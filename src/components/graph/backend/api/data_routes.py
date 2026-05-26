"""Data ingestion and analysis routes."""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional, List, Dict, Any
import json
import numpy as np
import pandas as pd
import io
from datetime import datetime
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Create router WITHOUT prefix here (prefix will be added in main.py)
router = APIRouter()

# Temporary storage (in production, use database or Redis)
dataset_store = {}

# Simple ingestion engine (in case the full one isn't available)
class SimpleIngestionEngine:
    async def process_uploaded_file(self, content, filename, content_type, options):
        try:
            # Parse CSV
            content_str = content.decode('utf-8', errors='replace')
            df = pd.read_csv(io.StringIO(content_str))
            
            # Basic cleaning
            if options.get('remove_duplicates', True):
                df = df.drop_duplicates()
            
            if options.get('handle_missing') == 'drop':
                df = df.dropna()
            elif options.get('handle_missing') == 'fill_mean':
                for col in df.select_dtypes(include=[np.number]).columns:
                    df[col] = df[col].fillna(df[col].mean())
            
            # Prepare response
            numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            x_arrays = {}
            y_arrays = {}
            
            x_column = options.get('x_column')
            if x_column and x_column in df.columns:
                x_arrays['default'] = pd.to_numeric(df[x_column], errors='coerce').dropna().tolist()
            
            if not x_arrays and numeric_cols:
                x_arrays['index'] = list(range(len(df)))
            
            y_columns = options.get('y_columns', [])
            if y_columns:
                for col in y_columns:
                    if col in df.columns:
                        y_arrays[col] = pd.to_numeric(df[col], errors='coerce').dropna().tolist()
            
            if not y_arrays and numeric_cols:
                first_numeric = numeric_cols[0] if numeric_cols else None
                if first_numeric:
                    y_arrays[first_numeric] = pd.to_numeric(df[first_numeric], errors='coerce').dropna().tolist()
            
            return {
                "status": "success",
                "dataset_id": f"ds_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "original_filename": filename,
                "rows": len(df),
                "columns": len(df.columns),
                "data": {
                    "x_arrays": x_arrays,
                    "y_arrays": y_arrays,
                    "dataframe_preview": df.head(20).to_dict(orient='records')
                },
                "metadata": {
                    "column_names": df.columns.tolist(),
                    "column_types": {col: str(df[col].dtype) for col in df.columns},
                    "missing_values": {col: int(df[col].isna().sum()) for col in df.columns}
                },
                "validation": {"warnings": [], "detected_types": {}},
                "statistical_summary": {
                    "mean": df[numeric_cols].mean().to_dict() if numeric_cols else {},
                    "std": df[numeric_cols].std().to_dict() if numeric_cols else {}
                }
            }
        except Exception as e:
            return {"status": "error", "errors": [str(e)]}

ingestion_engine = SimpleIngestionEngine()

# Simple statistical engine
class SimpleStatisticalEngine:
    def compute_descriptive_stats(self, data):
        arr = np.array([x for x in data if x is not None])
        if len(arr) == 0:
            return type('Stats', (), {'mean': 0, 'median': 0, 'std_dev': 0, 'variance': 0, 'skewness': 0, 'kurtosis': 0, 'range': 0, 'iqr': 0, 'cv': 0})()
        return type('Stats', (), {
            'mean': float(np.mean(arr)),
            'median': float(np.median(arr)),
            'std_dev': float(np.std(arr)),
            'variance': float(np.var(arr)),
            'skewness': float(0),
            'kurtosis': float(0),
            'range': float(np.ptp(arr)),
            'iqr': float(np.percentile(arr, 75) - np.percentile(arr, 25)),
            'cv': float(np.std(arr) / np.mean(arr)) if np.mean(arr) != 0 else 0
        })()
    
    def compute_percentiles(self, data):
        arr = np.array([x for x in data if x is not None])
        if len(arr) == 0:
            return {}
        return {p: float(np.percentile(arr, p)) for p in [1, 5, 10, 25, 50, 75, 90, 95, 99]}
    
    def compute_distribution_profile(self, data):
        arr = np.array([x for x in data if x is not None])
        if len(arr) == 0:
            return {"skewness": 0, "kurtosis": 0, "suggested_distribution": "unknown"}
        from scipy import stats
        skew = float(stats.skew(arr)) if len(arr) > 2 else 0
        kurt = float(stats.kurtosis(arr)) if len(arr) > 3 else 0
        return {"skewness": skew, "kurtosis": kurt, "suggested_distribution": "normal" if abs(skew) < 1 else "skewed"}
    
    def detect_outliers(self, data, method="iqr"):
        arr = np.array([x for x in data if x is not None])
        if len(arr) == 0:
            return {"outlier_count": 0, "outlier_percentage": 0, "outlier_values": []}
        q1, q3 = np.percentile(arr, [25, 75])
        iqr = q3 - q1
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr
        outliers = arr[(arr < lower) | (arr > upper)]
        return {
            "outlier_count": len(outliers),
            "outlier_percentage": len(outliers) / len(arr) * 100,
            "outlier_values": outliers.tolist()
        }

