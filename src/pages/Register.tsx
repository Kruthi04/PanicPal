import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Leaf, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/auth/register', data);
      
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Redirect to dashboard or welcome page
        navigate('/dashboard');
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = err.response.data.errors;
        setError(validationErrors.map((e: any) => e.message).join(', '));
      } else {
        setError(
          err.response?.data?.message || 'Registration failed. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };
    
    strength = Object.values(checks).filter(Boolean).length;
    
    if (strength < 3) return { strength, text: 'Weak', color: 'text-red-500' };
    if (strength < 5) return { strength, text: 'Medium', color: 'text-yellow-500' };
    return { strength, text: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(password || '');

  return (
    <div className="min-h-screen bg-forest-bg-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-forest-accent to-forest-seafoam rounded-full mb-4 shadow-card">
            <Leaf className="w-8 h-8 text-forest-bg-1" />
          </div>
          <h1 className="text-3xl font-bold text-forest-text-primary mb-2 font-poppins">Join PanicPal 🌱</h1>
          <p className="text-forest-text-secondary font-inter">Start your peaceful journey to wellness</p>
        </div>

        {/* Registration Form */}
        <div className="forest-card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-forest-text-primary mb-2 font-inter">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-forest-text-secondary" />
                </div>
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    },
                    maxLength: {
                      value: 50,
                      message: 'Name cannot exceed 50 characters'
                    }
                  })}
                  type="text"
                  id="name"
                  className="forest-input w-full pl-10 pr-4 py-3"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-forest-text-primary mb-2 font-inter">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-forest-text-secondary" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  id="email"
                  className="forest-input w-full pl-10 pr-4 py-3"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-forest-text-primary mb-2 font-inter">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-forest-text-secondary" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message: 'Password must contain uppercase, lowercase, number, and special character'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="forest-input w-full pl-10 pr-12 py-3"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-forest-text-secondary hover:text-forest-text-primary transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-forest-text-secondary hover:text-forest-text-primary transition-colors" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-forest-bg-2 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength < 3
                            ? 'bg-red-400'
                            : passwordStrength.strength < 5
                            ? 'bg-yellow-400'
                            : 'bg-forest-accent'
                        }`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength < 3
                        ? 'text-red-400'
                        : passwordStrength.strength < 5
                        ? 'text-yellow-400'
                        : 'text-forest-accent'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-forest-text-primary mb-2 font-inter">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-forest-text-secondary" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="forest-input w-full pl-10 pr-12 py-3"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-forest-text-secondary hover:text-forest-text-primary transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-forest-text-secondary hover:text-forest-text-primary transition-colors" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  {...register('acceptTerms', {
                    required: 'You must accept the terms and conditions'
                  })}
                  id="acceptTerms"
                  type="checkbox"
                  className="h-4 w-4 text-forest-accent focus:ring-forest-accent border-forest-text-secondary rounded bg-forest-card"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className="text-forest-text-primary font-inter">
                  I agree to the{' '}
                  <Link to="/terms" className="text-forest-accent hover:text-forest-seafoam font-medium transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-forest-accent hover:text-forest-seafoam font-medium transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-400">{errors.acceptTerms.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="forest-button w-full py-3 px-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-card"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-forest-bg-1 mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account 🌿'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-forest-text-secondary font-inter">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-forest-accent hover:text-forest-seafoam font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;