import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare, FileText, User } from 'lucide-react';

export default function VideoConsultation() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; message: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  const sendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { sender: 'You', message: chatInput }]);
      setChatInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-3 rounded-xl">
              <Video className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Video Consultation</h1>
              <p className="text-gray-600 dark:text-gray-400">Secure Telemedicine Platform</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Video */}
            <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden relative" style={{ height: '500px' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <User className="w-32 h-32 text-gray-600 mx-auto mb-4" />
                  <p className="text-white text-xl">Doctor's Video</p>
                  <p className="text-gray-400">Waiting to connect...</p>
                </div>
              </div>
              {/* Self Video (Picture-in-Picture) */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-teal-500">
                <div className="flex items-center justify-center h-full">
                  <User className="w-16 h-16 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-full transition-all ${
                    isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-4 rounded-full transition-all ${
                    isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6" />}
                </button>
                <button className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all">
                  <Phone className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Chat */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Chat</span>
              </h3>
              <div className="space-y-3 mb-4 h-64 overflow-y-auto">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{msg.sender}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{msg.message}</p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Prescription Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Prescription Notes</span>
              </h3>
              <textarea
                value={prescriptionNotes}
                onChange={(e) => setPrescriptionNotes(e.target.value)}
                rows={6}
                placeholder="Doctor's notes and prescriptions..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
              />
              <button className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
