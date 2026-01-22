import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import Step1UserInfo from '@/components/assessment/Step1UserInfo';
import Step2Chat from '../components/assessment/Step2Chat';
import Step3Gaps from '../components/assessment/Step3Gaps';
import Step4StudyPlan from '../components/assessment/Step4StudyPlan';
import Step5Salary from '../components/assessment/Step5Salary';
import Step6Persona from '../components/assessment/Step6Persona';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Rocket } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AssessmentPage = () => {
    const { profile, prevStep } = useProfileStore();
    const { current_step } = profile;
    const navigate = useNavigate();

    React.useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ''; // Chrome requires returnValue to be set
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const renderStep = () => {
        switch (current_step) {
            case 1: return <Step1UserInfo />;
            case 2: return <Step2Chat />;
            case 3: return <Step3Gaps />;
            case 4: return <Step4StudyPlan />;
            case 5: return <Step5Salary />;
            case 6: return <Step6Persona />;
            default: return <Step1UserInfo />;
        }
    };

    // ...

    const steps = [
        'Background',
        'Assessment',
        'Gap Analysis',
        'Study Plan',
        'Salary',
        'Profile'
    ];

    const [showResetConfirm, setShowResetConfirm] = React.useState(false);

    // ...

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Progress Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-20 flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-2">
                            <Rocket className="text-primary-600 w-6 h-6" />
                            <span className="text-xl font-bold font-heading gradient-text hidden sm:block">Skill Taxonomy Builder</span>
                        </Link>

                        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(current_step / 6) * 100}%` }}
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-600 to-accent-600"
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                {steps.map((step, i) => (
                                    <div key={i} className="flex flex-col items-center relative">
                                        <motion.span
                                            className={current_step === i + 1
                                                ? 'gradient-text font-extrabold'
                                                : 'text-gray-400'}
                                            animate={{
                                                scale: current_step === i + 1 ? 1.15 : 1,
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            style={{
                                                filter: current_step === i + 1
                                                    ? 'drop-shadow(0 2px 8px rgba(20, 184, 166, 0.4))'
                                                    : 'none'
                                            }}
                                        >
                                            {step}
                                        </motion.span>
                                        {current_step === i + 1 && (
                                            <motion.div
                                                className="absolute -bottom-2 w-1 h-1 rounded-full bg-gradient-to-r from-primary-600 to-accent-600"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: [1, 1.3, 1] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 1.5,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-bold text-gray-500">Step {current_step}/6</span>
                            {current_step > 1 && (
                                <div className="relative group">
                                    <button
                                        onClick={prevStep}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                                    </button>
                                    <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none">
                                        Go Back
                                    </div>
                                </div>
                            )}
                            <div className="relative group">
                                <button
                                    onClick={() => setShowResetConfirm(true)}
                                    className="p-2 hover:bg-red-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                                <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none">
                                    Start Over
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current_step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Custom Reset Confirmation Model */}
            <AnimatePresence>
                {showResetConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowResetConfirm(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative z-10"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Restart Assessment?</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to start over? All your progress and current inputs will be lost permanently.
                            </p>
                            <div className="flex space-x-3 justify-end">
                                <button
                                    onClick={() => setShowResetConfirm(false)}
                                    className="px-4 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        useProfileStore.getState().reset();
                                        window.location.href = '/';
                                    }}
                                    className="px-4 py-2 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                                >
                                    Yes, Start Over
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AssessmentPage;
