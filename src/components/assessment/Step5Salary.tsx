import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, ArrowUpRight, ChevronRight, Info } from 'lucide-react';

const Step5Salary = () => {
    const { profile, nextStep } = useProfileStore();

    const salaryData = profile.salary_projection || {
        current: profile.current_salary,
        projected: profile.current_salary * 1.35,
        reason: 'Acquiring high-demand skills like System Design and Distributed Computing moves you into the Staff/Principal tier, which carries a significant market premium.'
    };

    const chartData = [
        { name: 'Current Skills', value: salaryData.current, color: '#94a3b8' },
        { name: 'After Upskilling', value: salaryData.projected, color: '#8b5cf6' }
    ];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: profile.currency || 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    const increase = ((salaryData.projected - salaryData.current) / salaryData.current) * 100;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold font-heading mb-4 text-gray-900">Earning Potential</h2>
                <p className="text-gray-600">See how investments in your skill set translate into market value.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="glass-card p-8 rounded-[32px] flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                            <TrendingUp className="text-primary-600 w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Potential Increase</h3>
                        <p className="text-gray-500 text-sm mb-6">Estimated market value growth based on target skill acquisition.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="text-5xl font-extrabold gradient-text">+{increase.toFixed(0)}%</div>
                        <div className="flex items-center text-success-600 font-bold space-x-2">
                            <ArrowUpRight className="w-5 h-5" />
                            <span>{formatCurrency(salaryData.projected - salaryData.current)} more / year</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[32px] overflow-hidden min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl border border-gray-800 text-sm font-bold">
                                                {formatCurrency(payload[0].value as number)}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    formatter={(val: number) => formatCurrency(val)}
                                    style={{ fill: '#1e293b', fontWeight: 700, fontSize: '14px' }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl bg-white mb-12">
                <h3 className="text-lg font-bold mb-4">Market Insight</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{profile.salary_projection?.reason}</p>
                {profile.salary_projection?.reference && (
                    <p className="text-xs text-gray-400 italic">Source: {profile.salary_projection.reference}</p>
                )}
            </div>

            <div className="flex justify-end">
                <div className="relative group">
                    <button onClick={nextStep} className="p-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none">
                        Generate Your Profile
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step5Salary;
