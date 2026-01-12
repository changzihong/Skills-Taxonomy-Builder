# Product Requirements Document (PRD) v2.0

## Skills Taxonomy Builder

---

## 1. Product Overview

### 1.1 Product Name
Skills Taxonomy Builder

### 1.2 Product Description
Skills Taxonomy Builder is an AI-powered web application that helps professionals identify their current skills, discover skill gaps, and receive personalized learning recommendations to advance their careers. The application analyzes user information and provides tailored skill development plans with salary projections and shareable persona profiles.

### 1.3 Target Users
- Public users (professionals seeking career development)
- Individual contributors and managers across all industries
- Career changers and skill upgraders
- **No authentication required** - instant access for all users

### 1.4 Business Goals
- Help professionals identify and bridge skill gaps
- Provide data-driven career development recommendations
- Enable transparent skill-building conversations between employees and managers
- Create shareable, actionable skill development profiles

---

## 2. Technical Stack

### 2.1 Frontend
- **Framework**: Vite + React 18
- **Language**: TypeScript (recommended for type safety)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts/Visualizations**: Recharts, React Flow (for study plan visualization)
- **State Management**: React Context API + Zustand
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod validation

### 2.2 Backend & Database
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage
- **API**: Supabase Client SDK (direct from React, no separate backend)
- **Real-time**: Supabase Realtime (optional for future features)

### 2.3 AI Integration
- **Provider**: OpenAI API
- **Model**: gpt-4o-mini
- **API Key Management**: Environment variables (Vite: `VITE_OPENAI_API_KEY`)
- **API Calls**: Direct from frontend with proper error handling

### 2.4 Additional Libraries
- **PDF Generation**: jsPDF + html2canvas or React-PDF
- **File Upload**: React Dropzone
- **Date Handling**: date-fns
- **URL Shortening**: nanoid (for shareable profile IDs)
- **Notifications**: React Hot Toast or Sonner

---

## 3. Database Architecture (Supabase)

### 3.1 Database Schema

#### Table: `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_id VARCHAR(12) UNIQUE NOT NULL, -- Shareable link ID (e.g., 'abc123xyz')
  
  -- Personal Information
  full_name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 100),
  
  -- Professional Information
  job_title VARCHAR(255) NOT NULL,
  position_department VARCHAR(255) NOT NULL,
  industry_type VARCHAR(255) NOT NULL,
  company_size VARCHAR(50),
  years_of_experience INTEGER NOT NULL,
  
  -- Compensation & Location
  current_salary DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  country VARCHAR(100) NOT NULL,
  city_state VARCHAR(255) NOT NULL,
  
  -- Career Goals
  career_aspirations TEXT,
  skills_to_develop TEXT,
  
  -- File References
  resume_url TEXT,
  certificate_urls JSONB DEFAULT '[]',
  
  -- Assessment Data
  assessment_questions JSONB,
  assessment_answers JSONB,
  
  -- Skills Analysis
  current_skills JSONB,
  skill_gaps JSONB,
  recommendations JSONB,
  
  -- Learning Plan
  study_plan JSONB,
  recommended_courses JSONB,
  
  -- Salary Projection
  salary_projection JSONB,
  
  -- Persona Profile
  persona_profile_data JSONB,
  
  -- Sharing Settings
  share_password VARCHAR(255), -- Hashed password (optional)
  share_expiry TIMESTAMP WITH TIME ZONE,
  is_shareable BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  current_step INTEGER DEFAULT 1 CHECK (current_step >= 1 AND current_step <= 7)
);

-- Indexes
CREATE INDEX idx_share_id ON profiles(share_id);
CREATE INDEX idx_created_at ON profiles(created_at);
CREATE INDEX idx_share_expiry ON profiles(share_expiry);
```

#### Table: `profile_views` (Analytics - Optional)
```sql
CREATE TABLE profile_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET -- Store for analytics, hash for privacy
);

