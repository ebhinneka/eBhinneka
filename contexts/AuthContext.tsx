
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Session } from '@supabase/supabase-js';
import { Profile } from '../types';

interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isOperator: boolean;
  signIn: (userId: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  academicYear: string;
  semester: string;
  semesterStart: string;
  semesterEnd: string;
  activeScheduleVersion: string;
  availableClasses: string[];
  refreshClasses: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [academicYear, setAcademicYear] = useState<string>('2025/2026');
  const [semester, setSemester] = useState<string>('Genap');
  const [semesterStart, setSemesterStart] = useState<string>('');
  const [semesterEnd, setSemesterEnd] = useState<string>('');
  const [activeScheduleVersion, setActiveScheduleVersion] = useState<string>('Utama');
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);

  
  const refreshClasses = async () => {
    try {
        if (!isSupabaseConfigured) return;
        let allData: any[] = [];
        let from = 0;
        let step = 1000;
        while (true) {
            const { data, error } = await supabase.from('students').select('kelas').range(from, from + step - 1);
            if (error) throw error;
            if (!data || data.length === 0) break;
            allData = allData.concat(data);
            if (data.length < step) break;
            from += step;
        }
        const classes = [...new Set(allData.map((d: any) => d.kelas).filter(Boolean))].sort() as string[];
        setAvailableClasses(classes);
    } catch (err) {
        console.error('Failed to fetch classes', err);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!isSupabaseConfigured) return;
        await refreshClasses();
        const { data } = await supabase.from('app_settings').select('key, value').in('key', ['academic_year', 'semester', 'active_schedule_version', 'semester_start', 'semester_end']);
        if (data) {
           data.forEach(item => {
               if (item.key === 'academic_year' && item.value) setAcademicYear(item.value);
               if (item.key === 'semester' && item.value) setSemester(item.value);
               if (item.key === 'active_schedule_version' && item.value) setActiveScheduleVersion(item.value);
               if (item.key === 'semester_start' && item.value) setSemesterStart(item.value);
               if (item.key === 'semester_end' && item.value) setSemesterEnd(item.value);
           });
        }
      } catch (e) {
          console.error("Error fetching settings for auth context", e);
      }
    };

    fetchSettings();

    const initAuth = async () => {
      // Prevent fetching if config is missing (avoids 404/Network Error loops)
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        // Check active session safely
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        if (session) {
          await fetchProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.warn("Auth initialization failed (likely no connection):", error);
        // Do not block app loading on auth error
        setIsLoading(false);
      }
    };

    initAuth();

    if (!isSupabaseConfigured) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      if (!isSupabaseConfigured) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) setProfile(data);
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setIsLoading(false);
    }
  };

      const signIn = async (userId: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: "Konfigurasi Supabase belum diset. Hubungi Admin." } };
    }

    const cleanId = userId.trim();
    const idOnly = cleanId.split('@')[0];
    const email = `${idOnly}@sekolah.id`; 

    let finalPassword = password;

    const result = await supabase.auth.signInWithPassword({ email, password: finalPassword });
    return result;
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      profile, 
      isLoading, 
      signIn,
      signOut,
      isAdmin: profile?.role === 'admin',
      isOperator: profile?.role === 'operator',
      academicYear,
        semester,
        semesterStart,
        semesterEnd,
        activeScheduleVersion,
      availableClasses,
      refreshClasses
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
