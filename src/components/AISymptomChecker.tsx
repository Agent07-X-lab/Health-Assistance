import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { SymptomCheckerMessage } from '../lib/types';

interface PredictedCondition {
  name: string;
  probability: number;
  description: string;
}

export default function AISymptomChecker() {
  const { session } = useAuth();
  const [messages, setMessages] = useState<SymptomCheckerMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Health Assistant. Please describe your symptoms, and I\'ll help identify possible conditions. Remember, this is not a medical diagnosis - always consult a healthcare professional.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [predictedConditions, setPredictedConditions] = useState<PredictedCondition[]>([]);
  const [urgencyLevel, setUrgencyLevel] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [showResults, setShowResults] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeSymptoms = (symptomList: string[]): { conditions: PredictedCondition[]; urgency: 'Low' | 'Medium' | 'High' } => {
    // AI-powered symptom analysis (simplified for demo)
    const symptomKeywords = symptomList.join(' ').toLowerCase();
    const conditions: PredictedCondition[] = [];
    let urgency: 'Low' | 'Medium' | 'High' = 'Low';

    // Critical symptoms
    if (symptomKeywords.includes('chest pain') || symptomKeywords.includes('difficulty breathing') || 
        symptomKeywords.includes('severe headache') || symptomKeywords.includes('unconscious')) {
      urgency = 'High';
      conditions.push({
        name: 'Cardiac Emergency',
        probability: 0.75,
        description: 'Chest pain and breathing difficulty may indicate a cardiac event. Seek immediate medical attention.',
      });
    }

    // Fever-related conditions
    if (symptomKeywords.includes('fever') || symptomKeywords.includes('temperature')) {
      if (symptomKeywords.includes('cough') || symptomKeywords.includes('cold')) {
        urgency = urgency === 'High' ? 'High' : 'Medium';
        conditions.push({
          name: 'Respiratory Infection',
          probability: 0.82,
          description: 'Fever with cough suggests a respiratory infection like flu or COVID-19.',
        });
      }
      if (symptomKeywords.includes('headache') || symptomKeywords.includes('body ache')) {
        conditions.push({
          name: 'Viral Fever',
          probability: 0.78,
          description: 'Fever with body aches typically indicates a viral infection.',
        });
      }
    }

    // Digestive issues
    if (symptomKeywords.includes('stomach') || symptomKeywords.includes('nausea') || 
        symptomKeywords.includes('vomiting') || symptomKeywords.includes('diarrhea')) {
      urgency = urgency === 'High' ? 'High' : 'Medium';
      conditions.push({
        name: 'Gastroenteritis',
        probability: 0.70,
        description: 'Stomach upset with nausea may indicate gastroenteritis or food poisoning.',
      });
    }

    // Headache conditions
    if (symptomKeywords.includes('headache')) {
      if (symptomKeywords.includes('severe') || symptomKeywords.includes('sudden')) {
        urgency = 'High';
        conditions.push({
          name: 'Severe Headache',
          probability: 0.65,
          description: 'Sudden severe headache requires immediate medical evaluation.',
        });
      } else {
        conditions.push({
          name: 'Tension Headache',
          probability: 0.60,
          description: 'Common headache, often stress-related. Rest and hydration recommended.',
        });
        conditions.push({
          name: 'Migraine',
          probability: 0.45,
          description: 'Recurring headaches with sensitivity to light or sound.',
        });
      }
    }

    // Diabetes symptoms
    if (symptomKeywords.includes('thirst') && symptomKeywords.includes('urination')) {
      urgency = 'Medium';
      conditions.push({
        name: 'Diabetes Mellitus',
        probability: 0.68,
        description: 'Excessive thirst and urination are classic diabetes symptoms. Get blood sugar tested.',
      });
    }

    // Allergic reactions
    if (symptomKeywords.includes('rash') || symptomKeywords.includes('itching') || symptomKeywords.includes('swelling')) {
      if (symptomKeywords.includes('breathing') || symptomKeywords.includes('throat')) {
        urgency = 'High';
        conditions.push({
          name: 'Anaphylaxis',
          probability: 0.80,
          description: 'Severe allergic reaction with breathing difficulty. Emergency medical attention required.',
        });
      } else {
        urgency = urgency === 'High' ? 'High' : 'Low';
        conditions.push({
          name: 'Allergic Reaction',
          probability: 0.72,
          description: 'Skin rash and itching suggest an allergic reaction. Antihistamines may help.',
        });
      }
    }

    // Default condition if no specific match
    if (conditions.length === 0) {
      conditions.push({
        name: 'General Malaise',
        probability: 0.50,
        description: 'Symptoms are non-specific. Monitor and consult a doctor if they persist.',
      });
    }

    return { conditions: conditions.sort((a, b) => b.probability - a.probability), urgency };
  };

  const extractSymptoms = (text: string): string[] => {
    const commonSymptoms = [
      'fever', 'cough', 'cold', 'headache', 'body ache', 'fatigue', 'weakness',
      'chest pain', 'difficulty breathing', 'shortness of breath', 'nausea', 'vomiting',
      'diarrhea', 'stomach pain', 'abdominal pain', 'dizziness', 'rash', 'itching',
      'sore throat', 'runny nose', 'congestion', 'chills', 'sweating', 'loss of appetite',
      'weight loss', 'thirst', 'frequent urination', 'blurred vision', 'swelling'
    ];

    const lowerText = text.toLowerCase();
    const found: string[] = [];

    commonSymptoms.forEach(symptom => {
      if (lowerText.includes(symptom)) {
        found.push(symptom);
      }
    });

    return [...new Set(found)];
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: SymptomCheckerMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Extract symptoms from user input
    const newSymptoms = extractSymptoms(input);
    const allSymptoms = [...new Set([...symptoms, ...newSymptoms])];
    setSymptoms(allSymptoms);

    // Simulate AI processing delay
    setTimeout(() => {
      const { conditions, urgency } = analyzeSymptoms(allSymptoms);
      setPredictedConditions(conditions);
      setUrgencyLevel(urgency);

      let responseContent = '';
      if (newSymptoms.length > 0) {
        responseContent = `I've noted the following symptoms: ${newSymptoms.join(', ')}.\n\n`;
      }

      if (allSymptoms.length >= 2) {
        responseContent += `Based on your symptoms, here are possible conditions:\n\n`;
        conditions.slice(0, 3).forEach((condition, idx) => {
          responseContent += `${idx + 1}. **${condition.name}** (${(condition.probability * 100).toFixed(0)}% match)\n   ${condition.description}\n\n`;
        });
        responseContent += `\n**Urgency Level: ${urgency}**\n\n`;
        
        if (urgency === 'High') {
          responseContent += '⚠️ **URGENT**: Please seek immediate medical attention or call emergency services.';
        } else if (urgency === 'Medium') {
          responseContent += '⚠️ Please consult a healthcare provider soon.';
        } else {
          responseContent += 'ℹ️ Monitor your symptoms. Consult a doctor if they worsen or persist.';
        }

        setShowResults(true);
      } else {
        responseContent += 'Please provide more details about your symptoms so I can better assist you. For example:\n- How long have you had these symptoms?\n- Are they getting worse?\n- Any other symptoms you\'re experiencing?';
      }

      const assistantMessage: SymptomCheckerMessage = {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      setInput('');
    }, 1500);
  };

  const saveToHistory = async () => {
    if (!session?.user || predictedConditions.length === 0) return;

    try {
      await supabase.from('symptom_checker_history').insert({
        user_id: session.user.id,
        symptoms,
        predicted_conditions: predictedConditions,
        urgency_level: urgencyLevel,
        chat_history: messages,
      });
      alert('Symptom check saved to your history!');
    } catch (error) {
      console.error('Error saving symptom history:', error);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI Health Assistant. Please describe your symptoms, and I\'ll help identify possible conditions. Remember, this is not a medical diagnosis - always consult a healthcare professional.',
        timestamp: new Date().toISOString(),
      },
    ]);
    setSymptoms([]);
    setPredictedConditions([]);
    setUrgencyLevel('Low');
    setShowResults(false);
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'High':
        return <AlertTriangle className="w-5 h-5" />;
      case 'Medium':
        return <Info className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-3 rounded-xl">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Symptom Checker</h1>
                <p className="text-gray-600 dark:text-gray-400">Powered by Advanced AI • Not a substitute for professional medical advice</p>
              </div>
            </div>
            <button
              onClick={resetChat}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              New Chat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ height: '600px' }}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs mt-2 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your symptoms..."
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Urgency Level */}
            {showResults && (
              <div className={`rounded-2xl shadow-xl p-6 border-2 ${getUrgencyColor(urgencyLevel)}`}>
                <div className="flex items-center space-x-3 mb-4">
                  {getUrgencyIcon(urgencyLevel)}
                  <h3 className="text-lg font-bold">Urgency Level</h3>
                </div>
                <p className="text-2xl font-bold">{urgencyLevel}</p>
              </div>
            )}

            {/* Detected Symptoms */}
            {symptoms.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Detected Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-sm font-medium"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Predicted Conditions */}
            {predictedConditions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Possible Conditions</h3>
                <div className="space-y-3">
                  {predictedConditions.slice(0, 3).map((condition, index) => (
                    <div key={index} className="border-l-4 border-teal-500 pl-4 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{condition.name}</h4>
                        <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                          {(condition.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{condition.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {showResults && session?.user && (
              <button
                onClick={saveToHistory}
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all font-medium"
              >
                Save to History
              </button>
            )}

            {/* Disclaimer */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>⚠️ Medical Disclaimer:</strong> This AI tool provides general information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
