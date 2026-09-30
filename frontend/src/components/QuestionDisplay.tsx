import React, { useState, useEffect } from 'react';
import { MessageCircle, Loader } from 'lucide-react';

interface QuestionDisplayProps {
  question: string;
  currentQuestion?: number;
  totalQuestions?: number;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  question, 
  currentQuestion = 1, 
  totalQuestions = 5 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Function to clean text and remove undefined/null values
  const cleanText = (text: string | null | undefined): string => {
    if (!text || text === 'undefined' || text === 'null') return '';
    return text.toString().trim();
  };

  // Function to parse markdown-like formatting
  const parseMarkdown = (text: string) => {
    const cleanedText = cleanText(text);
    if (!cleanedText) return [];
    
    // Split text by markdown patterns while keeping the delimiters
    const parts = cleanedText.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    
    return parts
      .filter(part => part && part !== 'undefined' && part !== 'null')
      .map((part, index) => {
        const cleanPart = cleanText(part);
        if (!cleanPart) return null;

        if (cleanPart.startsWith('**') && cleanPart.endsWith('**')) {
          // Bold text
          const content = cleanPart.slice(2, -2);
          if (!content) return null;
          return (
            <strong key={index} className="font-bold text-blue-100">
              {content}
            </strong>
          );
        } else if (cleanPart.startsWith('*') && cleanPart.endsWith('*') && !cleanPart.startsWith('**')) {
          // Italic text (but not bold)
          const content = cleanPart.slice(1, -1);
          if (!content) return null;
          return (
            <em key={index} className="italic text-blue-100">
              {content}
            </em>
          );
        } else {
          // Regular text
          return <span key={index}>{cleanPart}</span>;
        }
      })
      .filter(Boolean); // Remove null/undefined elements
  };

  // Function to render the typed text with formatting
  const renderFormattedText = (text: string) => {
    const cleanedText = cleanText(text);
    if (!cleanedText) return null;
    
    // Split text into lines for better formatting
    const lines = cleanedText.split('\n');
    
    return lines
      .filter(line => line !== undefined && line !== null && line !== 'undefined')
      .map((line, lineIndex) => {
        const cleanLine = cleanText(line);
        if (!cleanLine) {
          return <br key={lineIndex} />;
        }
        
        // Check if line starts with bullet point or list item
        if (cleanLine.startsWith('* ')) {
          const listItem = cleanLine.substring(2);
          const cleanListItem = cleanText(listItem);
          if (!cleanListItem) return null;
          
          return (
            <div key={lineIndex} className="flex items-start gap-2 my-2">
              <span className="text-blue-300 mt-1">•</span>
              <span>{parseMarkdown(cleanListItem)}</span>
            </div>
          );
        }
        
        // Regular line with markdown parsing
        return (
          <div key={lineIndex} className={lineIndex > 0 ? "mt-3" : ""}>
            {parseMarkdown(cleanLine)}
          </div>
        );
      })
      .filter(Boolean); // Remove null/undefined elements
  };

  // Typewriter effect for questions
  useEffect(() => {
    const cleanedQuestion = cleanText(question);
    if (!cleanedQuestion) {
      setDisplayText('');
      setIsTyping(false);
      return;
    }
    
    console.log('Clean question:', cleanedQuestion);
    
    setIsTyping(true);
    setDisplayText('');
    
    let index = 0;
    const typewriterTimer = setInterval(() => {
      if (index < cleanedQuestion.length) {
        const nextChar = cleanedQuestion[index];
        // Extra safety check to ensure we're not adding undefined
        if (nextChar !== undefined && nextChar !== null) {
          setDisplayText(prev => prev + nextChar);
        }
        index++;
      } else {
        clearInterval(typewriterTimer);
        setIsTyping(false);
      }
    }, 5); 

    return () => clearInterval(typewriterTimer);
  }, [question]);

  // Check if we have a valid question
  const hasValidQuestion = cleanText(question);

  if (!hasValidQuestion) {
    return (
      <div className="backdrop-blur-xl bg-white/10 p-6 rounded-3xl border border-white/20 shadow-2xl">
        <div className="flex items-center justify-center h-32">
          <div className="flex items-center gap-3 text-blue-200">
            <Loader className="w-6 h-6 animate-spin" />
            <span>Waiting for interview to start...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 p-6 rounded-3xl border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <MessageCircle className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Interview Question</h3>
            <p className="text-blue-200 text-sm">Question {currentQuestion} of {totalQuestions}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isTyping 
              ? 'bg-yellow-500/20 text-yellow-300' 
              : 'bg-green-500/20 text-green-300'
          }`}>
            {isTyping ? 'Loading...' : 'Ready'}
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 min-h-[120px] flex items-start">
          <div className="text-white text-lg leading-relaxed w-full">
            {renderFormattedText(displayText)}
            {isTyping && (
              <span className="inline-block w-0.5 h-6 bg-blue-400 ml-1 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;