statistical_engine = SimpleStatisticalEngine()

# Helper function to clean NaN for JSON
def clean_for_json(obj):
    if isinstance(obj, dict):
        return {k: clean_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_for_json(item) for item in obj]
    elif isinstance(obj, float) and (np.isnan(obj) or np.isinf(obj)):
        return None
    elif isinstance(obj, (np.integer, np.int64, np.int32)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64, np.float32)):
        return float(obj) if not (np.isnan(obj) or np.isinf(obj)) else None
    else:
        return obj

# ============ ROUTES ============

@router.post("/data/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    handle_missing: str = Form("drop"),
    remove_duplicates: bool = Form(True),
    x_column: Optional[str] = Form(None),
    y_columns: Optional[str] = Form(None)
):
    """Upload and process CSV/Excel dataset."""
    try:
        # Read file content
        content = await file.read()
        
        # Parse y_columns from JSON string if provided
        y_cols_list = json.loads(y_columns) if y_columns and y_columns != "null" else []
        
        options = {
            "handle_missing": handle_missing,
            "remove_duplicates": remove_duplicates,
            "x_column": x_column,
            "y_columns": y_cols_list
        }
        
        # Process file
        result = await ingestion_engine.process_uploaded_file(
            content,
            file.filename,
            file.content_type,
            options
        )
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("errors", ["Upload failed"]))
        
        # Clean the result for JSON serialization
        cleaned_result = clean_for_json(result)
        
        # Store dataset for later analysis
        dataset_store[cleaned_result["dataset_id"]] = cleaned_result
        
        return cleaned_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/data/datasets")
async def list_datasets():
    """List all uploaded datasets."""
    return {
        "datasets": [
            {
                "dataset_id": ds_id,
                "filename": ds.get("original_filename", "unknown"),
                "rows": ds.get("rows", 0),
                "columns": ds.get("columns", 0)
            }
            for ds_id, ds in dataset_store.items()
        ]
    }

@router.get("/data/datasets/{dataset_id}")
async def get_dataset(dataset_id: str):
    """Get dataset by ID."""
    if dataset_id not in dataset_store:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset_store[dataset_id]

