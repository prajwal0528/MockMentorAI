import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface InterviewTimerProps {
  durationMinutes: number;
  onTimerExpire?: () => void;
}

const InterviewTimer: React.FC<InterviewTimerProps> = ({ durationMinutes, onTimerExpire }) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60); // in seconds
  const totalTime = durationMinutes * 60;

  useEffect(() => {
    if (timeLeft <= 0) {
      // Timer has expired, call the onTimerExpire callback
      if (onTimerExpire) {
        onTimerExpire();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimerExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  
  const isLowTime = timeLeft < 120; // Less than 2 minutes
  const isCriticalTime = timeLeft < 60; // Less than 1 minute

  return (
    <div className={`backdrop-blur-xl bg-white/10 p-6 rounded-3xl border shadow-2xl transition-all duration-300 ${
      isCriticalTime 
        ? 'border-red-400/50 bg-red-500/10' 
        : isLowTime 
        ? 'border-yellow-400/50 bg-yellow-500/10' 
        : 'border-white/20'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            isCriticalTime 
              ? 'bg-red-500/20' 
              : isLowTime 
              ? 'bg-yellow-500/20' 
              : 'bg-blue-500/20'
          }`}>
            <Clock className={`w-5 h-5 ${
              isCriticalTime 
                ? 'text-red-300' 
                : isLowTime 
                ? 'text-yellow-300' 
                : 'text-blue-300'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-white">Time Remaining</h3>
            <p className="text-blue-200 text-sm">{durationMinutes} minute interview</p>
          </div>
        </div>
        <div className={`text-right ${
          isCriticalTime 
            ? 'text-red-300' 
            : isLowTime 
            ? 'text-yellow-300' 
            : 'text-white'
        }`}>
          <div className="text-2xl font-bold font-mono">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 rounded-full ${
              isCriticalTime 
                ? 'bg-gradient-to-r from-red-500 to-red-400' 
                : isLowTime 
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' 
                : 'bg-gradient-to-r from-green-500 to-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {isCriticalTime && (
          <div className="flex items-center gap-2 mt-3 text-red-300">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Interview ending soon!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewTimer;