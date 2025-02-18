import numpy as np
from scipy.io.wavfile import write
import os

# Sampling rate for audio
SAMPLE_RATE = 16000
DURATION = 3  # Duration of each audio clip in seconds

# Output directory to save generated audio
data_dir = "generated_audio_data"
if not os.path.exists(data_dir):
    os.makedirs(data_dir)

# Function to generate a sine wave for breathing patterns
def generate_breathing(rate: float, label: str):
    t = np.linspace(0, DURATION, int(SAMPLE_RATE * DURATION), False)
    audio = 0.5 * np.sin(2 * np.pi * rate * t)  # Simple breathing-like wave
    audio = (audio * 32767).astype(np.int16)

    filename = os.path.join(data_dir, f"{label}_breathing.wav")
    write(filename, SAMPLE_RATE, audio)
    print(f"Saved: {filename}")

# Function to generate heartbeat sound (synthetic beats)
def generate_heartbeat(bpm: int, label: str):
    beat_interval = 60 / bpm
    samples_per_beat = int(beat_interval * SAMPLE_RATE)

    audio = np.zeros(SAMPLE_RATE * DURATION, dtype=np.float32)
    for i in range(0, len(audio), samples_per_beat):
        if i + 500 < len(audio):
            audio[i:i + 500] = 0.9  # Simulate a short "thump"

    audio = (audio * 32767).astype(np.int16)
    filename = os.path.join(data_dir, f"{label}_heartbeat.wav")
    write(filename, SAMPLE_RATE, audio)
    print(f"Saved: {filename}")

# Generate breathing audio samples
print("Generating breathing samples...")
generate_breathing(1.5, "slow")       # Slow breathing
generate_breathing(3.0, "fast")       # Fast breathing
generate_breathing(5.0, "very_fast")  # Very fast breathing

# Generate heartbeat audio samples
print("Generating heartbeat samples...")
generate_heartbeat(60, "normal")      # Normal heartbeat

generate_heartbeat(100, "fast")       # Fast heartbeat

print("Audio generation complete.")
