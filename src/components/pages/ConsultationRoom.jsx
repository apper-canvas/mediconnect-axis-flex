import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import VideoConsultation from '@/components/organisms/VideoConsultation';
import { AppointmentService } from '@/services/api/appointmentService';
import { PatientService } from '@/services/api/patientService';
import { PrescriptionService } from '@/services/api/prescriptionService';

const ConsultationRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: '',
    dosage: '',
    instructions: '',
    refills: 0
  });
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  
  useEffect(() => {
    loadConsultationData();
  }, [id]);
  
  const loadConsultationData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const appointmentData = await AppointmentService.getById(parseInt(id));
      if (!appointmentData) {
        throw new Error('Consultation not found');
      }
      
      const patientData = await PatientService.getById(appointmentData.patientId);
      if (!patientData) {
        throw new Error('Patient not found');
      }
      
      setAppointment(appointmentData);
      setPatient(patientData);
      
      // Mark appointment as in-progress
      if (appointmentData.status === 'scheduled') {
        const updatedAppointment = { ...appointmentData, status: 'in-progress' };
        await AppointmentService.update(appointmentData.Id, updatedAppointment);
        setAppointment(updatedAppointment);
      }
      
    } catch (err) {
      setError('Failed to load consultation data. Please try again.');
      console.error('Consultation room error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEndConsultation = async () => {
    try {
      const updatedAppointment = { ...appointment, status: 'completed' };
      await AppointmentService.update(appointment.Id, updatedAppointment);
      toast.success('Consultation ended successfully');
      navigate('/consultations');
    } catch (err) {
      toast.error('Failed to end consultation');
      console.error('End consultation error:', err);
    }
  };
  
  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPrescription = {
        ...prescriptionForm,
        patientId: patient.Id,
        prescribedDate: new Date().toISOString(),
        status: 'active'
      };
      
      await PrescriptionService.create(newPrescription);
      toast.success('Prescription created successfully');
      
      // Reset form
      setPrescriptionForm({
        medication: '',
        dosage: '',
        instructions: '',
        refills: 0
      });
      setShowPrescriptionForm(false);
      
    } catch (err) {
      toast.error('Failed to create prescription');
      console.error('Prescription error:', err);
    }
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <Error message={error} onRetry={loadConsultationData} />;
  }
  
  if (!appointment || !patient) {
    return <Error message="Consultation or patient not found" />;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultation Room</h1>
          <p className="text-gray-600">
            {patient.name} • {format(new Date(appointment.scheduledTime), 'MMMM dd, yyyy • h:mm a')}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            icon="User"
            onClick={() => navigate(`/patients/${patient.Id}`)}
          >
            View Patient Profile
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon="PhoneOff"
            onClick={handleEndConsultation}
          >
            End Consultation
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Call */}
        <div className="lg:col-span-2">
          <VideoConsultation
            appointment={appointment}
            patient={patient}
            onEndCall={handleEndConsultation}
          />
        </div>
        
        {/* Patient Info & Tools */}
        <div className="space-y-6">
          {/* Patient Info */}
          <div className="bg-surface rounded-lg p-6 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-600">
                    Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
                  </p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="Shield" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Insurance</span>
                </div>
                {patient.insurance ? (
                  <div className="text-sm text-gray-600">
                    <p>{patient.insurance.provider}</p>
                    <p>Policy: {patient.insurance.policyNumber}</p>
                    <p className={`font-medium ${patient.insurance.verified ? 'text-success' : 'text-warning'}`}>
                      {patient.insurance.verified ? 'Verified' : 'Pending'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No insurance information</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Consultation Notes */}
          <div className="bg-surface rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Consultation Notes</h3>
              <Button
                variant="ghost"
                size="sm"
                icon={isNotesExpanded ? "ChevronUp" : "ChevronDown"}
                onClick={() => setIsNotesExpanded(!isNotesExpanded)}
              />
            </div>
            
            {isNotesExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter consultation notes..."
                  className="w-full h-32 rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
                <Button
                  variant="primary"
                  size="sm"
                  icon="Save"
                  onClick={() => toast.success('Notes saved')}
                >
                  Save Notes
                </Button>
              </motion.div>
            )}
          </div>
          
          {/* Prescription Form */}
          <div className="bg-surface rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Prescription</h3>
              <Button
                variant="primary"
                size="sm"
                icon="Plus"
                onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
              >
                {showPrescriptionForm ? 'Cancel' : 'Add Prescription'}
              </Button>
            </div>
            
            {showPrescriptionForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handlePrescriptionSubmit}
                className="space-y-4"
              >
                <Input
                  label="Medication"
                  value={prescriptionForm.medication}
                  onChange={(e) => setPrescriptionForm({
                    ...prescriptionForm,
                    medication: e.target.value
                  })}
                  required
                />
                
                <Input
                  label="Dosage"
                  value={prescriptionForm.dosage}
                  onChange={(e) => setPrescriptionForm({
                    ...prescriptionForm,
                    dosage: e.target.value
                  })}
                  required
                />
                
                <Input
                  label="Instructions"
                  value={prescriptionForm.instructions}
                  onChange={(e) => setPrescriptionForm({
                    ...prescriptionForm,
                    instructions: e.target.value
                  })}
                  required
                />
                
                <Input
                  label="Refills"
                  type="number"
                  value={prescriptionForm.refills}
                  onChange={(e) => setPrescriptionForm({
                    ...prescriptionForm,
                    refills: parseInt(e.target.value) || 0
                  })}
                  min="0"
                  max="12"
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon="Pill"
                >
                  Create Prescription
                </Button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRoom;