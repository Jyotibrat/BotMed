# Backend

This directory contains the backend implementation for the BotMed, including development notebooks and core functionality.

## 📁 Directory Structure

```
Backend/
├── Notebooks/
│   ├── Main Backend/
│   │   ├── llama_8b_integrated_aud.ipynb
│   │   ├── tumor_class.ipynb
│   │   └── whisper_and_text.ipynb
│   │
│   └── Speech To Text/
│       └── Faster_Whisper_STT_with_NLP.ipynb files
│
└── README.md
```

## 📓 Notebooks

The Notebooks folder contains Jupyter notebooks that demonstrate, test, and prototype the core backend functionality of the BotMed.

### 🏗️ Main Backend

Contains notebooks focused on the primary backend functionality and core chatbot features.

**Typical notebook contents:**
- **Fine-tuned Llama Model Integration**: Implementation and testing of the fine-tuned Llama 7B model
- **Response Generation Logic**: Core algorithms for generating medical responses
- **Model Performance Testing**: Evaluation of chatbot accuracy and response quality

**Files:**
- `llama_8b_integrated_aud.ipynb`
- `tumour_class.ipynb`
- `whisper_and_text.ipynb`

### 🎤 Speech To Text

Contains notebooks specifically focused on audio processing, speech-to-text and NLP functionality using OpenAI WhisperX.

**Typical notebook contents:**
- **WhisperX Integration**: Implementation of OpenAI WhisperX for audio transcription
- **NLP Health Filter**: Development and validation of the health-related query filtering system
- **Audio Preprocessing**: Audio file format handling and preprocessing
- **Real-time Processing**: Live audio capture and transcription

**Expected notebook examples:**
- `Faster_Whisper_STT_with_NLP.ipynb`

## 🚀 Getting Started

### Prerequisites

1. **Python Environment**: Ensure Python 3.8+ is installed
2. **Jupyter Notebook**: Install Jupyter to run the notebooks

### Setup Instructions

Read the Setup Instructions [**here**](https://github.com/Jyotibrat/BotMed?tab=readme-ov-file#backend-setup)

## 📊 Key Features Implemented

### Core Backend Features

- Fine-tuned Llama 7B model integration
- ML Model which detects different types of tumor
- Performance optimization

### Speech Processing Features

- Real-time audio transcription
- Multi-format audio support
- High-accuracy speech recognition
- NLP-based health query filtering

## 🤝 Contributing

Read the [**Code of Conduct**]() and the [**Contributing Guidelines**](https://github.com/Jyotibrat/BotMed?tab=readme-ov-file#-contributing).

## ⚠️ Important Notes

- **Medical Disclaimer**: These tools are for educational purposes only
- **Data Privacy**: Ensure compliance with medical data regulations
- **Performance**: Some notebooks may require GPU for optimal performance
- **Dependencies**: Check version compatibility for all libraries