# 🚀 CodeCrest Vercel Deployment Guide

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:
- [Vercel Account](https://vercel.com/signup)
- [GitHub Account](https://github.com)
- [MongoDB Atlas Account](https://www.mongodb.com/atlas)
- [Redis Cloud Account](https://redis.com/try-free/)
- [Judge0 API Key](https://rapidapi.com/judge0-official/api/judge0-ce/)

## 🔧 Backend Deployment

### Step 1: Deploy Backend to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `backend` folder as root

3. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codecrest
   JWT_KEY=your-super-secure-jwt-secret-key-here
   JUDGE0_KEY=your-judge0-api-key-here
   REDIS_URL=redis://username:password@redis-host:port
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   ```

4. **Deploy Backend**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the backend URL (e.g., `https://your-backend.vercel.app`)

### Step 2: Update Frontend Environment

1. **Update the API URL**
   - Go to your frontend project in Vercel
   - Add environment variable:
   ```
   VITE_API_URL=https://your-backend.vercel.app
   ```

## 🌐 Frontend Deployment

### Step 1: Deploy Frontend to Vercel

1. **Create New Vercel Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-backend.vercel.app
   VITE_APP_NAME=CodeCrest
   VITE_APP_VERSION=1.0.0
   ```

4. **Deploy Frontend**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the frontend URL

## 🔄 Update CORS Configuration

After both deployments are complete:

1. **Update Backend CORS**
   - Go to your backend project in Vercel
   - Update the `CORS_ORIGIN` environment variable:
   ```
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```
   - Redeploy the backend

## 📱 Domain Configuration

### Custom Domain (Optional)

1. **Add Custom Domain**
   - In Vercel dashboard, go to "Settings" → "Domains"
   - Add your custom domain
   - Configure DNS records as instructed

2. **Update Environment Variables**
   - Update `CORS_ORIGIN` with your custom domain
   - Update `VITE_API_URL` if using custom domain for backend

## 🧪 Testing Deployment

### Backend Health Check
```bash
curl https://your-backend.vercel.app/health
```

### Frontend Test
1. Open your frontend URL
2. Test user registration/login
3. Test problem creation and submission
4. Verify all features work correctly

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel
   - Ensure all dependencies are in package.json
   - Verify build commands are correct

2. **Environment Variables**
   - Double-check all environment variables are set
   - Ensure variable names match exactly
   - Redeploy after changing environment variables

3. **CORS Errors**
   - Verify `CORS_ORIGIN` is set correctly
   - Check that frontend URL is accessible
   - Ensure backend is redeployed after CORS changes

4. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check network access in MongoDB Atlas
   - Ensure IP whitelist includes Vercel IPs

### Performance Optimization

1. **Enable Edge Functions**
   - Consider using Vercel Edge Functions for better performance
   - Optimize database queries
   - Implement proper caching strategies

2. **Monitor Performance**
   - Use Vercel Analytics
   - Monitor API response times
   - Check for memory leaks

## 📊 Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Database connection working
- [ ] All features tested
- [ ] Performance monitored
- [ ] Error logging configured

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Redis Cloud](https://docs.redis.com/)
- [Judge0 API](https://rapidapi.com/judge0-official/api/judge0-ce/)

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review environment variable configuration
3. Test locally with production environment variables
4. Check MongoDB and Redis connection status

---

**Happy Deploying! 🚀**
