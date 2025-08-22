#!/bin/bash

# 🚀 CodeCrest Vercel Deployment Script

echo "🚀 Starting CodeCrest Vercel Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

echo "📦 Installing dependencies..."

# Install frontend dependencies
echo "🔧 Installing frontend dependencies..."
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd backend
npm install
npm run build
cd ..

echo "✅ Dependencies installed and builds completed!"

echo ""
echo "🌐 Next Steps for Deployment:"
echo ""
echo "1. 📱 Deploy Backend:"
echo "   - Go to https://vercel.com/new"
echo "   - Import your GitHub repository"
echo "   - Set root directory to 'backend'"
echo "   - Add environment variables:"
echo "     MONGODB_URI=your-mongodb-uri"
echo "     JWT_KEY=your-jwt-secret"
echo "     JUDGE0_KEY=your-judge0-api-key"
echo "     REDIS_URL=your-redis-url"
echo "     CORS_ORIGIN=https://your-frontend-domain.vercel.app"
echo ""
echo "2. 🎨 Deploy Frontend:"
echo "   - Go to https://vercel.com/new"
echo "   - Import your GitHub repository"
echo "   - Set root directory to 'frontend'"
echo "   - Add environment variable:"
echo "     VITE_API_URL=https://your-backend-domain.vercel.app"
echo ""
echo "3. 🔄 Update CORS:"
echo "   - After both deployments, update backend CORS_ORIGIN"
echo "   - Redeploy backend"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "�� Happy Deploying!"
