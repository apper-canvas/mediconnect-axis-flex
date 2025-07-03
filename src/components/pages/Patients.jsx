import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import PatientCard from '@/components/molecules/PatientCard';
import SearchBar from '@/components/molecules/SearchBar';
import { PatientService } from '@/services/api/patientService';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  useEffect(() => {
    loadPatients();
  }, []);
  
  const loadPatients = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await PatientService.getAll();
      setPatients(data);
      
    } catch (err) {
      setError('Failed to load patients. Please try again.');
      console.error('Patients error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = !searchTerm || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.insurance?.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'verified' && patient.insurance?.verified) ||
      (filterStatus === 'unverified' && !patient.insurance?.verified);
    
    return matchesSearch && matchesFilter;
  });
  
  const getPatientStats = () => {
    const total = patients.length;
    const verified = patients.filter(p => p.insurance?.verified).length;
    const unverified = total - verified;
    
    return { total, verified, unverified };
  };
  
  const stats = getPatientStats();
  
  if (loading) {
    return <Loading type="table" />;
  }
  
  if (error) {
    return <Error message={error} onRetry={loadPatients} />;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage your patient records</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="sm"
            icon="UserPlus"
          >
            Add Patient
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
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-lg p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-primary" />
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
              <p className="text-sm font-medium text-gray-600">Verified Insurance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
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
              <p className="text-sm font-medium text-gray-600">Pending Verification</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unverified}</p>
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
            placeholder="Search patients by name or insurance provider..."
            onSearch={setSearchTerm}
            showFilter={true}
            className="max-w-md"
          />
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="all">All Patients</option>
              <option value="verified">Verified Insurance</option>
              <option value="unverified">Pending Verification</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Patients List */}
      <div className="bg-surface rounded-lg shadow-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Records</h2>
          
          {filteredPatients.length === 0 ? (
            <Empty
              title="No patients found"
              description="No patients match your search criteria."
              icon="Users"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.Id}
                  patient={patient}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;