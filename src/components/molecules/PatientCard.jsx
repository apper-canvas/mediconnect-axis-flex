import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const PatientCard = ({ patient, showActions = true }) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate(`/patients/${patient.Id}`);
  };
  
  const getInsuranceStatus = () => {
    if (!patient.insurance) return 'not-verified';
    return patient.insurance.verified ? 'verified' : 'pending';
  };
  
  const getInsuranceBadge = () => {
    const status = getInsuranceStatus();
    switch (status) {
      case 'verified':
        return <Badge variant="success" size="sm">Verified</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      default:
        return <Badge variant="error" size="sm">Not Verified</Badge>;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, shadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}
      className="bg-surface rounded-lg p-6 shadow-card hover:shadow-elevated transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-500">
              Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
            </p>
            <p className="text-sm text-gray-500">
              DOB: {format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          {getInsuranceBadge()}
          <p className="text-xs text-gray-500 mt-1">
            {patient.insurance?.provider || 'No Insurance'}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" className="w-4 h-4" />
              <span>{patient.upcomingAppointments?.length || 0} upcoming</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="FileText" className="w-4 h-4" />
              <span>{patient.medicalHistory?.length || 0} records</span>
            </div>
          </div>
          
          {showActions && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewProfile}
              className="text-primary hover:text-primary/80 font-medium text-sm"
            >
              View Profile
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PatientCard;