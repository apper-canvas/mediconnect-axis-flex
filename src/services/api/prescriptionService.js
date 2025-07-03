import prescriptionsData from '@/services/mockData/prescriptions.json';

const STORAGE_KEY = 'prescriptions';

// Load prescriptions from localStorage or use default data
const getPrescriptions = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : prescriptionsData;
};

// Save prescriptions to localStorage
const savePrescriptions = (prescriptions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prescriptions));
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const PrescriptionService = {
  async getAll() {
    await delay(300);
    return getPrescriptions();
  },

  async getById(id) {
    await delay(200);
    const prescriptions = getPrescriptions();
    return prescriptions.find(prescription => prescription.Id === id);
  },

  async create(prescriptionData) {
    await delay(400);
    const prescriptions = getPrescriptions();
    const maxId = Math.max(...prescriptions.map(p => p.Id), 0);
    const newPrescription = {
      ...prescriptionData,
      Id: maxId + 1
    };
    const updated = [...prescriptions, newPrescription];
    savePrescriptions(updated);
    return newPrescription;
  },

  async update(id, prescriptionData) {
    await delay(350);
    const prescriptions = getPrescriptions();
    const index = prescriptions.findIndex(prescription => prescription.Id === id);
    
    if (index === -1) {
      throw new Error('Prescription not found');
    }
    
    const updated = [...prescriptions];
    updated[index] = { ...updated[index], ...prescriptionData };
    savePrescriptions(updated);
    return updated[index];
  },

  async delete(id) {
    await delay(300);
    const prescriptions = getPrescriptions();
    const filtered = prescriptions.filter(prescription => prescription.Id !== id);
    
    if (filtered.length === prescriptions.length) {
      throw new Error('Prescription not found');
    }
    
    savePrescriptions(filtered);
    return true;
  }
};