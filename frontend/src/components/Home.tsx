import React, { useState } from 'react';
import Webcam from 'react-webcam';
import { 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  ArrowRight,
  XCircle,
  Clock
} from 'lucide-react';
import InterviewTimer from './InterviewTimer';
import QuestionDisplay from './QuestionDisplay';
import CheatingAlert from './CheatingAlert';

interface HomeProps {
  interviewStarted: boolean;
  startInterview: () => void;
  isLoading: boolean;
  question: string;
  currentQuestion: number;
  totalQuestions: number;
  webcamRef: React.RefObject<Webcam>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isCheating: boolean;
  eyesClosed: boolean;
  lookingAway: boolean;
  cameraBlocked: boolean;
  warningCount: number;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  getNextQuestion: () => void;
  endInterview: () => void;
}

const Home: React.FC<HomeProps> = ({
  interviewStarted,
  startInterview,
  isLoading,
  question,
  currentQuestion,
  totalQuestions,
  webcamRef,
  canvasRef,
  isCheating,
  eyesClosed,
  lookingAway,
  cameraBlocked,
  warningCount,
  userAnswer,
  setUserAnswer,
  getNextQuestion,
  endInterview
}) => {
  const [showTimeoutModal, setShowTimeoutModal] = useState<boolean>(false);

  // Function to handle timer expiration
  const handleTimerExpire = (): void => {
    setShowTimeoutModal(true);
    // Auto-close modal and end interview after 3 seconds
    setTimeout(() => {
      setShowTimeoutModal(false);
      endInterview();
    }, 3000);
  };

  if (!interviewStarted) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/home.mp4" type="video/mp4" />
        </video>
        
        
        
        {/* Content */}
        <div className="relative z-10 p-16 min-h-screen flex flex-col">
          

          <div className="flex-1 flex items-center justify-end pr-20">
            <div className="w-full max-w-lg" style={{ marginTop: '3cm' }}>
              <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mb-6">
                  <Play className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Ready for your mock interview?</h2>
                <p className="text-blue-200 mb-8">
                  This AI-powered interview will assess your technical skills<br />
                  and professional behavior.
                </p>
                <button
                  onClick={startInterview}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-8 rounded-2xl font-semibold hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-400 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Starting...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Start Interview</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto w-full">
          {/* Left Column: Fixed Header, Video + Face Mesh, and Alerts */}
          <div className="flex flex-col h-screen p-6">
            {/* Header aligned to center of camera card */}
            <div className="mb-4 text-center">
              <h1 className="text-4xl font-bold text-white mb-0">MockMentorAI</h1>
            </div>

            {/* Fixed Camera Container */}
            <div className="flex-none mb-4">
              <div className="backdrop-blur-xl bg-white/10 p-6 rounded-3xl border border-white/20 shadow-2xl">
                <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored={true}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode: 'user',
                      width: 840,
                      height: 480
                    }}
                    className="w-full h-full object-cover"
                  />
                  
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  />
                  
                  {isCheating && (
                    <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center z-20">
                      <div className="text-center animate-pulse">
                        <AlertTriangle className="w-16 h-16 text-white mx-auto mb-2" />
                        <p className="text-white text-xl font-bold">CHEATING DETECTED!</p>
                      </div>
                    </div>
                  )}
                  
                  {cameraBlocked && (
                    <div className="absolute bottom-4 left-4 right-4 bg-orange-500/90 text-white p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        <span className="font-medium">Camera appears blocked or very dark</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      isCheating ? 'bg-red-500' : 
                      (eyesClosed || lookingAway || cameraBlocked) ? 'bg-orange-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-white text-sm">
                      Status: {
                        isCheating ? 'FLAGGED' : 
                        (eyesClosed || lookingAway || cameraBlocked) ? 'WARNING' : 'GOOD'
                      }
                    </span>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Fixed Alert Container */}
            <div className="flex-none">
              <CheatingAlert 
                warningCount={warningCount} 
                isCheating={isCheating}
                eyesClosed={eyesClosed}
                lookingAway={lookingAway}
                cameraBlocked={cameraBlocked}
              />
            </div>
          </div>

          {/* Right Column: Scrollable Questions + Timer + Answer Input */}
          <div className="flex flex-col h-screen p-6">
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              <InterviewTimer 
                durationMinutes={10} 
                onTimerExpire={handleTimerExpire}
              />
              
              <QuestionDisplay 
                question={question} 
                currentQuestion={currentQuestion}
                totalQuestions={totalQuestions}
              />

              <div className="backdrop-blur-xl bg-white/10 p-6 rounded-3xl border border-white/20 shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">Your Answer:</h3>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-32 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-300"
                />
              </div>

              <div className="backdrop-blur-xl bg-white/10 p-6 rounded-3xl border border-white/20 shadow-2xl">
                <button
                  onClick={getNextQuestion}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold focus:outline-none focus:ring-2 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-4 ${
                    currentQuestion >= totalQuestions
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 focus:ring-purple-400'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-400'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      {currentQuestion >= totalQuestions ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Finish Interview</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-5 h-5" />
                          <span>Next Question ({currentQuestion}/{totalQuestions})</span>
                        </>
                      )}
                    </>
                  )}
                </button>
                
                <button
                  onClick={endInterview}
                  className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-4 px-6 rounded-2xl font-semibold hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <XCircle className="w-5 h-5" />
                  <span>End Interview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Timeout Modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-red-500/90 to-red-700/90 backdrop-blur-xl p-8 rounded-3xl border border-red-400/50 shadow-2xl text-center max-w-md mx-auto animate-pulse">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Session Timed Out</h2>
            <p className="text-red-100 text-lg mb-6">Your interview session has expired. The interview will end automatically.</p>
            <div className="flex items-center justify-center gap-2 text-red-100">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Ending interview...</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;