CREATE INDEX idx_profile_views_profile_id ON profile_views(profile_id);
```

### 3.2 Storage Buckets

#### Bucket: `resumes`
- **Purpose**: Store user resume uploads
- **File Types**: PDF, DOCX
- **Max Size**: 5MB per file
- **Access**: Public read (via signed URLs)

#### Bucket: `certificates`
- **Purpose**: Store user certificate uploads
- **File Types**: PDF, JPG, PNG
- **Max Size**: 5MB per file
- **Access**: Public read (via signed URLs)

### 3.3 Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (create new profile)
CREATE POLICY "Allow public insert" ON profiles
  FOR INSERT TO anon
  WITH CHECK (true);

-- Policy: Anyone can read if profile is shareable and not expired
CREATE POLICY "Allow public read shareable profiles" ON profiles
  FOR SELECT TO anon
  USING (
    is_shareable = true 
    AND (share_expiry IS NULL OR share_expiry > NOW())
  );

-- Policy: Allow updates only via share_id (no authentication)
CREATE POLICY "Allow update via share_id" ON profiles
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
```

### 3.4 Database Functions

```sql
-- Function: Increment view count
CREATE OR REPLACE FUNCTION increment_view_count(profile_share_id VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET view_count = view_count + 1 
  WHERE share_id = profile_share_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Generate unique share_id
CREATE OR REPLACE FUNCTION generate_share_id()
RETURNS VARCHAR AS $$
DECLARE
  new_id VARCHAR(12);
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_id := substring(md5(random()::text) from 1 for 12);
    SELECT EXISTS(SELECT 1 FROM profiles WHERE share_id = new_id) INTO id_exists;
    EXIT WHEN NOT id_exists;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. User Flow

```
Landing Page → User Information Form (Step 1) → 
AI Skill Assessment (Step 2) → Skill Gap Analysis (Step 3) → 
Learning Recommendations (Step 4) → Study Plan Visualization (Step 5) → 
Salary Projection (Step 6) → Persona Profile Generation (Step 7) → 
Share/Download
```

**No Login Required**: Users can immediately start the assessment and receive a unique shareable link upon completion.

---

## 5. Design System & UI/UX Guidelines

### 5.1 Design Principles

**Modern & Professional**
- Clean, spacious layouts with generous whitespace
- Contemporary typography with excellent hierarchy
- Sophisticated color palette with purpose-driven accents
- Glassmorphism and subtle gradients for depth

**Intuitive & Delightful**
- Smooth micro-interactions and transitions
- Progressive disclosure of information
- Clear visual feedback for all user actions
- Engaging but not distracting animations

**Accessible & Inclusive**
- WCAG 2.1 AA compliant contrast ratios
- Keyboard navigation support
- Screen reader friendly
- Responsive across all device sizes

### 5.2 Color Palette

#### Primary Colors
```css
/* Vibrant Purple (Trust, Growth) */
--primary-500: #8B5CF6;
--primary-600: #7C3AED;
--primary-700: #6D28D9;

/* Teal Accent (Innovation, Clarity) */
--accent-500: #14B8A6;
--accent-600: #0D9488;

/* Success Green */
--success-500: #10B981;
--success-600: #059669;
```

#### Neutral Colors
```css
/* Light Mode */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-700: #374151;
--gray-900: #111827;

/* Dark Mode */
--dark-bg: #0F172A;
--dark-surface: #1E293B;
--dark-border: #334155;
```

#### Gradient Backgrounds
```css
/* Hero gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Card hover gradient */
background: linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%);

