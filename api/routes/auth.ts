import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken, authenticateToken, AuthRequest } from '../utils/jwt.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validateRequest
} from '../validation/authValidation.js';

const router = Router();

// Register endpoint
router.post('/register', validateRequest(registerSchema), async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      passwordHash: password // Will be hashed by pre-save middleware
    });
    
    await user.save();
    
    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);
    
    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error: any) {
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      mongodbUri: process.env.MONGODB_URI ? 'SET' : 'NOT_SET',
      jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
      nodeEnv: process.env.NODE_ENV
    });
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle MongoDB connection errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
      console.error('Database connection failed:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? `Registration failed: ${error.message}` 
        : 'Registration failed. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { errorType: error.name })
    });
  }
});

// Login endpoint
router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);
    
    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      lastLogin: user.lastLogin,
      preferences: user.preferences
    };
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
        rememberMe
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token from storage. Here we just confirm the logout.
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      lastLogin: user.lastLogin,
      preferences: user.preferences,
      createdAt: user.createdAt
    };
    
    res.json({
      success: true,
      data: { user: userResponse }
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Forgot password endpoint
router.post('/forgot-password', validateRequest(forgotPasswordSchema), async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }
    
    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Save it to the database with expiration
    // 3. Send email with reset link
    
    // For now, just return success
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
