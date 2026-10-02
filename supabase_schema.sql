-- =================================================================
-- CampusLink PostgreSQL / Supabase DDL Database Schema
-- Run this script in the Supabase Dashboard -> SQL Editor
-- =================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INSTITUTIONS TABLE
CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL,
  domain TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROFILES TABLE (Students & Faculty)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'faculty')) NOT NULL DEFAULT 'student',
  institution_id UUID REFERENCES public.institutions(id),
  department TEXT NOT NULL,
  degree TEXT,
  verification_code TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  availability TEXT DEFAULT 'Weekends',
  contribution_score INTEGER DEFAULT 0,
  xp_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. QUESTIONS TABLE (Q&A Forum)
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_anonymous BOOLEAN DEFAULT FALSE,
  upvotes INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ANSWERS TABLE
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT FALSE,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  institution_id UUID REFERENCES public.institutions(id),
  category TEXT NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  open_roles TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('Recruiting', 'In Progress', 'Completed')) DEFAULT 'Recruiting',
  team_size_limit INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PROJECT APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.project_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_applied TEXT NOT NULL,
  pitch TEXT NOT NULL,
  status TEXT CHECK (status IN ('Pending', 'Accepted', 'Rejected')) DEFAULT 'Pending',
  match_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, applicant_id)
);

-- 7. MENTORSHIP SLOTS TABLE (Faculty)
CREATE TABLE IF NOT EXISTS public.mentorship_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  available_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  max_capacity INTEGER DEFAULT 1,
  booked_count INTEGER DEFAULT 0,
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. MENTORSHIP BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.mentorship_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_id UUID REFERENCES public.mentorship_slots(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  status TEXT CHECK (status IN ('Confirmed', 'Cancelled', 'Completed')) DEFAULT 'Confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Helper RPC function to safely increment question answer counts
CREATE OR REPLACE FUNCTION increment_answers_count(q_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.questions
  SET answers_count = answers_count + 1
  WHERE id = q_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_bookings ENABLE ROW LEVEL SECURITY;

-- Default Permissive RLS Policies (For Development / Prototype Access)
CREATE POLICY "Public profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Questions viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Auth users can post questions" ON public.questions FOR INSERT WITH CHECK (true);

CREATE POLICY "Answers viewable by everyone" ON public.answers FOR SELECT USING (true);
CREATE POLICY "Auth users can post answers" ON public.answers FOR INSERT WITH CHECK (true);

CREATE POLICY "Projects viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Auth users can post projects" ON public.projects FOR INSERT WITH CHECK (true);

CREATE POLICY "Applications viewable by everyone" ON public.project_applications FOR SELECT USING (true);
CREATE POLICY "Auth users can submit applications" ON public.project_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Mentorship slots viewable by everyone" ON public.mentorship_slots FOR SELECT USING (true);
CREATE POLICY "Mentorship bookings viewable by everyone" ON public.mentorship_bookings FOR SELECT USING (true);
