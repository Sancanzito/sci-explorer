# backend/core/computation.py
import numpy as np
from scipy import signal, stats, linalg, interpolate
from typing import Tuple, Dict, Any, Optional

# Fixed import - removed 'backend.' prefix
from core.exceptions import ComputationError

def generate_waveform(params) -> Tuple[np.ndarray, np.ndarray]:
    try:
        t = np.linspace(0, params.duration, int(params.sample_rate * params.duration))
        
        if params.waveform_type == "sine":
            y = params.amplitude * np.sin(2 * np.pi * params.frequency * t + np.radians(params.phase))
        elif params.waveform_type == "cosine":
            y = params.amplitude * np.cos(2 * np.pi * params.frequency * t + np.radians(params.phase))
        elif params.waveform_type == "square":
            y = params.amplitude * signal.square(2 * np.pi * params.frequency * t + np.radians(params.phase))
        elif params.waveform_type == "sawtooth":
            y = params.amplitude * signal.sawtooth(2 * np.pi * params.frequency * t + np.radians(params.phase))
        elif params.waveform_type == "triangle":
            y = params.amplitude * signal.sawtooth(2 * np.pi * params.frequency * t + np.radians(params.phase), width=0.5)
        else:
            raise ComputationError(f"Unknown waveform type: {params.waveform_type}")
        
        # Add noise if specified
        if params.noise_level > 0:
            noise = np.random.normal(0, params.noise_level * params.amplitude, len(t))
            y += noise
        
        return t, y
    except Exception as e:
        raise ComputationError(f"Waveform generation failed: {str(e)}")

def compute_fft(y: np.ndarray, sample_rate: int) -> Tuple[np.ndarray, np.ndarray]:
    try:
        N = len(y)
        yf = np.fft.fft(y)
        xf = np.fft.fftfreq(N, 1 / sample_rate)
        magnitude = 2.0 / N * np.abs(yf)
        return xf, magnitude
    except Exception as e:
        raise ComputationError(f"FFT computation failed: {str(e)}")

def apply_filter(y: np.ndarray, params) -> np.ndarray:
    try:
        nyquist = params.sample_rate / 2
        normalized_cutoff = params.cutoff_freq / nyquist
        
        if params.filter_type == "lowpass":
            b, a = signal.butter(params.filter_order, normalized_cutoff, btype='low')
        elif params.filter_type == "highpass":
            b, a = signal.butter(params.filter_order, normalized_cutoff, btype='high')
        elif params.filter_type == "bandpass":
            b, a = signal.butter(params.filter_order, [normalized_cutoff - 0.1, normalized_cutoff + 0.1], btype='band')
        elif params.filter_type == "butterworth":
            b, a = signal.butter(params.filter_order, normalized_cutoff)
        else:
            return y
        
        filtered = signal.filtfilt(b, a, y)
        return filtered
    except Exception as e:
        raise ComputationError(f"Filter application failed: {str(e)}")

def matrix_operations(params) -> Dict[str, Any]:
    try:
        # Handle dimensions from list or tuple
        dims = params.matrix_dimensions
        if isinstance(dims, list):
            dims = tuple(dims)
        
        # Generate matrix based on type
        if params.matrix_type == "random":
            matrix = np.random.randn(dims[0], dims[1])
        elif params.matrix_type == "identity":
            if dims[0] != dims[1]:
                raise ComputationError("Identity matrix must be square")
            matrix = np.eye(dims[0])
        else:
            matrix = np.random.randn(dims[0], dims[1])
        
        # Initialize results
        results = {
            "matrix": matrix,
            "determinant": None,
            "eigenvalues": None,
            "inverse": None,
            "svd": None,
            "rank": int(np.linalg.matrix_rank(matrix)),
            "condition_number": float(np.linalg.cond(matrix)),
            "operations": []
        }
        
        # Perform operations for square matrices
        if dims[0] == dims[1]:
            try:
                results["determinant"] = float(np.linalg.det(matrix))
                results["operations"].append("determinant")
            except:
                results["determinant"] = None
            
            # Perform specific operation if requested
            if params.operation_type == "eigenvalues":
                try:
                    eigenvalues, eigenvectors = np.linalg.eig(matrix)
                    results["eigenvalues"] = eigenvalues.astype(complex).tolist()
                    results["operations"].append("eigenvalue_decomposition")
                except:
                    results["eigenvalues"] = None
                    
            elif params.operation_type == "inverse":
                try:
                    if results["determinant"] != 0:
                        inv_matrix = np.linalg.inv(matrix)
                        results["inverse"] = inv_matrix.tolist()
                        results["operations"].append("inverse")
                except:
                    results["inverse"] = None
                    
            elif params.operation_type == "svd":
                try:
                    U, s, Vh = np.linalg.svd(matrix)
                    results["svd"] = {
                        "U": U.tolist(), 
                        "singular_values": s.tolist(), 
                        "Vh": Vh.tolist()
                    }
                    results["operations"].append("svd")
                except:
                    results["svd"] = None
        
        results["heatmap_matrix"] = matrix
        return results
        
    except linalg.LinAlgError as e:
        raise ComputationError(f"Matrix operation failed: {str(e)}")
    except Exception as e:
        raise ComputationError(f"Matrix computation failed: {str(e)}")

def statistical_analysis(params) -> Dict[str, Any]:
    try:
        if params.distribution_type == "normal":
            data = np.random.normal(0, 1, params.sample_size)
        elif params.distribution_type == "uniform":
            data = np.random.uniform(-3, 3, params.sample_size)
        elif params.distribution_type == "exponential":
            data = np.random.exponential(1, params.sample_size)
        elif params.distribution_type == "poisson":
            data = np.random.poisson(3, params.sample_size)
        else:
            data = np.random.normal(0, 1, params.sample_size)
        
        quartiles = np.percentile(data, [25, 50, 75])
        
        return {
            "data": data,
            "mean": float(np.mean(data)),
            "median": float(np.median(data)),
            "std_dev": float(np.std(data)),
            "variance": float(np.var(data)),
            "skewness": float(stats.skew(data)),
            "kurtosis": float(stats.kurtosis(data)),
            "quartiles": quartiles.tolist()
        }
    except Exception as e:
        raise ComputationError(f"Statistical analysis failed: {str(e)}")

def smooth_signal(y: np.ndarray, smoothing_factor: float) -> np.ndarray:
    try:
        window_length = max(3, int(len(y) * smoothing_factor))
        if window_length % 2 == 0:
            window_length += 1
        if window_length >= len(y):
            window_length = len(y) - 1 if len(y) % 2 == 0 else len(y) - 2
        
        from scipy.signal import savgol_filter
        smoothed = savgol_filter(y, window_length, 3)
        return smoothed
    except Exception as e:
        return y

def interpolate_data(x: np.ndarray, y: np.ndarray, num_points: int) -> Tuple[np.ndarray, np.ndarray]:
    try:
        x_new = np.linspace(x.min(), x.max(), num_points)
        f = interpolate.interp1d(x, y, kind='cubic')
        y_new = f(x_new)
        return x_new, y_new
    except Exception as e:
        raise ComputationError(f"Interpolation failed: {str(e)}")

def solve_linear_system(params) -> dict:
    # Add your solver logic here
    return {"status": "success", "solution": [0, 0]}