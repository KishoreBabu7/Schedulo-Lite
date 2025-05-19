import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, Loader, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  
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

  // For email step
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Check if the email exists before proceeding
    if (!(email === 'admin@example.com' || email === 'user@example.com')) {
      // Show error message for invalid email
      clearError();
      setTimeout(() => {
        setError('Email address not found. Please check and try again.');
      }, 0);
      return;
    }
    
    setStep(2);
  };

  // For security answer step
  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setStep(3);
  };

  // For new password step
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (newPassword !== confirmPassword) {
      return;
    }
    
    try {
      await resetPassword(email, securityAnswer, newPassword);
      setResetSuccess(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Password reset failed:', err);
    }
  };

  const renderStep = () => {
    if (resetSuccess) {
      return (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-success-100 p-3">
              <CheckCircle className="h-12 w-12 text-success-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Password Reset Successful</h3>
          <p className="text-neutral-600 mb-6">
            Your password has been reset successfully. You will be redirected to the login page shortly.
          </p>
          <Link to="/login" className="btn btn-primary">
            Back to Login
          </Link>
        </motion.div>
      );
    }
    
    switch (step) {
      case 1:
        return (
          <motion.form 
            key="step1"
            onSubmit={handleEmailSubmit}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Reset Your Password</h3>
              <p className="text-neutral-600">
                Enter your email address and we'll help you reset your password.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address
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
              {error && (
                <p className="mt-1 text-sm text-error-600">{error}</p>
              )}
              <p className="mt-2 text-xs text-neutral-500">
                Demo accounts: admin@example.com or user@example.com
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex justify-between">
              <Link to="/login" className="flex items-center text-primary-600 hover:text-primary-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                Continue
              </button>
            </motion.div>
          </motion.form>
        );
        
      case 2:
        return (
          <motion.form 
            key="step2"
            onSubmit={handleSecuritySubmit}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Security Verification</h3>
              <p className="text-neutral-600">
                Please answer your security question to continue.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mb-6">
              <p className="block text-sm font-medium text-neutral-700 mb-3">
                Security Question:
                <span className="block mt-1 text-neutral-900">What was the name of your first pet?</span>
              </p>
              
              <label htmlFor="securityAnswer" className="block text-sm font-medium text-neutral-700 mb-1">
                Your Answer
              </label>
              <input
                id="securityAnswer"
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="input-field"
                placeholder="Your answer"
                required
              />
              {error && (
                <p className="mt-1 text-sm text-error-600">{error}</p>
              )}
              
              <p className="mt-2 text-xs text-neutral-500">
                Hint for demo: Use "demo" as the answer
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex justify-between">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex items-center text-primary-600 hover:text-primary-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                Continue
              </button>
            </motion.div>
          </motion.form>
        );
        
      case 3:
        return (
          <motion.form 
            key="step3"
            onSubmit={handlePasswordSubmit}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Create New Password</h3>
              <p className="text-neutral-600">
                Your identity has been verified. Please create a new password.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            </motion.div>
            
            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`input-field ${
                  confirmPassword && newPassword !== confirmPassword
                    ? 'border-error-500 focus:ring-error-500'
                    : ''
                }`}
                placeholder="••••••••"
                required
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-sm text-error-600">
                  Passwords don't match
                </p>
              )}
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex justify-between">
              <button 
                type="button" 
                onClick={() => setStep(2)}
                className="flex items-center text-primary-600 hover:text-primary-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading || (newPassword !== confirmPassword) || !newPassword}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </motion.div>
          </motion.form>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full bg-white p-8 rounded-xl shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center mb-6">
          <Calendar className="h-12 w-12 text-primary-500 mb-2" />
          <h2 className="text-2xl font-bold text-neutral-900">Schedulo Lite</h2>
        </div>
        
        {renderStep()}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;