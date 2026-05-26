"""Regression analysis for trend fitting and forecasting."""

import numpy as np
from scipy import stats, optimize
from typing import List, Dict, Any, Tuple, Optional
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
from dataclasses import dataclass

@dataclass
class RegressionResult:
    coefficients: List[float]
    r_squared: float
    adjusted_r_squared: float
    mse: float
    rmse: float
    mae: float
    predictions: List[float]
    residuals: List[float]
    confidence_intervals: Optional[Dict[str, List[float]]]

class RegressionEngine:
    """Provides regression analysis capabilities."""
    
    def linear_regression(
        self,
        x: List[float],
        y: List[float],
        confidence_level: float = 0.95
    ) -> RegressionResult:
        """Perform linear regression with statistics."""
        x_arr = np.array(x).reshape(-1, 1)
        y_arr = np.array(y)
        
        # Remove NaN values
        valid_mask = ~(np.isnan(x_arr.flatten()) | np.isnan(y_arr))
        x_clean = x_arr[valid_mask].reshape(-1, 1)
        y_clean = y_arr[valid_mask]
        
        if len(x_clean) < 2:
            raise ValueError("Insufficient data for regression")
        
        # Perform regression
        model = LinearRegression()
        model.fit(x_clean, y_clean)
        predictions = model.predict(x_clean)
        
        # Statistics
        residuals = y_clean - predictions
        ss_res = np.sum(residuals ** 2)
        ss_tot = np.sum((y_clean - np.mean(y_clean)) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
        n = len(y_clean)
        p = 1  # Number of predictors
        adjusted_r_squared = 1 - (1 - r_squared) * (n - 1) / (n - p - 1) if n - p - 1 > 0 else r_squared
        
        # Error metrics
        mse = np.mean(residuals ** 2)
        rmse = np.sqrt(mse)
        mae = np.mean(np.abs(residuals))
        
        # Confidence intervals
        ci = self._compute_confidence_intervals(
            x_clean.flatten(), predictions, residuals, confidence_level
        )
        
        return RegressionResult(
            coefficients=[float(model.intercept_), float(model.coef_[0])],
            r_squared=float(r_squared),
            adjusted_r_squared=float(adjusted_r_squared),
            mse=float(mse),
            rmse=float(rmse),
            mae=float(mae),
            predictions=predictions.tolist(),
            residuals=residuals.tolist(),
            confidence_intervals=ci
        )
    
    def polynomial_regression(
        self,
        x: List[float],
        y: List[float],
        degree: int = 2
    ) -> RegressionResult:
        """Perform polynomial regression."""
        x_arr = np.array(x)
        y_arr = np.array(y)
        
        # Remove NaN
        valid_mask = ~(np.isnan(x_arr) | np.isnan(y_arr))
        x_clean = x_arr[valid_mask]
        y_clean = y_arr[valid_mask]
        
        if len(x_clean) < degree + 1:
            raise ValueError(f"Insufficient data for degree {degree} polynomial")
        
        # Fit polynomial
        model = make_pipeline(PolynomialFeatures(degree), LinearRegression())
        model.fit(x_clean.reshape(-1, 1), y_clean)
        predictions = model.predict(x_clean.reshape(-1, 1))
        
        # Extract coefficients
        poly_features = model.named_steps['polynomialfeatures']
        lin_reg = model.named_steps['linearregression']
        coefficients = [float(lin_reg.intercept_)] + [float(c) for c in lin_reg.coef_[1:]]
        
        # Statistics
        residuals = y_clean - predictions
        ss_res = np.sum(residuals ** 2)
        ss_tot = np.sum((y_clean - np.mean(y_clean)) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
        n = len(y_clean)
        p = degree
        adjusted_r_squared = 1 - (1 - r_squared) * (n - 1) / (n - p - 1) if n - p - 1 > 0 else r_squared
        
        return RegressionResult(
            coefficients=coefficients,
            r_squared=float(r_squared),
            adjusted_r_squared=float(adjusted_r_squared),
            mse=float(np.mean(residuals ** 2)),
            rmse=float(np.sqrt(np.mean(residuals ** 2))),
            mae=float(np.mean(np.abs(residuals))),
            predictions=predictions.tolist(),
            residuals=residuals.tolist(),
            confidence_intervals=None
        )
    
    def exponential_regression(
        self,
        x: List[float],
        y: List[float]
    ) -> RegressionResult:
        """Perform exponential regression y = a * exp(b * x)."""
        x_arr = np.array(x)
        y_arr = np.array(y)
        
        # Remove non-positive y for log transform
        valid_mask = (y_arr > 0) & ~np.isnan(x_arr) & ~np.isnan(y_arr)
        x_clean = x_arr[valid_mask]
        y_clean = y_arr[valid_mask]
        
        if len(x_clean) < 2:
            raise ValueError("Insufficient data for exponential regression")
        
        # Transform to linear: log(y) = log(a) + b*x
        log_y = np.log(y_clean)
        
        # Linear fit on transformed data
        A = np.vstack([x_clean, np.ones(len(x_clean))]).T
        b_coef, log_a = np.linalg.lstsq(A, log_y, rcond=None)[0]
        
        a = np.exp(log_a)
        predictions = a * np.exp(b_coef * x_clean)
        
        # Statistics
        residuals = y_clean - predictions
        ss_res = np.sum(residuals ** 2)
        ss_tot = np.sum((y_clean - np.mean(y_clean)) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
        
        return RegressionResult(
            coefficients=[float(a), float(b_coef)],
            r_squared=float(r_squared),
            adjusted_r_squared=float(r_squared),  # Simplified
            mse=float(np.mean(residuals ** 2)),
            rmse=float(np.sqrt(np.mean(residuals ** 2))),
            mae=float(np.mean(np.abs(residuals))),
            predictions=predictions.tolist(),
            residuals=residuals.tolist(),
            confidence_intervals=None
        )
    
    def forecast(
        self,
        x: List[float],
        y: List[float],
        future_steps: int,
        method: str = "linear"
    ) -> Dict[str, Any]:
        """Generate forecasts for future time points."""
        x_arr = np.array(x)
        y_arr = np.array(y)
        
        # Fit model
        if method == "linear":
            model = LinearRegression()
            model.fit(x_arr.reshape(-1, 1), y_arr)
            coef = [float(model.intercept_), float(model.coef_[0])]
            
            future_x = np.arange(x_arr[-1] + 1, x_arr[-1] + future_steps + 1)
            forecasts = model.predict(future_x.reshape(-1, 1))
            
        elif method == "polynomial":
            degree = min(2, len(x) // 3)
            model = make_pipeline(PolynomialFeatures(degree), LinearRegression())
            model.fit(x_arr.reshape(-1, 1), y_arr)
            
            future_x = np.arange(x_arr[-1] + 1, x_arr[-1] + future_steps + 1)
            forecasts = model.predict(future_x.reshape(-1, 1))
            coef = []
        else:
            raise ValueError(f"Unknown forecast method: {method}")
        
        # Simple confidence bands (based on recent variance)
        residuals = y_arr - model.predict(x_arr.reshape(-1, 1))
        residual_std = np.std(residuals)
        
        return {
            "method": method,
            "future_indices": future_x.tolist(),
            "forecast_values": forecasts.tolist(),
            "lower_bound": (forecasts - 1.96 * residual_std).tolist(),
            "upper_bound": (forecasts + 1.96 * residual_std).tolist(),
            "coefficients": coef if method == "linear" else None,
            "recent_variance": float(residual_std ** 2)
        }
    
    def _compute_confidence_intervals(
        self,
        x: np.ndarray,
        predictions: np.ndarray,
        residuals: np.ndarray,
        confidence_level: float
    ) -> Dict[str, List[float]]:
        """Compute prediction confidence intervals."""
        n = len(x)
        if n < 3:
            return None
        
        # Standard error of predictions
        residual_std = np.std(residuals)
        x_mean = np.mean(x)
        x_var = np.var(x)
        
        # Standard error for each prediction
        se = residual_std * np.sqrt(1 + 1/n + (x - x_mean)**2 / (n * x_var)) if x_var > 0 else residual_std
        
        # Critical value for t-distribution
        from scipy import stats
        t_critical = stats.t.ppf((1 + confidence_level) / 2, n - 2)
        
        margin = t_critical * se
        
        return {
            "lower": (predictions - margin).tolist(),
            "upper": (predictions + margin).tolist(),
            "confidence_level": confidence_level
        }


regression_engine = RegressionEngine()