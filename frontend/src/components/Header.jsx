import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, User, LogOut } from 'lucide-react';
import Button from './Button';

const Header = ({ isAuthenticated, user, onLogout, onThemeToggle, isDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = user?.is_staff || user?.is_superuser;

  const navigation = [
    { name: 'Subjects', href: '/' },
    { name: 'All Notes', href: '/materials' },
    { name: 'Syllabus', href: '/syllabus' },
    { name: 'Calendar', href: '/calendar' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 dark:bg-gray-800 dark:border-gray-700">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NS</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Notes with Neeraj Sir
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {isAuthenticated && isAdmin ? (
              <>
                <Link to="/admin/dashboard">
                  <Button variant="secondary" size="sm">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/admin/subjects">
                  <Button variant="secondary" size="sm">
                    Subjects
                  </Button>
                </Link>
                <Link to="/admin/modules">
                  <Button variant="secondary" size="sm">
                    Modules
                  </Button>
                </Link>
                <Button variant="danger" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : !isAuthenticated ? (
              <Link to="/login">
                <Button variant="primary" size="sm">
                  Login
                </Button>
              </Link>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4 mt-4 dark:border-gray-700">
              <button
                onClick={onThemeToggle}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700 w-full"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </>
                )}
              </button>
              {isAuthenticated && isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700 w-full"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                </Link>
                  <Link
                    to="/admin/subjects"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700 w-full"
                  >
                    Subjects
                  </Link>
                  <Link
                    to="/admin/modules"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700 w-full"
                  >
                    Modules
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : !isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg dark:text-primary-400 dark:hover:bg-primary-900/20 w-full"
                >
                  Login
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
