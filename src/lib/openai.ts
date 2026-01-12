import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const openai = new OpenAI({
    apiKey: apiKey || 'dummy-key',
    dangerouslyAllowBrowser: true
});

export const isAIEnabled = !!apiKey;

export const generateQuestions = async (profile: any) => {
    if (!isAIEnabled) {
        // Return mock questions if no API key
        return [
            { id: 1, text: `Based on your role as ${profile.job_title}, how would you rate your proficiency in core technical skills?`, type: 'rating' },
            { id: 2, text: "Which of these advanced tools have you used in the past year?", type: 'multiple', options: ['Cloud Services', 'Data Visualization', 'DevOps Pipelines', 'AI/ML Libraries'] },
            { id: 3, text: "Describe a complex project you led recently.", type: 'text' }
        ];
    }

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are an expert career coach. Based on the user's profile, generate 5-8 assessment questions to evaluate their skills and find gaps. Return JSON format: { questions: [{ id: number, text: string, type: 'rating' | 'multiple' | 'text', options?: string[] }] }"
            },
            {
                role: "user",
                content: JSON.stringify(profile)
            }
        ],
        response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content!).questions;
};

export const analyzeSkills = async (profile: any, answers: any) => {
    // Generate dynamic mock data based on profile inputs
    // This ensures "dummy data" feels personalized even without AI
    const generateSmartMock = () => {
        const title = profile.job_title || 'Professional';
        const skills = profile.current_skills?.length ? profile.current_skills : ['Core Skills'];

        return {
            current_skills: skills.map((s: string) => ({
                name: s,
                level: 'Intermediate',
                relevant: true
            })),
            skill_gaps: [
                { name: `Advanced ${title} Patterns`, priority: 'High', impact: '+20% salary' },
                { name: 'Technical Leadership', priority: 'Medium', impact: '+15% salary' },
                { name: 'Cloud Architecture', priority: 'Medium', impact: '+12% salary' }
            ],
            recommendations: `To advance as a ${title}, you should focus on deepening your expertise in ${skills[0] || 'your core skills'} while expanding into architectural concepts. The Malaysian market is currently valuing end-to-end ownership highly.`,
            study_plan: [
                { phase: 'Month 1', goal: `${title} Fundamentals`, steps: [`Master advanced patterns in ${skills[0] || 'core technologies'}`, 'Review industry best practices'] },
                { phase: 'Month 2', goal: 'Architecture & Scale', steps: ['Learn system design principles', 'Understand cloud deployment models'] },
                { phase: 'Month 3', goal: 'Leadership', steps: ['Mentoring junior developers', 'Technical strategy documentation'] }
            ],
            recommended_courses: [
                { title: `Advanced ${title} Masterclass`, platform: 'Udemy', rating: 4.8, duration: '20 hours', type: 'Course', url: `https://www.google.com/search?q=Advanced+${title}+Masterclass+Udemy` },
                { title: 'System Design for Senior Engineers', platform: 'Coursera', rating: 4.7, duration: '4 weeks', type: 'Specialization', url: 'https://www.google.com/search?q=System+Design+Specialization+Coursera' },
                { title: 'Technical Leadership', platform: 'Pluralsight', rating: 4.9, duration: '10 hours', type: 'Course', url: 'https://www.google.com/search?q=Technical+Leadership+Pluralsight' }
            ],
            salary_projection: {
                current: profile.current_salary || 5000,
                projected: (profile.current_salary || 5000) * 1.25,
                reason: `Specializing in high-demand areas within ${title} typically commands a 25% premium in the current market.`,
                reference: 'JobStreet Malaysia Salary Report 2024'
            },
            persona_profile_data: {
                title: `The Strategic ${title}`,
                traits: ['Growth-Minded', 'Technical', 'Problem-Solver'],
                summary: `You are a dedicated ${title} with a clear vision for growth. Your focus on bridging technical execution with strategic understanding positions you well for senior roles.`
            }
        };
    };

    if (!isAIEnabled) {
        return generateSmartMock();
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an expert career analyst specializing in the Malaysian job market. Analyze the user's profile, including their self-reported skills and assessment answers.
                    
                    You MUST return a JSON object with the following structure:
                    {
                      "current_skills": [{"name": "string", "level": "Beginner" | "Intermediate" | "Advanced" | "Expert", "relevant": boolean}],
                      "skill_gaps": [{"name": "string", "priority": "Low" | "Medium" | "High", "impact": "string (e.g. +10% salary)"}],
                      "recommendations": "string (strategic overview focused on Malaysia market trends)",
                      "study_plan": [{"phase": "string", "goal": "string", "steps": ["string (detailed actionable step, e.g. 'Build a microservice using Docker')"]}],
                      "recommended_courses": [{"title": "string", "platform": "string", "rating": number, "duration": "string", "type": "Course" | "Certification", "url": "string (valid URL or search link)"}],
                      "salary_projection": {"current": number, "projected": number, "reason": "string", "reference": "string (Source of data, e.g. JobStreet 2024, Hays Asia)"},
                      "persona_profile_data": {"title": "string", "traits": ["string"], "summary": "string"}
                    }
                    
                    IMPORTANT:
                    1. **Salary**: Must be in MYR. Cite a reputable Malaysian source (JobStreet, Hays, Michael Page) in the 'reference' field. Explain CAUSALITY in 'reason' (e.g. "Mastering X reduces operational risk, justifying a 20% premium").
                    2. **Courses**: Provide REAL URLs if possible, otherwise use Google Search Query URLs (e.g. https://www.google.com/search?q=course+name). Prioritize "Video" content (YouTube, Coursera Clips).
                    3. **Context**: Use the user's "current_responsibilities" to tailor advice. If they do X, suggest how to move to Y.
                    4. **Skill Validation**: Check if the user's "current_skills" inputs are relevant to their "job_title". Set "relevant": false for skills that are clearly outliers or hobbies not useful for the career.
                    5. **Market Context**: Ensure insights are specific to Malaysia (KL, Penang, Remote).
                    6. **Personalization**: Use the user's Name and Job Title in the summary and recommendations.`
                },
                {
                    role: "user",
                    content: JSON.stringify({ profile, answers })
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content returned from OpenAI");
        return JSON.parse(content);

    } catch (error) {
        console.error("OpenAI Analysis Failed, falling back to smart mock:", error);
        return generateSmartMock();
    }
};
