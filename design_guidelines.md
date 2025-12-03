# AI Life OS - Design Guidelines

## Design Approach

**Selected Framework:** Material Design principles with Linear-inspired minimalism
**Rationale:** Productivity-focused web application requiring information density, consistent patterns, and mobile optimization. Material Design provides robust component standards while Linear's aesthetic ensures visual clarity and speed.

**Key Design Principles:**
- Information hierarchy over decoration
- Immediate clarity and scannability
- Calm, distraction-free productivity environment
- Mobile-first with bottom navigation paradigm

---

## Typography System

**Font Family:** Inter (primary), SF Pro Display (fallback)

**Hierarchy:**
- **Page Titles:** 2xl (24px), font-semibold
- **Section Headers:** xl (20px), font-semibold  
- **Card Titles:** lg (18px), font-medium
- **Body Text:** base (16px), font-normal
- **Metadata/Labels:** sm (14px), font-medium
- **Helper Text:** xs (12px), font-normal

**Line Height:** Relaxed (1.6) for body, tight (1.2) for headings

---

## Layout & Spacing System

**Tailwind Spacing Units:** Consistently use 2, 4, 6, 8, 12, 16, 20, 24

**Container Structure:**
- Max-width: max-w-7xl for desktop
- Padding: px-4 (mobile), px-6 (tablet), px-8 (desktop)
- Vertical spacing between sections: space-y-8 (mobile), space-y-12 (desktop)

**Card/Component Spacing:**
- Internal padding: p-6 (cards), p-4 (compact items)
- Gap between elements: gap-4 (standard), gap-6 (generous)
- Margin bottom for stacked elements: mb-6 or mb-8

**Bottom Navigation:** 
- Fixed height: h-16
- Safe area padding: pb-safe (iOS notch handling)
- Content bottom padding: pb-24 to prevent overlap

---

## Component Library

### Navigation
**Bottom Nav Bar (Mobile Primary):**
- 5 icons: Dashboard, Tasks, Notes, Focus, Profile
- Icon size: w-6 h-6
- Active state: filled icon + label below
- Inactive: outline icon, muted label
- Centered alignment with equal spacing

**Top Bar (Desktop/Tablet):**
- Left: App logo + name
- Center: Search bar (when applicable)
- Right: User profile avatar + quick actions

### Dashboard Components
**Greeting Card:**
- Full-width, mb-8
- Dynamic greeting based on time
- Motivational quote rotation
- Stats row: Total tasks, Focus time today, Notes count

**Quick Stats Grid:**
- 3-column grid on desktop (grid-cols-3)
- Single column on mobile
- Each stat: Large number (3xl, font-bold), small label below
- Subtle background with rounded corners (rounded-xl)

**Upcoming Tasks Preview:**
- List of next 5 tasks
- Checkbox + title + due time
- "View All" link at bottom

**Focus Session Prompt:**
- CTA card with timer icon
- "Start 25-min Focus" primary button
- Last session summary (if exists)

### Task Management
**Task List:**
- Checkbox (left), title (flex-grow), priority badge, due date (right)
- Hover state: subtle background
- Completed: line-through text, reduced opacity
- Group by: Today, Tomorrow, Later sections

**Task Input:**
- Large textarea with placeholder: "What do you need to do? (AI will organize it)"
- "Add with AI" primary button
- Shows AI parsing in real-time

**Filters/Tabs:**
- Horizontal pill tabs: All, Active, Completed
- Count badges on each tab

### Notes Interface
**Notes Grid:**
- Masonry-style or standard grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each card: Title (truncated), preview (3 lines), timestamp, "Summarize" action
- Click to expand full note

**Note Editor:**
- Full-width textarea, minimal styling
- Bottom toolbar: Save, Summarize with AI, Delete
- Character count (optional helper)

### Focus Mode
**Timer Display:**
- Centered, extra-large numbers (6xl or 7xl)
- Circular progress ring around timer
- Start/Pause button below
- Session type indicator: "Deep Focus Session"

**Session Controls:**
- Skip break button
- End session early
- Settings gear (adjust duration)

**Session History:**
- Timeline view of past sessions
- Date, duration, tasks completed during session

### Content Planner
**Idea Generator Form:**
- Topic input field
- Platform selector: YouTube / Shorts / Reels (toggle buttons)
- "Generate Ideas" primary button

**Ideas Board:**
- Card grid (2-3 columns)
- Each idea: Title, description, platform icon, save/favorite action
- Regenerate button for new batch

### Profile/Settings
**User Section:**
- Avatar (large, centered or left)
- Name, email
- Member since date

**Settings Sections:**
- Grouped in cards: Account, Preferences, Focus Settings, AI Settings
- Toggle switches for boolean options
- Dropdowns for selections

---

## Design Specifications

### Cards & Containers
- Border radius: rounded-lg (8px) for cards, rounded-xl (12px) for prominent sections
- Elevation: subtle shadow (shadow-sm for cards, shadow-md for modals)
- Borders: 1px solid, very subtle

### Buttons
**Primary Action:**
- Rounded-lg, px-6, py-3
- Font: font-medium, text-base
- Full-width on mobile, auto-width on desktop

**Secondary:**
- Outlined style or ghost
- Same dimensions as primary

**Icon Buttons:**
- Square (w-10 h-10), centered icon
- Rounded-full for floating actions

### Form Inputs
- Height: h-12 (48px touch target)
- Padding: px-4
- Border radius: rounded-lg
- Focus state: ring-2 offset

### Badges & Tags
- Small (px-2 py-1), rounded-full
- Text: xs, font-medium
- Use for: Priority (High/Medium/Low), Categories, Status

### Empty States
- Centered icon (large, w-16 h-16)
- Heading below icon
- Descriptive text
- Primary action button

---

## Mobile Optimization

**Bottom Navigation Specifics:**
- Always visible, z-index ensures stays on top
- Content padding-bottom accounts for nav height
- Smooth transitions between pages
- Active page highlights current section

**Responsive Breakpoints:**
- Mobile: < 768px (single column, bottom nav)
- Tablet: 768px - 1024px (2 columns where appropriate)
- Desktop: > 1024px (3+ columns, side navigation optional)

**Touch Targets:**
- Minimum 44px height for all interactive elements
- Generous padding around clickable areas
- Swipe gestures: Swipe to delete tasks, swipe between tabs

---

## Animations & Interactions

**Micro-interactions (Minimal):**
- Task completion: subtle checkmark animation
- Timer countdown: smooth number transitions
- Page transitions: fade (150ms duration)
- Focus mode start: brief "centering" animation

**Loading States:**
- Skeleton loaders for content areas
- Spinner for AI processing
- Progress bar for focus timer

**Avoid:** Heavy animations, parallax, decorative motion

---

## Images

**No hero images required** - this is a productivity app, not marketing site.

**Icon Usage:**
- Use Heroicons (outline for inactive, solid for active states)
- Consistent 24px size throughout
- Dashboard: Stats icons (CheckCircle, Clock, DocumentText)
- Bottom nav: Home, ListBullet, DocumentDuplicate, Clock, User icons

---

## Accessibility

- Maintain ARIA labels on all interactive elements
- Form inputs have associated labels (not just placeholders)
- Color contrast meets WCAG AA standards minimum
- Keyboard navigation fully supported
- Focus indicators visible on all interactive elements

---

This design creates a **clean, focused productivity environment** that prioritizes function over decoration while maintaining visual polish through consistent spacing, clear hierarchy, and thoughtful component design.