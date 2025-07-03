import patientsData from '@/services/mockData/patients.json';

const STORAGE_KEY = 'patients';

// Load patients from localStorage or use default data
const getPatients = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : patientsData;
};

// Save patients to localStorage
const savePatients = (patients) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const PatientService = {
  async getAll() {
    await delay(300);
    return getPatients();
  },

  async getById(id) {
    await delay(200);
    const patients = getPatients();
    return patients.find(patient => patient.Id === id);
  },

  async create(patientData) {
    await delay(400);
    const patients = getPatients();
    const maxId = Math.max(...patients.map(p => p.Id), 0);
    const newPatient = {
      ...patientData,
      Id: maxId + 1
    };
    const updated = [...patients, newPatient];
    savePatients(updated);
    return newPatient;
  },

  async update(id, patientData) {
    await delay(350);
    const patients = getPatients();
    const index = patients.findIndex(patient => patient.Id === id);
    
    if (index === -1) {
      throw new Error('Patient not found');
    }
    
    const updated = [...patients];
    updated[index] = { ...updated[index], ...patientData };
    savePatients(updated);
    return updated[index];
  },

  async delete(id) {
    await delay(300);
    const patients = getPatients();
    const filtered = patients.filter(patient => patient.Id !== id);
    
    if (filtered.length === patients.length) {
      throw new Error('Patient not found');
    }
    
    savePatients(filtered);
    return true;
  }
};