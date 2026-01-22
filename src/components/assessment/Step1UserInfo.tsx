import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProfileStore } from '@/store/useProfileStore';
import { ArrowRight, User, Briefcase, DollarSign, Target, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { uploadFile } from '@/lib/supabase';

const step1Schema = z.object({
    full_name: z.string().min(2, 'Name is too short'),
    age: z.coerce.number().min(18).max(100),
    job_title: z.string().min(2, 'Job title is required'),
    position_department: z.string().min(2, 'Department is required'),
    current_responsibilities: z.string().min(10, 'Please describe what you do'),
    industry_type: z.string().min(2, 'Industry is required'),
    company_size: z.string(),
    years_of_experience: z.coerce.number().min(0),
    current_salary: z.coerce.number().min(0),
    currency: z.string().min(1),
    country: z.string().min(2),
    city_state: z.string().min(2),
    current_skills: z.string().min(2, 'Please list at least one skill'),
    career_aspirations: z.string().optional(),
    skills_to_develop: z.string().optional(),
});

const Step1UserInfo = () => {
    const { profile, setProfile, nextStep } = useProfileStore();

    // Convert current_skills to string for form, handling both string arrays and object arrays
    const skillsAsString = React.useMemo(() => {
        if (!profile.current_skills) return '';
        if (typeof profile.current_skills === 'string') return profile.current_skills;
        if (Array.isArray(profile.current_skills)) {
            return profile.current_skills
                .map((s: any) => typeof s === 'string' ? s : s.name)
                .join(', ');
        }
        return '';
    }, [profile.current_skills]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            ...profile,
            current_skills: skillsAsString
        },
    });

    // Update form when profile changes (e.g., when navigating back)
    React.useEffect(() => {
        reset({
            ...profile,
            current_skills: skillsAsString
        });
    }, [profile.full_name, skillsAsString, reset]);

    const onSubmit = (data: any) => {
        // Convert comma-separated string to array for store if needed, but OpenAI handles string too.
        // Let's keep it as string in prompt or split it.
        // Actually store expects array sometimes, but we made it flexible. 
        // Let's normalize to array for the store to be safe.
        const skillsArray = data.current_skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
        setProfile({ ...data, current_skills: skillsArray });
        nextStep();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
        >
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold font-heading mb-4">Personal & Professional Background</h2>
                <p className="text-gray-600">Tell us a bit about yourself to help the AI tailor the assessment.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                {/* Section: Personal Info */}
                <div className="glass-card p-8 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <User className="text-primary-600 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label-text">Full Name *</label>
                            <input {...register('full_name')} className={`input-field ${errors.full_name ? 'border-red-500' : ''}`} placeholder="e.g. John Doe" />
                            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message as string}</p>}
                        </div>
                        <div>
                            <label className="label-text">Age *</label>
                            <input type="number" {...register('age')} className={`input-field ${errors.age ? 'border-red-500' : ''}`} placeholder="e.g. 28" />
                            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message as string}</p>}
                        </div>
                    </div>
                </div>

                {/* Section: Professional Info */}
                <div className="glass-card p-8 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="text-accent-600 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Professional Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="label-text">Target/Current Job Title *</label>
                            <input {...register('job_title')} className={`input-field ${errors.job_title ? 'border-red-500' : ''}`} placeholder="e.g. Senior Software Engineer" />
                            {errors.job_title && <p className="text-red-500 text-xs mt-1">{errors.job_title.message as string}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="label-text">Current Responsibilities *</label>
                            <textarea
                                {...register('current_responsibilities')}
                                className={`input-field min-h-[100px] ${errors.current_responsibilities ? 'border-red-500' : ''}`}
                                placeholder="Describe your day-to-day tasks and main projects..."
                            />
                            {errors.current_responsibilities && <p className="text-red-500 text-xs mt-1">{errors.current_responsibilities.message as string}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="label-text">Current Skills (Comma separated) *</label>
                            <textarea
                                {...register('current_skills')}
                                className={`input-field min-h-[80px] ${errors.current_skills ? 'border-red-500' : ''}`}
                                placeholder="e.g. React, Python, Project Management, SEO"
                            />
                            {errors.current_skills && <p className="text-red-500 text-xs mt-1">{errors.current_skills.message as string}</p>}
                            <p className="text-xs text-gray-400 mt-2">AI will analyze these skills against your target role.</p>
                        </div>
                        <div>
                            <label className="label-text">Department *</label>
                            <input {...register('position_department')} className={`input-field ${errors.position_department ? 'border-red-500' : ''}`} placeholder="e.g. Engineering" />
                            {errors.position_department && <p className="text-red-500 text-xs mt-1">{errors.position_department.message as string}</p>}
                        </div>
                        <div>
                            <label className="label-text">Industry *</label>
                            <input {...register('industry_type')} className={`input-field ${errors.industry_type ? 'border-red-500' : ''}`} placeholder="e.g. Technology" />
                            {errors.industry_type && <p className="text-red-500 text-xs mt-1">{errors.industry_type.message as string}</p>}
                        </div>
                        <div>
                            <label className="label-text">Years of Experience *</label>
                            <input type="number" {...register('years_of_experience')} className={`input-field ${errors.years_of_experience ? 'border-red-500' : ''}`} />
                            {errors.years_of_experience && <p className="text-red-500 text-xs mt-1">{errors.years_of_experience.message as string}</p>}
                        </div>
                        <div>
                            <label className="label-text">Company Size</label>
                            <select {...register('company_size')} className="input-field">
                                <option value="Self-employed">Self-employed</option>
                                <option value="Small (1-50)">Small (1-50)</option>
                                <option value="Medium (51-200)">Medium (51-200)</option>
                                <option value="Large (201-1000)">Large (201-1000)</option>
                                <option value="Enterprise (1000+)">Enterprise (1000+)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section: Compensation */}
                <div className="glass-card p-8 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="text-success-600 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Compensation & Location</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label-text">Current Annual Salary *</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    RM
                                </div>
                                <input type="number" {...register('current_salary')} className={`input-field pl-10 ${errors.current_salary ? 'border-red-500' : ''}`} />
                            </div>
                        </div>
                        <div>
                            <label className="label-text">Currency</label>
                            <select {...register('currency')} className="input-field">
                                <option value="MYR">MYR (Malaysia)</option>
                            </select>
                        </div>
                        <div>
                            <label className="label-text">Country *</label>
                            <input {...register('country')} className="input-field" placeholder="e.g. United States" />
                        </div>
                        <div>
                            <label className="label-text">City/State *</label>
                            <input {...register('city_state')} className="input-field" placeholder="e.g. San Francisco, CA" />
                        </div>
                    </div>
                </div>

                {/* Section: Goals */}
                <div className="glass-card p-8 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Target className="text-purple-600 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Career Goals</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="label-text">Career Aspirations</label>
                            <textarea {...register('career_aspirations')} className="input-field min-h-[100px]" placeholder="Where do you see yourself in 3-5 years?" />
                        </div>
                        <div>
                            <label className="label-text">Specific Skills You Want to Develop</label>
                            <textarea {...register('skills_to_develop')} className="input-field min-h-[100px]" placeholder="e.g. Machine Learning, Public Speaking, Leadership..." />
                        </div>
                    </div>
                </div>

                {/* Section: Documents */}
                <div className="glass-card p-8 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Upload className="text-blue-600 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Documents (Optional)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Resume Upload */}
                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-colors text-center group">
                            <input
                                type="file"
                                accept=".pdf,.docx,.doc"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            toast.loading('Uploading Resume...', { id: 'upload-resume' });
                                            const url = await uploadFile('resumes', file);
                                            setProfile({ ...profile, resume_url: url });
                                            toast.success('Resume uploaded!', { id: 'upload-resume' });
                                        } catch (error) {
                                            console.error(error);
                                            toast.error('Upload failed', { id: 'upload-resume' });
                                        }
                                    }
                                }}
                            />
                            <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${profile.resume_url ? 'text-green-500' : 'text-gray-400 group-hover:text-primary-500'}`} />
                            <h4 className="font-bold text-gray-700 mb-1">{profile.resume_url ? 'Resume Uploaded' : 'Upload Resume'}</h4>
                            <p className="text-xs text-gray-500">{profile.resume_url ? 'Click to replace' : 'PDF, DOCX up to 5MB'}</p>
                        </div>

                        {/* Certificates Upload */}
                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-colors text-center group">
                            <input
                                type="file"
                                accept=".pdf,.jpg,.png"
                                multiple
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={async (e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        try {
                                            toast.loading('Uploading Certificates...', { id: 'upload-certs' });
                                            const urls = [];
                                            for (let i = 0; i < files.length; i++) {
                                                const url = await uploadFile('certificates', files[i]);
                                                urls.push(url);
                                            }
                                            // Append to existing certificates
                                            setProfile({
                                                ...profile,
                                                certificate_urls: [...(profile.certificate_urls || []), ...urls]
                                            });
                                            toast.success(`${files.length} Certificate(s) uploaded!`, { id: 'upload-certs' });
                                        } catch (error) {
                                            console.error(error);
                                            toast.error('Upload failed', { id: 'upload-certs' });
                                        }
                                    }
                                }}
                            />
                            <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${profile.certificate_urls && profile.certificate_urls.length > 0 ? 'text-green-500' : 'text-gray-400 group-hover:text-primary-500'}`} />
                            <h4 className="font-bold text-gray-700 mb-1">{profile.certificate_urls && profile.certificate_urls.length > 0 ? `${profile.certificate_urls.length} Certs Uploaded` : 'Upload Certificates'}</h4>
                            <p className="text-xs text-gray-500">{profile.certificate_urls?.length ? 'Click to add more' : 'PDF, JPG, PNG up to 5MB'}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <motion.button
                        type="submit"
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
                            <ArrowRight className="w-6 h-6" />
                        </div>
                        <motion.span
                            className="whitespace-nowrap font-bold pr-6 pl-1"
                            variants={{
                                initial: { opacity: 0 },
                                hover: { opacity: 1 }
                            }}
                        >
                            Continue to AI Assessment
                        </motion.span>
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

export default Step1UserInfo;
