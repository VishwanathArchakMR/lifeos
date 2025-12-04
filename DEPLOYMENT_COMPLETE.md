# 🚀 LIFEOS - COMPLETE DEPLOYMENT GUIDE
## Frontend (Vercel) + Backend (Render) - SAME REPO

---

# ⚡ QUICK START (5 MINUTES)

## YOUR REPO STRUCTURE
```
lifeos/ (Single Repo)
├── client/       👈 Frontend (React + Vite)
├── server/       👈 Backend (Express.js)
├── shared/       👈 Shared types
└── package.json  👈 Root dependencies
```

## DEPLOYMENT ARCHITECTURE
```
Browser
   ↓
[VERCEL] Frontend: https://lifeos.vercel.app
   ↓ (API calls)
[RENDER] Backend: https://lifeos-backend.onrender.com
   ↓ (DB queries)
[NEON] PostgreSQL Database
```

---

# 📋 COMPLETE STEP-BY-STEP GUIDE

## STEP 1: CREATE DATABASE (NEON) ⏱️ 3 MINS

### 1.1 Go to Neon
```
👉 https://neon.tech
- Sign up with GitHub
- Create new project: "lifeos"
- Create database: "lifeos"
```

### 1.2 Get Connection String
```
After creating project, copy:
postgresql://user:password@ep-xxx.neon.tech/lifeos

⚠️ SAVE THIS! You'll need it multiple times
```

---

## STEP 2: DEPLOY BACKEND TO RENDER ⏱️ 5 MINS

### 2.1 Go to Render
```
👉 https://render.com
- Sign up with GitHub
- Click "New +" → "Web Service"
- Select lifeos repository
- Click "Connect"
```

### 2.2 Configure Backend
```
Name: lifeos-backend
Root Directory: ./  (IMPORTANT: leave as default)
Build Command: npm run build
Start Command: npm run start
```

### 2.3 Add Environment Variables
```
Click "Advanced" → "Add Environment Variable"

Add these 5 variables:

1. NODE_ENV = production
2. NEON_DATABASE_URL = postgresql://user:password@ep-xxx.neon.tech/lifeos
3. CORS_ORIGIN = https://lifeos.vercel.app (UPDATE THIS AFTER VERCEL DEPLOYS)
4. JWT_SECRET = (Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
5. SESSION_SECRET = (Generate another random string)

Optional (if using AI features):
6. OPENAI_API_KEY = sk-your_key_here
```

### 2.4 Deploy
```
Click "Create Web Service"
Wait for deployment... (3-5 minutes)

✅ After deployed:
Your backend URL: https://lifeos-backend.onrender.com

Test it: curl https://lifeos-backend.onrender.com/api/health
```

### 2.5 Run Database Migrations
```
Go to Render Dashboard → lifeos-backend
Click "Shell" (top right)
Paste and run: npm run db:push

This creates all tables in Neon!
```

---

## STEP 3: DEPLOY FRONTEND TO VERCEL ⏱️ 5 MINS

### 3.1 Go to Vercel
```
👉 https://vercel.com
- Sign up with GitHub
- Click "New Project"
- Select lifeos repository
- Click "Import"
```

### 3.2 Configure Frontend
```
1. Framework Preset: Vite
2. Root Directory: client
3. Build Command: npm run build
4. Output Directory: dist/public

SCROLL DOWN!
```

### 3.3 Add Environment Variables
```
Click "Environment Variables"

Add this variable:
VITE_API_URL = https://lifeos-backend.onrender.com/api

(Replace with YOUR Render backend URL from Step 2.4)
```

### 3.4 Deploy
```
Click "Deploy"
Wait for deployment... (2-3 minutes)

✅ After deployed:
Your frontend URL: https://lifeos.vercel.app
```

---

## STEP 4: UPDATE CORS ON RENDER ⏱️ 1 MIN

Now that you have Vercel URL, update Render:

```
1. Go to Render Dashboard → lifeos-backend
2. Click "Environment"
3. Edit "CORS_ORIGIN" → https://lifeos.vercel.app
4. Click "Save"
5. Backend auto-redeployed!

✅ Now frontend can call backend!
```

