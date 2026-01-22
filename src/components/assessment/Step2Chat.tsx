import React, { useState, useEffect, useRef } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { generateQuestions } from '@/lib/openai';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Star, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const Step2Chat = () => {
    const { profile, setProfile, nextStep } = useProfileStore();
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<any[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const q = await generateQuestions(profile);
                setQuestions(q);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentIndex, loading]);

    const handleNext = () => {
        const newAnswers = [...answers, { questionId: questions[currentIndex].id, answer: currentAnswer }];
        setAnswers(newAnswers);
        setCurrentAnswer(null);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setProfile({
                assessment_questions: questions,
                assessment_answers: newAnswers,
                // Clear previous analysis to force re-generation
                skill_gaps: [],
                current_skills: [],
                recommendations: '',
                study_plan: [],
                recommended_courses: [],
                salary_projection: null,
                persona_profile_data: null
            });
            nextStep();
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">AI is personalizing your assessment...</p>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-heading">AI Skill Assessment</h2>
                    <p className="text-sm text-gray-500">Evaluating your expertise in {profile.job_title}</p>
                </div>
                <div className="px-4 py-2 bg-primary-50 rounded-full border border-primary-100 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-primary-600" />
                    <span className="text-xs font-bold text-primary-700">Question {currentIndex + 1} of {questions.length}</span>
                </div>
            </div>

            <div className="space-y-6 mb-8">
                {/* Previous Messages (Simulated) */}
                {answers.map((item, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                                <p className="text-gray-800">{questions[idx].text}</p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="bg-primary-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md max-w-[80%]">
                                <p>{String(item.answer)}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Current Question */}
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-start"
                >
                    <div className="bg-white border border-primary-100 p-6 rounded-2xl rounded-tl-none shadow-lg max-w-[90%] border-l-4 border-l-primary-500">
                        <p className="text-lg font-medium text-gray-900 mb-6">{currentQuestion.text}</p>

                        {/* Answer Types */}
                        {currentQuestion.type === 'rating' && (
                            <div className="flex justify-between items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setCurrentAnswer(num)}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${currentAnswer === num
                                            ? 'bg-primary-600 text-white scale-110 shadow-lg'
                                            : 'bg-gray-100 text-gray-500 hover:bg-primary-100'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        )}

                        {currentQuestion.type === 'single' && (
                            <div className="grid grid-cols-1 gap-3">
                                {currentQuestion.options.map((opt: string) => {
                                    const isSelected = currentAnswer === opt;
                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => setCurrentAnswer(opt)}
                                            className={`p-4 rounded-xl text-left font-medium transition-all border ${isSelected
                                                ? 'bg-primary-50 border-primary-500 text-primary-700 ring-2 ring-primary-200'
                                                : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{opt}</span>
                                                {isSelected && <CheckCircle2 className="w-5 h-5" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {currentQuestion.type === 'multiple' && (
                            <div className="grid grid-cols-1 gap-3">
                                {currentQuestion.options.map((opt: string) => {
                                    const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(opt);
                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                const current = Array.isArray(currentAnswer) ? currentAnswer : [];
                                                if (current.includes(opt)) {
                                                    setCurrentAnswer(current.filter((i: string) => i !== opt));
                                                } else {
                                                    if (current.length < 3) {
                                                        const verify = [...current, opt];
                                                        setCurrentAnswer(verify);
                                                    }
                                                }
                                            }}
                                            className={`p-4 rounded-xl text-left font-medium transition-all border ${isSelected
                                                ? 'bg-primary-50 border-primary-500 text-primary-700 ring-2 ring-primary-200'
                                                : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{opt}</span>
                                                {isSelected && <CheckCircle2 className="w-5 h-5" />}
                                            </div>
                                        </button>
                                    );
                                })}
                                <p className="text-xs text-gray-400 mt-2 text-right">Select up to 3 options</p>
                            </div>
                        )}

                        {currentQuestion.type === 'text' && (
                            <textarea
                                value={currentAnswer || ''}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                placeholder="Type your response here..."
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none min-h-[120px]"
                            />
                        )}

                        <div className="mt-8 flex justify-end">
                            <div className="relative group">
                                <button
                                    disabled={!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)}
                                    onClick={handleNext}
                                    className="p-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none">
                                    {currentIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <div ref={chatEndRef} />
            </div>
        </div>
    );
};

export default Step2Chat;
// Initialized
