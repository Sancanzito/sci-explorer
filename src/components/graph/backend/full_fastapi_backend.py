from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np
from scipy import stats
import statsmodels.api as sm

app = FastAPI(title="StatsPro Advanced Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# ADVANCED DATA VALIDATION (PYDANTIC)
# ==========================================
class DataPayload(BaseModel):
    columns: Dict[str, List[float]]

    @validator('columns')
    def validate_data(cls, v):
        if len(v) == 0:
            raise ValueError("Dataset cannot be empty.")
        for col_name, arr in v.items():
            if len(arr) > 100_000:
                raise ValueError(f"Column '{col_name}' exceeds 100,000 row limit.")
            np_arr = np.array(arr)
            if np.isinf(np_arr).any():
                raise ValueError(f"Column '{col_name}' contains infinite values.")
        return v

class AnalysisPayload(DataPayload):
    nonparametric: bool = False

def clean_data(data_dict: Dict[str, List[float]], paired: bool = False) -> List[np.ndarray]:
    """Strict data cleaning: listwise or pairwise deletion."""
    keys = list(data_dict.keys())
    if paired:
        df = pd.DataFrame(data_dict).dropna()
        if len(df) < 3: 
            raise ValueError("Insufficient paired data after dropping NaNs.")
        return [df[k].to_numpy() for k in keys]
    else:
        cleaned = []
        for k in keys:
            arr = np.array(data_dict[k])
            clean_arr = arr[~np.isnan(arr)]
            if len(clean_arr) < 3: 
                raise ValueError(f"Insufficient data in '{k}' after dropping NaNs.")
            cleaned.append(clean_arr)
        return cleaned

# ==========================================
# ENDPOINTS
# ==========================================

@app.get("/")
async def root():
    return {"message": "StatsPro API is running", "status": "healthy"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "available_endpoints": ["ttest", "anova", "correlation", "regression", "plots/qq"]}

@app.post("/api/stats/plots/qq")
async def get_qq_plot_data(payload: DataPayload):
    """Generates Q-Q plot coordinates for normality checking"""
    try:
        results = {}
        for col_name, arr in payload.columns.items():
            clean_arr = np.array(arr)[~np.isnan(arr)]
            if len(clean_arr) < 3:
                continue
            
            # osm = theoretical quantiles, osr = ordered responses
            (osm, osr), (slope, intercept, r) = stats.probplot(clean_arr, dist="norm")
            
            results[col_name] = {
                "theoretical_quantiles": osm.tolist(),
                "sample_quantiles": osr.tolist(),
                "trendline": {
                    "slope": float(slope),
                    "intercept": float(intercept),
                    "r_squared": float(r**2)
                }
            }
        return {"status": "success", "data": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/regression")
async def get_regression(payload: DataPayload):
    """Advanced Linear Regression using Statsmodels with automated interpretation"""
    try:
        keys = list(payload.columns.keys())
        if len(keys) != 2:
            raise HTTPException(status_code=400, detail="Select exactly 1 Predictor (X) and 1 Outcome (Y).")
            
        df = pd.DataFrame(payload.columns).dropna()
        if len(df) < 3:
            raise HTTPException(status_code=400, detail="Need at least 3 complete cases for regression.")
            
        x_name, y_name = keys[0], keys[1]
        
        X = df[x_name]
        Y = df[y_name]
        X_with_const = sm.add_constant(X)
        
        # Fit OLS model using statsmodels
        model = sm.OLS(Y, X_with_const).fit()
        
        # Extract metrics safely
        intercept = model.params.get('const', 0)
        slope = model.params.get(x_name, 0)
        p_value = model.pvalues.get(x_name, 1.0)
        r_squared = model.rsquared
        f_pvalue = model.f_pvalue
        
        # Assumption Checks
        residuals = model.resid
        shapiro_stat, shapiro_p = stats.shapiro(residuals)
        
        # Automated Interpretation Generation
        sig_text = "significantly" if p_value < 0.05 else "did not significantly"
        direction = "positive" if slope > 0 else "negative"
        interp = (f"A simple linear regression was calculated to predict {y_name} based on {x_name}. "
                  f"The model {sig_text} predicted {y_name} (F = {model.fvalue:.2f}, p = {f_pvalue:.4f}). "
                  f"{x_name} explains {r_squared*100:.1f}% of the variance in {y_name}. "
                  f"The {direction} relationship indicates that for every one unit increase in {x_name}, "
                  f"{y_name} changes by {slope:.4f} units.")

        return {
            "status": "success",
            "data": {
                "model": "Ordinary Least Squares (OLS) Regression",
                "equation": f"Y = {intercept:.4f} + ({slope:.4f})X",
                "predictor": x_name,
                "outcome": y_name,
                "interpretation": interp,
                "coefficients": {
                    "intercept": {"value": float(intercept), "p_value": float(model.pvalues.get('const', 1.0))},
                    "slope": {"value": float(slope), "p_value": float(p_value), "std_err": float(model.bse.get(x_name, 0))}
                },
                "model_fit": {
                    "r_squared": float(r_squared),
                    "adj_r_squared": float(model.rsquared_adj),
                    "f_statistic": float(model.fvalue),
                    "f_pvalue": float(f_pvalue),
                    "n": int(model.nobs)
                },
                "assumptions": {
                    "residual_normality": {
                        "passed": bool(shapiro_p > 0.05),
                        "p_value": float(shapiro_p)
                    }
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/ttest")
async def get_ttest(payload: AnalysisPayload, paired: bool = False):
    try:
        arrays = clean_data(payload.columns, paired=paired)
        names = list(payload.columns.keys())
        arr1, arr2 = arrays[0], arrays[1]
        
        if paired:
            t_stat, p_value = stats.ttest_rel(arr1, arr2)
            test_name = "Paired Samples T-Test"
        else:
            t_stat, p_value = stats.ttest_ind(arr1, arr2)
            test_name = "Independent Samples T-Test"
            
        sig = "statistically significant" if p_value < 0.05 else "not statistically significant"
        interp = (f"A {test_name.lower()} indicated that the difference between "
                  f"'{names[0]}' and '{names[1]}' is {sig} "
                  f"(t = {t_stat:.3f}, df = {len(arr1) + len(arr2) - 2}, p = {p_value:.4f}).")

        return {
            "status": "success", 
            "data": {
                "test": test_name, 
                "p_value": float(p_value), 
                "t_stat": float(t_stat),
                "degrees_freedom": len(arr1) + len(arr2) - 2 if not paired else len(arr1) - 1,
                "interpretation": interp,
                "group1": {
                    "name": names[0],
                    "mean": float(np.mean(arr1)),
                    "std": float(np.std(arr1, ddof=1)),
                    "n": len(arr1)
                },
                "group2": {
                    "name": names[1],
                    "mean": float(np.mean(arr2)),
                    "std": float(np.std(arr2, ddof=1)),
                    "n": len(arr2)
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/anova")
async def get_anova(payload: AnalysisPayload):
    try:
        arrays = clean_data(payload.columns, paired=False)
        names = list(payload.columns.keys())
        
        if len(arrays) < 2:
            raise HTTPException(status_code=400, detail="ANOVA requires at least 2 groups.")
            
        f_stat, p_value = stats.f_oneway(*arrays)
        
        # Calculate additional statistics
        all_data = np.concatenate(arrays)
        grand_mean = np.mean(all_data)
        
        group_means = [np.mean(arr) for arr in arrays]
        group_sizes = [len(arr) for arr in arrays]
        
        # Calculate effect size (eta-squared)
        ss_between = sum([size * (mean - grand_mean)**2 for size, mean in zip(group_sizes, group_means)])
        ss_total = sum([(val - grand_mean)**2 for val in all_data])
        eta_squared = ss_between / ss_total if ss_total > 0 else 0
        
        sig = "a statistically significant" if p_value < 0.05 else "no statistically significant"
        interp = f"A one-way ANOVA revealed {sig} difference between the groups (F = {f_stat:.3f}, p = {p_value:.4f}, η² = {eta_squared:.3f})."

        return {
            "status": "success", 
            "data": {
                "test": "One-Way ANOVA", 
                "p_value": float(p_value), 
                "f_stat": float(f_stat),
                "eta_squared": float(eta_squared),
                "groups": len(arrays),
                "total_n": sum(group_sizes),
                "interpretation": interp,
                "group_statistics": [
                    {
                        "name": names[i],
                        "mean": float(group_means[i]),
                        "std": float(np.std(arrays[i], ddof=1)),
                        "n": group_sizes[i]
                    }
                    for i in range(len(arrays))
                ]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/correlation")
async def get_correlation(payload: DataPayload):
    try:
        df = pd.DataFrame(payload.columns).dropna()
        if df.shape[1] < 2: 
            raise ValueError("Requires 2+ columns.")
        if len(df) < 3:
            raise ValueError("Need at least 3 complete cases for correlation.")
            
        pearson_corr = df.corr(method='pearson')
        spearman_corr = df.corr(method='spearman')
        
        # Construct basic interpretation for the first pair found
        keys = list(df.columns)
        r_val = pearson_corr.iloc[0, 1]
        p_val = stats.pearsonr(df[keys[0]], df[keys[1]])[1]
        
        if abs(r_val) > 0.7:
            strength = "very strong"
        elif abs(r_val) > 0.5:
            strength = "strong"
        elif abs(r_val) > 0.3:
            strength = "moderate"
        elif abs(r_val) > 0.1:
            strength = "weak"
        else:
            strength = "very weak"
            
        direction = "positive" if r_val > 0 else "negative"
        sig_text = "statistically significant" if p_val < 0.05 else "not statistically significant"
        
        interp = (f"There is a {strength}, {direction} correlation between '{keys[0]}' and '{keys[1]}' "
                  f"(r = {r_val:.3f}, p = {p_val:.4f}). This correlation is {sig_text}.")

        return {
            "status": "success", 
            "data": {
                "pearson_matrix": pearson_corr.to_dict(),
                "spearman_matrix": spearman_corr.to_dict(),
                "n": len(df),
                "interpretation": interp,
                "variables": keys
            }
        }
    except Exception as e:
         raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)