import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { PatientService } from '@/services/api/patientService';
import { AppointmentService } from '@/services/api/appointmentService';
import { PrescriptionService } from '@/services/api/prescriptionService';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    loadPatientData();
  }, [id]);
  
  const loadPatientData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [patientData, appointmentsData, prescriptionsData] = await Promise.all([
        PatientService.getById(parseInt(id)),
        AppointmentService.getAll(),
        PrescriptionService.getAll()
      ]);
      
      if (!patientData) {
        throw new Error('Patient not found');
      }
      
      setPatient(patientData);
      setAppointments(appointmentsData.filter(apt => apt.patientId === patientData.Id));
      setPrescriptions(prescriptionsData.filter(rx => rx.patientId === patientData.Id));
      
    } catch (err) {
      setError('Failed to load patient data. Please try again.');
      console.error('Patient profile error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <Error message={error} onRetry={loadPatientData} />;
  }
  
  if (!patient) {
    return <Error message="Patient not found" />;
  }
  
  const getInsuranceStatus = () => {
    if (!patient.insurance) return 'not-verified';
    return patient.insurance.verified ? 'verified' : 'pending';
  };
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'appointments', label: 'Appointments', icon: 'Calendar' },
    { id: 'prescriptions', label: 'Prescriptions', icon: 'Pill' },
    { id: 'medical-history', label: 'Medical History', icon: 'FileText' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            icon="ArrowLeft"
            onClick={() => navigate('/patients')}
          >
            Back to Patients
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">Patient Profile</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="sm"
            icon="Calendar"
          >
            Schedule Appointment
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon="Edit"
          >
            Edit Profile
          </Button>
        </div>
      </div>
      
      {/* Patient Info Card */}
      <div className="bg-surface rounded-lg p-6 shadow-card">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-10 h-10 text-primary" />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
              <p className="text-gray-600">
                Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years old
              </p>
              <p className="text-gray-600">
                DOB: {format(new Date(patient.dateOfBirth), 'MMMM dd, yyyy')}
              </p>
              
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {appointments.length} appointments
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Pill" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {prescriptions.length} prescriptions
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="mb-3">
              {getInsuranceStatus() === 'verified' && (
                <Badge variant="success">Verified Insurance</Badge>
              )}
              {getInsuranceStatus() === 'pending' && (
                <Badge variant="warning">Pending Verification</Badge>
              )}
              {getInsuranceStatus() === 'not-verified' && (
                <Badge variant="error">Not Verified</Badge>
              )}
            </div>
            
            {patient.insurance && (
              <div className="text-sm text-gray-600">
                <p className="font-medium">{patient.insurance.provider}</p>
                <p>Policy: {patient.insurance.policyNumber}</p>
                <p>Group: {patient.insurance.groupNumber}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-surface rounded-lg shadow-card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
<div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
                {patient.insurance ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Provider</label>
                      <p className="text-gray-900">{patient.insurance.provider}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Policy Number</label>
                      <p className="text-gray-900">{patient.insurance.policyNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Group Number</label>
                      <p className="text-gray-900">{patient.insurance.groupNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p className="text-gray-900">
                        {patient.insurance.verified ? 'Verified' : 'Pending Verification'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No insurance information available</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Appointment History</h3>
              {appointments.length === 0 ? (
                <p className="text-gray-500">No appointments found for this patient.</p>
              ) : (
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div key={appointment.Id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{appointment.type}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(appointment.scheduledTime), 'MMMM dd, yyyy • h:mm a')}
                          </p>
                        </div>
                        <Badge variant={appointment.status === 'completed' ? 'success' : 'info'}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Prescription History</h3>
              {prescriptions.length === 0 ? (
                <p className="text-gray-500">No prescriptions found for this patient.</p>
              ) : (
                <div className="space-y-3">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.Id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{prescription.medication}</p>
                          <p className="text-sm text-gray-600">Dosage: {prescription.dosage}</p>
                          <p className="text-sm text-gray-600">
                            Prescribed: {format(new Date(prescription.prescribedDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="success">Active</Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            Refills: {prescription.refills}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'medical-history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
              {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                <div className="space-y-3">
                  {patient.medicalHistory.map((record) => (
                    <div key={record.Id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{record.type}</p>
                          <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {format(new Date(record.date), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                        {record.attachments && record.attachments.length > 0 && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <ApperIcon name="Paperclip" className="w-4 h-4" />
                            <span>{record.attachments.length} files</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No medical history available for this patient.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;