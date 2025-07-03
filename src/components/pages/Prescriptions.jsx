import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import SearchBar from '@/components/molecules/SearchBar';
import { PrescriptionService } from '@/services/api/prescriptionService';
import { PatientService } from '@/services/api/patientService';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    medication: '',
    dosage: '',
    instructions: '',
    refills: 0
  });
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [prescriptionsData, patientsData] = await Promise.all([
        PrescriptionService.getAll(),
        PatientService.getAll()
      ]);
      
      setPrescriptions(prescriptionsData);
      setPatients(patientsData);
      
    } catch (err) {
      setError('Failed to load prescriptions. Please try again.');
      console.error('Prescriptions error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const patient = patients.find(p => p.Id === prescription.patientId);
    const matchesSearch = !searchTerm || 
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      prescription.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    try {
      const newPrescription = {
        ...prescriptionForm,
        patientId: parseInt(prescriptionForm.patientId),
        prescribedDate: new Date().toISOString(),
        status: 'active'
      };
      
      const created = await PrescriptionService.create(newPrescription);
      setPrescriptions([...prescriptions, created]);
      
      // Reset form
      setPrescriptionForm({
        patientId: '',
        medication: '',
        dosage: '',
        instructions: '',
        refills: 0
      });
      setShowCreateForm(false);
      
    } catch (err) {
      setError('Failed to create prescription');
      console.error('Create prescription error:', err);
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'expired':
        return <Badge variant="error">Expired</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  
  const getPrescriptionStats = () => {
    const total = prescriptions.length;
    const active = prescriptions.filter(p => p.status === 'active').length;
    const expired = prescriptions.filter(p => p.status === 'expired').length;
    const pending = prescriptions.filter(p => p.status === 'pending').length;
    
    return { total, active, expired, pending };
  };
  
  const stats = getPrescriptionStats();
  
  if (loading) {
    return <Loading type="table" />;
  }
  
  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600">Manage patient prescriptions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="sm"
            icon="Plus"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'New Prescription'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon="Download"
          >
            Export
          </Button>
        </div>
      </div>
      
      {/* Create Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-surface rounded-lg p-6 shadow-card"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Prescription</h2>
          
          <form onSubmit={handleCreatePrescription} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient
              </label>
              <select
                value={prescriptionForm.patientId}
                onChange={(e) => setPrescriptionForm({
                  ...prescriptionForm,
                  patientId: e.target.value
                })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              >
                <option value="">Select a patient</option>
                {patients.map(patient => (
                  <option key={patient.Id} value={patient.Id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            
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
            
            <div className="md:col-span-2">
              <Button
                type="submit"
                variant="primary"
                icon="Pill"
              >
                Create Prescription
              </Button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-lg p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Pill" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-lg p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-lg p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
            </div>
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertCircle" className="w-6 h-6 text-error" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface rounded-lg p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-warning" />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-surface rounded-lg p-4 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchBar
            placeholder="Search prescriptions by patient or medication..."
            onSearch={setSearchTerm}
            showFilter={true}
            className="max-w-md"
          />
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Prescriptions List */}
      <div className="bg-surface rounded-lg shadow-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Prescription Records</h2>
          
          {filteredPrescriptions.length === 0 ? (
            <Empty
              title="No prescriptions found"
              description="No prescriptions match your search criteria."
              icon="Pill"
            />
          ) : (
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => {
                const patient = patients.find(p => p.Id === prescription.patientId);
                return patient ? (
                  <motion.div
                    key={prescription.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <ApperIcon name="Pill" className="w-6 h-6 text-primary" />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900">{prescription.medication}</h3>
                          <p className="text-sm text-gray-600">Patient: {patient.name}</p>
                          <p className="text-sm text-gray-600">Dosage: {prescription.dosage}</p>
                          <p className="text-sm text-gray-500">
                            Prescribed: {format(new Date(prescription.prescribedDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {getStatusBadge(prescription.status)}
                        <p className="text-sm text-gray-500 mt-1">
                          Refills: {prescription.refills}
                        </p>
                        <p className="text-sm text-gray-500">
                          Instructions: {prescription.instructions}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;