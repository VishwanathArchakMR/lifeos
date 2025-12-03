# LifeOS - Vercel Deployment Guide

Complete step-by-step guide to deploy LifeOS frontend to Vercel and set up backend services.

## 📋 Pre-Deployment Checklist

- [ ] All code committed to GitHub
- [ ] Environment variables documented in `.env.example`
- [ ] `vercel.json` configured
- [ ] `.vercelignore` file in place
- [ ] README.md updated
- [ ] Database migrations tested locally
- [ ] Backend API endpoints verified
- [ ] Frontend builds successfully (`npm run build`)

## 🚀 Step 1: Prepare Your Repository

### 1.1 Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Verify Project Structure

Ensure your repository has:
```
lifeos/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared code
├── vercel.json      # Vercel configuration
├── .vercelignore    # Files to exclude
├── .env.example     # Environment template
├── README.md        # Documentation
└── package.json     # Root dependencies
```

## 📦 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

### 2.2 Import Project

1. Click "New Project" on Vercel dashboard
2. Select your `lifeos` repository
3. Vercel will auto-detect it as a Node.js project
4. Click "Import"

### 2.3 Configure Build Settings

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist/public
```

**Install Command:**
```
npm install
```

### 2.4 Add Environment Variables

In the Vercel project settings, add the following environment variables:

#### Required Variables:
```
VITE_API_URL=https://your-backend-api.com/api
NODE_ENV=production
```

#### Optional Variables (for backend features):
```
JWT_SECRET=your_secret_key
OPENAI_API_KEY=sk-your-key
NEON_DATABASE_URL=postgresql://...
```

### 2.5 Deploy

1. Click "Deploy"
2. Vercel will:
   - Clone your repository
   - Install dependencies
   - Run `npm run build`
   - Upload static files to CDN
3. Wait for deployment to complete
4. Your frontend will be live at: `https://lifeos.vercel.app`

## 🖥️ Step 3: Deploy Backend

### Option A: Separate Node.js Hosting (Recommended)

**Recommended platforms:**
- Railway.app
- Render.com
- Heroku (paid)
- DigitalOcean
- AWS EC2

**Example: Deploy to Railway**

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Select branch (main)
5. Configure:
   - **Start Command:** `npm run start`
   - **Build Command:** `npm run build`
6. Add environment variables
7. Deploy

### Option B: Vercel Serverless Functions

For serverless deployment, you would need to restructure the backend as Vercel functions. This requires:

1. Moving Express routes to `/api` folder
2. Creating serverless function handlers
3. Using Vercel KV for sessions (paid feature)
4. Configuring `vercel.json` for serverless

**Note:** This approach has limitations for WebSocket connections and long-running processes.

## 🔌 Step 4: Connect Frontend and Backend

### 4.1 Update API URL

After deploying backend, update `VITE_API_URL` in Vercel:

1. Go to Vercel Project Settings
2. Navigate to Environment Variables
3. Update `VITE_API_URL` to your backend URL:
   ```
   https://your-backend.railway.app/api
   ```
4. Redeploy: Click "Deployments" → "Redeploy" on latest deployment

### 4.2 Configure CORS

In your backend (`server/index.ts`), update CORS settings:

```typescript
const corsOptions = {
  origin: [
    'https://lifeos.vercel.app',
    'https://your-domain.com',
    'http://localhost:5173' // for local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

## 🗄️ Step 5: Setup Database

### 5.1 Create Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create new project
4. Get connection string: `postgresql://user:password@...`

### 5.2 Add to Backend Environment Variables

In your backend hosting platform:

```
NEON_DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/lifeos
```

### 5.3 Run Migrations

SSH into your backend and run:

```bash
npm run db:push
```

Or manually in your deployment platform:

```bash
npm install
npm run db:push
```

## 🔐 Step 6: Security Configuration

### 6.1 Enable HTTPS

- Vercel automatically provides HTTPS
- Ensure backend also uses HTTPS

### 6.2 Set Strong Secrets

Update these secrets in production:

```
JWT_SECRET=<long-random-string-min-32-chars>
SESSION_SECRET=<long-random-string-min-32-chars>
OPENID_CLIENT_SECRET=<your-actual-secret>
```

Generate strong secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6.3 Add Security Headers

In Vercel `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

## 🧪 Step 7: Testing & Verification

### 7.1 Test Frontend

- [ ] Navigate to `https://lifeos.vercel.app`
- [ ] Check console for errors
- [ ] Test all UI interactions
- [ ] Verify responsive design

### 7.2 Test API Connectivity

```bash
curl -X GET https://your-backend.railway.app/api/health
```

Expected response: `{"status": "ok"}`

### 7.3 Test Authentication

- [ ] Test login functionality
- [ ] Verify tokens are stored correctly
- [ ] Test logout
- [ ] Test session persistence

### 7.4 Test Database

- [ ] Verify data is being saved
- [ ] Check queries in database logs
- [ ] Test error handling

## 📊 Step 8: Monitoring & Maintenance

### 8.1 Set Up Error Tracking

Add Sentry for error monitoring:

1. Go to [sentry.io](https://sentry.io)
2. Create project for Node.js
3. Add Sentry SDK to frontend and backend
4. Configure in environment variables

### 8.2 Enable Analytics

Vercel provides built-in analytics:
- Web Vitals
- Usage metrics
- Performance metrics

Access via Vercel dashboard → Analytics

### 8.3 Setup Logging

For backend, use:
- Winston or Pino for structured logging
- Log to stdout for Vercel logs
- Monitor in deployment platform's log viewer

### 8.4 Regular Maintenance

```bash
# Update dependencies
npm update
npm audit fix

# Run tests
npm test

# Build check
npm run build

# Commit and push
git add .
git commit -m "Update dependencies"
git push

# Vercel auto-redeploys on push
```

## 🚨 Troubleshooting

### Issue: Build fails on Vercel

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify `npm run build` works locally
3. Check for missing environment variables
4. Ensure `vercel.json` syntax is correct

### Issue: Frontend can't reach backend

**Solution:**
1. Verify `VITE_API_URL` is correct
2. Check CORS configuration on backend
3. Verify backend is running and healthy
4. Check network tab in browser DevTools

### Issue: Database connection fails

**Solution:**
1. Verify `NEON_DATABASE_URL` is correct
2. Check Neon allowed IPs
3. Verify migrations ran successfully
4. Check database logs

### Issue: Authentication not working

**Solution:**
1. Verify JWT_SECRET is set
2. Check token expiration
3. Verify CORS credentials=true
4. Check browser cookies are enabled

## 📈 Performance Optimization

### 1. Enable Caching

In `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
    }
  ]
}
```

### 2. Use Image Optimization

- Use Next.js Image component
- Compress images before upload
- Use WebP format

### 3. Code Splitting

Vite automatically code-splits React components. Ensure:
```typescript
const LazyComponent = lazy(() => import('./Component'));
```

## 📞 Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://vercel.com/community)
- [Railway Documentation](https://railway.app/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Express.js Deployment](https://expressjs.com/en/advanced/best-practice-performance.html)

## ✅ Post-Deployment

- [ ] Test all features in production
- [ ] Monitor error tracking
- [ ] Check analytics
- [ ] Gather user feedback
- [ ] Plan for scaling
- [ ] Document any issues encountered

---

**Happy Deploying! 🚀**
