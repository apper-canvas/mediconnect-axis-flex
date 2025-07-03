import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const AppointmentCard = ({ appointment, patient, showActions = true }) => {
  const navigate = useNavigate();
  
  const handleJoinConsultation = () => {
    navigate(`/consultations/${appointment.Id}`);
  };
  
  const handleViewPatient = () => {
    navigate(`/patients/${patient.Id}`);
  };
  
  const getStatusBadge = () => {
    switch (appointment.status) {
      case 'scheduled':
        return <Badge variant="info" size="sm">Scheduled</Badge>;
      case 'in-progress':
        return <Badge variant="warning" size="sm">In Progress</Badge>;
      case 'completed':
        return <Badge variant="success" size="sm">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="error" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="default" size="sm">{appointment.status}</Badge>;
    }
  };
  
  const getTypeIcon = () => {
    switch (appointment.type) {
      case 'consultation':
        return 'Video';
      case 'follow-up':
        return 'RefreshCw';
      case 'emergency':
        return 'AlertTriangle';
      default:
        return 'Calendar';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, shadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}
      className="bg-surface rounded-lg p-6 shadow-card hover:shadow-elevated transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <ApperIcon name={getTypeIcon()} className="w-6 h-6 text-primary" />
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{appointment.type}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(appointment.scheduledTime), 'MMM dd, yyyy • h:mm a')}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          {getStatusBadge()}
          <p className="text-xs text-gray-500 mt-1">
            {appointment.duration} min
          </p>
        </div>
      </div>
      
      {showActions && (
        <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            icon="User"
            onClick={handleViewPatient}
          >
            View Patient
          </Button>
          
          {appointment.status === 'scheduled' && (
            <Button
              variant="primary"
              size="sm"
              icon="Video"
              onClick={handleJoinConsultation}
            >
              Join Consultation
            </Button>
          )}
          
          {appointment.status === 'in-progress' && (
            <Button
              variant="success"
              size="sm"
              icon="Video"
              onClick={handleJoinConsultation}
            >
              Rejoin
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AppointmentCard;