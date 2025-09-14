# Deployment Guide for PanicPal on Vercel

## Common Registration Error Fixes

If you're experiencing registration errors after deploying to Vercel, follow these steps:

### 1. Database Configuration

**Problem**: Local MongoDB connection won't work on Vercel.

**Solution**: Set up MongoDB Atlas (cloud database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string (should look like: `mongodb+srv://username:password@cluster.mongodb.net/panicpal`)
4. Add your Vercel deployment IP to the whitelist (or use `0.0.0.0/0` for all IPs)

### 2. Environment Variables Setup

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add these variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/panicpal
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
```

**Important**: 
- Replace `your-username`, `your-password`, and `cluster` with your actual MongoDB Atlas credentials
- Generate a strong JWT_SECRET (at least 32 characters)
- Update `FRONTEND_URL` with your actual Vercel deployment URL

### 3. API Routes Configuration

The `vercel.json` file has been updated to:
- Properly route API calls to `/api/index.ts`
- Set the Node.js runtime version
- Configure environment variables

### 4. CORS Configuration

The CORS settings have been updated to:
- Allow your Vercel deployment domain
- Handle requests from `*.vercel.app` domains
- Maintain security while allowing cross-origin requests

### 5. Deployment Steps

1. **Push your code** to your Git repository
2. **Connect to Vercel** (if not already connected)
3. **Set environment variables** in Vercel dashboard
4. **Redeploy** your application

### 6. Testing the Fix

1. Visit your deployed application
2. Try to register a new account
3. Check the browser's Network tab for any API errors
4. Check Vercel's function logs for backend errors

### 7. Common Issues and Solutions

**Issue**: "Network Error" or "Failed to fetch"
- **Solution**: Check CORS configuration and ensure FRONTEND_URL is correct

**Issue**: "MongoDB connection error"
- **Solution**: Verify MongoDB Atlas connection string and IP whitelist

**Issue**: "JWT Error" or "Token invalid"
- **Solution**: Ensure JWT_SECRET is set and is at least 32 characters long

**Issue**: "Function timeout"
- **Solution**: Check if MongoDB Atlas cluster is in the same region as Vercel deployment

### 8. Monitoring

After deployment:
1. Monitor Vercel function logs for errors
2. Test all authentication flows (register, login, logout)
3. Verify database connections in MongoDB Atlas

### 9. Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB Atlas has proper IP restrictions
- [ ] Environment variables are set in Vercel (not in code)
- [ ] CORS is configured for your specific domain
- [ ] No sensitive data in client-side code

## Need Help?

If you're still experiencing issues:
1. Check Vercel function logs in your dashboard
2. Test API endpoints directly using tools like Postman
3. Verify all environment variables are correctly set
4. Ensure MongoDB Atlas cluster is accessible

## Quick Fix Commands

If you need to redeploy quickly:

```bash
# Build the project locally first
npm run build

# Then push to trigger Vercel deployment
git add .
git commit -m "Fix deployment configuration"
git push
```

Your registration should work after following these steps!