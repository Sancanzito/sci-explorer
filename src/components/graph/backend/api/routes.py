# backend/api/routes.py
from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any
import numpy as np
import base64
import io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from scipy import signal, stats, interpolate, linalg

# Fixed imports - removed 'backend.' prefix
from api.schemas import (
    GraphParameters, 
    WaveformResponse, 
    MatrixResponse,
    StatisticalResponse,
    FilterResponse
)
from core.computation import (
    generate_waveform,
    compute_fft,
    apply_filter,
    matrix_operations,
    statistical_analysis,
    solve_linear_system,
    interpolate_data,
    smooth_signal
)
from core.exceptions import ComputationError, ValidationError

router = APIRouter()

@router.post("/waveform", response_model=WaveformResponse)
async def compute_waveform(params: GraphParameters):
    try:
        # Generate waveform data
        x, y = generate_waveform(params)
        
        # Compute FFT if requested
        fft_data = None
        if params.compute_fft:
            freqs, fft_mag = compute_fft(y, params.sample_rate)
            fft_data = {"frequencies": freqs.tolist(), "magnitudes": fft_mag.tolist()}
        
        # Apply smoothing if needed
        if params.smoothing > 0:
            y = smooth_signal(y, params.smoothing)
        
        # Generate visualization
        img_base64 = generate_waveform_plot(x, y, params)
        
        return WaveformResponse(
            x_values=x.tolist(),
            y_values=y.tolist(),
            chart_image=img_base64,
            fft_data=fft_data,
            metadata={
                "sample_count": len(x),
                "signal_type": params.waveform_type.value if hasattr(params.waveform_type, 'value') else params.waveform_type,
                "duration": len(x) / params.sample_rate
            }
        )
    except ComputationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation failed: {str(e)}")

@router.post("/matrix", response_model=MatrixResponse)
async def compute_matrix_operations(params: GraphParameters):
    try:
        results = matrix_operations(params)
        
        # Generate matrix visualization
        img_base64 = generate_matrix_plot(results["matrix"])
        
        # Handle eigenvalues (might be complex numbers)
        eigenvalues = results.get("eigenvalues")
        if eigenvalues is not None:
            # Convert complex numbers to serializable format
            eigenvalues = [complex(e).real if isinstance(complex(e).imag, (int, float)) and complex(e).imag == 0 else [complex(e).real, complex(e).imag] for e in eigenvalues]
        
        return MatrixResponse(
            matrix=results["matrix"].tolist(),
            eigenvalues=eigenvalues,
            determinant=results.get("determinant"),
            rank=results["rank"],
            condition_number=float(results["condition_number"]),
            heatmap_image=img_base64,
            metadata={
                "dimensions": params.matrix_dimensions,
                "operations_performed": results.get("operations", [])
            }
        )
    except ComputationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matrix computation failed: {str(e)}")

@router.post("/statistical", response_model=StatisticalResponse)
async def compute_statistical_analysis(params: GraphParameters):
    try:
        results = statistical_analysis(params)
        
        img_base64 = generate_statistical_plot(results)
        
        return StatisticalResponse(
            data=results["data"].tolist(),
            mean=results["mean"],
            median=results["median"],
            std_dev=results["std_dev"],
            variance=results["variance"],
            skewness=results["skewness"],
            kurtosis=results["kurtosis"],
            quartiles=results["quartiles"],
            histogram_image=img_base64,
            metadata={
                "sample_size": len(results["data"]),
                "distribution": params.distribution_type.value if hasattr(params.distribution_type, 'value') else params.distribution_type
            }
        )
    except ComputationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Statistical analysis failed: {str(e)}")

@router.post("/filter", response_model=FilterResponse)
async def apply_signal_filter(params: GraphParameters):
    try:
        # Generate test signal
        _, y = generate_waveform(params)
        
        # Apply filter
        filtered_y = apply_filter(y, params)
        
        # Generate comparison plot
        img_base64 = generate_filter_plot(y, filtered_y, params)
        
        return FilterResponse(
            original_signal=y.tolist(),
            filtered_signal=filtered_y.tolist(),
            filter_image=img_base64,
            metadata={
                "filter_type": params.filter_type.value if params.filter_type and hasattr(params.filter_type, 'value') else params.filter_type,
                "cutoff_frequency": params.cutoff_freq,
                "order": params.filter_order
            }
        )
    except ComputationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Filter computation failed: {str(e)}")

