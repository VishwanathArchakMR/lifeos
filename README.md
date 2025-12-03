# LifeOS - Personal Operating System

A full-stack web application for personal operating system management and life organization with AI-powered features.

## 🚀 Features

- **Personal Dashboard**: Unified interface for managing your digital life
- **AI-Powered Insights**: OpenAI integration for smart recommendations
- **Task & Project Management**: Organize your work with ease
- **Authentication**: Secure OAuth2 and OpenID Connect support
- **Real-time Updates**: WebSocket support for live notifications
- **Database**: Neon serverless PostgreSQL with Drizzle ORM
- **Modern UI**: Built with React, Tailwind CSS, and Radix UI components

## 🛠️ Tech Stack

### Frontend
- **React 18.3** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Radix UI** for accessible component library
- **React Hook Form** for form management
- **TanStack React Query** for data fetching

### Backend
- **Express.js** with TypeScript
- **Node.js** runtime
- **Neon PostgreSQL** serverless database
- **Drizzle ORM** for type-safe database operations
- **Passport.js** for authentication
- **WebSocket** support with ws library

### Deployment
- **Vercel** for frontend hosting
- **Node.js** for backend (can use Vercel serverless functions)

## 📁 Project Structure

```
lifeos/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── main.tsx       # Entry point
│   │   ├── App.tsx        # Root component
│   │   └── components/    # React components
│   └── public/            # Static assets
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database config
│   └── auth/              # Authentication logic
├── shared/                 # Shared types and utilities
├── script/                 # Build scripts
├── vercel.json            # Vercel deployment config
├── .env.example           # Environment variables template
└── package.json           # Project dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/VishwanathArchakMR/lifeos.git
cd lifeos
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual configuration:
- `NEON_DATABASE_URL`: Your Neon PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `JWT_SECRET`: Secure random string for JWT signing

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

### Building

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm run start
```

## 📋 Environment Variables

See `.env.example` for a complete list of environment variables needed.

### Key Variables:
- `NEON_DATABASE_URL`: PostgreSQL connection URL
- `VITE_API_URL`: Backend API URL for frontend
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `JWT_SECRET`: Secret for signing JWT tokens
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)

## 🔐 Security

- ✅ Environment variables for sensitive data
- ✅ JWT-based authentication
- ✅ CORS configuration
- ✅ SQL injection prevention with Drizzle ORM
- ✅ Password hashing and salting

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The `vercel.json` file is pre-configured for:
- Frontend build with Vite
- Static file serving
- API route proxying

**Note**: This configuration deploys the frontend to Vercel. For the backend:
- Option 1: Deploy backend separately to Railway, Render, or Heroku
- Option 2: Use Vercel serverless functions for API routes

## 📊 Database

The project uses Neon serverless PostgreSQL with Drizzle ORM.

### Running migrations:
```bash
npm run db:push
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**VishwanathArchakMR**
- GitHub: [@VishwanathArchakMR](https://github.com/VishwanathArchakMR)

## 🙏 Acknowledgments

- Radix UI for component library
- Vercel for deployment platform
- Neon for serverless PostgreSQL
- OpenAI for AI capabilities

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review `replit.md` for local development notes
