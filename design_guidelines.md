# Design Guidelines: Online Job Recruitment & Application Portal

## Design Approach

**Selected Approach**: Design System + Professional Reference
- Primary inspiration: LinkedIn's professional aesthetic with Material Design principles
- Focus: Clear information hierarchy, efficient workflows, role-based visual clarity
- Justification: Job portals require trust, professionalism, and information density with excellent usability

## Typography

**Font System** (Google Fonts via CDN):
- Primary: Inter (400, 500, 600, 700) - Clean, professional, excellent readability
- Monospace: JetBrains Mono (400, 500) - For job IDs, application numbers

**Type Scale**:
- Hero Headlines: text-4xl md:text-5xl font-bold
- Page Titles: text-3xl font-bold
- Section Headers: text-2xl font-semibold
- Card Titles: text-xl font-semibold
- Body Text: text-base (16px)
- Secondary/Meta: text-sm
- Captions: text-xs

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4, p-6
- Section spacing: py-8, py-12, py-16
- Card gaps: gap-4, gap-6
- Element margins: m-2, m-4, mb-6, mb-8

**Container Strategy**:
- Full-width: w-full with inner max-w-7xl mx-auto px-4
- Dashboard content: max-w-6xl mx-auto
- Forms: max-w-2xl mx-auto
- Job cards grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Core Components

### Navigation & Headers

**Public Navigation**:
- Fixed top navbar with logo left, nav links center, Login/Signup buttons right
- Height: h-16, backdrop blur on scroll
- Links: Horizontal with hover underline effect

**Dashboard Navigation**:
- Side navigation (w-64) with role-specific menu items
- User profile section at top with avatar, name, role badge
- Main content area with top bar showing page title and quick actions
- Mobile: Collapsible drawer navigation

### Hero Section (Landing Page)

**Layout**: Split hero design
- Left side (50%): Compelling headline, subheadline, dual CTA buttons (primary: "Find Jobs" / secondary: "Post a Job")
- Right side (50%): Professional hero image showing diverse professionals or office collaboration
- Height: min-h-[600px], not full viewport
- Background: Subtle gradient overlay

**Images**: Include professional stock photo of diverse professionals collaborating in modern office setting

### Job Cards

**Design**:
- Card with border, rounded-lg, shadow-sm, hover:shadow-md transition
- Company logo/icon top-left (w-12 h-12)
- Job title (text-xl font-semibold)
- Company name (text-sm text-gray-600)
- Location + Job type badges (rounded-full px-3 py-1 bg-blue-100)
- Salary range (text-base font-medium)
- Posted date (text-xs text-gray-500)
- "View Details" button bottom-right
- Card padding: p-6

### Forms

**Input Fields**:
- Label above input (text-sm font-medium mb-2)
- Input height: h-12, rounded-md border
- Focus: ring-2 ring-blue-500
- Error state: border-red-500 with error message below
- File upload: Dropzone style with dashed border, icon, and "Drag PDF or click to browse"

**Buttons**:
- Primary: px-6 py-3 rounded-md font-medium
- Secondary: px-6 py-3 rounded-md border-2 font-medium
- Icon buttons: p-2 rounded-full for actions

### Dashboard Components

**Stats Cards** (Admin/Employer dashboards):
- Grid of 3-4 cards showing key metrics
- Each card: p-6, rounded-lg, border
- Large number (text-3xl font-bold)
- Label below (text-sm text-gray-600)
- Icon top-right corner

**Data Tables**:
- Header row with sorting icons
- Alternating row backgrounds for readability
- Action buttons right-aligned in each row
- Pagination at bottom
- Row height: min-h-[60px]

**Application Status Badges**:
- Pill-shaped: rounded-full px-3 py-1 text-xs font-medium
- Pending: bg-yellow-100 text-yellow-800
- Reviewed: bg-blue-100 text-blue-800
- Accepted: bg-green-100 text-green-800
- Rejected: bg-red-100 text-red-800

### Role-Based Visual Identity

**Admin**: Blue accent throughout dashboard
**Employer**: Purple accent for employer-specific features
**Applicant**: Green accent for applicant features

Use accent in: badges, primary buttons, active nav items, progress indicators

## Multi-Page Structure

**Landing Page Sections** (in order):
1. Hero (split with image)
2. How It Works (3-column: Register → Browse/Post → Apply/Hire)
3. Featured Jobs (grid of 6 job cards)
4. For Employers (benefits of posting, CTA)
5. Testimonials (2-column layout)
6. Footer (comprehensive with links, social)

**Dashboard Layouts**:
- Sidebar (fixed left) + Main content area
- Breadcrumb navigation below top bar
- Page title with action button (e.g., "Create Job")
- Content cards/tables with consistent spacing

## Animations

**Use sparingly**:
- Card hover: Subtle shadow lift (transition-shadow duration-200)
- Button hover: Slight scale or background darkening
- Page transitions: None (instant navigation for efficiency)
- Form feedback: Success checkmark animation only

## Images

**Hero Section**: Professional office/team collaboration image (1200x800px minimum)
**Company Logos**: Placeholder circles or initials if no logo (w-12 h-12 rounded-full)
**Empty States**: Simple icon + message for "No jobs found" or "No applications yet"