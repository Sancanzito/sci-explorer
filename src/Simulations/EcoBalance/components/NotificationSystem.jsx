// games/EcoBalance/components/NotificationSystem.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaSkullCrossbones,
  FaInfoCircle,
  FaTimes 
} from 'react-icons/fa';

const NotificationSystem = () => {
  const { notifications, dismissNotification } = useGameStore();
  
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="text-green-400" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-400" />;
      case 'critical': return <FaSkullCrossbones className="text-red-400" />;
      default: return <FaInfoCircle className="text-blue-400" />;
    }
  };
  
  const getColors = (type) => {
    switch (type) {
      case 'success': return 'bg-green-900/90 border-green-500';
      case 'warning': return 'bg-yellow-900/90 border-yellow-500';
      case 'critical': return 'bg-red-900/90 border-red-500';
      default: return 'bg-blue-900/90 border-blue-500';
    }
  };
  
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`${getColors(notification.type)} backdrop-blur-md border rounded-lg p-3 shadow-xl relative overflow-hidden`}
          >
            <button
              onClick={() => dismissNotification(notification.id)}
              className="absolute top-2 right-2 text-white/50 hover:text-white"
            >
              <FaTimes className="w-3 h-3" />
            </button>
            
            <div className="flex items-start gap-3 pr-6">
              <div className="text-xl">{getIcon(notification.type)}</div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  {notification.message}
                </p>
                <p className="text-white/50 text-xs mt-1">
                  {notification.timestamp?.toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            {/* Progress bar for auto-dismiss */}
            <motion.div
              className={`absolute bottom-0 left-0 h-1 ${
                notification.type === 'success' ? 'bg-green-500' :
                notification.type === 'warning' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;