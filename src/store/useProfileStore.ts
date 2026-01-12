import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProfileData {
    full_name: string;
    age: number;
    job_title: string;
    position_department: string;
    current_responsibilities: string; // Added field
    industry_type: string;
    company_size: string;
    years_of_experience: number;
    current_salary: number;
    currency: string;
    country: string;
    city_state: string;
    career_aspirations: string;
    skills_to_develop: string;
    certificate_urls: string[];
    resume_url: string;
    assessment_questions: any[];
    assessment_answers: any[];
    current_step: number;
    // Analysis Results
    current_skills: any[];
    skill_gaps: any[];
    recommendations: string;
    study_plan: any[];
    recommended_courses: any[];
    salary_projection: any;
    persona_profile_data: any;
    share_id?: string;
}

interface ProfileState {
    profile: ProfileData;
    setProfile: (data: Partial<ProfileData>) => void;
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: number) => void;
    reset: () => void;
}

const initialProfile: ProfileData = {
    full_name: '',
    age: 25,
    job_title: '',
    position_department: '',
    current_responsibilities: '',
    industry_type: '',
    company_size: 'Small',
    years_of_experience: 0,
    current_salary: 0,
    currency: 'MYR',
    country: 'Malaysia',
    city_state: 'Kuala Lumpur',
    career_aspirations: '',
    skills_to_develop: '',
    certificate_urls: [],
    resume_url: '',
    assessment_questions: [],
    assessment_answers: [],
    current_step: 1,
    current_skills: [],
    skill_gaps: [],
    recommendations: '',
    study_plan: [],
    recommended_courses: [],
    salary_projection: null,
    persona_profile_data: null
};

export const useProfileStore = create<ProfileState>((set) => ({
    profile: initialProfile,
    setProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
    nextStep: () => set((state) => ({ profile: { ...state.profile, current_step: state.profile.current_step + 1 } })),
    prevStep: () => set((state) => ({ profile: { ...state.profile, current_step: Math.max(1, state.profile.current_step - 1) } })),
    setStep: (step) => set((state) => ({ profile: { ...state.profile, current_step: step } })),
    reset: () => set({ profile: initialProfile }),
}));
