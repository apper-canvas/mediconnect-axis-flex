import { toast } from 'react-toastify';

export const PatientService = {
  async getAll() {
    try {
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "Owner" } },
          { "field": { "Name": "date_of_birth" } },
          { "field": { "Name": "insurance_provider" } },
          { "field": { "Name": "insurance_policy_number" } },
          { "field": { "Name": "insurance_group_number" } },
          { "field": { "Name": "insurance_verified" } },
          { "field": { "Name": "upcoming_appointments" } }
        ],
        "orderBy": [
          {
            "fieldName": "Name",
            "sorttype": "ASC"
          }
        ],
        "pagingInfo": {
          "limit": 100,
          "offset": 0
        }
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.fetchRecords('patient', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform data to match existing UI expectations
      const transformedData = response.data?.map(patient => ({
        Id: patient.Id,
        name: patient.Name,
        dateOfBirth: patient.date_of_birth,
        insurance: {
          provider: patient.insurance_provider,
          policyNumber: patient.insurance_policy_number,
          groupNumber: patient.insurance_group_number,
          verified: patient.insurance_verified
        },
        upcomingAppointments: patient.upcoming_appointments ? patient.upcoming_appointments.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      })) || [];
      
      return transformedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching patients:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "Owner" } },
          { "field": { "Name": "date_of_birth" } },
          { "field": { "Name": "insurance_provider" } },
          { "field": { "Name": "insurance_policy_number" } },
          { "field": { "Name": "insurance_group_number" } },
          { "field": { "Name": "insurance_verified" } },
          { "field": { "Name": "upcoming_appointments" } }
        ]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.getRecordById('patient', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (!response.data) {
        return null;
      }
      
      // Transform data to match existing UI expectations
      const patient = response.data;
      return {
        Id: patient.Id,
        name: patient.Name,
        dateOfBirth: patient.date_of_birth,
        insurance: {
          provider: patient.insurance_provider,
          policyNumber: patient.insurance_policy_number,
          groupNumber: patient.insurance_group_number,
          verified: patient.insurance_verified
        },
        upcomingAppointments: patient.upcoming_appointments ? patient.upcoming_appointments.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching patient with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(patientData) {
    try {
      const params = {
        records: [
          {
            Name: patientData.name,
            Tags: patientData.tags || "",
            date_of_birth: patientData.dateOfBirth,
            insurance_provider: patientData.insurance?.provider || "",
            insurance_policy_number: patientData.insurance?.policyNumber || "",
            insurance_group_number: patientData.insurance?.groupNumber || "",
            insurance_verified: patientData.insurance?.verified || false,
            upcoming_appointments: patientData.upcomingAppointments ? patientData.upcomingAppointments.join(',') : ""
          }
        ]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.createRecord('patient', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} patients:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdPatient = successfulRecords[0].data;
          toast.success('Patient created successfully');
          
          // Transform response to match UI expectations
          return {
            Id: createdPatient.Id,
            name: createdPatient.Name,
            dateOfBirth: createdPatient.date_of_birth,
            insurance: {
              provider: createdPatient.insurance_provider,
              policyNumber: createdPatient.insurance_policy_number,
              groupNumber: createdPatient.insurance_group_number,
              verified: createdPatient.insurance_verified
            },
            upcomingAppointments: createdPatient.upcoming_appointments ? createdPatient.upcoming_appointments.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating patient:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, patientData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: patientData.name,
            Tags: patientData.tags || "",
            date_of_birth: patientData.dateOfBirth,
            insurance_provider: patientData.insurance?.provider || "",
            insurance_policy_number: patientData.insurance?.policyNumber || "",
            insurance_group_number: patientData.insurance?.groupNumber || "",
            insurance_verified: patientData.insurance?.verified || false,
            upcoming_appointments: patientData.upcomingAppointments ? patientData.upcomingAppointments.join(',') : ""
          }
        ]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.updateRecord('patient', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} patients:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedPatient = successfulUpdates[0].data;
          toast.success('Patient updated successfully');
          
          // Transform response to match UI expectations
          return {
            Id: updatedPatient.Id,
            name: updatedPatient.Name,
            dateOfBirth: updatedPatient.date_of_birth,
            insurance: {
              provider: updatedPatient.insurance_provider,
              policyNumber: updatedPatient.insurance_policy_number,
              groupNumber: updatedPatient.insurance_group_number,
              verified: updatedPatient.insurance_verified
            },
            upcomingAppointments: updatedPatient.upcoming_appointments ? updatedPatient.upcoming_appointments.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating patient:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.deleteRecord('patient', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} patients:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Patient deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting patient:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};