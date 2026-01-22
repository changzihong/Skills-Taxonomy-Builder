import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useProfileStore } from '@/store/useProfileStore';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Map, BookOpen, PlayCircle, Star, Award, Search, CheckCircle2 } from 'lucide-react';

const Step4StudyPlan = () => {
    const { profile, nextStep } = useProfileStore();

    // Learning recommendations
    const courses = profile.recommended_courses?.length > 0 ? profile.recommended_courses : [
        { title: 'Advanced System Design Architectural Patterns', platform: 'Coursera', rating: 4.8, duration: '20 hours', type: 'Specialization', icon: Award },
        { title: 'Distributed Systems in Production', platform: 'Udemy', rating: 4.7, duration: '12 hours', type: 'Course', icon: PlayCircle },
        { title: 'Mastering Cloud Native Infrastructure', platform: 'Pluralsight', rating: 4.9, duration: '15 hours', type: 'Learning Path', icon: BookOpen }
    ];

    // Study plan data
    const studyPlanData = profile.study_plan || [
        { phase: 'Month 1', goal: 'Core Foundations', steps: ['Review basics', 'Deep dive into language specs'] },
        { phase: 'Month 2', goal: 'Intermediate Mastery', steps: ['Functional patterns', 'Concurrency'] },
        { phase: 'Month 3', goal: 'Advanced Architecture', steps: ['Microservices', 'System Design'] }
    ];

    const initialNodes: Node[] = useMemo(() => {
        return studyPlanData.map((plan: any, i: number) => ({
            id: `node-${i}`,
            data: {
                label: (
                    <div className="p-4 text-left">
                        <div className="text-[10px] font-bold uppercase text-primary-500 mb-1">{plan.phase}</div>
                        <div className="font-bold text-gray-900 mb-2">{plan.goal}</div>
                        <ul className="text-[9px] text-gray-500 list-disc pl-3">
                            {plan.steps.map((s: string, j: number) => <li key={j}>{s}</li>)}
                        </ul>
                    </div>
                )
            },
            position: { x: 250 * i, y: 100 + (i % 2 === 0 ? 0 : 50) },
            className: 'bg-white border-2 border-primary-200 rounded-2xl shadow-xl w-60',
        }));
    }, [studyPlanData]);

    const initialEdges: Edge[] = useMemo(() => {
        return initialNodes.slice(0, -1).map((_, i) => ({
            id: `edge-${i}`,
            source: `node-${i}`,
            target: `node-${i + 1}`,
            animated: true,
            style: { stroke: '#8b5cf6', strokeWidth: 2 },
        }));
    }, [initialNodes]);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
                <h2 className="text-4xl font-bold font-heading mb-4 text-gray-900">Your Personalized Study Plan</h2>
                <p className="text-lg text-gray-600">A complete roadmap with recommended courses and learning path</p>
            </div>

            {/* Learning Recommendations Section */}
            <div className="mb-16">
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-3 bg-primary-50 px-6 py-3 rounded-full border-2 border-primary-200">
                        <BookOpen className="w-5 h-5 text-primary-600" />
                        <h3 className="text-xl font-bold text-gray-900">Recommended Learning Resources</h3>
                    </div>
                </div>

                <p className="text-center text-gray-600 mb-8">Search for these courses to bridge your skill gaps</p>

                <div className="grid grid-cols-1 gap-6 mb-8">
                    {courses.map((course: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card group p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 hover:bg-primary-50 transition-colors border-2 border-transparent hover:border-primary-100"
                        >
                            <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                {course.icon ? <course.icon className="w-8 h-8 text-primary-600" /> : <BookOpen className="w-8 h-8 text-primary-600" />}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary-600 px-2 py-0.5 bg-primary-100 rounded">
                                        {course.type || 'Course'}
                                    </span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs font-medium text-gray-500">{course.platform}</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{course.title}</h4>
                                <div className="flex items-center space-x-4 mt-2">
                                    <div className="flex items-center text-amber-500">
                                        <Star className="w-4 h-4 fill-current mr-1" />
                                        <span className="text-sm font-bold">{course.rating}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">Duration: {course.duration}</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-lg border border-primary-100">
                                <Search className="w-4 h-4 text-primary-600 flex-shrink-0" />
                                <span className="text-sm text-gray-700">
                                    Search: <span className="font-semibold text-gray-900">"{course.title}"</span>
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="relative mb-16">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-gray-50 px-6 py-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Study Timeline</span>
                </div>
            </div>

            {/* Study Plan Visualization */}
            <div className="mb-12">
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-3 bg-accent-50 px-6 py-3 rounded-full border-2 border-accent-200">
                        <Map className="w-5 h-5 text-accent-600" />
                        <h3 className="text-xl font-bold text-gray-900">3-Month Learning Roadmap</h3>
                    </div>
                </div>

                <div className="h-[400px] w-full bg-gray-50 rounded-[32px] border border-gray-200 overflow-hidden relative mb-12">
                    <div className="absolute top-6 left-6 z-10 flex items-center space-x-2 bg-white/80 backdrop-blur p-3 rounded-xl border border-gray-100 shadow-sm">
                        <Map className="w-5 h-5 text-primary-600" />
                        <span className="text-sm font-bold text-gray-700">Skill Map Visualization</span>
                    </div>
                    <ReactFlow
                        nodes={initialNodes}
                        edges={initialEdges}
                        fitView
                        nodesConnectable={false}
                        panOnDrag={true}
                        zoomOnScroll={false}
                    >
                        <Background color="#8b5cf6" variant={'dots' as any} gap={20} size={1} />
                        <Controls />
                    </ReactFlow>
                </div>
            </div>

            {/* Step-by-Step Breakdown */}
            <div className="mb-12">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Step-by-Step Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {studyPlanData.map((plan: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-primary-200 transition-all relative"
                        >
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">Step {i + 1}</span>
                            </div>
                            <div className="flex items-center space-x-2 mb-4 mt-2">
                                <Calendar className="w-5 h-5 text-accent-600" />
                                <span className="font-bold text-accent-700">{plan.phase}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-3 text-lg">{plan.goal}</h4>
                            <div className="space-y-2">
                                {plan.steps.map((step: string, j: number) => (
                                    <div key={j} className="flex items-start space-x-3 text-sm text-gray-600">
                                        <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                                        <span>{step}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={nextStep} className="btn-primary py-4 px-12 flex items-center group text-lg">
                    See Salary Projections
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default Step4StudyPlan;
