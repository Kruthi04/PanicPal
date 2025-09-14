# Vercel Deployment Troubleshooting Guide

## Registration Failure Debug Steps

### 1. Environment Variables Configuration

**Required Environment Variables in Vercel:**

```bash
# Database Configuration (CRITICAL)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/panicpal?retryWrites=true&w=majority

# JWT Configuration (CRITICAL)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d

# Server Configuration
NODE_ENV=production

# Frontend URL (CRITICAL for CORS)
FRONTEND_URL=https://your-app.vercel.app

# Email Configuration (Optional for registration)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@panicpal.com
```

### 2. Common Issues and Fixes

#### Issue 1: MongoDB Connection Failure
**Symptoms:** Registration fails with database connection errors
**Solutions:**
- Ensure MONGODB_URI uses MongoDB Atlas connection string (not localhost)
- Verify MongoDB Atlas allows connections from 0.0.0.0/0 (all IPs)
- Check database user has read/write permissions
- Ensure database name exists in the connection string

#### Issue 2: CORS Errors
**Symptoms:** Registration fails with CORS policy errors
**Solutions:**
- Set FRONTEND_URL to exact Vercel deployment URL
- Ensure no trailing slash in FRONTEND_URL
- Verify CORS configuration in api/app.ts includes production domain

#### Issue 3: JWT Secret Issues
**Symptoms:** Registration succeeds but token generation fails
**Solutions:**
- Use a strong JWT_SECRET (minimum 32 characters)
- Ensure JWT_SECRET is set in Vercel environment variables

### 3. Vercel Configuration Fixes Applied

✅ **Fixed:** Removed deprecated 'functions' field from vercel.json
✅ **Fixed:** Updated frontend API calls to use environment-based URLs
✅ **Fixed:** Implemented proper error handling in AuthContext

### 4. Testing Steps

1. **Test API Endpoint Directly:**
   ```bash
   curl -X POST https://your-app.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"TestPass123!"}'
   ```

2. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions tab
   - Check logs for /api/auth/register function
   - Look for MongoDB connection errors or other issues

3. **Verify Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure all required variables are set
   - Redeploy after adding/updating variables

### 5. Database Setup Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network access allows all IPs (0.0.0.0/0)
- [ ] Connection string includes database name
- [ ] Connection string uses correct username/password

### 6. Quick Fix Commands

**Redeploy after environment variable changes:**
```bash
vercel --prod
```

**Test local API (if MongoDB is running):**
```bash
npm run server:dev
# In another terminal:
curl -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"Test123!"}'
```

### 7. Next Steps if Issues Persist

1. Check Vercel function logs for specific error messages
2. Verify MongoDB Atlas connection from a different tool
3. Test with a minimal registration payload
4. Enable debug logging in production (temporarily)

---

**Most Common Fix:** Ensure MONGODB_URI in Vercel points to MongoDB Atlas (not localhost) and FRONTEND_URL matches your Vercel deployment URL exactly.