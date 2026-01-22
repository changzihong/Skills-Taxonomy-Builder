import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProfileByShareId } from '@/lib/supabase';
import { useProfileStore } from '@/store/useProfileStore';
import { Loader2, Rocket, Download, ExternalLink, Calendar, Map, TrendingUp, Sparkles, User, BadgeCheck, Globe, Award, Target, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const { shareId } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Helper function to generate platform-specific search URLs
    const getPlatformSearchUrl = (platform: string, query: string) => {
        const encodedQuery = encodeURIComponent(query);
        const platformUrls: { [key: string]: string } = {
            'Coursera': `https://www.coursera.org/search?query=${encodedQuery}`,
            'Udemy': `https://www.udemy.com/courses/search/?q=${encodedQuery}`,
            'Pluralsight': `https://www.pluralsight.com/search?q=${encodedQuery}`,
            'edX': `https://www.edx.org/search?q=${encodedQuery}`,
            'LinkedIn Learning': `https://www.google.com/search?q=site:linkedin.com/learning+${encodedQuery}`,
            'Udacity': `https://www.udacity.com/courses/all?search=${encodedQuery}`,
            'Khan Academy': `https://www.khanacademy.org/search?page_search_query=${encodedQuery}`,
        };
        return platformUrls[platform] || `https://www.google.com/search?q=${encodedQuery}+course+${encodeURIComponent(platform)}`;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (shareId) {
                // If it's a mock ID, use random data
                if (shareId.startsWith('mock-')) {
                    setProfile({
                        full_name: 'John Doe',
                        job_title: 'Senior Software Engineer',
                        country: 'United States',
                        years_of_experience: 8,
                        currency: 'USD',
                        current_salary: 120000,
                        current_skills: ['React', 'Node.js', 'System Design'],
                        skill_gaps: ['Cloud Architecture', 'Leadership', 'Performance Optimization'],
                        persona_profile_data: {
                            title: 'Strategic Developer',
                            traits: ['Logical', 'Persistent', 'Visionary'],
                            summary: 'A seasoned professional with a deep understanding of software systems.'
                        },
                        study_plan: [
                            { phase: 'Month 1', goal: 'Core Foundations', steps: ['Review basics', 'Deep dive into language specs'] },
                            { phase: 'Month 2', goal: 'Intermediate Mastery', steps: ['Functional patterns', 'Concurrency'] },
                            { phase: 'Month 3', goal: 'Advanced Architecture', steps: ['Microservices', 'System Design'] }
                        ],
                        salary_projection: {
                            current: 120000,
                            projected: 162000,
                            reason: 'Acquiring high-demand skills like System Design and Distributed Computing moves you into the Staff/Principal tier.'
                        }
                    });
                    setLoading(false);
                    return;
                }

                const data = await getProfileByShareId(shareId);
                setProfile(data);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [shareId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading skill profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
                <p className="text-gray-600 mb-8">This skill roadmap may have expired or the link is incorrect.</p>
                <Link to="/" className="btn-primary">Build Your Own Roadmap</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 print:bg-white print:pb-0">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <Rocket className="text-primary-600 w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="text-lg font-bold font-heading gradient-text">SkillPath AI</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <button
                                onClick={() => window.print()}
                                className="p-2 bg-gray-100 rounded-lg hover:bg-primary-100 transition-all hover:scale-110"
                                title="Download as PDF"
                            >
                                <Download className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
                            </button>
                            <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none">
                                Download as PDF
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 print:pt-0 print:px-8 print:max-w-none">
                {/* Print Header - Only visible when printing */}
                <div className="hidden print:block mb-8 pb-6 border-b-2 border-gray-900">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.full_name}</h1>
                            <p className="text-xl text-gray-700 font-semibold mb-2">{profile.job_title}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{profile.country}</span>
                                <span>•</span>
                                <span>{profile.years_of_experience} Years Experience</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Professional Archetype</div>
                            <div className="text-lg font-bold text-gray-900">{profile.persona_profile_data?.title || 'Professional'}</div>
                        </div>
                    </div>
                </div>

                {/* Web View Profile Card */}
                <div className="glass-card rounded-[40px] overflow-hidden bg-white mb-12 shadow-2xl border-0 print:hidden">
                    <div className="h-48 bg-gradient-to-br from-primary-600 to-accent-600" />
                    <div className="pt-20 pb-12 px-8 md:px-12 relative">
                        <div className="absolute -top-16 left-8 md:left-12 w-32 h-32 bg-white rounded-[32px] p-2 shadow-xl">
                            <div className="w-full h-full bg-gray-100 rounded-[24px] flex items-center justify-center">
                                <User className="w-16 h-16 text-primary-300" />
                            </div>
                            <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-success-500 rounded-full border-4 border-white flex items-center justify-center">
                                <BadgeCheck className="text-white w-4 h-4" />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                                <p className="text-lg text-primary-600 font-bold">{profile.job_title}</p>
                            </div>
                            <motion.div
                                className="px-6 py-3 bg-primary-50 rounded-2xl border border-primary-100 cursor-default hover:bg-primary-100 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-1">Archetype</div>
                                <div className="text-xl font-bold text-primary-900 flex items-center">
                                    <motion.div
                                        whileHover={{ rotate: 180 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Sparkles className="w-5 h-5 mr-2 text-primary-600" />
                                    </motion.div>
                                    {profile.persona_profile_data?.title || 'Professional'}
                                </div>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Info Column */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Strategic Summary</h3>
                                    <p className="text-gray-600 leading-relaxed italic">
                                        "{profile.persona_profile_data?.summary}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div
                                        className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors cursor-default"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Location</div>
                                        <div className="font-bold text-gray-800 flex items-center"><Globe className="w-3 h-3 mr-1" /> {profile.country}</div>
                                    </motion.div>
                                    <motion.div
                                        className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors cursor-default"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Experience</div>
                                        <div className="font-bold text-gray-800">{profile.years_of_experience} Years</div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Skills Column */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Verified Strengths</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.current_skills?.map((s: any, i: number) => (
                                            <motion.span
                                                key={i}
                                                className="px-3 py-1.5 bg-success-50 text-success-700 rounded-lg text-sm font-bold border border-success-100 cursor-default"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                            >
                                                {typeof s === 'string' ? s : s.name}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Growth Areas</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skill_gaps?.map((s: any, i: number) => (
                                            <motion.span
                                                key={i}
                                                className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-bold border border-red-100 cursor-default"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                            >
                                                {typeof s === 'string' ? s : s.name}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print-Optimized Content Sections */}
                <div className="hidden print:block space-y-8">
                    {/* Executive Summary - Print */}
                    <section className="page-break-avoid mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300 flex items-center">
                            <Award className="w-5 h-5 mr-2" />
                            Executive Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed italic pl-4 border-l-4 border-teal-500">
                            "{profile.persona_profile_data?.summary}"
                        </p>
                    </section>

                    {/* Skills Overview - Print */}
                    <section className="page-break-avoid mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300 flex items-center">
                            <Target className="w-5 h-5 mr-2" />
                            Skills Assessment
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Current Strengths</h3>
                                <ul className="space-y-2">
                                    {profile.current_skills?.map((s: any, i: number) => (
                                        <li key={i} className="flex items-start">
                                            <span className="text-green-600 mr-2">✓</span>
                                            <span className="text-gray-700">{typeof s === 'string' ? s : s.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Development Areas</h3>
                                <ul className="space-y-2">
                                    {profile.skill_gaps?.map((s: any, i: number) => (
                                        <li key={i} className="flex items-start">
                                            <span className="text-orange-600 mr-2">→</span>
                                            <span className="text-gray-700">{typeof s === 'string' ? s : s.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Learning Roadmap - Print */}
                    <section className="page-break-before mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300 flex items-center">
                            <Map className="w-5 h-5 mr-2" />
                            3-Month Learning Roadmap
                        </h2>
                        <div className="space-y-6">
                            {profile.study_plan?.map((plan: any, i: number) => (
                                <div key={i} className="page-break-avoid">
                                    <div className="flex items-start mb-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1">{plan.phase}</div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.goal}</h3>
                                            <ul className="space-y-1 text-sm text-gray-700">
                                                {plan.steps?.map((step: string, j: number) => (
                                                    <li key={j} className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        <span>{step}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recommended Courses - Print */}
                    {profile.recommended_courses && (
                        <section className="page-break-avoid mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300 flex items-center">
                                <BookOpen className="w-5 h-5 mr-2" />
                                Recommended Learning Resources
                            </h2>
                            <div className="space-y-3">
                                {profile.recommended_courses.map((course: any, i: number) => (
                                    <div key={i} className="border border-gray-200 p-4 page-break-avoid">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900">{course.title}</h3>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1">{course.type}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-2">
                                            <span className="font-semibold">{course.platform}</span> • {course.duration}
                                        </div>
                                        <div className="text-xs text-blue-600 break-all">
                                            {course.url || getPlatformSearchUrl(course.platform, course.title)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Market Value - Print */}
                    <section className="page-break-avoid mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Market Value Projection
                        </h2>
                        <div className="bg-gray-50 p-6 border border-gray-200">
                            <div className="grid grid-cols-2 gap-6 mb-4">
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Current Salary</div>
                                    <div className="text-2xl font-bold text-gray-700">
                                        {profile.currency} {profile.salary_projection?.current?.toLocaleString() || profile.current_salary?.toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Projected Salary</div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {profile.currency} {profile.salary_projection?.projected.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-green-600 font-semibold mt-1">
                                        +{((profile.salary_projection?.projected - (profile.salary_projection?.current || profile.current_salary)) / (profile.salary_projection?.current || profile.current_salary) * 100).toFixed(0)}% Growth Potential
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-300 pt-4">
                                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                                    {profile.salary_projection?.reason}
                                </p>
                                {profile.salary_projection?.reference && (
                                    <p className="text-xs text-gray-500 italic">
                                        Source: {profile.salary_projection.reference}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Footer - Print */}
                    <div className="mt-12 pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
                        <p>Generated by SkillPath AI • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                {/* Web View - Roadmap Visualization */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            className="glass-card p-8 rounded-[32px] hover:shadow-xl transition-shadow"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <div className="flex items-center space-x-3 mb-8">
                                <motion.div
                                    className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Map className="text-primary-600 w-6 h-6" />
                                </motion.div>
                                <h2 className="text-2xl font-bold">Learning Roadmap</h2>
                            </div>

                            <div className="space-y-6">
                                {profile.study_plan?.map((plan: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        className="flex space-x-6 group"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <div className="flex flex-col items-center">
                                            <motion.div
                                                className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-primary-100 group-hover:ring-primary-200 transition-all"
                                                whileHover={{ scale: 1.2 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                            >
                                                {i + 1}
                                            </motion.div>
                                            {i !== profile.study_plan.length - 1 && <div className="w-1 h-full bg-primary-100 my-2 rounded-full" />}
                                        </div>
                                        <div className="pb-8">
                                            <div className="text-xs font-bold text-primary-500 uppercase mb-1">{plan.phase}</div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{plan.goal}</h4>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {plan.steps?.map((s: string, j: number) => (
                                                    <li key={j} className="text-sm text-gray-500 flex items-center">
                                                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2" />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recommended Courses Section */}
                        {profile.recommended_courses && (
                            <motion.div
                                className="glass-card p-8 rounded-[32px] hover:shadow-xl transition-shadow"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="flex items-center space-x-3 mb-8">
                                    <motion.div
                                        className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <ExternalLink className="text-accent-600 w-6 h-6" />
                                    </motion.div>
                                    <h2 className="text-2xl font-bold">Recommended Courses</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {profile.recommended_courses.map((course: any, i: number) => (
                                        <motion.a
                                            key={i}
                                            href={course.url || getPlatformSearchUrl(course.platform, course.title)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all block group hover:shadow-lg hover:border-primary-200"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-accent-600 bg-accent-50 px-2 py-1 rounded-lg group-hover:bg-accent-100 transition-colors">{course.platform}</span>
                                                <span className="text-xs font-bold text-gray-400">{course.type}</span>
                                            </div>
                                            <h4 className="font-bold text-gray-900 leading-tight mb-2 group-hover:text-primary-600 transition-colors">{course.title}</h4>
                                            <div className="flex items-center text-xs text-gray-500 space-x-3">
                                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {course.duration}</span>
                                                <span className="flex items-center text-yellow-500">★ {course.rating}</span>
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <motion.div
                            className="glass-card p-8 rounded-[32px] bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-900">Market Value</h3>
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 15 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    <TrendingUp className="text-teal-600 w-6 h-6" />
                                </motion.div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">Current Salary</div>
                                        <div className="text-2xl font-bold text-gray-700">
                                            {profile.currency} {profile.salary_projection?.current?.toLocaleString() || profile.current_salary?.toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">Projected Salary</div>
                                        <div className="text-4xl font-extrabold text-teal-600">
                                            {profile.currency} {profile.salary_projection?.projected.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-green-600 font-bold mt-2">
                                            + {((profile.salary_projection?.projected - (profile.salary_projection?.current || profile.current_salary)) / (profile.salary_projection?.current || profile.current_salary) * 100).toFixed(0)}% Growth
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        {profile.salary_projection?.reason}
                                    </p>
                                    {profile.salary_projection?.reference && (
                                        <p className="text-xs text-gray-400 italic">
                                            Source: {profile.salary_projection.reference}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
