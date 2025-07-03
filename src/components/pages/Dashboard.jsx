import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import AppointmentCard from '@/components/molecules/AppointmentCard';
import PatientCard from '@/components/molecules/PatientCard';
import { AppointmentService } from '@/services/api/appointmentService';
import { PatientService } from '@/services/api/patientService';
import { PrescriptionService } from '@/services/api/prescriptionService';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    activePrescriptions: 0,
    completedConsultations: 0
  });
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [appointmentsData, patientsData, prescriptionsData] = await Promise.all([
        AppointmentService.getAll(),
        PatientService.getAll(),
        PrescriptionService.getAll()
      ]);
      
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setPrescriptions(prescriptionsData);
      
      // Calculate stats
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayAppointments = appointmentsData.filter(apt => 
        format(new Date(apt.scheduledTime), 'yyyy-MM-dd') === today
      ).length;
      
      const activePrescriptions = prescriptionsData.filter(rx => rx.status === 'active').length;
      const completedConsultations = appointmentsData.filter(apt => apt.status === 'completed').length;
      
      setStats({
        todayAppointments,
        totalPatients: patientsData.length,
        activePrescriptions,
        completedConsultations
      });
      
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Loading type="dashboard" />;
  }
  
  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }
  
  const todayAppointments = appointments.filter(apt => 
    format(new Date(apt.scheduledTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );
  
  const recentPatients = patients.slice(0, 4);
  
  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: 'Calendar',
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: 'Users',
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Active Prescriptions',
      value: stats.activePrescriptions,
      icon: 'Pill',
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Completed Consultations',
      value: stats.completedConsultations,
      icon: 'CheckCircle',
      color: 'bg-emerald-500',
      change: '+15%'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Dr. Johnson!</h1>
            <p className="text-blue-100">
              You have {stats.todayAppointments} appointments scheduled for today
            </p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="Activity" className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface rounded-lg p-6 shadow-card hover:shadow-elevated transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last week</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
            <ApperIcon name="Calendar" className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {todayAppointments.length === 0 ? (
              <Empty
                title="No appointments today"
                description="You have no appointments scheduled for today."
                icon="Calendar"
              />
            ) : (
              todayAppointments.map((appointment) => {
                const patient = patients.find(p => p.Id === appointment.patientId);
                return patient ? (
                  <AppointmentCard
                    key={appointment.Id}
                    appointment={appointment}
                    patient={patient}
                    showActions={true}
                  />
                ) : null;
              })
            )}
          </div>
        </div>
        
        {/* Recent Patients */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
            <ApperIcon name="Users" className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentPatients.length === 0 ? (
              <Empty
                title="No patients yet"
                description="You haven't seen any patients recently."
                icon="Users"
              />
            ) : (
              recentPatients.map((patient) => (
                <PatientCard
                  key={patient.Id}
                  patient={patient}
                  showActions={true}
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-surface rounded-lg p-6 shadow-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span className="font-medium">Schedule Appointment</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-success/10 rounded-lg text-success hover:bg-success/20 transition-colors"
          >
            <ApperIcon name="UserPlus" className="w-5 h-5" />
            <span className="font-medium">Add New Patient</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-purple-100 rounded-lg text-purple-600 hover:bg-purple-200 transition-colors"
          >
            <ApperIcon name="FileText" className="w-5 h-5" />
            <span className="font-medium">Create Prescription</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;