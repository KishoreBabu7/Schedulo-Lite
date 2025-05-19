import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, Loader, CheckCircle, AlertTriangle } from 'lucide-react';

const securityQuestions = [
  "What was the name of your first pet?",
  "In which city were you born?",
  "What was your childhood nickname?",
  "What is your mother's maiden name?",
  "What was the make of your first car?",
];

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState(securityQuestions[0]);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register, error, clearError, isLoading } = useAuth();
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

  // Check password match
  const passwordsMatch = password === confirmPassword;
  const passwordError = confirmPassword && !passwordsMatch ? "Passwords don't match" : '';
  
  // Check password strength
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    
    // Contains number
    if (/\d/.test(password)) score += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) score += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) score += 1;
    
    // Contains special char
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    setPasswordStrength(score);
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Medium";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-error-500";
    if (passwordStrength <= 4) return "bg-warning-500";
    return "bg-success-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!passwordsMatch) {
      return;
    }
    
    try {
      await register(name, email, password, securityQuestion, securityAnswer);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in the auth context
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-lg w-full bg-white p-8 rounded-xl shadow-card"
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
          <h2 className="text-3xl font-bold text-neutral-900">Create Account</h2>
          <p className="text-neutral-600 mt-2">Join Schedulo Lite today</p>
        </motion.div>
        
        {error && (
          <motion.div 
            className="mb-4 p-3 bg-error-50 border border-error-200 text-error-700 rounded-lg flex items-start"
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        
        <motion.form onSubmit={handleSubmit} variants={itemVariants}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
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
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
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
              
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor()}`} 
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs ml-2 min-w-[60px]">
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <ul className="text-xs text-neutral-600 space-y-1 mt-2">
                    <li className="flex items-center">
                      <span className={`w-3 h-3 mr-1 rounded-full inline-block ${password.length >= 8 ? 'bg-success-500' : 'bg-neutral-300'}`}></span>
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <span className={`w-3 h-3 mr-1 rounded-full inline-block ${/[A-Z]/.test(password) ? 'bg-success-500' : 'bg-neutral-300'}`}></span>
                      One uppercase letter
                    </li>
                    <li className="flex items-center">
                      <span className={`w-3 h-3 mr-1 rounded-full inline-block ${/\d/.test(password) ? 'bg-success-500' : 'bg-neutral-300'}`}></span>
                      One number
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`input-field ${passwordError ? 'border-error-500 focus:ring-error-500' : ''}`}
                placeholder="••••••••"
                required
              />
              {passwordError && (
                <p className="mt-1 text-sm text-error-600">
                  {passwordError}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="securityQuestion" className="block text-sm font-medium text-neutral-700 mb-1">
                Security Question
              </label>
              <select
                id="securityQuestion"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="input-field"
                required
              >
                {securityQuestions.map((question, index) => (
                  <option key={index} value={question}>
                    {question}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="securityAnswer" className="block text-sm font-medium text-neutral-700 mb-1">
                Security Answer
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
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full mb-4"
            disabled={isLoading || !passwordsMatch}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
          
          <div className="text-center">
            <span className="text-neutral-600">Already have an account?</span>{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;