# LifeOS Cleanup Guide - Remove Replit Dependencies

🎯 **Goal**: Remove all Replit-specific authentication and prepare the app for deployment to Render + Vercel

---

## Overview

Your LifeOS app currently has Replit OAuth integrated. To deploy it to Vercel (frontend) and Render (backend), we need to:

1. **Remove** Replit authentication logic
2. **Remove** Replit-specific dependencies
3. **Clean** .env file of Replit variables
4. **Simplify** routes to work without auth (for now)
5. **Test** locally

---

## Step-by-Step Cleanup (Do This LOCALLY)

### ✅ Step 1: Clone/Pull the Latest Code

```bash
cd ~/lifeos
git pull origin main
```

---

### ✅ Step 2: Remove Replit Dependencies

Open terminal in your `lifeos` directory and run:

```bash
cd server
npm uninstall openid-client passport express-session connect-pg-simple memoizee
npm uninstall @types/memoizee @jridgewell/trace-mapping
```

**What's being removed:**
- `openid-client` - OpenID authentication client
- `passport` - Authentication middleware
- `express-session` - Session management
- `connect-pg-simple` - PostgreSQL session store
- `memoizee` - Memory caching (only used for auth)
- Type definitions for removed packages

---

### ✅ Step 3: Delete replitAuth.ts File

```bash
rm server/replitAuth.ts
```

This file contains all Replit OAuth logic.

---

### ✅ Step 4: Update server/routes.ts

Open `server/routes.ts` and:

**REMOVE this import block (lines 1-4):**
```typescript
import { setupAuth, isAuthenticated } from "./replitAuth";
```

**REMOVE this line (around line 20):**
```typescript
await setupAuth(app);
```

**Remove `isAuthenticated` middleware from ALL routes:**

Change every route from:
```typescript
app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
  const userId = req.user.claims.sub;
  // ...
});
```

To:
```typescript
app.get('/api/tasks', async (req, res) => {
  // For now, use a hardcoded userId for testing
  // In production, implement proper auth (JWT, API keys, etc.)
  const userId = 'demo-user';
  try {
    const tasks = await storage.getTasks(userId);
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});
```

**TIP**: You can use Find & Replace:
- Find: `, isAuthenticated`
- Replace with: `` (empty)
- Find: `const userId = req.user.claims.sub;`
- Replace with: `const userId = 'demo-user';`

---

### ✅ Step 5: Update .env File

Open `.env` and **DELETE these lines** (if they exist):

```
REPL_ID=
REPLIT_CLIENT_ID=
REPLIT_CLIENT_SECRET=
REPLIT_CALLBACK_URL=
REPLIT_AUTH_DOMAIN=
ISSUER_URL=
SESSION_SECRET=
```

**Keep these:**
```
DATABASE_URL=<your Neon PostgreSQL connection string>
OPENAI_API_KEY=<your OpenAI key if using AI features>
NODE_ENV=development
```

---

### ✅ Step 6: Rebuild and Test Locally

```bash
cd server
npm install
npm run dev
```

**Expected output:**
```
serving on port 5000
```

**Test an endpoint:**
```bash
curl http://localhost:5000/api/tasks
```

Should return a JSON response (empty array or tasks list).

---

### ✅ Step 7: Update Frontend (if needed)

If your frontend makes API calls:

1. Open `client/src/...` (wherever you make API calls)
2. Remove any auth/login logic
3. Ensure API calls point to your backend URL

---

### ✅ Step 8: Commit Changes

```bash
git add .
git commit -m "Remove Replit auth - prepare for Render + Vercel deployment"
git push origin main
```

---

## After Cleanup - What You'll Have

✅ No Replit dependencies  
✅ No vendor lock-in  
✅ Deployable to Render (backend) + Vercel (frontend)  
✅ Using Neon PostgreSQL  
✅ Ready for proper authentication later (JWT, OAuth 2.0, etc.)  

---

## Next Steps

Once cleanup is complete:

1. **Deploy Backend to Render** (see DEPLOYMENT_COMPLETE.md)
2. **Deploy Frontend to Vercel** (see DEPLOYMENT_COMPLETE.md)
3. **Test the full stack**
4. **Add proper authentication** (JWT tokens recommended for REST APIs)

---

## Troubleshooting

**Q: What if npm install fails?**  
A: Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Q: My app won't start?**  
A: Check that DATABASE_URL is set and your Neon database is accessible

**Q: Should I remove user authentication completely?**  
A: For now yes (demo user). Later add JWT or API keys for security.

---

✨ **You're now ready to deploy!** ✨
