import numpy as np
import librosa
import soundfile as sf
import random
import os

# Directory to save synthetic audio samples
SAVE_DIR = "generated_medical_audio"
os.makedirs(SAVE_DIR, exist_ok=True)

# Parameters
sr = 16000  # Sample rate
sample_duration = 3  # Duration in seconds
num_samples = 100  # Number of samples to generate

# Helper functions to generate synthetic sounds
def generate_heartbeat(frequency=1.0, duration=3, sr=16000):
    """Generates a heartbeat-like sound."""
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    heart_wave = 0.3 * np.sin(2 * np.pi * frequency * t)
    heart_wave[t % 1.0 < 0.05] += 0.6  # Add pulse effect
    return heart_wave


def generate_breathing(duration=3, sr=16000):
    """Generates synthetic breathing sounds."""
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    breath = 0.2 * np.sin(2 * np.pi * 1.5 * t)  # Slow wave breathing
    breath += 0.05 * np.random.randn(len(t))  # Add slight noise
    breath[t % 1.5 < 0.1] += 0.2  # Inhale spikes
    return breath


def add_white_noise(audio, noise_level=0.02):
    """Adds white noise to the audio."""
    noise = noise_level * np.random.randn(len(audio))
    return audio + noise


def add_hum_noise(audio, frequency=50, sr=16000):
    """Adds hum noise (like electrical hum)."""
    t = np.linspace(0, len(audio) / sr, len(audio), endpoint=False)
    hum = 0.02 * np.sin(2 * np.pi * frequency * t)
    return audio + hum


# Predefined words to include in samples
filler_words = ["hmm", "ok", "so", "yeah", "uh-huh"]

for i in range(num_samples):
    # Generate base signals
    audio = np.zeros(int(sr * sample_duration))

    # Select random sound elements
    if random.random() < 0.5:
        audio += generate_heartbeat(duration=sample_duration, sr=sr)
    if random.random() < 0.5:
        audio += generate_breathing(duration=sample_duration, sr=sr)

    # Add noise
    audio = add_white_noise(audio)
    audio = add_hum_noise(audio)

    # Add random filler words
    word_position = random.randint(0, len(audio) - sr // 2)
    word = random.choice(filler_words)
    print(f"Sample {i+1}: Adding word '{word}' at position {word_position}")
    
    # Save audio sample
    filename = os.path.join(SAVE_DIR, f"sample_{i+1:03d}.wav")
    sf.write(filename, audio, sr)

print(f"Generated {num_samples} synthetic audio samples in '{SAVE_DIR}'.")
