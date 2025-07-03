import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import AppointmentCard from '@/components/molecules/AppointmentCard';
import SearchBar from '@/components/molecules/SearchBar';
import { AppointmentService } from '@/services/api/appointmentService';
import { PatientService } from '@/services/api/patientService';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [appointmentsData, patientsData] = await Promise.all([
        AppointmentService.getAll(),
        PatientService.getAll()
      ]);
      
      setAppointments(appointmentsData);
      setPatients(patientsData);
      
    } catch (err) {
      setError('Failed to load appointments. Please try again.');
      console.error('Appointments error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const filteredAppointments = appointments.filter(appointment => {
    const patient = patients.find(p => p.Id === appointment.patientId);
    const matchesSearch = !searchTerm || 
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  const getAppointmentsForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredAppointments.filter(apt => 
      format(new Date(apt.scheduledTime), 'yyyy-MM-dd') === dateStr
    );
  };
  
  const navigateWeek = (direction) => {
    setCurrentWeek(prev => addDays(prev, direction * 7));
  };
  
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
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage your patient appointments</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant={viewMode === 'week' ? 'primary' : 'outline'}
            size="sm"
            icon="Calendar"
            onClick={() => setViewMode('week')}
          >
            Week View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            icon="List"
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon="Plus"
          >
            New Appointment
          </Button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-surface rounded-lg p-4 shadow-card">
        <SearchBar
          placeholder="Search appointments by patient name or type..."
          onSearch={setSearchTerm}
          showFilter={true}
          className="max-w-md"
        />
      </div>
      
      {viewMode === 'week' ? (
        /* Week View */
        <div className="space-y-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between bg-surface rounded-lg p-4 shadow-card">
            <Button
              variant="outline"
              size="sm"
              icon="ChevronLeft"
              onClick={() => navigateWeek(-1)}
            />
            
            <h2 className="text-lg font-semibold text-gray-900">
              {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
            </h2>
            
            <Button
              variant="outline"
              size="sm"
              icon="ChevronRight"
              onClick={() => navigateWeek(1)}
            />
          </div>
          
          {/* Week Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              
              return (
                <motion.div
                  key={day.toISOString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-surface rounded-lg p-4 shadow-card min-h-[200px] ${
                    isToday ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{format(day, 'EEE')}</p>
                      <p className={`text-sm ${isToday ? 'text-primary font-bold' : 'text-gray-500'}`}>
                        {format(day, 'dd')}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">{dayAppointments.length} apt</span>
                  </div>
                  
                  <div className="space-y-2">
                    {dayAppointments.map((appointment) => {
                      const patient = patients.find(p => p.Id === appointment.patientId);
                      return patient ? (
                        <div
                          key={appointment.Id}
                          className="bg-primary/10 rounded-lg p-2 text-xs"
                        >
                          <p className="font-medium text-primary">{patient.name}</p>
                          <p className="text-gray-600">
                            {format(new Date(appointment.scheduledTime), 'h:mm a')}
                          </p>
                          <p className="text-gray-500 capitalize">{appointment.type}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-surface rounded-lg shadow-card">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Appointments</h2>
            
            {filteredAppointments.length === 0 ? (
              <Empty
                title="No appointments found"
                description="No appointments match your search criteria."
                icon="Calendar"
              />
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => {
                  const patient = patients.find(p => p.Id === appointment.patientId);
                  return patient ? (
                    <AppointmentCard
                      key={appointment.Id}
                      appointment={appointment}
                      patient={patient}
                      showActions={true}
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;