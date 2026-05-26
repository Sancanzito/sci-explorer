// games/EcoBalance/hooks/useAudioManager.js
import { useEffect, useRef, useCallback } from 'react';

// Simple audio manager without external dependencies
export const useAudioManager = () => {
  const soundsRef = useRef({});
  const ambientRef = useRef(null);
  
  useEffect(() => {
    // Create simple oscillator for sounds (no external files needed)
    const createBeep = (frequency, duration, volume) => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        gainNode.gain.value = volume;
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (e) {
        console.log('Beep audio error:', e);
      }
    };
    
    soundsRef.current = {
      successChime: () => createBeep(880, 0.3, 0.3),
      warning: () => createBeep(440, 0.5, 0.4),
      critical: () => createBeep(220, 0.8, 0.5),
      click: () => createBeep(660, 0.1, 0.2),
      collapse: () => {
        createBeep(200, 0.5, 0.5);
        setTimeout(() => createBeep(150, 0.8, 0.5), 100);
      },
      intervention: () => createBeep(523.25, 0.2, 0.3)
    };
    
    // Simple ambient sound using oscillator (optional)
    const startAmbient = () => {
      if (ambientRef.current) return;
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 130.81; // C3
        gainNode.gain.value = 0.05;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        
        ambientRef.current = {
          context: audioContext,
          oscillator,
          gainNode
        };
      } catch (e) {
        console.log('Audio not supported');
      }
    };
    
    startAmbient();
    
    // Safe useEffect Cleanup Function
    return () => {
      if (ambientRef.current) {
        try {
          // Only stop oscillator if it exists
          if (ambientRef.current.oscillator) {
            ambientRef.current.oscillator.stop();
          }
          
          // CRITICAL FIX: Only close context if it isn't already closed
          if (ambientRef.current.context && ambientRef.current.context.state !== 'closed') {
            ambientRef.current.context.close().catch((err) => {
              console.warn('AudioContext close handled during unmount:', err);
            });
          }
        } catch (e) {
          console.log('Cleanup audio error:', e);
        }
        ambientRef.current = null;
      }
    };
  }, []);
  
  const playSound = useCallback((soundName) => {
    const sound = soundsRef.current[soundName];
    if (sound && typeof sound === 'function') {
      try {
        sound();
      } catch (e) {
        console.log('Audio play error:', e);
      }
    }
  }, []);
  
  const setVolume = useCallback((volume) => {
    if (ambientRef.current?.gainNode) {
      ambientRef.current.gainNode.gain.value = Math.max(0, Math.min(1, volume)) * 0.05;
    }
  }, []);
  
  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      try {
        if (ambientRef.current.oscillator) {
          ambientRef.current.oscillator.stop();
        }
        
        // CRITICAL FIX: Only close context if it isn't already closed
        if (ambientRef.current.context && ambientRef.current.context.state !== 'closed') {
          ambientRef.current.context.close().catch((err) => {
            console.warn('AudioContext close handled during stopAmbient:', err);
          });
        }
      } catch (e) {
        console.log('Stop ambient audio error:', e);
      }
      ambientRef.current = null;
    }
  }, []);
  
  const playRandomForestSound = useCallback(() => {
    try {
      const randomFreq = 440 + Math.random() * 440;
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = randomFreq;
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Random forest sound error:', e);
    }
  }, []);
  
  return {
    playSound,
    setVolume,
    stopAmbient,
    playRandomForestSound
  };
};