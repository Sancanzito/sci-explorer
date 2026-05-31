from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator, ValidationInfo
from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np
from scipy import stats
import statsmodels.api as sm
from statsmodels.stats.multicomp import pairwise_tukeyhsd
from statsmodels.stats.outliers_influence import variance_inflation_factor
from statsmodels.stats.stattools import durbin_watson
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

try:
    from factor_analyzer.factor_analyzer import calculate_kmo, calculate_bartlett_sphericity
except ImportError:
    pass # Will handle gracefully if not installed

app = FastAPI(title="StatsPro Advanced Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DataPayload(BaseModel):
    columns: Dict[str, List[Any]]

    @field_validator('columns')
    @classmethod
    def validate_data(cls, v: Dict[str, List[Any]], info: ValidationInfo) -> Dict[str, List[Any]]:
        if len(v) == 0:
            raise ValueError("Dataset cannot be empty.")
        for col_name, arr in v.items():
            if len(arr) > 100_000:
                raise ValueError(f"Column '{col_name}' exceeds 100,000 row limit.")
            numerics = [x for x in arr if isinstance(x, (int, float))]
            if numerics and np.isinf(numerics).any():
                raise ValueError(f"Column '{col_name}' contains infinite numeric values.")
        return v

class AnalysisPayload(DataPayload):
    nonparametric: bool = False

def clean_data(data_dict: Dict[str, List[Any]], paired: bool = False, numeric_only: bool = True) -> List[np.ndarray]:
    keys = list(data_dict.keys())
    if paired:
        df = pd.DataFrame(data_dict)
        if numeric_only:
            df = df.apply(pd.to_numeric, errors='coerce')
        df = df.dropna()
        if len(df) < 3: 
            raise ValueError("Insufficient paired data after dropping NaNs or invalid text.")
        return [df[k].to_numpy() for k in keys]
    else:
        cleaned = []
        for k in keys:
            if numeric_only:
                s = pd.to_numeric(pd.Series(data_dict[k]), errors='coerce').dropna()
            else:
                s = pd.Series(data_dict[k]).dropna()
                
            if len(s) < 3: 
                raise ValueError(f"Insufficient valid data in '{k}'.")
            cleaned.append(s.to_numpy())
        return cleaned

@app.get("/")
async def root():
    return {"message": "StatsPro API is running", "status": "healthy"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/stats/preview")
async def preview_data(payload: DataPayload):
    try:
        preview_dict = {}
        for col, arr in payload.columns.items():
            preview_dict[col] = {
                "count": len(arr),
                "first_10_values": arr[:10],
                "last_10_values": arr[-10:] if len(arr) > 10 else []
            }
        return {"status": "success", "message": "Data mounted successfully.", "data": preview_dict}
    except Exception as e:
         raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/frequencies")
async def get_frequencies(payload: DataPayload):
    try:
        df = pd.DataFrame(payload.columns).dropna()
        keys = list(df.columns)
        if len(keys) < 1:
            raise ValueError("Requires at least 1 column for frequency analysis.")
            
        results = {}
        if len(keys) == 1:
            counts = df[keys[0]].value_counts()
            percs = df[keys[0]].value_counts(normalize=True) * 100
            results = {str(k): {"count": int(v), "percentage": float(percs[k])} for k, v in counts.items()}
            interp = f"Frequency distribution for {keys[0]} generated."
        else:
            crosstab = pd.crosstab(df[keys[0]], df[keys[1]])
            row_perc = pd.crosstab(df[keys[0]], df[keys[1]], normalize='index') * 100
            col_perc = pd.crosstab(df[keys[0]], df[keys[1]], normalize='columns') * 100
            
            results = {
                "absolute": crosstab.to_dict(),
                "row_percentages": row_perc.to_dict(),
                "column_percentages": col_perc.to_dict()
            }
            interp = f"Crosstabulation between {keys[0]} and {keys[1]} completed."

        return {
            "status": "success",
            "data": {
                "test": "Frequency & Categorical Analysis",
                "variables": keys,
                "table": results,
                "interpretation": interp
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/assumptions")
async def check_assumptions(payload: DataPayload, outcome: str = None):
    try:
        df = pd.DataFrame(payload.columns).apply(pd.to_numeric, errors='coerce').dropna()
        keys = list(df.columns)
        if len(keys) < 2:
            raise ValueError("Assumptions module requires at least 2 columns (Predictor and Outcome).")
            
        y_name = outcome if outcome and outcome in keys else keys[-1]
        x_names = [k for k in keys if k != y_name]
        
        X = sm.add_constant(df[x_names])
        Y = df[y_name]
        model = sm.OLS(Y, X).fit()
        
        # Multicollinearity (VIF)
        vif_data = {}
        if len(x_names) > 1:
            for i, name in enumerate(X.columns):
                if name != 'const':
                    vif_data[name] = float(variance_inflation_factor(X.values, i))
                    
        # Autocorrelation
        dw_stat = float(durbin_watson(model.resid))
        
        # Normality of Residuals
        shapiro_stat, shapiro_p = stats.shapiro(model.resid)

        return {
            "status": "success",
            "data": {
                "test": "Statistical Assumptions Check",
                "model_outcome": y_name,
                "multicollinearity_vif": vif_data,
                "autocorrelation_durbin_watson": dw_stat,
                "normality_shapiro": {"statistic": float(shapiro_stat), "p_value": float(shapiro_p)},
                "interpretation": f"Assumptions computed. VIF > 10 indicates high multicollinearity. Durbin-Watson near 2.0 indicates no autocorrelation. Shapiro-Wilk p > 0.05 indicates normal residuals."
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/reliability")
async def get_reliability(payload: DataPayload):
    try:
        df = pd.DataFrame(payload.columns).apply(pd.to_numeric, errors='coerce').dropna()
        k = df.shape[1]
        if k < 2:
            raise ValueError("Reliability analysis requires at least 2 numeric items.")
            
        var_items = df.var(ddof=1)
        var_total = df.sum(axis=1).var(ddof=1)
        
        if var_total == 0:
            raise ValueError("Total variance is zero. Cannot compute Cronbach's Alpha.")
            
        alpha = (k / (k - 1)) * (1 - var_items.sum() / var_total)
        
        # Alpha if item deleted
        alpha_deleted = {}
        for col in df.columns:
            df_dropped = df.drop(columns=[col])
            var_items_dropped = df_dropped.var(ddof=1)
            var_total_dropped = df_dropped.sum(axis=1).var(ddof=1)
            alpha_del = ((k - 1) / (k - 2)) * (1 - var_items_dropped.sum() / var_total_dropped) if k > 2 else 0
            alpha_deleted[col] = float(alpha_del)

        interp = f"Cronbach's Alpha for the {k} items is {alpha:.3f}. Values > 0.7 generally indicate acceptable internal consistency."
        return {
            "status": "success",
            "data": {
                "test": "Reliability Analysis",
                "cronbach_alpha": float(alpha),
                "items": k,
                "n": len(df),
                "alpha_if_item_deleted": alpha_deleted,
                "interpretation": interp
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/pca")
async def get_pca(payload: DataPayload):
    try:
        df = pd.DataFrame(payload.columns).apply(pd.to_numeric, errors='coerce').dropna()
        if df.shape[1] < 3:
            raise ValueError("PCA requires at least 3 numeric variables.")
            
        # KMO and Bartlett
        kmo_stat = None
        bartlett_stat = None
        bartlett_p = None
        try:
            kmo_all, kmo_stat = calculate_kmo(df)
            bartlett_stat, bartlett_p = calculate_bartlett_sphericity(df)
        except Exception:
            pass # Skip if factor_analyzer not installed or matrix singular

        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(df)
        
        pca = PCA()
        pca.fit(scaled_data)
        
        eigenvalues = pca.explained_variance_
        explained_var_ratio = pca.explained_variance_ratio_ * 100
        cumulative_var = np.cumsum(explained_var_ratio)
        
        loadings = pca.components_.T * np.sqrt(pca.explained_variance_)
        loadings_dict = {}
        for i, col in enumerate(df.columns):
            loadings_dict[col] = [float(val) for val in loadings[i]]

        n_components_kaiser = sum(eigenvalues > 1.0)
        
        interp = (f"PCA extracted {len(eigenvalues)} components. "
                  f"Based on Kaiser's criterion (Eigenvalue > 1), {n_components_kaiser} components "
                  f"should be retained, explaining {cumulative_var[n_components_kaiser-1]:.2f}% of total variance.")

        return {
            "status": "success",
            "data": {
                "test": "Principal Component Analysis (PCA)",
                "kmo_overall": float(kmo_stat) if kmo_stat else "N/A",
                "bartlett_p": float(bartlett_p) if bartlett_p else "N/A",
                "eigenvalues": [float(e) for e in eigenvalues],
                "explained_variance_percent": [float(v) for v in explained_var_ratio],
                "cumulative_variance_percent": [float(c) for c in cumulative_var],
                "loadings": loadings_dict,
                "interpretation": interp,
                "variables": list(df.columns)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/plots/qq")
async def get_qq_plot_data(payload: DataPayload):
    try:
        results = {}
        for col_name, arr in payload.columns.items():
            clean_arr = pd.to_numeric(pd.Series(arr), errors='coerce').dropna().to_numpy()
            if len(clean_arr) < 3: continue
            (osm, osr), (slope, intercept, r) = stats.probplot(clean_arr, dist="norm")
            results[col_name] = {
                "theoretical_quantiles": osm.tolist(),
                "sample_quantiles": osr.tolist(),
                "trendline": {"slope": float(slope), "intercept": float(intercept), "r_squared": float(r**2)}
            }
        return {"status": "success", "data": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/regression")
async def get_regression(payload: DataPayload):
    try:
        keys = list(payload.columns.keys())
        if len(keys) != 2: raise HTTPException(status_code=400, detail="Select exactly 1 Predictor and 1 Outcome.")
            
        df = pd.DataFrame(payload.columns).apply(pd.to_numeric, errors='coerce').dropna()
        x_name, y_name = keys[0], keys[1]
        
        X = sm.add_constant(df[x_name])
        Y = df[y_name]
        model = sm.OLS(Y, X).fit()
        
        intercept = model.params.get('const', 0)
        slope = model.params.get(x_name, 0)
        p_value = model.pvalues.get(x_name, 1.0)
        r_squared = model.rsquared
        f_pvalue = model.f_pvalue
        
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
                "model": "Simple Linear Regression",
                "equation": f"Y = {intercept:.4f} + ({slope:.4f})X",
                "predictor": x_name,
                "outcome": y_name,
                "interpretation": interp,
                "model_fit": {
                    "r_squared": float(r_squared),
                    "adj_r_squared": float(model.rsquared_adj),
                    "f_statistic": float(model.fvalue),
                    "f_pvalue": float(f_pvalue),
                    "n": int(model.nobs)
                },
                "diagnostics": {"residuals": model.resid.tolist(), "fitted": model.fittedvalues.tolist()}
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/multiple_regression")
async def get_multiple_regression(outcome: str, payload: DataPayload):
    try:
        df = pd.DataFrame(payload.columns).apply(pd.to_numeric, errors='coerce').dropna()
        predictors = [col for col in df.columns if col != outcome]
        X = sm.add_constant(df[predictors])
        Y = df[outcome]
        model = sm.OLS(Y, X).fit()
        
        coef_dict = {str(p): {"coef": float(model.params[p]), "p_val": float(model.pvalues[p])} for p in model.params.index}
            
        return {
            "status": "success",
            "data": {
                "model": "Multiple Linear Regression",
                "outcome": outcome,
                "predictors": predictors,
                "r_squared": float(model.rsquared),
                "adj_r_squared": float(model.rsquared_adj),
                "f_statistic": float(model.fvalue),
                "f_pvalue": float(model.f_pvalue),
                "coefficients": coef_dict,
                "interpretation": f"The multiple regression model explains {model.rsquared*100:.1f}% of the variance in '{outcome}' (F = {model.fvalue:.2f}, p = {model.f_pvalue:.4f}).",
                "diagnostics": {"residuals": model.resid.tolist(), "fitted": model.fittedvalues.tolist()}
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/ttest")
async def get_ttest(payload: AnalysisPayload, paired: bool = False):
    try:
        arrays = clean_data(payload.columns, paired=paired, numeric_only=True)
        names = list(payload.columns.keys())
        arr1, arr2 = arrays[0], arrays[1]
        nx, ny = len(arr1), len(arr2)
        
        # Effect Sizes (Cohen's d and Hedges' g)
        dof = nx + ny - 2 if not paired else nx - 1
        pool_var = ((nx-1)*np.var(arr1, ddof=1) + (ny-1)*np.var(arr2, ddof=1)) / dof
        cohens_d = (np.mean(arr1) - np.mean(arr2)) / np.sqrt(pool_var)
        hedges_g = cohens_d * (1 - (3 / (4 * (nx + ny) - 9)))
        
        if paired:
            t_stat, p_value = stats.ttest_rel(arr1, arr2)
            test_name = "Paired Samples T-Test"
        else:
            t_stat, p_value = stats.ttest_ind(arr1, arr2)
            test_name = "Independent Samples T-Test"
            
        sig = "statistically significant" if p_value < 0.05 else "not statistically significant"
        interp = (f"A {test_name.lower()} indicated that the difference between "
                  f"'{names[0]}' and '{names[1]}' is {sig} "
                  f"(t({dof}) = {t_stat:.3f}, p = {p_value:.4f}, d = {cohens_d:.2f}).")

        return {
            "status": "success", 
            "data": {
                "test": test_name, 
                "p_value": float(p_value), 
                "t_stat": float(t_stat),
                "degrees_freedom": dof,
                "cohens_d": float(cohens_d),
                "hedges_g": float(hedges_g),
                "interpretation": interp,
                "group1": {"name": names[0], "mean": float(np.mean(arr1)), "std": float(np.std(arr1, ddof=1)), "n": nx},
                "group2": {"name": names[1], "mean": float(np.mean(arr2)), "std": float(np.std(arr2, ddof=1)), "n": ny}
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/anova")
async def get_anova(payload: AnalysisPayload):
    try:
        arrays = clean_data(payload.columns, paired=False, numeric_only=True)
        names = list(payload.columns.keys())
        
        f_stat, p_value = stats.f_oneway(*arrays)
        all_data = np.concatenate(arrays)
        grand_mean = np.mean(all_data)
        
        group_means = [np.mean(arr) for arr in arrays]
        group_sizes = [len(arr) for arr in arrays]
        
        ss_between = sum([size * (mean - grand_mean)**2 for size, mean in zip(group_sizes, group_means)])
        ss_total = sum([(val - grand_mean)**2 for val in all_data])
        
        # Effect sizes
        eta_squared = ss_between / ss_total if ss_total > 0 else 0
        df_between = len(arrays) - 1
        df_within = sum(group_sizes) - len(arrays)
        ms_within = (ss_total - ss_between) / df_within
        omega_sq = (ss_between - df_between * ms_within) / (ss_total + ms_within)
        
        sig = "a statistically significant" if p_value < 0.05 else "no statistically significant"
        interp = f"A one-way ANOVA revealed {sig} difference between the groups (F({df_between}, {df_within}) = {f_stat:.3f}, p = {p_value:.4f}, η² = {eta_squared:.3f}, ω² = {omega_sq:.3f})."

        return {
            "status": "success", 
            "data": {
                "test": "One-Way ANOVA", 
                "p_value": float(p_value), 
                "f_stat": float(f_stat),
                "eta_squared": float(eta_squared),
                "omega_squared": float(omega_sq),
                "interpretation": interp,
                "group_statistics": [
                    {"name": names[i], "mean": float(group_means[i]), "std": float(np.std(arrays[i], ddof=1)), "n": group_sizes[i]}
                    for i in range(len(arrays))
                ]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/anova_posthoc")
async def get_anova_posthoc(payload: DataPayload):
    try:
        df = pd.DataFrame(payload.columns).apply(pd.to_numeric, errors='coerce')
        groups, values = [], []
        for col in df.columns:
            clean_col = df[col].dropna()
            groups.extend([col] * len(clean_col))
            values.extend(clean_col.tolist())
            
        tukey_result = pairwise_tukeyhsd(values, groups, alpha=0.05)
        return {
            "status": "success",
            "data": {
                "method": "Tukey HSD Post-Hoc",
                "reject": tukey_result.reject.tolist(),
                "meandiff": tukey_result.meandiff.tolist(),
                "p_values": tukey_result.pvalue.tolist(),
                "comparisons": [f"{g1} vs {g2}" for g1, g2 in zip(tukey_result.group1, tukey_result.group2)],
                "interpretation": "Tukey HSD Post-Hoc Analysis completed."
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/correlation")
async def get_correlation(payload: DataPayload):
    try:
        df = pd.DataFrame(payload.columns).apply(pd.to_numeric, errors='coerce').dropna()
        pearson_corr = df.corr(method='pearson')
        keys = list(df.columns)
        r_val = pearson_corr.iloc[0, 1]
        p_val = stats.pearsonr(df[keys[0]], df[keys[1]])[1]
        
        interp = (f"There is a correlation of r = {r_val:.3f} (p = {p_val:.4f}) between '{keys[0]}' and '{keys[1]}'.")
        return {
            "status": "success", 
            "data": {
                "test": "Pearson Correlation",
                "pearson_matrix": pearson_corr.to_dict(),
                "interpretation": interp,
                "variables": keys
            }
        }
    except Exception as e:
         raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/chisquare")
async def get_chisquare(payload: dict):
    try:
        df = pd.DataFrame(payload.get("columns", {})).dropna()
        keys = list(df.columns)
        contingency_table = pd.crosstab(df[keys[0]], df[keys[1]])
        observed = contingency_table.values
        chi2, p_value, dof, expected = stats.chi2_contingency(observed)
        
        return {
            "status": "success",
            "data": {
                "test": "Chi-Square Test",
                "chi2": float(chi2),
                "p_value": float(p_value),
                "degrees_freedom": int(dof),
                "interpretation": f"Chi-square test: χ²({dof}) = {chi2:.2f}, p = {p_value:.4f}."
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/levene")
async def get_levene(payload: DataPayload):
    try:
        arrays = clean_data(payload.columns, paired=False, numeric_only=True)
        statistic, p_value = stats.levene(*arrays)
        return {
            "status": "success",
            "data": {
                "test": "Levene's Test",
                "statistic": float(statistic),
                "p_value": float(p_value),
                "interpretation": f"Variances are {'homogeneous' if p_value > 0.05 else 'not homogeneous'} (W = {statistic:.2f}, p = {p_value:.4f})"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/mannwhitney")
async def get_mannwhitney(payload: AnalysisPayload):
    try:
        arrays = clean_data(payload.columns, paired=False, numeric_only=True)
        names = list(payload.columns.keys())
        u_stat, p_value = stats.mannwhitneyu(arrays[0], arrays[1], alternative='two-sided')
        
        n1, n2 = len(arrays[0]), len(arrays[1])
        rank_biserial = 1 - (2 * u_stat) / (n1 * n2)

        return {
            "status": "success",
            "data": {
                "test": "Mann-Whitney U",
                "u_stat": float(u_stat),
                "p_value": float(p_value),
                "rank_biserial_corr": float(abs(rank_biserial)),
                "interpretation": f"Mann-Whitney U test (U = {u_stat:.2f}, p = {p_value:.4f}, r = {abs(rank_biserial):.2f})",
                "group1": {"name": names[0], "median": float(np.median(arrays[0])), "n": n1},
                "group2": {"name": names[1], "median": float(np.median(arrays[1])), "n": n2}
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/wilcoxon")
async def get_wilcoxon(payload: AnalysisPayload):
    try:
        arrays = clean_data(payload.columns, paired=True, numeric_only=True)
        names = list(payload.columns.keys())
        w_stat, p_value = stats.wilcoxon(arrays[0], arrays[1])
        return {
            "status": "success",
            "data": {
                "test": "Wilcoxon Signed-Rank",
                "w_stat": float(w_stat),
                "p_value": float(p_value),
                "interpretation": f"Wilcoxon test (W = {w_stat:.2f}, p = {p_value:.4f})"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stats/kruskal")
async def get_kruskal(payload: AnalysisPayload):
    try:
        arrays = clean_data(payload.columns, paired=False, numeric_only=True)
        h_stat, p_value = stats.kruskal(*arrays)
        total_n = sum([len(a) for a in arrays])
        epsilon_sq = h_stat / ((total_n**2 - 1) / (total_n + 1))
        
        return {
            "status": "success",
            "data": {
                "test": "Kruskal-Wallis H Test",
                "h_stat": float(h_stat),
                "p_value": float(p_value),
                "epsilon_squared": float(epsilon_sq),
                "interpretation": f"Kruskal-Wallis (H = {h_stat:.2f}, p = {p_value:.4f}, ε² = {epsilon_sq:.3f})"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)