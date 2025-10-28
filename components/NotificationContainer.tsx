import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import NotificationToast from './NotificationToast';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 p-4 space-y-3 z-[100] w-full max-w-md md:max-w-lg pointer-events-none">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;