import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const MainLayout = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isAuthenticated={isAuthenticated} 
        user={user}
        onLogout={logout}
        onThemeToggle={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