def generate_waveform_plot(x, y, params):
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
    
    # Time domain plot
    ax1.plot(x, y, linewidth=2, color='#00ff9d')
    signal_type = params.waveform_type.value if hasattr(params.waveform_type, 'value') else params.waveform_type
    ax1.set_title(f'{signal_type.capitalize()} Waveform', fontsize=14, color='white')
    ax1.set_xlabel('Time (s)', color='white')
    ax1.set_ylabel('Amplitude', color='white')
    ax1.grid(True, alpha=0.3)
    ax1.set_facecolor('#1a1a2e')
    ax1.tick_params(colors='white')
    
    # Frequency domain if FFT computed
    if params.compute_fft:
        freqs, fft_mag = compute_fft(y, params.sample_rate)
        ax2.semilogy(freqs[:len(freqs)//2], fft_mag[:len(freqs)//2], linewidth=2, color='#ff6b6b')
        ax2.set_title('Frequency Spectrum', fontsize=14, color='white')
        ax2.set_xlabel('Frequency (Hz)', color='white')
        ax2.set_ylabel('Magnitude', color='white')
        ax2.grid(True, alpha=0.3)
        ax2.set_facecolor('#1a1a2e')
        ax2.tick_params(colors='white')
    
    fig.patch.set_facecolor('#0f0f1a')
    plt.tight_layout()
    
    # Convert to base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, facecolor=fig.get_facecolor(), bbox_inches='tight')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode()
    plt.close()
    
    return f"data:image/png;base64,{img_base64}"

def generate_matrix_plot(matrix):
    fig, ax = plt.subplots(figsize=(10, 8))
    im = ax.imshow(matrix, cmap='viridis', aspect='auto')
    ax.set_title('Matrix Heatmap', fontsize=14, color='white')
    plt.colorbar(im)
    fig.patch.set_facecolor('#0f0f1a')
    ax.set_facecolor('#1a1a2e')
    ax.tick_params(colors='white')
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, facecolor=fig.get_facecolor(), bbox_inches='tight')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode()
    plt.close()
    
    return f"data:image/png;base64,{img_base64}"

def generate_statistical_plot(results):
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    
    # Histogram
    ax1.hist(results["data"], bins=30, color='#00ff9d', alpha=0.7, edgecolor='white')
    ax1.axvline(results["mean"], color='#ff6b6b', linewidth=2, label=f'Mean: {results["mean"]:.2f}')
    ax1.axvline(results["median"], color='#4ecdc4', linewidth=2, label=f'Median: {results["median"]:.2f}')
    ax1.set_title('Data Distribution', fontsize=14, color='white')
    ax1.set_xlabel('Value', color='white')
    ax1.set_ylabel('Frequency', color='white')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    ax1.set_facecolor('#1a1a2e')
    ax1.tick_params(colors='white')
    
    # Box plot
    ax2.boxplot(results["data"], vert=True, patch_artist=True,
                boxprops=dict(facecolor='#00ff9d', color='white'),
                whiskerprops=dict(color='white'),
                capprops=dict(color='white'),
                medianprops=dict(color='#ff6b6b', linewidth=2))
    ax2.set_title('Statistical Summary', fontsize=14, color='white')
    ax2.set_ylabel('Values', color='white')
    ax2.set_facecolor('#1a1a2e')
    ax2.tick_params(colors='white')
    
    fig.patch.set_facecolor('#0f0f1a')
    plt.tight_layout()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, facecolor=fig.get_facecolor(), bbox_inches='tight')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode()
    plt.close()
    
    return f"data:image/png;base64,{img_base64}"

def generate_filter_plot(original, filtered, params):
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
    
    ax1.plot(original, linewidth=1.5, color='#ff6b6b', alpha=0.7, label='Original')
    ax1.set_title('Original Signal', fontsize=14, color='white')
    ax1.set_ylabel('Amplitude', color='white')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    ax1.set_facecolor('#1a1a2e')
    ax1.tick_params(colors='white')
    
    filter_type = params.filter_type.value if params.filter_type and hasattr(params.filter_type, 'value') else params.filter_type
    ax2.plot(filtered, linewidth=2, color='#00ff9d', label=f'{filter_type.capitalize() if filter_type else "Filter"} Filtered')
    ax2.set_title(f'Filtered Signal (Cutoff: {params.cutoff_freq} Hz, Order: {params.filter_order})', fontsize=14, color='white')
    ax2.set_xlabel('Sample Index', color='white')
    ax2.set_ylabel('Amplitude', color='white')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    ax2.set_facecolor('#1a1a2e')
    ax2.tick_params(colors='white')
    
    fig.patch.set_facecolor('#0f0f1a')
    plt.tight_layout()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, facecolor=fig.get_facecolor(), bbox_inches='tight')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode()
    plt.close()
    
    return f"data:image/png;base64,{img_base64}"