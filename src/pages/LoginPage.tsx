import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, Loader } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  // Get the redirect path from state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled in the auth context
      console.error('Login failed:', err);
    }
  };

  // For demo purposes
  const setDemoCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@example.com');
      setPassword('password');
    } else {
      setEmail('user@example.com');
      setPassword('password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full bg-white p-8 rounded-xl shadow-card"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div 
          className="flex flex-col items-center mb-6"
          variants={itemVariants}
        >
          <Calendar className="h-12 w-12 text-primary-500 mb-2" />
          <h2 className="text-3xl font-bold text-neutral-900">Welcome Back</h2>
          <p className="text-neutral-600 mt-2">Sign in to your account</p>
        </motion.div>
        
        {error && (
          <motion.div 
            className="mb-4 p-3 bg-error-50 border border-error-200 text-error-700 rounded-lg"
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        <motion.form onSubmit={handleSubmit} variants={itemVariants}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-neutral-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full mb-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
          
          <div className="text-center mb-4">
            <span className="text-neutral-600">Don't have an account?</span>{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </div>
        </motion.form>
        
        <motion.div variants={itemVariants} className="mt-6 pt-6 border-t border-neutral-200">
          <p className="text-sm text-neutral-600 text-center mb-3">
            Demo Accounts (for testing)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDemoCredentials('admin')}
              className="btn btn-outline text-sm py-1"
            >
              Admin Demo
            </button>
            <button
              onClick={() => setDemoCredentials('user')}
              className="btn btn-outline text-sm py-1"
            >
              User Demo
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;