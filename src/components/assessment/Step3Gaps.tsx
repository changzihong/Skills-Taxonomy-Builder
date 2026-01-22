import React, { useEffect, useState } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { analyzeSkills } from '@/lib/openai';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ChevronRight, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';

const Step3Gaps = () => {
    const { profile, setProfile, nextStep } = useProfileStore();
    // Loading is controlled by the effect now


    const [loading, setLoading] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);

    useEffect(() => {
        const hasGaps = profile.skill_gaps && profile.skill_gaps.length > 0;

        if (!hasGaps && !analyzed) {
            setLoading(true);
            const analyze = async () => {
                try {
                    const result = await analyzeSkills(profile, profile.assessment_answers);
                    setProfile(result);
                    setAnalyzed(true);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            analyze();
        }
    }, [analyzed, profile.skill_gaps]);

    const getProficiencyColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'beginner': return 'from-yellow-50 to-orange-50 border-yellow-200 text-orange-700';
            case 'intermediate': return 'from-blue-50 to-indigo-50 border-blue-200 text-indigo-700';
            case 'advanced': return 'from-purple-50 to-fuchsia-50 border-purple-200 text-fuchsia-700';
            case 'expert': return 'from-amber-50 to-yellow-100 border-amber-200 text-amber-700';
            default: return 'from-gray-50 to-gray-100 border-gray-200 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Analyzing your results and identifying gaps...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-12 text-center">
                <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-gray-900">Your Skills Analysis</h2>
                <p className="text-lg text-gray-600">Based on your profile and assessment, here's what we found</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mb-12">
                {/* Current Skills - 40% */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold flex items-center">
                            <CheckCircle2 className="text-success-500 w-6 h-6 mr-2" />
                            Verified Strengths
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {(() => {
                            const skills = Array.isArray(profile.current_skills)
                                ? profile.current_skills
                                : typeof (profile.current_skills as any) === 'string'
                                    ? (profile.current_skills as any).split(',').map((s: string) => s.trim())
                                    : ['React', 'TypeScript', 'Node.js'];

                            return skills.map((skill: any, i: number) => {
                                const name = typeof skill === 'string' ? skill : skill.name;
                                const level = typeof skill === 'string' ? 'Advanced' : (skill.level || 'Advanced');
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`p-5 rounded-2xl border-2 bg-gradient-to-br shadow-sm hover:scale-[1.02] transition-transform ${getProficiencyColor(level)}`}
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-bold text-lg">{name}</span>
                                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-white/50 rounded-lg">{level}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/30 rounded-full overflow-hidden">
                                            <div className="h-full bg-current opacity-60 rounded-full" style={{ width: level === 'Expert' ? '100%' : level === 'Advanced' ? '80%' : level === 'Intermediate' ? '60%' : '40%' }} />
                                        </div>
                                    </motion.div>
                                );
                            });
                        })()}
                    </div>
                </div>

                {/* Skill Gaps - 60% */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold flex items-center">
                            <AlertCircle className="text-red-500 w-6 h-6 mr-2" />
                            Identification of Gaps
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {(() => {
                            const gaps = Array.isArray(profile.skill_gaps)
                                ? profile.skill_gaps
                                : typeof (profile.skill_gaps as any) === 'string'
                                    ? (profile.skill_gaps as any).split(',').map((s: string) => s.trim())
                                    : ['System Design', 'Cloud Architecture'];

                            return gaps.map((gap: any, i: number) => {
                                const name = typeof gap === 'string' ? gap : gap.name;
                                const priority = typeof gap === 'string' ? (i === 0 ? 'High' : 'Medium') : (gap.priority || 'Medium');
                                const impact = typeof gap === 'string' ? '+15%' : (gap.impact || '+10%');

                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`p-6 bg-white rounded-2xl border-2 shadow-md hover:shadow-lg transition-all relative overflow-hidden group ${priority === 'High' ? 'border-red-100 hover:border-red-200' :
                                            priority === 'Medium' ? 'border-orange-100 hover:border-orange-200' : 'border-yellow-100'
                                            }`}
                                    >
                                        <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-bold uppercase tracking-tighter text-white rounded-bl-xl ${priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-orange-500' : 'bg-yellow-500'
                                            }`}>
                                            {priority} Priority
                                        </div>

                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-xl font-bold text-gray-900">{name}</h4>
                                        </div>

                                        <div className="flex items-center text-sm font-medium text-success-600">
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                            Estimated Market Impact: {impact} salary
                                        </div>
                                    </motion.div>
                                );
                            });
                        })()}
                    </div>
                </div>
            </div>

            {/* Strategic Analysis */}
            <div className="glass-card p-10 rounded-[40px] mb-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary-600" />
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <Sparkles className="text-primary-600 w-6 h-6 mr-2" />
                    Strategic Analysis
                </h3>
                <p className="text-xl text-gray-700 leading-relaxed italic">
                    "{profile.recommendations || 'Your logical approach to system architecture is a major asset. Focus on scaling these patterns to cloud-native environments to unlock senior leadership opportunities.'}"
                </p>
            </div>

            <div className="flex justify-end">
                <motion.button
                    onClick={nextStep}
                    className="flex items-center bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl h-14 overflow-hidden"
                    initial="initial"
                    whileHover="hover"
                    variants={{
                        initial: { width: "3.5rem" },
                        hover: { width: "auto" }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <div className="flex items-center justify-center min-w-[3.5rem] h-full">
                        <ChevronRight className="w-6 h-6" />
                    </div>
                    <motion.span
                        className="whitespace-nowrap font-bold pr-6 pl-1"
                        variants={{
                            initial: { opacity: 0 },
                            hover: { opacity: 1 }
                        }}
                    >
                        View Your Study Plan
                    </motion.span>
                </motion.button>
            </div>
        </div>
    );
};


export default Step3Gaps;
