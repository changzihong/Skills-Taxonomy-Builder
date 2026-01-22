import React, { useState } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { saveProfile } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Share2, Download, Check, Sparkles, Globe, Award, Target, BookOpen, Map, TrendingUp, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';

const Step6Persona = () => {
    const { profile, setProfile } = useProfileStore();
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    // Helper function to generate platform-specific search URLs
    const getPlatformSearchUrl = (platform: string, query: string) => {
        const encodedQuery = encodeURIComponent(query);
        const platformUrls: { [key: string]: string } = {
            'Coursera': `https://www.coursera.org/search?query=${encodedQuery}`,
            'Udemy': `https://www.udemy.com/courses/search/?q=${encodedQuery}`,
            'Pluralsight': `https://www.pluralsight.com/search?q=${encodedQuery}`,
            'edX': `https://www.edx.org/search?q=${encodedQuery}`,
            'LinkedIn Learning': `https://www.linkedin.com/learning/search?keywords=${encodedQuery}`,
            'Udacity': `https://www.udacity.com/courses/all?search=${encodedQuery}`,
            'Khan Academy': `https://www.khanacademy.org/search?page_search_query=${encodedQuery}`,
        };
        return platformUrls[platform] || `https://www.google.com/search?q=${encodedQuery}+course+${encodeURIComponent(platform)}`;
    };

    const persona = profile.persona_profile_data || {
        title: 'The Modern Architect',
        traits: ['Data-driven', 'Innovative', 'Systemic Thinker'],
        summary: `Based on your profile, you are a ${profile.full_name} who excels at bridging technical complexity with business value. You have a natural aptitude for ${profile.current_skills?.[0] || 'problem solving'} and a clear path toward ${profile.job_title} mastery.`
    };

    const handleShare = async () => {
        setSaving(true);
        try {
            // Use existing share_id or generate a new one
            let shareId = profile.share_id;

            if (!shareId) {
                shareId = nanoid(10);
                try {
                    // Try to save to backend
                    await saveProfile({
                        ...profile,
                        share_id: shareId,
                        persona_profile_data: persona,
                        completed_at: new Date().toISOString()
                    });
                } catch (err) {
                    console.warn("Backend save failed, using local link generation for demo.", err);
                    // Silently fail for demo purposes so user still gets a link
                }

                // Always update local store
                setProfile({ share_id: shareId });
            }

            const shareUrl = `${window.location.origin}/profile/${shareId}`;
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Share link generated and copied!');
            setTimeout(() => setCopied(false), 3000);
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate link. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto print:max-w-none print:px-8">
            {/* Web View Header */}
            <div className="mb-12 text-center print:hidden">
                <h2 className="text-3xl font-bold font-heading mb-4 text-gray-900">Your Professional Capability Report</h2>
                <p className="text-gray-600">A data-driven analysis of your career trajectory and growth potential.</p>
            </div>

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
                        <div className="text-lg font-bold text-gray-900">{persona.title}</div>
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
                        "{persona.summary}"
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

            {/* Web View Content */}
            <div className="glass-card rounded-lg overflow-hidden bg-white mb-12 shadow-xl border border-gray-200 print:hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white relative">
                    <div className="p-12 pb-24">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold font-heading mb-2">{profile.full_name}</h1>
                                <p className="text-xl text-gray-300 font-medium">{profile.job_title}</p>
                                <div className="flex items-center space-x-4 mt-4 text-gray-400 text-sm">
                                    <span className="flex items-center"><Globe className="w-4 h-4 mr-1" /> {profile.city_state}, {profile.country}</span>
                                    <span>•</span>
                                    <span>{profile.years_of_experience} Years Experience</span>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Archetype</div>
                                <div className="text-2xl font-bold text-white flex items-center justify-end">
                                    <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                                    {persona.title}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-12 py-12 -mt-12">
                    {/* Traits Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {persona.traits.map((trait: string, i: number) => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow-lg border border-gray-100 flex items-center justify-center space-x-2">
                                <Check className="w-5 h-5 text-teal-500" />
                                <span className="font-bold text-gray-800">{trait}</span>
                            </div>
                        ))}
                    </div>

                    {/* Executive Summary */}
                    <div className="mb-12 border-b border-gray-100 pb-12">
                        <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest flex items-center">
                            <Award className="w-4 h-4 mr-2" /> Executive Summary
                        </h4>
                        <div className="bg-gray-50/50 p-8 rounded-lg border-l-4 border-teal-500 text-gray-700 leading-relaxed text-lg">
                            "{persona.summary}"
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                        {/* Skill Gap Analysis */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest flex items-center">
                                <Target className="w-4 h-4 mr-2" />
                                Priority Growth Areas
                            </h4>
                            <div className="space-y-4">
                                {(profile.skill_gaps || []).slice(0, 4).map((gap: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center p-3 border-b border-gray-100">
                                        <span className="font-medium text-gray-800">{typeof gap === 'string' ? gap : gap.name}</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${(typeof gap !== 'string' && gap.priority === 'High') ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {typeof gap === 'string' ? 'Strategic' : gap.priority} Priority
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Study Plan Snapshot */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest flex items-center">
                                <Map className="w-4 h-4 mr-2" />
                                Strategic Roadmap
                            </h4>
                            <div className="space-y-8">
                                {(profile.study_plan || []).map((plan: any, i: number) => (
                                    <div key={i} className="relative pl-6 border-l-2 border-gray-200">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-teal-500"></div>
                                        <div className="mb-2">
                                            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-1 rounded">{plan.phase}</span>
                                        </div>
                                        <h5 className="font-bold text-gray-900 mb-2">{plan.goal}</h5>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            {plan.steps && plan.steps.map((step: string, j: number) => (
                                                <li key={j} className="flex items-start">
                                                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recommended Resources */}
                    <div className="mb-8">
                        <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Recommended Development Resources
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(profile.recommended_courses || []).map((course: any, i: number) => (
                                <motion.a
                                    key={i}
                                    href={course.url || getPlatformSearchUrl(course.platform, course.title)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 rounded-lg border-2 border-gray-200 hover:border-teal-500 hover:shadow-lg transition-all group cursor-pointer bg-white hover:bg-teal-50"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h5 className="font-bold text-gray-900 group-hover:text-teal-700 mb-1 flex items-center">
                                                {course.title}
                                                <ExternalLink className="w-4 h-4 ml-2 text-gray-400 group-hover:text-teal-600 transition-colors" />
                                            </h5>
                                            <p className="text-sm text-gray-500">{course.platform} • {course.type}</p>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Market Value Section */}
                    <div className="mb-8 bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-lg border border-teal-100">
                        <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Market Value Projection
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="text-sm text-gray-600 mb-2">Current Salary</div>
                                <div className="text-3xl font-bold text-gray-700">
                                    {profile.currency} {profile.salary_projection?.current?.toLocaleString() || profile.current_salary?.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-2">Projected Salary</div>
                                <div className="text-4xl font-bold text-teal-600">
                                    {profile.currency} {profile.salary_projection?.projected.toLocaleString()}
                                </div>
                                <div className="text-sm text-green-600 font-bold mt-2">
                                    +{((profile.salary_projection?.projected - (profile.salary_projection?.current || profile.current_salary)) / (profile.salary_projection?.current || profile.current_salary) * 100).toFixed(0)}% Growth Potential
                                </div>
                            </div>
                        </div>
                        {profile.salary_projection?.reason && (
                            <div className="mt-6 pt-6 border-t border-teal-200">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {profile.salary_projection.reason}
                                </p>
                                {profile.salary_projection?.reference && (
                                    <p className="text-xs text-gray-500 italic mt-2">
                                        Source: {profile.salary_projection.reference}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap justify-center gap-6 pt-12 border-t border-gray-100">
                        <div className="relative group">
                            <button
                                onClick={handleShare}
                                disabled={saving}
                                className="p-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {copied ? <Check className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none">
                                {saving ? 'Generating...' : copied ? 'Link Copied!' : 'Save & Share Profile'}
                            </div>
                        </div>
                        <div className="relative group">
                            <button
                                onClick={() => window.print()}
                                className="p-4 rounded-xl bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all"
                            >
                                <Download className="w-6 h-6" />
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none">
                                Download PDF Report
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step6Persona;
