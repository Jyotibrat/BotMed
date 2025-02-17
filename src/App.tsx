import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Sun, Moon, Image, Mic, Send, Sparkles, Bot, User, X } from 'lucide-react';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  media?: {
    type: 'image' | 'audio';
    url: string;
  };
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hello! I'm your AI Health Assistant. I'm here to help you with any health-related questions or concerns. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup audio stream when component unmounts
  useEffect(() => {
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioStream]);

  const handleSend = () => {
    if (input.trim() || selectedImage) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: 'user',
        timestamp: new Date(),
      };

      if (selectedImage) {
        newMessage.media = {
          type: 'image',
          url: selectedImage
        };
      }

      setMessages([...messages, newMessage]);
      setInput('');
      setSelectedImage(null);
      simulateBotResponse();
    }
  };

  const simulateBotResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "I understand your concern. As your health assistant, I'm here to provide guidance. However, please remember that I'm an AI and not a substitute for professional medical advice. Would you like me to provide some general information about this topic?",
        sender: 'bot',
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 2000);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleMicClick = async () => {
    try {
      if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];
        
        recorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };
        
        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          setMessages(prev => [...prev, {
            id: prev.length + 1,
            text: "Audio message",
            sender: 'user',
            timestamp: new Date(),
            media: {
              type: 'audio',
              url: audioUrl
            }
          }]);
          
          simulateBotResponse();
        };
        
        setMediaRecorder(recorder);
        recorder.start();
        setIsRecording(true);
      } else {
        if (mediaRecorder) {
          mediaRecorder.stop();
          audioStream?.getTracks().forEach(track => track.stop());
          setAudioStream(null);
        }
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Health Assistant AI
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your Personal Health Companion</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="container mx-auto px-4 pt-28 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white ml-12'
                      : 'bg-white dark:bg-gray-800 dark:text-white shadow-md mr-12'
                  }`}
                >
                  {message.media?.type === 'image' && (
                    <img 
                      src={message.media.url} 
                      alt="User uploaded" 
                      className="rounded-lg mb-2 max-w-full h-auto"
                    />
                  )}
                  {message.media?.type === 'audio' && (
                    <audio 
                      controls 
                      src={message.media.url}
                      className="w-full mb-2"
                    />
                  )}
                  <p className="text-[15px] leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t dark:border-gray-700 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {selectedImage && (
            <div className="mb-4 relative inline-block">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="h-20 w-auto rounded-lg border-2 border-blue-500"
              />
              <button
                onClick={removeSelectedImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <button 
              onClick={handleImageClick}
              className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors group"
            >
              <Image className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </button>
            <button 
              onClick={handleMicClick}
              className={`p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors group ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : ''
              }`}
            >
              <Mic className={`w-6 h-6 ${
                isRecording ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
              } transition-colors`} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your health-related question..."
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
              />
              <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={handleSend}
              className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
            Your privacy is important to us. This is a demo interface - no data is stored or processed.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;