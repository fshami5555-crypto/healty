import React, { useMemo } from 'react';
import { AppleIcon, AvocadoIcon, CarrotIcon, PlateIcon, ChefIcon, CoffeeCupIcon } from './Icons';

interface LoadingOverlayProps {
    isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
    const icons = useMemo(() => [
        <AppleIcon className="w-16 h-16 text-primary dark:text-dark-primary" />,
        <CarrotIcon className="w-16 h-16 text-primary dark:text-dark-primary" />,
        <AvocadoIcon className="w-16 h-16 text-primary dark:text-dark-primary" />,
        <PlateIcon className="w-16 h-16 text-primary dark:text-dark-primary" />,
        <ChefIcon className="w-16 h-16 text-primary dark:text-dark-primary" />,
        <CoffeeCupIcon className="w-16 h-16 text-primary dark:text-dark-primary" />,
    ], []);

    const randomIcon = useMemo(() => {
        return icons[Math.floor(Math.random() * icons.length)];
    }, [isVisible, icons]);


    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-background/80 dark:bg-dark-background/80 backdrop-blur-sm z-[999] flex items-center justify-center transition-opacity duration-300 animate-fadeIn">
            <div className="animate-gentle-pulse">
                {randomIcon}
            </div>
        </div>
    );
};

export default LoadingOverlay;
