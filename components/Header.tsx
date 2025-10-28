import React from 'react';
// Fix: Corrected import path for types
import type { User, View } from '../types';
import { UserIcon, ChatBubbleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  user: User;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNavigate, onLogout }) => {
  const { t } = useLanguage();

  return (
    <header className="bg-primary/90 dark:bg-dark-surface/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-2 text-background dark:text-dark-text">
        <img 
          src="https://i.ibb.co/9mK2RbhS/21.png" 
          alt="Calorina Logo" 
          className="h-12 w-auto cursor-pointer"
          onClick={() => onNavigate('profile')}
        />
        <nav className="flex items-center space-x-2 md:space-x-4">
          {user.isAdmin && (
             <button
                onClick={() => onNavigate('admin')}
                className="flex items-center space-x-2 hover:text-accent dark:hover:text-dark-accent transition-colors duration-200"
                aria-label="Go to Admin Dashboard"
              >
                <Cog6ToothIcon className="w-6 h-6" />
                <span className="hidden md:inline">{t.adminDashboard}</span>
              </button>
          )}

          <button
            id="tour-chat-button"
            onClick={() => onNavigate('chat')}
            className="flex items-center space-x-2 hover:text-accent dark:hover:text-dark-accent transition-colors duration-200"
            aria-label="Go to Chat"
          >
            <ChatBubbleIcon className="w-6 h-6" />
            <span className="hidden md:inline">{t.aiChat}</span>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center space-x-2 hover:text-accent dark:hover:text-dark-accent transition-colors duration-200"
            aria-label="Go to Profile"
          >
            <UserIcon className="w-6 h-6" />
            <span className="hidden md:inline">{user.name}</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-background dark:text-dark-text bg-secondary dark:bg-dark-border hover:bg-opacity-80 px-3 py-2 rounded-md transition-colors duration-200"
            aria-label="Logout"
          >
             <ArrowRightOnRectangleIcon className="w-6 h-6" />
             <span className="hidden md:inline">{t.logout}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
