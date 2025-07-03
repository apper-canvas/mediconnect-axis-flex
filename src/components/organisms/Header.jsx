import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';

const Header = ({ onMenuToggle }) => {
  const [notifications] = useState([
    { Id: 1, type: 'appointment', message: 'New appointment scheduled', time: '5 min ago' },
    { Id: 2, type: 'prescription', message: 'Prescription refill requested', time: '10 min ago' },
    { Id: 3, type: 'system', message: 'System maintenance tonight', time: '1 hour ago' }
  ]);
  
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="bg-surface shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">
            MediConnect Pro
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <SearchBar
              placeholder="Search patients, appointments..."
              className="w-80"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Bell" className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
              )}
            </button>
            
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-2 w-80 bg-surface rounded-lg shadow-elevated border border-gray-200 z-50"
              >
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.Id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <ApperIcon name="Bell" className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 text-center">
                  <button className="text-sm text-primary hover:text-primary/80 font-medium">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Dr. Sarah Johnson</p>
              <p className="text-xs text-gray-500">Cardiologist</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;