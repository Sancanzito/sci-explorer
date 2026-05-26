"""Spectral analysis for signal processing and frequency domain analysis."""

import numpy as np
from scipy import signal, fft
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass

@dataclass
class PowerSpectrum:
    frequencies: List[float]
    power_density: List[float]
    peak_frequency: float
    total_power: float
    bandwidth_3db: Optional[float]

class SpectralAnalyzer:
    """Provides spectral analysis capabilities."""
    
    def compute_psd_welch(
        self,
        data: List[float],
        sample_rate: float,
        nperseg: Optional[int] = None,
        noverlap: Optional[int] = None
    ) -> PowerSpectrum:
        """
        Compute Power Spectral Density using Welch's method.
        
        Args:
            data: Input signal
            sample_rate: Sampling frequency in Hz
            nperseg: Length of each segment
            noverlap: Number of points to overlap
        """
        arr = np.array(data)
        
        # Default parameters
        if nperseg is None:
            nperseg = min(256, len(arr) // 2)
        if noverlap is None:
            noverlap = nperseg // 2
        
        try:
            frequencies, psd = signal.welch(
                arr,
                fs=sample_rate,
                nperseg=nperseg,
                noverlap=noverlap,
                scaling='density'
            )
            
            # Find peak frequency
            peak_idx = np.argmax(psd)
            peak_freq = frequencies[peak_idx]
            
            # Total power (integral of PSD)
            total_power = np.trapz(psd, frequencies)
            
            # Find -3dB bandwidth
            half_power = psd[peak_idx] / 2
            indices_above_half = np.where(psd >= half_power)[0]
            bandwidth = frequencies[indices_above_half[-1]] - frequencies[indices_above_half[0]] if len(indices_above_half) > 1 else None
            
            return PowerSpectrum(
                frequencies=frequencies.tolist(),
                power_density=psd.tolist(),
                peak_frequency=float(peak_freq),
                total_power=float(total_power),
                bandwidth_3db=float(bandwidth) if bandwidth is not None else None
            )
        except Exception as e:
            raise ValueError(f"PSD computation failed: {str(e)}")
    
    def compute_fft_analysis(
        self,
        data: List[float],
        sample_rate: float
    ) -> Dict[str, Any]:
        """Compute comprehensive FFT analysis."""
        arr = np.array(data)
        N = len(arr)
        
        # Compute FFT
        fft_vals = fft.fft(arr)
        frequencies = fft.fftfreq(N, 1 / sample_rate)
        
        # Single-sided spectrum
        positive_mask = frequencies >= 0
        freqs_pos = frequencies[positive_mask]
        magnitude_pos = np.abs(fft_vals[positive_mask]) * 2 / N
        phase_pos = np.angle(fft_vals[positive_mask])
        
        # Find dominant frequencies
        sorted_indices = np.argsort(magnitude_pos)[::-1][:5]
        dominant_freqs = [
            {
                "frequency": float(freqs_pos[i]),
                "magnitude": float(magnitude_pos[i]),
                "phase": float(phase_pos[i])
            }
            for i in sorted_indices if magnitude_pos[i] > 0
        ]
        
        # Spectral features
        spectral_centroid = np.sum(freqs_pos * magnitude_pos) / np.sum(magnitude_pos) if np.sum(magnitude_pos) > 0 else 0
        spectral_spread = np.sqrt(np.sum((freqs_pos - spectral_centroid)**2 * magnitude_pos) / np.sum(magnitude_pos)) if np.sum(magnitude_pos) > 0 else 0
        
        return {
            "frequencies": freqs_pos.tolist(),
            "magnitudes": magnitude_pos.tolist(),
            "phases": phase_pos.tolist(),
            "dominant_frequencies": dominant_freqs,
            "spectral_centroid": float(spectral_centroid),
            "spectral_spread": float(spectral_spread),
            "total_harmonic_distortion": self._compute_thd(magnitude_pos, dominant_freqs[0]["frequency"] if dominant_freqs else 0)
        }
    
    def _compute_thd(self, magnitudes: np.ndarray, fundamental_freq: float) -> float:
        """Compute Total Harmonic Distortion."""
        if fundamental_freq <= 0:
            return 0.0
        
        # Find harmonics (integer multiples of fundamental)
        harmonic_power = 0
        for i, mag in enumerate(magnitudes):
            # Simple harmonic detection - can be refined
            if mag > 0 and i > 0:  # Skip DC
                harmonic_power += mag ** 2
        
        fundamental_power = magnitudes[0] ** 2 if len(magnitudes) > 0 else 0
        
        return np.sqrt(harmonic_power) / fundamental_power if fundamental_power > 0 else 0
    
    def apply_frequency_filter(
        self,
        data: List[float],
        sample_rate: float,
        filter_type: str,
        cutoff_freq: float,
        order: int = 4
    ) -> List[float]:
        """Apply frequency domain filter."""
        arr = np.array(data)
        nyquist = sample_rate / 2
        normalized_cutoff = cutoff_freq / nyquist
        
        if normalized_cutoff >= 1:
            return data  # Cutoff above Nyquist
        
        if filter_type == "lowpass":
            b, a = signal.butter(order, normalized_cutoff, btype='low')
        elif filter_type == "highpass":
            b, a = signal.butter(order, normalized_cutoff, btype='high')
        elif filter_type == "bandpass":
            # Simple bandpass around cutoff
            low = max(0.01, normalized_cutoff - 0.1)
            high = min(0.99, normalized_cutoff + 0.1)
            b, a = signal.butter(order, [low, high], btype='band')
        else:
            return data
        
        filtered = signal.filtfilt(b, a, arr)
        return filtered.tolist()
    
    def compute_noise_floor(self, data: List[float]) -> Dict[str, float]:
        """Estimate noise floor and SNR."""
        arr = np.array(data)
        
        # Simple noise floor estimation using median of FFT magnitudes
        fft_vals = np.abs(fft.fft(arr))
        noise_floor = np.median(fft_vals[len(fft_vals)//4:3*len(fft_vals)//4])
        
        signal_power = np.mean(arr ** 2)
        noise_power = noise_floor ** 2
        
        snr = 10 * np.log10(signal_power / noise_power) if noise_power > 0 else float('inf')
        
        return {
            "noise_floor_estimate": float(noise_floor),
            "signal_power": float(signal_power),
            "estimated_snr_db": float(snr),
            "dynamic_range_db": float(20 * np.log10(np.max(np.abs(arr)) / noise_floor)) if noise_floor > 0 else float('inf')
        }


spectral_analyzer = SpectralAnalyzer()