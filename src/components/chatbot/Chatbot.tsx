
import React, { useState, useEffect } from 'react';
import { X, MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatbotData } from './chatbotData';
import './chatbot.css';

type ChatMessage = {
  isUser: boolean;
  text: string;
  timestamp: Date;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  
  // On first open, show welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          isUser: false,
          text: chatbotData.welcomeMessage,
          timestamp: new Date(),
        }
      ]);
      
      // Load frequent questions from localStorage
      const savedFrequentQuestions = localStorage.getItem('frequentQuestions');
      if (savedFrequentQuestions) {
        try {
          const parsed = JSON.parse(savedFrequentQuestions);
          // Do something with frequent questions if needed
        } catch (e) {
          console.error('Error parsing frequentQuestions from localStorage', e);
        }
      }
    }
  }, [isOpen, messages.length]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const selectCategory = (category: string) => {
    setCurrentCategory(category);
  };
  
  const goBackToCategories = () => {
    setCurrentCategory(null);
  };
  
  const handleQuestionClick = (questionId: string) => {
    // Find the question and answer
    let question = '';
    let answer = '';
    
    if (currentCategory) {
      const categoryData = chatbotData.categories.find(c => c.id === currentCategory);
      if (categoryData) {
        const questionData = categoryData.questions.find(q => q.id === questionId);
        if (questionData) {
          question = questionData.text;
          answer = questionData.answer;
          
          // Update frequency in localStorage (simple implementation)
          try {
            const frequentQuestions = JSON.parse(localStorage.getItem('frequentQuestions') || '{}');
            frequentQuestions[questionId] = (frequentQuestions[questionId] || 0) + 1;
            localStorage.setItem('frequentQuestions', JSON.stringify(frequentQuestions));
          } catch (e) {
            console.error('Error updating frequentQuestions in localStorage', e);
          }
        }
      }
    }
    
    if (question && answer) {
      setMessages(prev => [
        ...prev,
        {
          isUser: true,
          text: question,
          timestamp: new Date(),
        },
        {
          isUser: false,
          text: answer,
          timestamp: new Date(),
        }
      ]);
      
      // Reset to categories after answering
      setCurrentCategory(null);
    }
  };
  
  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Help Center</h3>
            <button onClick={toggleChat} className="chatbot-close-btn">
              <X size={18} />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={cn(
                  "chatbot-message", 
                  msg.isUser ? "user-message" : "bot-message"
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>
          
          <div className="chatbot-options">
            {currentCategory ? (
              <>
                <button onClick={goBackToCategories} className="chatbot-back-btn">
                  <ChevronLeft size={16} />
                  Back to topics
                </button>
                <div className="chatbot-questions-list">
                  {chatbotData.categories
                    .find(c => c.id === currentCategory)
                    ?.questions.map(question => (
                      <button
                        key={question.id}
                        onClick={() => handleQuestionClick(question.id)}
                        className="chatbot-question-btn"
                      >
                        {question.text}
                        <ChevronRight size={16} />
                      </button>
                    ))}
                </div>
              </>
            ) : (
              <div className="chatbot-categories">
                {chatbotData.categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => selectCategory(category.id)}
                    className="chatbot-category-btn"
                  >
                    {category.name}
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="chatbot-footer">
            <small>This is an automated help system. For additional support, please contact us directly.</small>
          </div>
        </div>
      ) : (
        <button onClick={toggleChat} className="chatbot-toggle-btn">
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
