import React, { useEffect, useState } from 'react';
// Fix: Corrected import path for types
import type { Notification } from '../types';
import { XMarkIcon, CheckCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from './Icons';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300); // Wait for exit animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
      setExiting(true);
      setTimeout(onClose, 300);
  }

  const baseClasses = "max-w-lg w-full bg-white dark:bg-dark-surface shadow-lg rounded-lg pointer-events-auto ring-1 ring-black dark:ring-dark-border ring-opacity-5 overflow-hidden";
  const animationClasses = exiting ? "animate-fadeOut" : "animate-slideInUp";
  
  const typeStyles = {
    success: { icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />, title: 'Success' },
    error: { icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />, title: 'Error' },
    info: { icon: <InformationCircleIcon className="h-6 w-6 text-blue-500" />, title: 'Information' },
  };

  const { icon } = typeStyles[notification.type];

  return (
    <div className={`${baseClasses} ${animationClasses}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ltr:ml-3 rtl:mr-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-dark-text">{notification.message}</p>
          </div>
          <div className="ltr:ml-4 rtl:mr-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 dark:text-dark-text-secondary rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
