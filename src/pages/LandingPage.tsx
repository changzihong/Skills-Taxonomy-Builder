import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Target, TrendingUp, Share2, Rocket, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import kadoshLogo from '../components/image/kadosh_ai_logo.jpeg';

const LandingPage = () => {
    return (
        <div className="overflow-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
                            <Rocket className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold font-heading gradient-text">SkillPath AI</span>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#features" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Features</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">How it works</a>
                    </nav>
                    <div className="relative group">
                        
                        <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none">
                            Get Started
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary-200/30 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[60%] bg-accent-200/30 blur-[120px] rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold font-heading text-gray-900 mb-6 leading-tight">
                            Build Your Career <br />
                            <span className="gradient-text">Roadmap with AI</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Discover your skill gaps, get personalized learning plans, and unlock your earning potential in minutes. Powered by advanced AI to help you navigate your professional growth.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <div className="relative group">
                                <Link to="/assess" className="p-5 rounded-2xl font-bold text-white shadow-xl shadow-teal-500/30 bg-gradient-to-r from-teal-500 to-indigo-600 hover:scale-110 transition-all duration-200 text-lg flex items-center">
                                    <Rocket className="w-7 h-7" />
                                </Link>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none">
                                    Start Your Journey — It's Free
                                </div>
                            </div>
                            <div className="relative group">
                                <a href="#features" className="p-5 rounded-2xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-110 transition-all duration-200 text-lg flex items-center shadow-lg">
                                    <Target className="w-7 h-7" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hero Image/Illustration Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-20 relative mx-auto max-w-5xl"
                    >
                        <div className="relative rounded-2xl overflow-hidden glass-card p-4 border-white/40">
                            <div className="bg-gray-900 rounded-xl aspect-[16/9] flex items-center justify-center relative overflow-hidden">
                                {/* Visual Representation of Dashboard */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-accent-900/20"></div>
                                <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-4">
                                            <div className="w-48 h-8 bg-white/10 rounded-lg animate-pulse"></div>
                                            <div className="w-32 h-6 bg-white/5 rounded-lg animate-pulse"></div>
                                        </div>
                                        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                                            <TrendingUp className="text-white w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="h-32 bg-white/10 rounded-xl animate-pulse"></div>
                                        <div className="h-32 bg-white/10 rounded-xl animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="h-32 bg-white/10 rounded-xl animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center space-y-2 z-20"
                        >
                            <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="text-success-600 w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-gray-800">Verified</span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="section-container bg-white relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-heading text-gray-900 mb-4">Precision-Crafted Features</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to analyze your professional standing and take the next step in your career.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            icon: Brain,
                            title: "AI Assessment",
                            desc: "Dynamic, AI-driven questions that adapt to your field and experience level.",
                            color: "bg-purple-100 text-purple-600"
                        },
                        {
                            icon: Target,
                            title: "Gap Analysis",
                            desc: "Identify exactly which skills you're missing for your dream position.",
                            color: "bg-teal-100 text-teal-600"
                        },
                        {
                            icon: TrendingUp,
                            title: "Salary Projection",
                            desc: "See how acquiring new skills directly impacts your earning potential.",
                            color: "bg-green-100 text-green-600"
                        },
                        {
                            icon: Share2,
                            title: "Shareable Profile",
                            desc: "Get a unique persona profile to share with managers or on social media.",
                            color: "bg-blue-100 text-blue-600"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="section-container">
                <div className="bg-gray-900 rounded-[32px] p-8 md:p-16 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-600/20 to-transparent"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-12">How It Works</h2>

                        <div className="space-y-12">
                            {[
                                { step: "01", title: "Share Your Background", desc: "Briefly tell us about your current role, experience, and career aspirations." },
                                { step: "02", title: "AI Assessment", desc: "Complete a personalized skill assessment guided by our intelligent career coach." },
                                { step: "03", title: "Unlock Insights", desc: "Receive a comprehensive report on your skills, gaps, and growth opportunities." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-6">
                                    <span className="text-4xl font-extrabold text-white/20 font-heading">{item.step}</span>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                                        <p className="text-gray-400 max-w-xl">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16">
                            <div className="relative inline-block group">
                                <Link to="/assess" className="p-5 rounded-2xl font-bold text-white shadow-xl shadow-teal-500/30 bg-gradient-to-r from-teal-500 to-indigo-600 hover:scale-110 transition-all duration-200 inline-flex items-center">
                                    <ArrowRight className="w-6 h-6" />
                                </Link>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none">
                                    Begin Assessment Now
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                      <img src={kadoshLogo} alt="Kadosh AI Logo" className="w-6 h-6 object-contain" />
                      <span className="text-xl font-bold font-heading">Kadosh <span style={{ color: '#48edc4' }}>AI</span></span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        ©2026 SkillPath AI. All rights reserved. Built with precision for professional growth.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
