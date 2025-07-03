import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import { AppointmentService } from "@/services/api/appointmentService";
import { PatientService } from "@/services/api/patientService";

const Consultations = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  useEffect(() => {
    loadConsultations();
  }, []);
  
  const loadConsultations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [appointmentsData, patientsData] = await Promise.all([
        AppointmentService.getAll(),
        PatientService.getAll()
      ]);
      
      // Filter only consultations (appointments that are video calls)
      const consultationData = appointmentsData.filter(apt => 
        apt.type === 'consultation' || apt.videoRoomUrl
      );
      
      setConsultations(consultationData);
      setPatients(patientsData);
      
    } catch (err) {
      setError('Failed to load consultations. Please try again.');
      console.error('Consultations error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredConsultations = consultations.filter(consultation => {
    const patient = patients.find(p => p.Id === consultation.patientId);
    const matchesSearch = !searchTerm || 
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      consultation.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="info">Scheduled</Badge>;
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="error">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  
  const getConsultationStats = () => {
    const total = consultations.length;
    const scheduled = consultations.filter(c => c.status === 'scheduled').length;
    const inProgress = consultations.filter(c => c.status === 'in-progress').length;
    const completed = consultations.filter(c => c.status === 'completed').length;
    
    return { total, scheduled, inProgress, completed };
  };
  
  const stats = getConsultationStats();
  
  if (loading) {
    return <Loading type="table" />;
  }
  
  if (error) {
    return <Error message={error} onRetry={loadConsultations} />;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
          <p className="text-gray-600">Manage your video consultations</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="sm"
            icon="Video"
          >
            Start Consultation
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon="Settings"
          >
            Video Settings
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-lg p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Consultations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Video" className="w-6 h-6 text-primary" />
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
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-info" />
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
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-warning" />
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
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-surface rounded-lg p-4 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchBar
            placeholder="Search consultations by patient name..."
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
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Consultations List */}
      <div className="bg-surface rounded-lg shadow-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Consultations</h2>
          
          {filteredConsultations.length === 0 ? (
            <Empty
              title="No consultations found"
              description="No video consultations match your search criteria."
              icon="Video"
            />
          ) : (
            <div className="space-y-4">
              {filteredConsultations.map((consultation) => {
                const patient = patients.find(p => p.Id === consultation.patientId);
                return patient ? (
                  <motion.div
                    key={consultation.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" className="w-6 h-6 text-primary" />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <p className="text-sm text-gray-600">
                            {format(new Date(consultation.scheduledTime), 'MMMM dd, yyyy • h:mm a')}
                          </p>
                          <p className="text-sm text-gray-500">
                            Duration: {consultation.duration} minutes
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          {getStatusBadge(consultation.status)}
                          <p className="text-sm text-gray-500 mt-1">
                            Type: {consultation.type}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon="User"
                            onClick={() => navigate(`/patients/${patient.Id}`)}
                          >
                            View Patient
                          </Button>
                          
                          {consultation.status === 'scheduled' && (
                            <Button
                              variant="primary"
                              size="sm"
                              icon="Video"
                              onClick={() => navigate(`/consultations/${consultation.Id}`)}
                            >
                              Start Call
                            </Button>
                          )}
                          
                          {consultation.status === 'in-progress' && (
                            <Button
                              variant="success"
                              size="sm"
                              icon="Video"
                              onClick={() => navigate(`/consultations/${consultation.Id}`)}
                            >
                              Rejoin
                            </Button>
                          )}
                        </div>
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

export default Consultations;