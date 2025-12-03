# AI Life OS

## Overview

AI Life OS is a productivity-focused web application designed for students and creators to manage tasks, notes, focus sessions, and content ideas. The application leverages AI (OpenAI GPT-5) to parse natural language inputs, generate summaries, create content ideas, and optimize daily schedules. Built with a mobile-first approach, it features a bottom navigation paradigm and follows Material Design principles with Linear-inspired minimalism.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui (Radix UI primitives with Tailwind CSS)
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite with React plugin

**Design System**:
- Typography: Inter font family with hierarchical sizing (xs to 2xl)
- Spacing: Tailwind units (2, 4, 6, 8, 12, 16, 20, 24)
- Mobile-first layout with bottom navigation (fixed h-16)
- Theme support: Light/dark mode with system preference detection
- Color system: HSL-based custom properties for consistent theming

**Key Pages**:
- Landing: Unauthenticated homepage
- Dashboard: Overview with motivational quotes, task summary, and recent activity
- Tasks: AI-powered task creation and management with filtering
- Notes: Note-taking with AI summarization
- Focus: Pomodoro timer (25-minute sessions) with session tracking
- Content: AI-generated content ideas for YouTube, Shorts, and Reels
- Profile: User stats and daily AI-generated summaries

### Backend Architecture

**Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Build Process**: esbuild for server bundling, Vite for client
- **Development**: tsx for TypeScript execution, hot module replacement via Vite

**API Design**:
- RESTful endpoints under `/api/*`
- Authentication-protected routes using middleware
- JSON request/response format
- Error handling with structured error messages

**Session Management**:
- Express sessions with PostgreSQL store (connect-pg-simple)
- Session TTL: 7 days
- HttpOnly, secure cookies in production

### Database Architecture

**ORM**: Drizzle ORM with Neon serverless PostgreSQL driver
- **Schema Location**: `shared/schema.ts`
- **Migration Tool**: drizzle-kit
- **Database**: PostgreSQL (Neon serverless)

**Core Tables**:
- `users`: User profiles (id, email, firstName, lastName, profileImageUrl)
- `tasks`: Task management (title, description, priority, category, dueDate, completed)
- `notes`: Note storage (title, content, aiSummary)
- `focusSessions`: Pomodoro session tracking (duration, completedDuration, completed)
- `contentIdeas`: AI-generated ideas (platform, niche, idea, saved)
- `dailySummaries`: AI-generated daily recaps (summary, tasksCompleted, focusMinutes)
- `aiLogs`: AI interaction logging (operation, inputTokens, outputTokens)
- `sessions`: Express session storage

**Relationships**:
- All content tables reference `users.id` with cascade delete
- Foreign keys ensure referential integrity

### Authentication & Authorization

**Provider**: Replit Auth (OpenID Connect)
- **Strategy**: Passport.js with OIDC strategy
- **Session Store**: PostgreSQL-backed sessions
- **User Management**: Automatic user creation/update on login
- **Token Refresh**: Automatic refresh token handling

**Protected Routes**:
- All `/api/*` endpoints require authentication (except `/api/login`, `/api/logout`)
- Client-side auth check via `/api/auth/user` query
- Unauthorized errors (401) trigger redirect to login

### AI Integration

**Provider**: OpenAI (GPT-5 model)
- **API Key**: Environment variable `OPENAI_API_KEY`

**AI Features**:
1. **Task Parsing**: Natural language → structured tasks (title, description, priority, category, dueDate)
2. **Note Summarization**: Extract key points from note content
3. **Content Idea Generation**: Generate platform-specific content ideas (YouTube, Shorts, Reels)
4. **Daily Summaries**: Aggregate user activity into motivational summaries
5. **Schedule Optimization**: Generate optimized schedules based on tasks and free time

**Response Format**: JSON mode for structured outputs

**Usage Logging**: All AI operations logged to `aiLogs` table (operation type, token counts, cost tracking)

## External Dependencies

### Third-Party Services

1. **Database**: Neon Serverless PostgreSQL
   - Connection via `DATABASE_URL` environment variable
   - WebSocket support for serverless environments

2. **Authentication**: Replit Auth (OIDC)
   - `ISSUER_URL`: OpenID Connect provider
   - `REPL_ID`: Application identifier
   - `SESSION_SECRET`: Session encryption key

3. **AI Provider**: OpenAI
   - `OPENAI_API_KEY`: API authentication
   - Model: GPT-5 (latest as of August 2025)

### Key NPM Packages

**UI/Frontend**:
- `@radix-ui/*`: Accessible UI primitives (dialogs, dropdowns, tabs, etc.)
- `@tanstack/react-query`: Server state management
- `tailwindcss`: Utility-first CSS framework
- `wouter`: Lightweight routing
- `date-fns`: Date formatting and manipulation

**Backend**:
- `express`: Web server framework
- `passport`: Authentication middleware
- `openid-client`: OIDC authentication
- `drizzle-orm`: Type-safe ORM
- `@neondatabase/serverless`: Neon PostgreSQL driver

**Build Tools**:
- `vite`: Frontend build tool and dev server
- `esbuild`: Server bundling
- `tsx`: TypeScript execution

### Environment Variables

Required:
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key
- `SESSION_SECRET`: Session encryption secret
- `REPL_ID`: Replit application ID (for auth)
- `ISSUER_URL`: OIDC provider URL (defaults to `https://replit.com/oidc`)

Optional:
- `NODE_ENV`: Environment (development/production)