import { Link } from 'react-router-dom';
import { Calendar, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4 flex items-center justify-center">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-100 rounded-full filter blur-3xl opacity-50"></div>
          <Calendar className="h-24 w-24 text-primary-500 mx-auto relative" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4 text-neutral-900">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-neutral-800">Page Not Found</h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link 
          to="/" 
          className="btn btn-primary inline-flex items-center px-6 py-3"
        >
          <Home className="h-5 w-5 mr-2" />
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;