---

## STEP 5: TEST EVERYTHING ⏱️ 2 MINS

### 5.1 Test Frontend
```
👉 Go to https://lifeos.vercel.app
- Page should load
- Check browser console for errors
```

### 5.2 Test Backend
```
curl https://lifeos-backend.onrender.com/api/health

Expected response: {"status":"ok"}
```

### 5.3 Test Connection
```
1. Go to https://lifeos.vercel.app
2. Login/Register
3. Try creating a task
4. If saves → DATABASE WORKS! ✅
```

---

# 📊 ENVIRONMENT VARIABLES SUMMARY

## VERCEL (Frontend)
```env
VITE_API_URL=https://lifeos-backend.onrender.com/api
```

## RENDER (Backend)
```env
NODE_ENV=production
NEON_DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/lifeos
CORS_ORIGIN=https://lifeos.vercel.app
JWT_SECRET=<random_32_char_string>
SESSION_SECRET=<random_32_char_string>
OPENAI_API_KEY=sk-your_key (optional)
```

## NEON (Database)
```
Connection URL: postgresql://user:password@ep-xxx.neon.tech/lifeos
(Used by Render backend)
```

---

# 🔧 AUTO-DEPLOYMENT SETUP

## How it Works
```
1. You push code to GitHub (main branch)
2. Vercel automatically deploys frontend
3. Render automatically deploys backend
4. Both use same database (Neon)

✅ NO MANUAL DEPLOYMENT NEEDED!
```

## Verify Auto-Deploy
```
1. Make a small change to code
2. Commit and push
3. Check Vercel & Render dashboards
4. Should auto-deploy within 1 minute
```

---

# 🆘 TROUBLESHOOTING

## Frontend won't load
```
❌ Problem: White/blank page
✅ Solution: 
   1. Check VITE_API_URL in Vercel environment
   2. Check browser console for errors
   3. Redeploy Vercel
```

## Frontend can't reach backend
```
❌ Problem: "Cannot reach API"
✅ Solution:
   1. Verify Render backend is running
   2. Test: curl https://lifeos-backend.onrender.com/api/health
   3. Check CORS_ORIGIN in Render environment
   4. Should be: https://lifeos.vercel.app
```

## Database connection fails
```
❌ Problem: "Database connection error"
✅ Solution:
   1. Check NEON_DATABASE_URL in Render
   2. Verify Neon database is active
   3. Run migrations: npm run db:push
```

## Migrations not running
```
❌ Problem: Tables not created
✅ Solution:
   1. Go to Render Dashboard
   2. Click "Shell"
   3. Run: npm run db:push
```

---

# ✅ FINAL CHECKLIST

- [ ] Neon database created with connection string
- [ ] Render backend deployed with all env vars
- [ ] Migrations ran (npm run db:push)
- [ ] Vercel frontend deployed with VITE_API_URL
- [ ] CORS_ORIGIN updated to Vercel URL on Render
- [ ] Frontend loads at https://lifeos.vercel.app
- [ ] Backend responds at https://lifeos-backend.onrender.com/api/health
- [ ] Can login and create data
- [ ] Auto-deployment verified (code push → auto-deploy)

---

# 🎉 YOU'RE LIVE!

## Your App URLs
```
🌐 Frontend:  https://lifeos.vercel.app
🔌 API:       https://lifeos-backend.onrender.com/api
💾 Database:  Neon PostgreSQL
```

## Next Steps
```
1. Share your app link!
2. Monitor dashboards:
   - Vercel: https://vercel.com/dashboard
   - Render: https://dashboard.render.com
   - Neon: https://console.neon.tech
3. Fix bugs as users find them
4. Add features based on feedback
```

---

## 📞 NEED HELP?

If something breaks:
1. Check deployment logs
   - Vercel: Deployments tab
   - Render: Events tab
2. Check environment variables
3. Re-read troubleshooting section
4. Redeploy manually if needed

---

**✨ DEPLOYMENT COMPLETE!** Your app is now LIVE! 🚀
