# backend/api/schemas.py
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any, Union, Tuple
from enum import Enum

class WaveformType(str, Enum):
    sine = "sine"
    cosine = "cosine"
    square = "square"
    sawtooth = "sawtooth"
    triangle = "triangle"

class FilterType(str, Enum):
    lowpass = "lowpass"
    highpass = "highpass"
    bandpass = "bandpass"
    butterworth = "butterworth"

class DistributionType(str, Enum):
    normal = "normal"
    uniform = "uniform"
    exponential = "exponential"
    poisson = "poisson"

class OperationType(str, Enum):
    eigenvalues = "eigenvalues"
    determinant = "determinant"
    inverse = "inverse"
    svd = "svd"

class GraphParameters(BaseModel):
    # Waveform parameters
    waveform_type: WaveformType = WaveformType.sine
    amplitude: float = Field(1.0, ge=0.1, le=10.0)
    frequency: float = Field(5.0, ge=0.1, le=100.0)
    phase: float = Field(0.0, ge=0, le=360)
    duration: float = Field(1.0, ge=0.1, le=10.0)
    sample_rate: int = Field(1000, ge=100, le=10000)
    
    # Signal processing
    smoothing: float = Field(0.0, ge=0, le=1.0)
    compute_fft: bool = False
    noise_level: float = Field(0.0, ge=0, le=0.5)
    
    # Filter parameters
    filter_type: Optional[FilterType] = None
    cutoff_freq: Optional[float] = Field(None, ge=0.1, le=50.0)
    filter_order: int = Field(4, ge=1, le=10)
    
    # Matrix parameters
    matrix_dimensions: Union[List[int], tuple] = Field([3, 3])
    matrix_type: str = Field("random", pattern="^(random|identity)$")
    operation_type: Optional[OperationType] = None
    
    # Statistical parameters
    distribution_type: DistributionType = DistributionType.normal
    sample_size: int = Field(1000, ge=100, le=10000)
    
    @validator('cutoff_freq')
    def validate_cutoff(cls, v, values):
        if values.get('filter_type') and v is None:
            raise ValueError('cutoff_freq required when filter_type specified')
        return v
    
    @validator('matrix_dimensions', pre=True)
    def validate_dimensions(cls, v):
        if isinstance(v, list):
            if len(v) != 2:
                raise ValueError('matrix_dimensions must have exactly 2 values')
            return v
        elif isinstance(v, tuple):
            if len(v) != 2:
                raise ValueError('matrix_dimensions must have exactly 2 values')
            return list(v)
        return v

class WaveformResponse(BaseModel):
    x_values: List[float]
    y_values: List[float]
    chart_image: str
    fft_data: Optional[Dict[str, List[float]]] = None
    metadata: Dict[str, Any]

class MatrixResponse(BaseModel):
    matrix: List[List[float]]
    eigenvalues: Optional[List[Any]] = None
    determinant: Optional[float] = None
    rank: int
    condition_number: float
    heatmap_image: str
    metadata: Dict[str, Any]

class StatisticalResponse(BaseModel):
    data: List[float]
    mean: float
    median: float
    std_dev: float
    variance: float
    skewness: float
    kurtosis: float
    quartiles: List[float]
    histogram_image: str
    metadata: Dict[str, Any]

class FilterResponse(BaseModel):
    original_signal: List[float]
    filtered_signal: List[float]
    filter_image: str
    metadata: Dict[str, Any]

# ============ ADD THESE NEW CLASSES ============

class FileUploadResponse(BaseModel):
    status: str
    dataset_id: str
    original_filename: str
    rows: int
    columns: int
    data: Dict[str, Any]
    metadata: Dict[str, Any]
    validation: Dict[str, Any]
    statistical_summary: Dict[str, Any]

class DescriptiveStatsRequest(BaseModel):
    dataset_id: str
    column_name: str
    methods: List[str] = Field(default=["mean", "median", "std", "percentiles"])

class DescriptiveStatsResponse(BaseModel):
    column: str
    basic_stats: Dict[str, float]
    percentiles: Dict[int, float]
    distribution: Dict[str, Any]
    outliers: Dict[str, Any]

class HypothesisTestRequest(BaseModel):
    test_type: str
    group1: Union[List[float], str]
    group2: Optional[Union[List[float], str]] = None
    paired: bool = False
    confidence_level: float = Field(0.95, ge=0.8, le=0.99)
    equal_var: bool = True

class HypothesisTestResponse(BaseModel):
    test_name: str
    statistic: float
    p_value: float
    degrees_of_freedom: Optional[int]
    effect_size: Optional[float]
    significant: bool
    confidence_interval: Optional[Tuple[float, float]]
    interpretation: str

class RegressionRequest(BaseModel):
    x_data: List[float]
    y_data: List[float]
    regression_type: str = Field("linear", pattern="^(linear|polynomial|exponential)$")
    polynomial_degree: Optional[int] = Field(2, ge=2, le=5)
    forecast_steps: Optional[int] = Field(0, ge=0, le=100)

class RegressionResponse(BaseModel):
    coefficients: List[float]
    r_squared: float
    adjusted_r_squared: float
    mse: float
    rmse: float
    mae: float
    predictions: List[float]
    residuals: List[float]
    forecast: Optional[Dict[str, Any]]

class SpectralRequest(BaseModel):
    data: List[float]
    sample_rate: float = Field(1000, ge=1)
    method: str = Field("welch", pattern="^(welch|fft)$")
    nperseg: Optional[int] = None

class SpectralResponse(BaseModel):
    frequencies: List[float]
    power_spectrum: List[float]
    peak_frequency: float
    total_power: float
    noise_floor_db: Optional[float]
    snr_db: Optional[float]