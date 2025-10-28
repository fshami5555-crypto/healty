import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background dark:bg-dark-background animate-fadeIn">
      <img
        src="https://i.ibb.co/Fbk8SxqJ/20.png"
        alt="Calorina Logo"
        className="w-48 h-auto animate-gentle-pulse"
      />
    </div>
  );
};

export default SplashScreen;
