import json
import numpy as np
import tensorflow as tf
from keras.preprocessing.sequence import pad_sequences
from keras.layers import Input, Conv1D, Bidirectional, LSTM, TimeDistributed, Dense
import librosa
import os

# Paths for audio data and transcripts
DATA_DIR = "C:\\Users\\Ansh Gaur\\Lucifer\\data\\audio"
TRANSCRIPT_FILE = "C:\\Users\\Ansh Gaur\\Lucifer\\data\\transcript.json"
MODEL_PATH = "C:\\Users\\Ansh Gaur\\Lucifer\\audio_recognition_model.h5"

# Load JSON Transcripts
with open(TRANSCRIPT_FILE) as f:
    transcripts = json.load(f)

# Audio feature extraction and target collection
audio_features = []
target_texts = []
vocab = set()

for entry in transcripts:
    audio_path = os.path.join(DATA_DIR, f"{entry['id']}.wav")
    if os.path.exists(audio_path):
        audio, sr = librosa.load(audio_path, sr=16000)
        mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40).T
        if len(mfcc) > 0:
            audio_features.append(mfcc)
            target_texts.append(entry["content"].lower())
            vocab.update(entry["content"].lower().split())

# Create vocab mappings
vocab = sorted(list(vocab))
vocab_size = len(vocab) + 1  # +1 for padding
word_to_index = {word: i for i, word in enumerate(vocab, start=1)}
index_to_word = {i: word for word, i in word_to_index.items()}

# Encode and pad target sequences
encoded_targets = [[word_to_index[word] for word in text.split()] for text in target_texts]

max_audio_len = max(len(feature) for feature in audio_features)
max_target_len = max(len(target) for target in encoded_targets)

# Pad audio and target sequences
padded_audio_features = pad_sequences(audio_features, maxlen=max_audio_len, padding="post", dtype="float32")
padded_targets = pad_sequences(encoded_targets, maxlen=max_audio_len, padding="post", dtype="int32")

# Model Architecture
model = tf.keras.Sequential([
    Input(shape=(max_audio_len, 40)),
    tf.keras.layers.Masking(mask_value=0.0),
    Conv1D(64, kernel_size=3, activation='relu', padding="same"),
    Bidirectional(LSTM(128, return_sequences=True)),
    TimeDistributed(Dense(vocab_size, activation='softmax'))
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy')

# Reshape targets correctly for sparse loss
padded_targets = np.expand_dims(padded_targets, axis=-1)

# Training
if not os.path.exists(MODEL_PATH):
    model.fit(padded_audio_features, padded_targets, epochs=150, batch_size=2)
    model.save(MODEL_PATH)
else:
    model = tf.keras.models.load_model(MODEL_PATH)

# Prediction Function
def decode_prediction(prediction):
    indices = np.argmax(prediction, axis=-1)
    words = [index_to_word.get(idx, "") for idx in indices if idx > 0]
    return " ".join(words)

def predict_audio(audio_path):
    if os.path.exists(audio_path):
        test_audio, _ = librosa.load(audio_path, sr=16000)
        test_mfcc = librosa.feature.mfcc(y=test_audio, sr=16000, n_mfcc=40).T
        test_mfcc = np.expand_dims(test_mfcc, axis=0)
        test_mfcc = pad_sequences(test_mfcc, maxlen=max_audio_len, padding="post", dtype="float32")

        predicted_output = model.predict(test_mfcc)
        decoded_text = decode_prediction(predicted_output[0])
        print(f"Predicted Text for '{os.path.basename(audio_path)}': {decoded_text}")
    else:
        print("Audio file not found!")

# User Input for Custom Audio
custom_audio_path = input("Enter the full path of your audio file: ").strip()
predict_audio(custom_audio_path)
