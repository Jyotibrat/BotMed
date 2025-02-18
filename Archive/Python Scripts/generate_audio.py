from gtts import gTTS
import os

# Text to convert to audio
text = "Maintain proper hydration and rest for recovery."

# Create the audio file
tts = gTTS(text=text, lang='en')
output_file = "test_audio005.wav"
tts.save(output_file)

print(f"Audio file saved as {output_file}.")