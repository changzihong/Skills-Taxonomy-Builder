import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, PlayCircle, Star, Award, ChevronRight } from 'lucide-react';

const Step4Recommendations = () => {
    const { profile, nextStep } = useProfileStore();

    // Mock recommendations if not present
    const courses = profile.recommended_courses?.length > 0 ? profile.recommended_courses : [
        { title: 'Advanced System Design Architectural Patterns', platform: 'Coursera', rating: 4.8, duration: '20 hours', type: 'Specialization', icon: Award },
        { title: 'Distributed Systems in Production', platform: 'Udemy', rating: 4.7, duration: '12 hours', type: 'Course', icon: PlayCircle },
        { title: 'Mastering Cloud Native Infrastructure', platform: 'Pluralsight', rating: 4.9, duration: '15 hours', type: 'Learning Path', icon: BookOpen }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold font-heading mb-4 text-gray-900">Learning Recommendations</h2>
                <p className="text-gray-600">Based on your gaps, we've curated the best resources to help you level up.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-12">
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
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{course.title}</h3>
                            <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center text-amber-500">
                                    <Star className="w-4 h-4 fill-current mr-1" />
                                    <span className="text-sm font-bold">{course.rating}</span>
                                </div>
                                <div className="text-sm text-gray-500 font-medium">Duration: {course.duration}</div>
                            </div>
                        </div>

                        <a
                            href={course.url || `https://www.google.com/search?q=${encodeURIComponent(course.title + ' ' + course.platform)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary py-2 px-6 flex items-center space-x-2 text-sm"
                        >
                            <span>View Course</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-end">
                <button onClick={nextStep} className="btn-primary py-4 px-12 flex items-center group">
                    Visualize Your Study Plan
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default Step4Recommendations;
