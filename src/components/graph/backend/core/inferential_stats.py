"""Inferential statistics for hypothesis testing and group comparisons."""

import numpy as np
from scipy import stats
from typing import List, Dict, Any, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

class TestType(Enum):
    T_TEST_INDEPENDENT = "t_test_independent"
    T_TEST_PAIRED = "t_test_paired"
    T_TEST_ONE_SAMPLE = "t_test_one_sample"
    MANN_WHITNEY = "mann_whitney"
    WILCOXON = "wilcoxon"
    CHI_SQUARE = "chi_square"
    ANOVA_ONE_WAY = "anova_one_way"
    ANOVA_TWO_WAY = "anova_two_way"
    KRUSKAL_WALLIS = "kruskal_wallis"

@dataclass
class HypothesisTestResult:
    test_name: str
    statistic: float
    p_value: float
    degrees_of_freedom: Optional[int]
    effect_size: Optional[float]
    significant: bool
    confidence_interval: Optional[Tuple[float, float]]
    interpretation: str

class InferentialStatistics:
    """Provides hypothesis testing and inferential statistical methods."""
    
    def t_test_independent(
        self,
        group1: List[float],
        group2: List[float],
        equal_var: bool = True,
        confidence_level: float = 0.95
    ) -> HypothesisTestResult:
        """Independent two-sample t-test."""
        arr1 = np.array(group1)
        arr2 = np.array(group2)
        
        # Remove NaN
        arr1_clean = arr1[~np.isnan(arr1)]
        arr2_clean = arr2[~np.isnan(arr2)]
        
        if len(arr1_clean) < 2 or len(arr2_clean) < 2:
            raise ValueError("Insufficient data for t-test")
        
        # Perform test
        statistic, p_value = stats.ttest_ind(arr1_clean, arr2_clean, equal_var=equal_var)
        
        # Degrees of freedom
        if equal_var:
            df = len(arr1_clean) + len(arr2_clean) - 2
        else:
            # Welch-Satterthwaite approximation
            s1 = np.var(arr1_clean, ddof=1)
            s2 = np.var(arr2_clean, ddof=1)
            n1, n2 = len(arr1_clean), len(arr2_clean)
            df = (s1/n1 + s2/n2)**2 / ((s1/n1)**2/(n1-1) + (s2/n2)**2/(n2-1))
        
        # Effect size (Cohen's d)
        pooled_std = np.sqrt(((n1-1)*s1 + (n2-1)*s2) / (n1+n2-2)) if equal_var else np.sqrt(s1/n1 + s2/n2)
        effect_size = abs(np.mean(arr1_clean) - np.mean(arr2_clean)) / pooled_std if pooled_std > 0 else 0
        
        # Confidence interval for mean difference
        mean_diff = np.mean(arr1_clean) - np.mean(arr2_clean)
        se_diff = np.sqrt(s1/n1 + s2/n2)
        t_critical = stats.t.ppf((1 + confidence_level) / 2, df)
        ci = (mean_diff - t_critical * se_diff, mean_diff + t_critical * se_diff)
        
        # Interpretation
        if p_value < 0.001:
            interpretation = "Very strong evidence against null hypothesis"
        elif p_value < 0.01:
            interpretation = "Strong evidence against null hypothesis"
        elif p_value < 0.05:
            interpretation = "Moderate evidence against null hypothesis"
        elif p_value < 0.1:
            interpretation = "Weak evidence against null hypothesis"
        else:
            interpretation = "No significant evidence against null hypothesis"
        
        return HypothesisTestResult(
            test_name="Independent t-test",
            statistic=float(statistic),
            p_value=float(p_value),
            degrees_of_freedom=int(df),
            effect_size=float(effect_size),
            significant=p_value < 0.05,
            confidence_interval=ci,
            interpretation=interpretation
        )
    
    def t_test_paired(
        self,
        before: List[float],
        after: List[float],
        confidence_level: float = 0.95
    ) -> HypothesisTestResult:
        """Paired two-sample t-test."""
        arr_before = np.array(before)
        arr_after = np.array(after)
        
        # Pair and remove NaN
        valid_mask = ~(np.isnan(arr_before) | np.isnan(arr_after))
        before_clean = arr_before[valid_mask]
        after_clean = arr_after[valid_mask]
        
        if len(before_clean) < 2:
            raise ValueError("Insufficient paired data")
        
        # Perform test
        differences = after_clean - before_clean
        statistic, p_value = stats.ttest_rel(before_clean, after_clean)
        
        # Effect size (Cohen's d for paired)
        effect_size = np.mean(differences) / np.std(differences, ddof=1) if np.std(differences) > 0 else 0
        
        # Confidence interval for mean difference
        mean_diff = np.mean(differences)
        se_diff = np.std(differences, ddof=1) / np.sqrt(len(differences))
        t_critical = stats.t.ppf((1 + confidence_level) / 2, len(differences) - 1)
        ci = (mean_diff - t_critical * se_diff, mean_diff + t_critical * se_diff)
        
        return HypothesisTestResult(
            test_name="Paired t-test",
            statistic=float(statistic),
            p_value=float(p_value),
            degrees_of_freedom=len(differences) - 1,
            effect_size=float(effect_size),
            significant=p_value < 0.05,
            confidence_interval=ci,
            interpretation="Significant difference" if p_value < 0.05 else "No significant difference"
        )
    
    def mann_whitney_u(
        self,
        group1: List[float],
        group2: List[float]
    ) -> HypothesisTestResult:
        """Mann-Whitney U test (non-parametric alternative to t-test)."""
        arr1 = np.array(group1)
        arr2 = np.array(group2)
        
        arr1_clean = arr1[~np.isnan(arr1)]
        arr2_clean = arr2[~np.isnan(arr2)]
        
        statistic, p_value = stats.mannwhitneyu(arr1_clean, arr2_clean, alternative='two-sided')
        
        # Effect size (r = Z / sqrt(N))
        n = len(arr1_clean) + len(arr2_clean)
        z_score = stats.norm.ppf(p_value / 2) if p_value > 0 else 0
        effect_size = abs(z_score) / np.sqrt(n) if n > 0 else 0
        
        return HypothesisTestResult(
            test_name="Mann-Whitney U",
            statistic=float(statistic),
            p_value=float(p_value),
            degrees_of_freedom=None,
            effect_size=float(effect_size),
            significant=p_value < 0.05,
            confidence_interval=None,
            interpretation="Distributions differ significantly" if p_value < 0.05 else "No significant distribution difference"
        )
    
    def chi_square_test(
        self,
        observed: List[List[int]]
    ) -> HypothesisTestResult:
        """Chi-square test for independence or goodness-of-fit."""
        observed_array = np.array(observed)
        
        statistic, p_value, df, expected = stats.chi2_contingency(observed_array)
        
        # Effect size (Cramer's V)
        n = np.sum(observed_array)
        min_dim = min(observed_array.shape) - 1
        cramers_v = np.sqrt(statistic / (n * min_dim)) if min_dim > 0 and n > 0 else 0
        
        return HypothesisTestResult(
            test_name="Chi-square test",
            statistic=float(statistic),
            p_value=float(p_value),
            degrees_of_freedom=int(df),
            effect_size=float(cramers_v),
            significant=p_value < 0.05,
            confidence_interval=None,
            interpretation="Variables are associated" if p_value < 0.05 else "No significant association"
        )
    
    def anova_one_way(
        self,
        groups: List[List[float]]
    ) -> HypothesisTestResult:
        """One-way ANOVA for comparing multiple groups."""
        # Prepare data
        group_arrays = [np.array(g)[~np.isnan(np.array(g))] for g in groups]
        group_arrays = [g for g in group_arrays if len(g) > 0]
        
        if len(group_arrays) < 2:
            raise ValueError("Need at least 2 groups for ANOVA")
        
        # Perform ANOVA
        statistic, p_value = stats.f_oneway(*group_arrays)
        
        # Calculate effect size (eta-squared)
        all_data = np.concatenate(group_arrays)
        grand_mean = np.mean(all_data)
        
        ss_between = sum(len(g) * (np.mean(g) - grand_mean)**2 for g in group_arrays)
        ss_within = sum(np.sum((g - np.mean(g))**2) for g in group_arrays)
        ss_total = ss_between + ss_within
        eta_squared = ss_between / ss_total if ss_total > 0 else 0
        
        df_between = len(group_arrays) - 1
        df_within = len(all_data) - len(group_arrays)
        
        return HypothesisTestResult(
            test_name="One-way ANOVA",
            statistic=float(statistic),
            p_value=float(p_value),
            degrees_of_freedom=df_between,
            effect_size=float(eta_squared),
            significant=p_value < 0.05,
            confidence_interval=None,
            interpretation=f"Significant difference between groups (F({df_between},{df_within}) = {statistic:.3f}, p = {p_value:.4f})" if p_value < 0.05 else "No significant difference between groups"
        )
    
    def kruskal_wallis(
        self,
        groups: List[List[float]]
    ) -> HypothesisTestResult:
        """Kruskal-Wallis H-test (non-parametric ANOVA)."""
        group_arrays = [np.array(g)[~np.isnan(np.array(g))] for g in groups if len(np.array(g)[~np.isnan(np.array(g))]) > 0]
        
        if len(group_arrays) < 2:
            raise ValueError("Need at least 2 groups")
        
        statistic, p_value = stats.kruskal(*group_arrays)
        
        # Effect size (eta-squared for ranks)
        all_ranks = stats.rankdata(np.concatenate(group_arrays))
        n_total = len(all_ranks)
        k = len(group_arrays)
        
        # Calculate eta-squared
        rank_positions = []
        start = 0
        for g in group_arrays:
            end = start + len(g)
            rank_positions.append(all_ranks[start:end])
            start = end
        
        mean_rank_total = np.mean(all_ranks)
        ss_between = sum(len(g) * (np.mean(r) - mean_rank_total)**2 for r, g in zip(rank_positions, group_arrays))
        ss_total = np.sum((all_ranks - mean_rank_total)**2)
        eta_squared = ss_between / ss_total if ss_total > 0 else 0
        
        return HypothesisTestResult(
            test_name="Kruskal-Wallis H",
            statistic=float(statistic),
            p_value=float(p_value),
            degrees_of_freedom=k - 1,
            effect_size=float(eta_squared),
            significant=p_value < 0.05,
            confidence_interval=None,
            interpretation="Significant difference between groups" if p_value < 0.05 else "No significant difference"
        )
    
    def correlation_analysis(
        self,
        x: List[float],
        y: List[float],
        method: str = "pearson"
    ) -> Dict[str, Any]:
        """Compute correlation coefficient and significance."""
        x_arr = np.array(x)
        y_arr = np.array(y)
        
        # Remove NaN pairs
        valid_mask = ~(np.isnan(x_arr) | np.isnan(y_arr))
        x_clean = x_arr[valid_mask]
        y_clean = y_arr[valid_mask]
        
        if len(x_clean) < 3:
            raise ValueError("Insufficient data for correlation")
        
        if method == "pearson":
            r, p_value = stats.pearsonr(x_clean, y_clean)
            interpretation = self._interpret_correlation(r)
        elif method == "spearman":
            r, p_value = stats.spearmanr(x_clean, y_clean)
            interpretation = self._interpret_correlation(r)
        else:
            raise ValueError(f"Unknown correlation method: {method}")
        
        # Confidence interval for Pearson's r
        ci = None
        if method == "pearson" and len(x_clean) > 3:
            z = np.arctanh(r)
            se = 1 / np.sqrt(len(x_clean) - 3)
            z_critical = stats.norm.ppf(0.975)
            ci_lower = np.tanh(z - z_critical * se)
            ci_upper = np.tanh(z + z_critical * se)
            ci = (float(ci_lower), float(ci_upper))
        
        return {
            "method": method,
            "coefficient": float(r),
            "p_value": float(p_value),
            "significant": p_value < 0.05,
            "confidence_interval": ci,
            "interpretation": interpretation,
            "sample_size": len(x_clean)
        }
    
    def _interpret_correlation(self, r: float) -> str:
        """Interpret correlation coefficient magnitude."""
        abs_r = abs(r)
        if abs_r >= 0.9:
            strength = "very strong"
        elif abs_r >= 0.7:
            strength = "strong"
        elif abs_r >= 0.5:
            strength = "moderate"
        elif abs_r >= 0.3:
            strength = "weak"
        else:
            strength = "negligible"
        
        direction = "positive" if r > 0 else "negative"
        return f"{strength} {direction} correlation"


inferential_stats = InferentialStatistics()