@router.post("/data/descriptive/{dataset_id}")
async def compute_descriptive_stats(
    dataset_id: str,
    column_name: str
):
    """Compute descriptive statistics for a column."""
    if dataset_id not in dataset_store:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    dataset = dataset_store[dataset_id]
    
    # Find column data
    column_data = None
    
    # Try to get from y_arrays
    if column_name in dataset.get("data", {}).get("y_arrays", {}):
        column_data = dataset["data"]["y_arrays"][column_name]
    else:
        # Try to find in preview data
        preview_data = dataset.get("data", {}).get("dataframe_preview", [])
        if preview_data and column_name in preview_data[0]:
            column_data = [row[column_name] for row in preview_data if column_name in row and row[column_name] is not None]
    
    if not column_data:
        raise HTTPException(status_code=404, detail=f"Column '{column_name}' not found or has no valid data")
    
    try:
        # Compute statistics
        stats_result = statistical_engine.compute_descriptive_stats(column_data)
        percentiles = statistical_engine.compute_percentiles(column_data)
        distribution = statistical_engine.compute_distribution_profile(column_data)
        outliers = statistical_engine.detect_outliers(column_data, method="iqr")
        
        return clean_for_json({
            "column": column_name,
            "basic_stats": {
                "mean": stats_result.mean,
                "median": stats_result.median,
                "std_dev": stats_result.std_dev,
                "variance": stats_result.variance,
                "skewness": stats_result.skewness,
                "kurtosis": stats_result.kurtosis,
                "range": stats_result.range,
                "iqr": stats_result.iqr,
                "cv": stats_result.cv
            },
            "percentiles": percentiles,
            "distribution": distribution,
            "outliers": outliers
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/data/regression")
async def run_regression(request: dict):
    """Perform regression analysis."""
    try:
        x_data = request.get("x_data", [])
        y_data = request.get("y_data", [])
        
        if len(x_data) != len(y_data):
            raise ValueError("x_data and y_data must have same length")
        
        if len(x_data) < 2:
            raise ValueError("Need at least 2 data points for regression")
        
        # Simple linear regression
        x = np.array([v for v in x_data if v is not None])
        y = np.array([v for v in y_data if v is not None])
        
        if len(x) < 2:
            raise ValueError("Not enough valid data points")
        
        # Calculate slope and intercept
        n = len(x)
        x_mean = np.mean(x)
        y_mean = np.mean(y)
        
        numerator = np.sum((x - x_mean) * (y - y_mean))
        denominator = np.sum((x - x_mean) ** 2)
        
        slope = numerator / denominator if denominator != 0 else 0
        intercept = y_mean - slope * x_mean
        
        predictions = intercept + slope * x
        residuals = y - predictions
        
        # Calculate R-squared
        ss_res = np.sum(residuals ** 2)
        ss_tot = np.sum((y - y_mean) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
        
        # Calculate adjusted R-squared
        n_params = 2
        adjusted_r_squared = 1 - (1 - r_squared) * (n - 1) / (n - n_params - 1) if n - n_params - 1 > 0 else r_squared
        
        # Calculate error metrics
        mse = np.mean(residuals ** 2)
        rmse = np.sqrt(mse)
        mae = np.mean(np.abs(residuals))
        
        result = {
            "coefficients": [float(intercept), float(slope)],
            "r_squared": float(r_squared),
            "adjusted_r_squared": float(adjusted_r_squared),
            "mse": float(mse),
            "rmse": float(rmse),
            "mae": float(mae),
            "predictions": predictions.tolist(),
            "residuals": residuals.tolist()
        }
        
        # Add forecast if requested
        forecast_steps = request.get("forecast_steps", 0)
        if forecast_steps > 0:
            last_x = x[-1]
            future_x = np.arange(last_x + 1, last_x + forecast_steps + 1)
            forecast_values = intercept + slope * future_x
            residual_std = np.std(residuals) if len(residuals) > 1 else 0
            result["forecast"] = {
                "future_indices": future_x.tolist(),
                "forecast_values": forecast_values.tolist(),
                "lower_bound": (forecast_values - 1.96 * residual_std).tolist(),
                "upper_bound": (forecast_values + 1.96 * residual_std).tolist()
            }
        
        return clean_for_json(result)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/data/hypothesis-test")
async def run_hypothesis_test(request: dict):
    """Run statistical hypothesis tests."""
    try:
        test_type = request.get("test_type", "ttest")
        group1 = request.get("group1", [])
        group2 = request.get("group2", [])
        
        if not group1:
            raise ValueError("Group 1 data is required")
        
        from scipy import stats
        
        if test_type in ["ttest", "t_test", "independent"]:
            if not group2:
                raise ValueError("Second group required for independent t-test")
            
            arr1 = np.array([v for v in group1 if v is not None])
            arr2 = np.array([v for v in group2 if v is not None])
            
            if len(arr1) < 2 or len(arr2) < 2:
                raise ValueError("Each group must have at least 2 valid data points")
            
            statistic, p_value = stats.ttest_ind(arr1, arr2)
            df = len(arr1) + len(arr2) - 2
            
            # Calculate effect size (Cohen's d)
            mean1 = np.mean(arr1)
            mean2 = np.mean(arr2)
            std1 = np.std(arr1, ddof=1)
            std2 = np.std(arr2, ddof=1)
            pooled_std = np.sqrt(((len(arr1) - 1) * std1**2 + (len(arr2) - 1) * std2**2) / df)
            effect_size = abs(mean1 - mean2) / pooled_std if pooled_std > 0 else 0
            
            test_name = "Independent t-test"
            
        elif test_type in ["paired", "paired_ttest"]:
            if not group2:
                raise ValueError("Second group required for paired t-test")
            
            arr1 = np.array([v for v in group1 if v is not None])
            arr2 = np.array([v for v in group2 if v is not None])
            
            # Remove pairs with NaN
            valid = ~(np.isnan(arr1) | np.isnan(arr2))
            arr1 = arr1[valid]
            arr2 = arr2[valid]
            
            if len(arr1) < 2:
                raise ValueError("Need at least 2 valid pairs")
            
            statistic, p_value = stats.ttest_rel(arr1, arr2)
            df = len(arr1) - 1
            
            # Calculate effect size
            differences = arr2 - arr1
            effect_size = abs(np.mean(differences)) / np.std(differences, ddof=1) if np.std(differences) > 0 else 0
            
            test_name = "Paired t-test"
        else:
            # One-sample t-test
            arr1 = np.array([v for v in group1 if v is not None])
            if len(arr1) < 2:
                raise ValueError("Need at least 2 valid data points")
            statistic, p_value = stats.ttest_1samp(arr1, 0)
            df = len(arr1) - 1
            effect_size = None
            test_name = "One-sample t-test"
        
        significant = bool(p_value < 0.05)
        
        return clean_for_json({
            "test_name": test_name,
            "test_statistic": float(statistic),
            "p_value": float(p_value),
            "degrees_of_freedom": int(df),
            "effect_size": float(effect_size) if effect_size is not None else None,
            "effect_size_interpretation": f"Cohen's d = {effect_size:.3f}" if effect_size else None,
            "confidence_interval": None,
            "significant": significant,
            "interpretation": f"{'Statistically significant' if significant else 'Not statistically significant'} difference found (p = {p_value:.4f})"
        })
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/data/spectral")
async def analyze_spectrum(request: dict):
    """Perform spectral analysis."""
    try:
        data = request.get("data", [])
        sample_rate = request.get("sample_rate", 1000)
        
        arr = np.array([v for v in data if v is not None])
        
        if len(arr) < 2:
            raise ValueError("Need at least 2 data points")
        
        # Simple FFT
        N = len(arr)
        fft_vals = np.fft.fft(arr)
        frequencies = np.fft.fftfreq(N, 1 / sample_rate)
        
        # Positive frequencies only
        positive_mask = frequencies >= 0
        freqs = frequencies[positive_mask]
        power = np.abs(fft_vals[positive_mask]) ** 2 / N
        
        # Peak frequency
        peak_idx = np.argmax(power)
        peak_freq = float(freqs[peak_idx])
        
        # Total power
        total_power = float(np.sum(power))
        
        # Estimate noise floor
        power_excluding_peak = np.delete(power, peak_idx) if len(power) > 1 else power
        noise_floor = float(10 * np.log10(np.median(power_excluding_peak))) if len(power_excluding_peak) > 0 and np.median(power_excluding_peak) > 0 else -float('inf')
        
        return clean_for_json({
            "frequencies": freqs.tolist(),
            "power_spectrum": power.tolist(),
            "peak_frequency": peak_freq,
            "total_power": total_power,
            "noise_floor_db": noise_floor if noise_floor != -float('inf') else None,
            "snr_db": None
        })
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))