import appointmentsData from '@/services/mockData/appointments.json';

const STORAGE_KEY = 'appointments';

// Load appointments from localStorage or use default data
const getAppointments = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : appointmentsData;
};

// Save appointments to localStorage
const saveAppointments = (appointments) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const AppointmentService = {
  async getAll() {
    await delay(300);
    return getAppointments();
  },

  async getById(id) {
    await delay(200);
    const appointments = getAppointments();
    return appointments.find(appointment => appointment.Id === id);
  },

  async create(appointmentData) {
    await delay(400);
    const appointments = getAppointments();
    const maxId = Math.max(...appointments.map(a => a.Id), 0);
    const newAppointment = {
      ...appointmentData,
      Id: maxId + 1
    };
    const updated = [...appointments, newAppointment];
    saveAppointments(updated);
    return newAppointment;
  },

  async update(id, appointmentData) {
    await delay(350);
    const appointments = getAppointments();
    const index = appointments.findIndex(appointment => appointment.Id === id);
    
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    
    const updated = [...appointments];
    updated[index] = { ...updated[index], ...appointmentData };
    saveAppointments(updated);
    return updated[index];
  },

  async delete(id) {
    await delay(300);
    const appointments = getAppointments();
    const filtered = appointments.filter(appointment => appointment.Id !== id);
    
    if (filtered.length === appointments.length) {
      throw new Error('Appointment not found');
    }
    
    saveAppointments(filtered);
    return true;
  }
};