import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useProfileStore } from '@/store/useProfileStore';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Map } from 'lucide-react';

const Step5StudyPlan = () => {
    const { profile, nextStep } = useProfileStore();

    const initialNodes: Node[] = useMemo(() => {
        return (profile.study_plan || [
            { phase: 'Month 1', goal: 'Core Foundations', steps: ['Review basics', 'Deep dive into language specs'] },
            { phase: 'Month 2', goal: 'Intermediate Mastery', steps: ['Functional patterns', 'Concurrency'] },
            { phase: 'Month 3', goal: 'Advanced Architecture', steps: ['Microservices', 'System Design'] }
        ]).map((plan: any, i: number) => ({
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
    }, [profile.study_plan]);

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
                <h2 className="text-3xl font-bold font-heading mb-4 text-gray-900">Your Personalized Roadmap</h2>
                <p className="text-gray-600">A visual guide to mastering your target skills over the next 3 months.</p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {(profile.study_plan || []).map((plan: any, i: number) => (
                    <div key={i} className="glass-card p-6 rounded-2xl bg-white">
                        <div className="flex items-center space-x-2 mb-4">
                            <Calendar className="w-5 h-5 text-accent-600" />
                            <span className="font-bold text-accent-700">{plan.phase}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-3">{plan.goal}</h4>
                        <div className="space-y-2">
                            {plan.steps.map((step: string, j: number) => (
                                <div key={j} className="flex items-start space-x-3 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0" />
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button onClick={nextStep} className="btn-primary py-4 px-12 flex items-center group">
                    See Salary Projections
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default Step5StudyPlan;
