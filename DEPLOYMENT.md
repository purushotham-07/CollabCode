# Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide walks you through deploying **CollabCode** to **Render** and **Vercel** with zero Docker setup.

---

## 1. Deploy Backend on Render

### Prerequisites
- A free account on [Render](https://render.com).
- A free MongoDB cluster from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (takes 2 minutes).

### Steps
1. **Push your repository** to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name**: `collabcode-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Java` (Java 17 / 21)
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar app/target/collabcode-app-1.0.0-SNAPSHOT.jar`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `MONGO_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://user:password@cluster.mongodb.net/collabcode?retryWrites=true&w=majority`)
6. Click **Create Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://collabcode-backend.onrender.com`).

---

## 2. Deploy Frontend on Vercel

### Prerequisites
- A free account on [Vercel](https://vercel.com).
- Your Render backend URL from Step 1.

### Steps
1. In the [Vercel Dashboard](https://vercel.com/dashboard), click **Add New...** → **Project**.
2. Import your GitHub repository.
3. In the project configuration:
   - **Root Directory**: Click edit and select `frontend`.
   - **Framework Preset**: `Vite` (auto-detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - `VITE_API_BASE_URL`: `https://collabcode-backend.onrender.com/api` (replace with your Render backend URL, including the `/api` path)
5. Click **Deploy**.
6. That's it! Your full-stack collaborative editor is live with custom URL, SSL, and instant global CDN.
