# Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide walks you through deploying **CollabCode** to **Render** (Spring Boot Backend) and **Vercel** (React + Vite Frontend).

The repository is configured to support **both zero-config root deployment** and **direct `frontend` subdirectory deployment** on Vercel without 404 routing errors.

---

## 1. Deploy Backend on Render

### Prerequisites
- A free account on [Render](https://render.com).
- A free MongoDB cluster from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Steps
1. **Push your repository** to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** → **Blueprint** (recommended) or **Web Service**.
3. Connect your GitHub repository (`CollabCode`).
4. When using **Blueprint**, Render automatically reads `render.yaml` and builds the Docker image.
   If configuring manually via **Web Service**:
   - **Name**: `collabcode-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `JAVA_VERSION`: `17`
   - `PORT`: `10000`
   - `MONGO_URI`: Your MongoDB Atlas connection string:
     `mongodb+srv://<username>:<password>@cluster0.mongodb.net/collabcode?retryWrites=true&w=majority`
   - `JWT_ACCESS_TOKEN_EXPIRATION_MS`: `900000` (15 minutes)
   - `JWT_REFRESH_TOKEN_EXPIRATION_MS`: `604800000` (7 days)
   - *(Optional for rate limiting)*:
     - `UPSTASH_REDIS_REST_URL`: Your Upstash Redis REST URL
     - `UPSTASH_REDIS_REST_TOKEN`: Your Upstash Redis REST Token
   - *(Optional for Google OAuth2)*:
     - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
     - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
     - `GOOGLE_REDIRECT_URI`: `https://<your-frontend>.vercel.app/auth/callback`
6. Click **Create Web Service**.
7. Once deployed, test health:
   ```bash
   curl https://<your-backend>.onrender.com/actuator/health
   # Expected response: {"status":"UP"}
   ```
8. Copy your backend URL (e.g. `https://collabcode-backend.onrender.com`).

---

## 2. Deploy Frontend on Vercel

The repository includes both a **root `vercel.json`** and **`frontend/vercel.json`** with SPA catch-all rewrites, so deployment works seamlessly regardless of which configuration you choose in Vercel.

### Option A: Standard Deployment (Recommended)
1. In the [Vercel Dashboard](https://vercel.com/dashboard), click **Add New...** → **Project**.
2. Select your `CollabCode` repository and click **Import**.
3. Under **Project Configuration**:
   - **Root Directory**: Click **Edit** and choose `frontend`.
   - **Framework Preset**: `Vite` (automatically detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://<your-backend>.onrender.com/api`
     *(The frontend automatically normalizes this even if you omit `/api` or include a trailing slash)*
5. Click **Deploy**.

### Option B: Zero-Config Root Deployment
If you leave **Root Directory** as `./` (default repository root):
1. In Vercel, leave Root Directory empty (`./`).
2. Add the environment variable:
   - `VITE_API_BASE_URL`: `https://<your-backend>.onrender.com/api`
3. Click **Deploy**.
   Vercel will use root `vercel.json` and `package.json` to build `frontend` and serve `frontend/dist` with SPA routing.

---

## 3. Troubleshooting Common Issues

### Vercel `404: NOT_FOUND / This page doesn't exist`
- **Cause**: Vercel deployed from the repository root without a root `vercel.json` or build configuration, leaving no files to serve.
- **Fix**: The repository now includes `vercel.json` at root and in `frontend/` with rewrite rules `/(.*) -> /index.html`. Trigger a new deployment on Vercel by pushing to GitHub or clicking **Redeploy** in the Vercel dashboard.

### Render `./mvnw: Permission denied`
- **Cause**: Git tracked `backend/mvnw` without executable permissions (`100644`).
- **Fix**: Run `git update-index --chmod=+x backend/mvnw` (already configured in the repository) and push.

### CORS Errors
- The backend allows origins matching `https://*.vercel.app`, `https://*.onrender.com`, `http://localhost:*`, and `*` with credentials enabled in `SecurityConfig.java`.
