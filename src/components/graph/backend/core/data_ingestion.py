"""Data ingestion and preprocessing pipeline for scientific datasets."""

import pandas as pd
import numpy as np
from typing import Dict, Any, Optional, Tuple, List, Union
from pathlib import Path
import io
import re
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum

class DataType(Enum):
    NUMERIC = "numeric"
    CATEGORICAL = "categorical"
    DATETIME = "datetime"
    TEXT = "text"

@dataclass
class ValidationResult:
    is_valid: bool
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    detected_types: Dict[str, DataType] = field(default_factory=dict)
    column_stats: Dict[str, Dict[str, Any]] = field(default_factory=dict)

class DataIngestionEngine:
    """Handles CSV and Excel file ingestion with intelligent cleaning."""
    
    def __init__(self):
        self.supported_formats = ['.csv', '.xlsx', '.xls']
        self.max_file_size_mb = 100
        self.dtype_mapping = {
            'int64': DataType.NUMERIC,
            'float64': DataType.NUMERIC,
            'object': DataType.TEXT,
            'datetime64': DataType.DATETIME,
            'category': DataType.CATEGORICAL
        }
    
    async def process_uploaded_file(
        self,
        file_content: bytes,
        filename: str,
        file_type: str,
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Process uploaded CSV or Excel file with automatic cleaning."""
        options = options or {}
        
        # Validate file size
        file_size_mb = len(file_content) / (1024 * 1024)
        if file_size_mb > self.max_file_size_mb:
            raise ValueError(f"File exceeds {self.max_file_size_mb}MB limit")
        
        # Parse based on file type
        if file_type in ['csv', 'text/csv']:
            df = self._parse_csv(file_content, options)
        elif file_type in ['xlsx', 'xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
            df = self._parse_excel(file_content, options)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
        
        print(f"📁 Loaded file: {filename}")
        print(f"   Columns: {df.columns.tolist()}")
        print(f"   Shape: {df.shape}")
        
        # Validate and clean
        validation = self._validate_dataset(df)
        
        if not validation.is_valid:
            return {
                "status": "error",
                "errors": validation.errors,
                "warnings": validation.warnings
            }
        
        # Apply cleaning operations
        df_cleaned = self._clean_dataset(df, options)
        
        # Generate standardized arrays (FIXED - includes ALL columns)
        x_arrays, y_arrays = self._extract_analytical_arrays(df_cleaned, options)
        
        # Generate comprehensive metadata
        metadata = self._generate_metadata(df_cleaned, validation)
        
        return {
            "status": "success",
            "dataset_id": f"ds_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "original_filename": filename,
            "rows": len(df_cleaned),
            "columns": len(df_cleaned.columns),
            "data": {
                "x_arrays": x_arrays,
                "y_arrays": y_arrays,
                "dataframe_preview": df_cleaned.head(20).to_dict(orient='records')
            },
            "metadata": metadata,
            "validation": {
                "warnings": validation.warnings,
                "detected_types": {k: v.value for k, v in validation.detected_types.items()},
                "missing_handled": options.get('handle_missing', 'drop')
            },
            "statistical_summary": self._compute_quick_stats(df_cleaned)
        }
    
    def _parse_csv(self, content: bytes, options: Dict) -> pd.DataFrame:
        """Parse CSV with delimiter detection and error handling."""
        content_str = content.decode('utf-8', errors='replace')
        
        # Auto-detect delimiter
        first_line = content_str.split('\n')[0] if content_str else ''
        delimiters = [',', ';', '\t', '|']
        delimiter_scores = {}
        
        for delim in delimiters:
            count = first_line.count(delim)
            if count > 0:
                delimiter_scores[delim] = count
        
        best_delimiter = max(delimiter_scores, key=delimiter_scores.get) if delimiter_scores else ','
        
        try:
            return pd.read_csv(
                io.StringIO(content_str),
                delimiter=best_delimiter,
                encoding='utf-8',
                on_bad_lines='skip',
                low_memory=False,
                **options.get('csv_params', {})
            )
        except Exception as e:
            raise ValueError(f"CSV parsing failed: {str(e)}")
    
    def _parse_excel(self, content: bytes, options: Dict) -> pd.DataFrame:
        """Parse Excel file with sheet detection."""
        try:
            excel_file = pd.ExcelFile(io.BytesIO(content))
            sheet_name = options.get('sheet_name', 0)
            return pd.read_excel(
                excel_file,
                sheet_name=sheet_name,
                **options.get('excel_params', {})
            )
        except Exception as e:
            raise ValueError(f"Excel parsing failed: {str(e)}")
    
    def _validate_dataset(self, df: pd.DataFrame) -> ValidationResult:
        """Validate dataset quality and structure."""
        result = ValidationResult(is_valid=True)
        
        if df.empty:
            result.is_valid = False
            result.errors.append("Dataset is empty")
            return result
        
        if len(df) < 3:
            result.warnings.append("Dataset has fewer than 3 rows")
        
        for col in df.columns:
            col_str = str(col)
            if df[col].dtype in ['int64', 'float64']:
                result.detected_types[col_str] = DataType.NUMERIC
                non_null = df[col].dropna()
                if len(non_null) > 0:
                    result.column_stats[col_str] = {
                        "min": float(non_null.min()),
                        "max": float(non_null.max()),
                        "std": float(non_null.std()),
                        "null_count": int(df[col].isna().sum())
                    }
            elif pd.api.types.is_datetime64_any_dtype(df[col]):
                result.detected_types[col_str] = DataType.DATETIME
            elif df[col].dtype == 'object':
                unique_ratio = df[col].nunique() / len(df)
                if unique_ratio < 0.05:
                    result.detected_types[col_str] = DataType.CATEGORICAL
                else:
                    try:
                        pd.to_numeric(df[col])
                        result.detected_types[col_str] = DataType.NUMERIC
                    except:
                        result.detected_types[col_str] = DataType.TEXT
        
        for col in df.columns:
            missing_pct = df[col].isna().mean() * 100
            if missing_pct > 50:
                result.warnings.append(f"Column '{col}' has {missing_pct:.1f}% missing values")
        
        duplicates = df.duplicated().sum()
        if duplicates > 0:
            result.warnings.append(f"Found {duplicates} duplicate rows")
        
        return result
    
    def _clean_dataset(self, df: pd.DataFrame, options: Dict) -> pd.DataFrame:
        """Apply cleaning operations to standardize dataset."""
        df_clean = df.copy()
        
        handle_missing = options.get('handle_missing', 'drop')
        remove_duplicates = options.get('remove_duplicates', True)
        
        if handle_missing == 'drop':
            df_clean = df_clean.dropna()
        elif handle_missing == 'fill_mean':
            for col in df_clean.select_dtypes(include=[np.number]).columns:
                df_clean[col] = df_clean[col].fillna(df_clean[col].mean())
        elif handle_missing == 'fill_median':
            for col in df_clean.select_dtypes(include=[np.number]).columns:
                df_clean[col] = df_clean[col].fillna(df_clean[col].median())
        
        if remove_duplicates:
            df_clean = df_clean.drop_duplicates()
        
        df_clean.columns = [
            re.sub(r'[^a-zA-Z0-9_]', '_', str(col).strip().lower())
            for col in df_clean.columns
        ]
        
        for col in df_clean.columns:
            if df_clean[col].dtype == 'object':
                try:
                    df_clean[col] = pd.to_datetime(df_clean[col])
                except:
                    pass
        
        return df_clean
    
    def _extract_analytical_arrays(
        self, 
        df: pd.DataFrame, 
        options: Dict
    ) -> Tuple[Dict[str, List[float]], Dict[str, List[float]]]:
        """Extract ALL numeric columns for analysis."""
        x_arrays = {}
        y_arrays = {}
        
        x_column = options.get('x_column')
        y_columns = options.get('y_columns', [])
        
        # Get ALL numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        print(f"\n📊 Found numeric columns: {numeric_cols}")
        
        # IMPORTANT: Add ALL numeric columns to y_arrays
        for col in numeric_cols:
            clean_data = df[col].dropna().tolist()
            if len(clean_data) > 0:
                y_arrays[col] = clean_data
                print(f"   ✅ Added column '{col}' with {len(clean_data)} values (first 3: {clean_data[:3]})")
        
        # Handle specific X column selection
        if x_column and x_column in df.columns:
            if x_column in y_arrays:
                x_arrays['default'] = y_arrays[x_column]
            else:
                x_data = pd.to_numeric(df[x_column], errors='coerce').dropna()
                if len(x_data) > 0:
                    x_arrays['default'] = x_data.tolist()
        
        # If specific Y columns requested
        if y_columns:
            selected_y = {}
            for y_col in y_columns:
                if y_col in y_arrays:
                    selected_y[y_col] = y_arrays[y_col]
            if selected_y:
                y_arrays = selected_y
        
        # Auto-select X if not specified
        if not x_arrays and numeric_cols:
            x_arrays['index'] = list(range(len(df)))
            first_col = numeric_cols[0]
            if first_col in y_arrays:
                x_arrays[first_col] = y_arrays[first_col]
        
        print(f"\n📤 FINAL EXTRACTED DATA:")
        print(f"   X arrays: {list(x_arrays.keys())}")
        print(f"   Y arrays: {list(y_arrays.keys())}")
        print(f"   Total columns extracted: {len(y_arrays)}")
        
        return x_arrays, y_arrays
    
    def _generate_metadata(self, df: pd.DataFrame, validation: ValidationResult) -> Dict:
        """Generate comprehensive dataset metadata."""
        missing_values = {}
        for col in df.columns:
            missing_values[str(col)] = int(df[col].isna().sum())
        
        unique_counts = {}
        for col in df.columns:
            unique_counts[str(col)] = int(df[col].nunique())
        
        return {
            "shape": [int(len(df)), int(len(df.columns))],
            "column_names": [str(col) for col in df.columns],
            "column_types": {
                str(col): self.dtype_mapping.get(str(df[col].dtype), DataType.TEXT).value
                for col in df.columns
            },
            "missing_values": missing_values,
            "memory_usage_mb": float(df.memory_usage(deep=True).sum() / (1024 * 1024)),
            "unique_counts": unique_counts,
            "detected_patterns": {k: v.value for k, v in validation.detected_types.items()}
        }
    
    def _compute_quick_stats(self, df: pd.DataFrame) -> Dict:
        """Compute quick statistical summary for preview."""
        numeric_df = df.select_dtypes(include=[np.number])
        
        if numeric_df.empty:
            return {"message": "No numeric columns for statistical summary"}
        
        def clean_dict(d):
            if isinstance(d, dict):
                return {k: clean_dict(v) for k, v in d.items()}
            elif isinstance(d, list):
                return [clean_dict(x) for x in d]
            elif isinstance(d, float) and (np.isnan(d) or np.isinf(d)):
                return None
            elif isinstance(d, np.integer):
                return int(d)
            elif isinstance(d, np.floating):
                return float(d) if not (np.isnan(d) or np.isinf(d)) else None
            else:
                return d
        
        stats = {}
        try:
            stats["mean"] = numeric_df.mean().to_dict()
            stats["std"] = numeric_df.std().to_dict()
            stats["min"] = numeric_df.min().to_dict()
            stats["max"] = numeric_df.max().to_dict()
        except:
            pass
        
        correlation_matrix = None
        if len(numeric_df.columns) > 1:
            try:
                corr = numeric_df.corr()
                correlation_matrix = corr.where(pd.notnull(corr), None).to_dict()
                correlation_matrix = clean_dict(correlation_matrix)
            except:
                pass
        
        result = {
            "mean": clean_dict(stats.get("mean", {})),
            "std": clean_dict(stats.get("std", {})),
            "min": clean_dict(stats.get("min", {})),
            "max": clean_dict(stats.get("max", {})),
            "correlation_matrix": correlation_matrix,
            "numeric_columns": [str(col) for col in numeric_df.columns]
        }
        
        return clean_dict(result)


# Global instance
ingestion_engine = DataIngestionEngine()