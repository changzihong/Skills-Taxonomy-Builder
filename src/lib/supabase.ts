import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const saveProfile = async (profileData: any) => {
    // Generate a share_id if one doesn't exist (used for localStorage key)
    const shareId = profileData.share_id || ('local-' + Math.random().toString(36).substring(7));
    const dataWithId = { ...profileData, share_id: shareId };

    // Valid Supabase instance? Try that first.
    if (supabase) {
        try {
            // Check if exists
            if (profileData.share_id) {
                const { data, error } = await supabase
                    .from('profiles')
                    .update(dataWithId)
                    .eq('share_id', profileData.share_id)
                    .select()
                    .single();
                if (!error) return data;
            } else {
                const { data, error } = await supabase
                    .from('profiles')
                    .insert([dataWithId])
                    .select()
                    .single();
                if (!error) return data;
            }
        } catch (err) {
            console.warn("Supabase save failed, falling back to local storage", err);
        }
    }

    // Fallback: Save to LocalStorage so the link works on this device
    try {
        localStorage.setItem(`skillpath_profile_${shareId}`, JSON.stringify(dataWithId));
        return dataWithId;
    } catch (e) {
        console.error("Local storage save failed", e);
        return dataWithId;
    }
};

export const getProfileByShareId = async (shareId: string) => {
    // 1. Try Supabase
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('share_id', shareId)
                .single();

            if (data && !error) return data;
        } catch (err) {
            console.warn("Supabase fetch failed", err);
        }
    }

    // 2. Fallback: Try LocalStorage
    try {
        const localData = localStorage.getItem(`skillpath_profile_${shareId}`);
        if (localData) {
            return JSON.parse(localData);
        }
    } catch (e) {
        console.error("Local storage fetch failed", e);
    }

    return null;
};

export const uploadFile = async (bucket: string, file: File) => {
    if (!supabase) {
        console.warn("Supabase not configured, returning fake URL.");
        return `https://fake-url.com/${file.name}`;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return data.publicUrl;
};
