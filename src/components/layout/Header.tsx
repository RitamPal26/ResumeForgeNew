import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { DarkModeToggle } from '../ui/DarkModeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest('[data-mobile-menu]')) {
        setIsMenuOpen(false);
      }
      if (isProfileOpen && !target.closest('[data-profile-menu]')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isProfileOpen]);

  // Close mobile menu on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary-600 text-white px-4 py-2 rounded-md z-[60] transition-all duration-200"
      >
        Skip to main content
      </a>
      
      <header className="bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-50 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-1"
              aria-label="ResumeForge - Go to homepage"
            >
              <div className="p-2 bg-primary-600 rounded-lg group-hover:bg-primary-700 transition-colors duration-200">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900 dark:text-white theme-transition">
                ResumeForge
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              <Link 
                to="/features" 
                className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 theme-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
              >
                Features
              </Link>
              <Link 
                to="/about" 
                className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 theme-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
              >
                About
              </Link>
              <Link 
                to="/pricing" 
                className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 theme-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
              >
                Pricing
              </Link>
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <DarkModeToggle />
              {user ? (
                <div className="relative\" data-profile-menu>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 theme-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[44px]"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-secondary-700 dark:text-secondary-300 theme-transition max-w-[120px] truncate">
                      {user.email}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-secondary-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 py-1 theme-transition z-50"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <Link
                          to="/dashboard"
                          className="block px-4 py-3 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 theme-transition focus:outline-none focus:bg-secondary-50 dark:focus:bg-secondary-700"
                          role="menuitem"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 theme-transition focus:outline-none focus:bg-secondary-50 dark:focus:bg-secondary-700"
                          role="menuitem"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Profile Settings
                        </Link>
                        <hr className="my-1 border-secondary-200 dark:border-secondary-600" />
                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 theme-transition flex items-center space-x-2 focus:outline-none focus:bg-red-50 dark:focus:bg-red-900/20"
                          role="menuitem"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/auth/signin')}>
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/auth/signup')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 theme-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              data-mobile-menu
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-secondary-900 dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-secondary-900 dark:text-white" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t border-secondary-200 dark:border-secondary-700 theme-transition overflow-hidden"
                data-mobile-menu
              >
                <nav className="py-4 space-y-2" role="navigation" aria-label="Mobile navigation">
                  <Link 
                    to="/features" 
                    className="block px-4 py-3 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 theme-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mx-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link 
                    to="/about" 
                    className="block px-4 py-3 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 theme-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mx-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="block px-4 py-3 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 theme-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mx-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  
                  <div className="px-4 py-2">
                    <DarkModeToggle />
                  </div>
                  
                  {user ? (
                    <>
                      <div className="border-t border-secondary-200 dark:border-secondary-600 my-2"></div>
                      <div className="px-4 py-2">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm text-secondary-700 dark:text-secondary-300 theme-transition truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <Link 
                        to="/dashboard" 
                        className="block px-4 py-3 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 theme-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mx-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-3 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 theme-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mx-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 theme-transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg mx-2 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-2 space-y-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          navigate('/auth/signin');
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-center"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => {
                          navigate('/auth/signup');
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-center"
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}