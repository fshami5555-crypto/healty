import React from 'react';
// Fix: Corrected import path for types
import type { View } from '../types';
import { UserIcon, ChatBubbleIcon, ShoppingCartIcon, Cog6ToothIcon, CoffeeCupIcon, ChartBarIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavBarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, onNavigate }) => {
  const { t } = useLanguage();

  const navItems: { view: View; label: string; icon: React.ReactNode, id?: string }[] = [
    { view: 'profile', label: t.profile, icon: <UserIcon className="w-6 h-6" /> },
    { view: 'chat', label: t.aiChat, icon: <ChatBubbleIcon className="w-6 h-6" /> },
    { view: 'statistics', label: t.statistics, icon: <ChartBarIcon className="w-6 h-6" /> },
    { view: 'market', label: t.market, icon: <ShoppingCartIcon className="w-6 h-6" />, id: 'tour-market-tab' },
    // { view: 'cafe', label: t.cafe, icon: <CoffeeCupIcon className="w-6 h-6" /> },
    { view: 'settings', label: t.settings, icon: <Cog6ToothIcon className="w-6 h-6" /> },
  ];

  const NavButton: React.FC<{
    item: { view: View; label: string; icon: React.ReactNode, id?: string };
    isActive: boolean;
  }> = ({ item, isActive }) => (
    <button
      id={item.id}
      onClick={() => onNavigate(item.view)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? 'text-primary dark:text-dark-primary' : 'text-gray-500 dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.icon}
      <span className="text-xs mt-1">{item.label}</span>
    </button>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-neutral-light dark:border-dark-border z-50">
      <div className="container mx-auto flex justify-around">
        {navItems.map(item => (
          <NavButton key={item.view} item={item} isActive={currentView === item.view} />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
