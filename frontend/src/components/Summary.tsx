import React from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  User 
} from 'lucide-react';

interface PerformanceData {
  confidence_score: number;
  eye_contact_score: number;
  cheating_attempts: number;
  questions_answered: number;
  avg_response_time: number;
  improvement_areas: string[];
  greeting_message: string;
}

interface SummaryProps {
  performanceData: PerformanceData | null;
  currentQuestion: number;
  totalQuestions: number;
  warningCount: number;
  onStartNewInterview: () => void;
}

const Summary: React.FC<SummaryProps> = ({
  performanceData,
  currentQuestion,
  totalQuestions,
  warningCount,
  onStartNewInterview
}) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen p-6">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/summary.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      
      
      {/* Content */}
      <div className="relative z-20 w-full max-w-4xl">
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mb-6">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Interview Completed!</h1>
            <p className="text-blue-200 text-xl">Here's your performance analysis</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-200">Confidence Level</span>
                    <span className="text-white font-semibold">{performanceData?.confidence_score || 75}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        (performanceData?.confidence_score || 75) > 70 ? 'bg-gradient-to-r from-green-500 to-green-400' : 
                        (performanceData?.confidence_score || 75) > 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                        'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                      style={{ width: `${performanceData?.confidence_score || 75}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-200">Eye Contact Quality</span>
                    <span className="text-white font-semibold">{performanceData?.eye_contact_score || 82}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        (performanceData?.eye_contact_score || 82) > 70 ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 
                        (performanceData?.eye_contact_score || 82) > 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                        'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                      style={{ width: `${performanceData?.eye_contact_score || 82}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Interview Insights</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{performanceData?.cheating_attempts || 0}</div>
                  <div className="text-blue-200 text-sm">Cheating Attempts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{performanceData?.questions_answered || currentQuestion}/{totalQuestions}</div>
                  <div className="text-blue-200 text-sm">Questions Answered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{performanceData?.avg_response_time || 45}s</div>
                  <div className="text-blue-200 text-sm">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{warningCount}</div>
                  <div className="text-blue-200 text-sm">Total Warnings</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Areas for Improvement</h3>
            {performanceData && performanceData.improvement_areas && performanceData.improvement_areas.length > 0 ? (
              <ul className="space-y-2">
                {performanceData.improvement_areas.map((area, index) => (
                  <li key={index} className="flex items-start gap-3 text-blue-200">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-3 text-green-300">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span>Excellent! You maintained excellent eye contact and showed strong confidence throughout the interview.</span>
              </div>
            )}
          </div>
          
          <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-2xl border border-blue-400/30 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Personal Message</h3>
            <p className="text-blue-100 text-lg italic">
              "{performanceData?.greeting_message || 'Thank you for your dedication to improving your interview skills. Keep up the great work!'}"
            </p>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
            >
              <User className="w-5 h-5" />
              <span>Start New Interview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;