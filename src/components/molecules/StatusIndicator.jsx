import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatusIndicator = ({ status, type = 'appointment' }) => {
  const getStatusConfig = () => {
    switch (type) {
      case 'appointment':
        switch (status) {
          case 'scheduled':
            return { color: 'bg-info', text: 'Scheduled', icon: 'Calendar' };
          case 'in-progress':
            return { color: 'bg-warning', text: 'In Progress', icon: 'Clock' };
          case 'completed':
            return { color: 'bg-success', text: 'Completed', icon: 'CheckCircle' };
          case 'cancelled':
            return { color: 'bg-error', text: 'Cancelled', icon: 'XCircle' };
          default:
            return { color: 'bg-gray-400', text: 'Unknown', icon: 'Circle' };
        }
      
      case 'connection':
        switch (status) {
          case 'excellent':
            return { color: 'bg-success', text: 'Excellent', icon: 'Wifi' };
          case 'good':
            return { color: 'bg-warning', text: 'Good', icon: 'Wifi' };
          case 'poor':
            return { color: 'bg-error', text: 'Poor', icon: 'WifiOff' };
          default:
            return { color: 'bg-gray-400', text: 'Unknown', icon: 'Wifi' };
        }
      
      case 'prescription':
        switch (status) {
          case 'active':
            return { color: 'bg-success', text: 'Active', icon: 'Pill' };
          case 'expired':
            return { color: 'bg-error', text: 'Expired', icon: 'AlertCircle' };
          case 'pending':
            return { color: 'bg-warning', text: 'Pending', icon: 'Clock' };
          default:
            return { color: 'bg-gray-400', text: 'Unknown', icon: 'Pill' };
        }
      
      default:
        return { color: 'bg-gray-400', text: status, icon: 'Circle' };
    }
  };
  
  const config = getStatusConfig();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2"
    >
      <div className={`w-2 h-2 rounded-full ${config.color}`}>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-full h-full rounded-full ${config.color}`}
        />
      </div>
      <span className="text-sm font-medium text-gray-700">{config.text}</span>
      <ApperIcon name={config.icon} className="w-4 h-4 text-gray-400" />
    </motion.div>
  );
};

export default StatusIndicator;