/* Success gradient */
background: linear-gradient(135deg, #10B981 0%, #14B8A6 100%);
```

### 5.3 Typography

#### Font Stack
```css
/* Primary Font: Inter (sans-serif) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Headings: Plus Jakarta Sans (modern, geometric) */
font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;

/* Monospace: JetBrains Mono */
font-family: 'JetBrains Mono', 'Courier New', monospace;
```

#### Type Scale
```css
/* Hero Title */
font-size: 4rem (64px);
font-weight: 800;
line-height: 1.1;

/* Page Title */
font-size: 3rem (48px);
font-weight: 700;
line-height: 1.2;

/* Section Title */
font-size: 2rem (32px);
font-weight: 700;
line-height: 1.3;

/* Card Title */
font-size: 1.5rem (24px);
font-weight: 600;
line-height: 1.4;

/* Body Large */
font-size: 1.125rem (18px);
font-weight: 400;
line-height: 1.7;

/* Body Regular */
font-size: 1rem (16px);
font-weight: 400;
line-height: 1.6;

/* Small Text */
font-size: 0.875rem (14px);
font-weight: 400;
line-height: 1.5;
```

### 5.4 Spacing System
```css
/* Based on 8px base unit */
--space-1: 0.25rem (4px);
--space-2: 0.5rem (8px);
--space-3: 0.75rem (12px);
--space-4: 1rem (16px);
--space-6: 1.5rem (24px);
--space-8: 2rem (32px);
--space-12: 3rem (48px);
--space-16: 4rem (64px);
--space-24: 6rem (96px);
```

### 5.5 Border Radius
```css
--radius-sm: 0.375rem (6px);
--radius-md: 0.5rem (8px);
--radius-lg: 0.75rem (12px);
--radius-xl: 1rem (16px);
--radius-2xl: 1.5rem (24px);
--radius-full: 9999px;
```

### 5.6 Shadows
```css
/* Subtle elevation */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Card shadow */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 
             0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Elevated card */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 
             0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Modal/Dropdown */
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 
             0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Colored shadow for CTAs */
--shadow-primary: 0 10px 30px -5px rgb(139 92 246 / 0.3);
```

---

## 6. Page-by-Page Design Specifications

### 6.1 Landing Page

#### Layout Structure
```
┌─────────────────────────────────────────────────┐
│  Header (fixed)                                  │
├─────────────────────────────────────────────────┤
│  Hero Section (full viewport)                    │
│  - Animated gradient background                  │
│  - Headline + Subheadline                        │
│  - CTA Button (glowing effect)                   │
│  - Visual illustration (3D elements/animation)   │
├─────────────────────────────────────────────────┤
│  Features Section                                │
│  - 4 feature cards with icons + animations       │
│  - Hover effects with tilt/scale                 │
├─────────────────────────────────────────────────┤
│  How It Works Section                            │
│  - Vertical timeline with 7 steps                │
│  - Animated progress line                        │
│  - Step cards with illustrations                 │
├─────────────────────────────────────────────────┤
│  Trust & Stats Section                           │
│  - Counter animations for numbers                │
│  - Social proof elements                         │
├─────────────────────────────────────────────────┤
│  Final CTA Section                               │
│  - Bold gradient background                      │
│  - Large CTA button                              │
├─────────────────────────────────────────────────┤
│  Footer                                          │
└─────────────────────────────────────────────────┘
```

#### Hero Section
```jsx
Design Specs:
- Background: Animated gradient mesh (purple to teal)
- Headline: 64px, weight 800, white color
  "Build Your Career Roadmap with AI"
- Subheadline: 20px, weight 400, gray-100
  "Discover your skill gaps, get personalized learning plans, 
   and unlock your earning potential in minutes."
- CTA Button: 
  - Size: Large (56px height)
  - Background: Gradient (primary + accent)
  - Shadow: Glowing effect (shadow-primary)
  - Icon: Arrow right (animated on hover)
  - Text: "Start Your Journey — It's Free"
- Illustration: 
  - 3D isometric career ladder/growth chart
  - Floating skill icons with subtle animations
  - Particles or light effects in background
```

#### Features Cards
```jsx
Card Design:
- Background: White with subtle gradient border
- Padding: 32px
- Border Radius: 16px
- Shadow: shadow-md (hover: shadow-lg + scale 1.02)
- Hover Effect: Tilt animation (3D transform)

Each Card Contains:
- Icon: 64px, gradient background circle
  Icons: Brain (AI), Target (Skills), TrendingUp (Salary), Share (Profile)
- Title: 24px, weight 600, gray-900
- Description: 16px, weight 400, gray-600, 2-3 lines
- Micro-animation: Icon rotates/bounces on hover
```

#### How It Works Timeline
```jsx
Timeline Design:
- Vertical layout (mobile), Horizontal (desktop > 1024px)
- Progress line: 4px width, gradient color, animated fill on scroll
- Step circles: 80px diameter, white background, gradient border
- Step number inside circle: 32px, weight 700

Step Cards:
- Connected to timeline with animated line
- Alternating left/right (desktop)
- Background: Glassmorphism effect
  background: rgba(255, 255, 255, 0.8)
  backdrop-filter: blur(10px)
- Each step has:
  - Icon (48px)
  - Title (20px, weight 600)
  - Description (14px, gray-600)
  - Fade-in animation on scroll
```

#### Animations
```jsx
// Hero entrance
- Headline: Fade up + blur (0.8s delay 0.1s)
- Subheadline: Fade up + blur (0.8s delay 0.3s)
- CTA Button: Scale + fade (1s delay 0.5s)
- Illustration: Float animation (continuous)

// Scroll animations (using Intersection Observer)
- Feature cards: Stagger fade-in (each 0.1s apart)
- Timeline steps: Slide in from alternating sides
- Stats counters: Count-up animation when in view

// Hover animations
- CTA Button: Scale 1.05 + shadow expansion
- Feature cards: Tilt effect (transform: rotateX/Y)
- Timeline steps: Glow effect on hover
```

### 6.2 Step 1: User Information Form

#### Layout
```
┌─────────────────────────────────────────────────┐
│  Progress Bar (Step 1 of 7)                      │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐   │
│  │  Form Container (max-width: 800px)       │   │
│  │                                           │   │
│  │  Section: Personal Information           │   │
│  │  - Name input                             │   │
│  │  - Age input                              │   │
│  │                                           │   │
│  │  Section: Professional Information        │   │
│  │  - Job Title                              │   │
│  │  - Position/Department                    │   │
│  │  - Industry (searchable dropdown)         │   │
│  │  - Company Size                           │   │
│  │  - Years of Experience                    │   │
│  │                                           │   │
│  │  Section: Compensation & Location         │   │
│  │  - Salary + Currency (side by side)       │   │
│  │  - Country + City                         │   │
│  │                                           │   │
│  │  Section: Career Goals (Optional)         │   │
│  │  - Career Aspirations (textarea)          │   │
│  │  - Skills to Develop (textarea)           │   │
│  │                                           │   │
│  │  Section: Documents (Optional)            │   │
│  │  - Resume Upload (drag & drop)            │   │
│  │  - Certificates Upload                    │   │
│  │                                           │   │
│  │  [Save & Continue] Button                 │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

#### Progress Bar
```jsx
Design:
- Full width, fixed at top
- Height: 4px
- Background: gray-200
- Fill: Gradient (primary → accent)
- Percentage text: "Step 1 of 7 — Personal Information"
- Position: sticky top-0
- Animation: Smooth width transition

Below progress bar:
- Step indicators (7 circles)
- Current step: Filled with gradient, scale 1.2
- Completed steps: Filled with success color, checkmark icon
- Future steps: Gray outline
```

#### Form Sections
```jsx
Section Header:
- Title: 24px, weight 600, gray-900
- Description: 14px, gray-600
- Icon: 32px, gradient background
- Margin bottom: 24px

Input Fields:
- Height: 48px
- Border: 1px solid gray-300
- Border Radius: 8px
- Focus state: 
  - Border color: primary-500
  - Ring: 3px shadow with primary color (opacity 0.1)
  - Smooth transition
- Padding: 12px 16px
- Font size: 16px

Input Labels:
- Font size: 14px
- Weight: 500
- Color: gray-700
- Margin bottom: 6px
- Required indicator: Red asterisk

Placeholder Text:
- Color: gray-400
- Examples: "e.g., John Smith", "e.g., 28"
```

#### File Upload Component
```jsx
Dropzone Design:
- Border: 2px dashed gray-300
- Border radius: 12px
- Padding: 40px
- Background: gray-50
- Hover: 
  - Border color: primary-500
  - Background: primary-50
  - Cursor: pointer

Upload Icon:
- Size: 48px
- Color: gray-400
- Animation: Bounce on hover

Text:
- Primary: "Drag & drop your resume here"
- Secondary: "or click to browse (PDF, DOCX, max 5MB)"
- Font sizes: 16px / 14px

Uploaded File Display:
- Background: white
- Border: 1px solid gray-200
- Border radius: 8px
- Padding: 12px 16px
- File icon + name + size
- Remove button (X icon, hover: red)
```

#### Save & Continue Button
```jsx
Design:
- Width: Full width on mobile, auto on desktop
- Height: 56px
- Background: Gradient (primary → accent)
- Text: "Save & Continue" + Arrow icon
- Font: 18px, weight 600, white
- Border radius: 12px
- Shadow: shadow-lg
- Hover: 
  - Scale: 1.02
  - Shadow: shadow-xl
  - Arrow slides right 4px
- Disabled state:
  - Opacity: 0.5
  - Cursor: not-allowed
  - No hover effects
```

#### Validation & Error States
```jsx
Error Message:
- Color: red-600
- Font size: 14px
- Icon: Alert circle (16px)
- Margin top: 6px
- Fade in animation

Error Input Border:
- Border color: red-500
- Background: red-50

Success Input Border:
- Border color: success-500
- Checkmark icon (right side of input)
```

### 6.3 Step 2: AI Skill Assessment

#### Layout
```
┌─────────────────────────────────────────────────┐
│  Progress Bar (Step 2 of 7)                      │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐   │
│  │  Chat Container (max-width: 900px)       │   │
│  │                                           │   │
│  │  ┌────────────────────────────────────┐ │   │
│  │  │ AI Avatar + Welcome Message         │ │   │
│  │  │ "Hi John! I'll ask you a few        │ │   │
│  │  │  questions to understand your        │ │   │
│  │  │  current skills better..."           │ │   │
│  │  └────────────────────────────────────┘ │   │
│  │                                           │   │
│  │  ┌────────────────────────────────────┐ │   │
│  │  │ Question 1/8                         │ │   │
│  │  │ "Rate your proficiency in Python:"   │ │   │
│  │  │                                       │ │   │
│  │  │ [Beginner] [Intermediate]            │ │   │
│  │  │ [Advanced] [Expert]                  │ │   │
│  │  └────────────────────────────────────┘ │   │
│  │                                           │   │
│  │  ┌────────────────────────────────────┐ │   │
│  │  │ User's Answer                        │ │   │
│  │  │ "Intermediate"                       │ │   │
│  │  └────────────────────────────────────┘ │   │
│  │                                           │   │
│  │  [Skip] [Next Question] buttons          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

#### Chat Interface Design
```jsx
AI Message Bubble:
- Background: Gradient (light purple to light teal)
- Border radius: 16px 16px 16px 4px
- Padding: 20px 24px
- Max width: 80%
- Align: left
- Shadow: shadow-md
- Animation: Fade in + slide from left

AI Avatar:
- Size: 48px
- Background: Gradient circle (primary colors)
- Icon: Sparkles or Brain icon
- Position: Top left of message
- Pulse animation (subtle)

User Message Bubble:
- Background: gray-100
- Border radius: 16px 16px 4px 16px
- Padding: 16px 20px
- Max width: 70%
- Align: right
- Animation: Fade in + slide from right

Question Counter:
- Position: Top right of question
- Text: "Question 3 of 8"
- Font: 14px, weight 500
- Color: gray-600
- Badge style with rounded background
```

#### Question Types UI

**Multiple Choice:**
```jsx
Button Options:
- Width: Auto (inline) or full width (mobile)
- Height: 48px
- Border: 2px solid gray-200
- Border radius: 10px
- Padding: 12px 24px
- Background: white
- Hover:
  - Border color: primary-500
  - Background: primary-50
- Selected:
  - Border color: primary-500
  - Background: primary-100
  - Checkmark icon
  - Scale: 1.02
- Transition: all 0.2s ease
```

**Rating Scale (1-5):**
```jsx
Star Rating / Slider Design:
- 5 stars or circular buttons
- Size: 48px each
- Color: gray-300 (inactive), primary-500 (active)
- Hover: Scale 1.1 + color change
- Animation: Fill animation left to right
```

**Text Input:**
```jsx
Textarea Design:
- Min height: 120px
- Border: 2px solid gray-200
- Border radius: 12px
- Padding: 16px
- Font size: 16px
- Focus: Border primary-500, ring effect
- Character counter: Bottom right (gray-500)
- Resize: Vertical only
```

#### Loading State (While AI Generates Next Question)
```jsx
Loading Indicator:
- Three dots animation (bouncing)
- Colors: Cycle through gradient
- Text: "Analyzing your answer..."
- Position: Center of new message bubble
- Background: Same as AI message
```

#### Action Buttons
```jsx
Skip Button:
- Background: Transparent
- Border: 1px solid gray-300
- Color: gray-600
- Hover: Background gray-100

Next Question Button:
- Background: Gradient (primary)
- Color: white
- Icon: Arrow right
- Disabled until answer selected
- Hover: Scale 1.03 + shadow

Finish Assessment Button (Last question):
- Background: Gradient (success colors)
- Text: "Complete Assessment"
- Icon: Check circle
- Larger size (height: 56px)
```

### 6.4 Step 3: Skill Gap Analysis

#### Layout
```
┌─────────────────────────────────────────────────┐
│  Progress Bar (Step 3 of 7)                      │
├─────────────────────────────────────────────────┤
│  Page Header                                     │
│  "Your Skills Analysis"                          │
├─────────────────────────────────────────────────┤
│  ┌────────────────┬─────────────────────────┐  │
│  │ Current Skills │ Skill Gaps              │  │
│  │ (Left Panel)   │ (Right Panel)           │  │
│  │                │                         │  │
│  │ ✓ Python       │ ⚠ Machine Learning      │  │
│  │   Advanced     │   Priority: High        │  │
│  │                │   Impact: +12% salary   │  │
│  │ ✓ Leadership   │                         │  │
│  │   Expert       │ ⚠ Cloud Computing       │  │
│  │                │   Priority: Medium      │  │
│  └────────────────┴─────────────────────────┘  │
│                                                  │
│  Detailed Recommendations Section               │
│  (Expandable cards for each skill gap)          │
│                                                  │
│  [Continue to Learning Resources] button        │
└─────────────────────────────────────────────────┘
```

#### Page Header
```jsx
Design:
- Background: Gradient mesh (subtle)
- Padding: 48px 0
- Title: 48px, weight 700
- Subtitle: 18px, gray-600
  "Based on your profile and assessment, here's what we found"
- Illustration: Skills matrix visualization (right side)
```

#### Skills Panel Layout (Desktop)
```jsx
Two Column Grid:
- Gap: 24px
- Current Skills (Left): 40% width
- Skill Gaps (Right): 60% width
- Mobile: Stack vertically

Panel Container:
- Background: White
- Border radius: 16px
- Padding: 32px
- Shadow: shadow-lg
- Border: 1px solid gray-200
```

#### Current Skills Display
```jsx
Skill Card:
- Background: Gradient (light, based on proficiency)
  - Beginner: Yellow gradient
  - Intermediate: Blue gradient
  - Advanced: Purple gradient
  - Expert: Gold gradient
- Border radius: 12px
- Padding: 16px 20px
- Margin bottom: 12px

Content:
- Skill name: 18px, weight 600, gray-900
- Proficiency badge: 
  - Pill shape, colored background
  - 14px, weight 500
- Icon: Checkmark circle (success-500)
- Progress bar below: Shows proficiency level visually

Animation:
- Stagger fade-in (each card 0.1s delay)
- Hover: Slight scale (1.02) + shadow increase
```

#### Skill Gap Cards
```jsx
Card Design:
- Background: White
- Border: 2px solid (color based on priority)
  - High: red-300
  - Medium: orange-300
  - Low: yellow-300
- Border radius: 12px
- Padding: 24px
- Margin bottom: 16px
- Shadow: shadow-md
- Hover: shadow-lg + translate up 2px

Header:
- Skill name: 20px, weight 600, gray-900
- Priority badge: Top right corner