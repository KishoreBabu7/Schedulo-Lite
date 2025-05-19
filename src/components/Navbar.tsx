import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Calendar, UserCircle, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <Calendar className="h-8 w-8 text-primary-500" />
          <span className="text-xl font-heading font-bold">Schedulo Lite</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`hover:text-primary-500 transition-colors ${
              location.pathname === '/' ? 'text-primary-500 font-medium' : ''
            }`}
          >
            Home
          </Link>
          
          {!user ? (
            <>
              <Link 
                to="/login" 
                className={`hover:text-primary-500 transition-colors ${
                  location.pathname === '/login' ? 'text-primary-500 font-medium' : ''
                }`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className={`hover:text-primary-500 transition-colors ${
                  location.pathname === '/dashboard' ? 'text-primary-500 font-medium' : ''
                }`}
              >
                Dashboard
              </Link>
              
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-primary-500 transition-colors">
                  <span>{user.name}</span>
                  <UserCircle className="h-5 w-5" />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <div className="py-2">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 hover:bg-neutral-100"
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </Link>
                    
                    {user.isAdmin && (
                      <Link 
                        to="/admin" 
                        className="flex items-center px-4 py-2 hover:bg-neutral-100"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    
                    <button 
                      onClick={logout}
                      className="flex items-center w-full text-left px-4 py-2 hover:bg-neutral-100 text-error-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Mobile Navigation Toggle */}
        <button 
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`py-2 ${
                  location.pathname === '/' ? 'text-primary-500 font-medium' : ''
                }`}
              >
                Home
              </Link>
              
              {!user ? (
                <>
                  <Link 
                    to="/login" 
                    className={`py-2 ${
                      location.pathname === '/login' ? 'text-primary-500 font-medium' : ''
                    }`}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary text-center"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`py-2 ${
                      location.pathname === '/dashboard' ? 'text-primary-500 font-medium' : ''
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`py-2 ${
                      location.pathname === '/profile' ? 'text-primary-500 font-medium' : ''
                    }`}
                  >
                    Profile
                  </Link>
                  
                  {user.isAdmin && (
                    <Link 
                      to="/admin" 
                      className={`py-2 ${
                        location.pathname === '/admin' ? 'text-primary-500 font-medium' : ''
                      }`}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <button 
                    onClick={logout}
                    className="py-2 text-left text-error-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;