import { toast } from 'react-toastify';

export const PrescriptionService = {
  async getAll() {
    try {
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "Owner" } },
          { 
            "field": { "name": "patient_id" },
            "referenceField": { "field": { "Name": "Name" } }
          },
          { "field": { "Name": "medication" } },
          { "field": { "Name": "dosage" } },
          { "field": { "Name": "instructions" } },
          { "field": { "Name": "refills" } },
          { "field": { "Name": "prescribed_date" } },
          { "field": { "Name": "status" } }
        ],
        "orderBy": [
          {
            "fieldName": "prescribed_date",
            "sorttype": "DESC"
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
      
      const response = await apperClient.fetchRecords('prescription', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform data to match existing UI expectations
      const transformedData = response.data?.map(prescription => ({
        Id: prescription.Id,
        patientId: prescription.patient_id?.Id,
        medication: prescription.medication,
        dosage: prescription.dosage,
        instructions: prescription.instructions,
        refills: prescription.refills,
        prescribedDate: prescription.prescribed_date,
        status: prescription.status
      })) || [];
      
      return transformedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching prescriptions:", error?.response?.data?.message);
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
          { 
            "field": { "name": "patient_id" },
            "referenceField": { "field": { "Name": "Name" } }
          },
          { "field": { "Name": "medication" } },
          { "field": { "Name": "dosage" } },
          { "field": { "Name": "instructions" } },
          { "field": { "Name": "refills" } },
          { "field": { "Name": "prescribed_date" } },
          { "field": { "Name": "status" } }
        ]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.getRecordById('prescription', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (!response.data) {
        return null;
      }
      
      // Transform data to match existing UI expectations
      const prescription = response.data;
      return {
        Id: prescription.Id,
        patientId: prescription.patient_id?.Id,
        medication: prescription.medication,
        dosage: prescription.dosage,
        instructions: prescription.instructions,
        refills: prescription.refills,
        prescribedDate: prescription.prescribed_date,
        status: prescription.status
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching prescription with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(prescriptionData) {
    try {
      const params = {
        records: [
          {
            Name: prescriptionData.name || prescriptionData.medication,
            Tags: prescriptionData.tags || "",
            patient_id: parseInt(prescriptionData.patientId),
            medication: prescriptionData.medication,
            dosage: prescriptionData.dosage,
            instructions: prescriptionData.instructions,
            refills: prescriptionData.refills,
            prescribed_date: prescriptionData.prescribedDate,
            status: prescriptionData.status || "active"
          }
        ]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.createRecord('prescription', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} prescriptions:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdPrescription = successfulRecords[0].data;
          toast.success('Prescription created successfully');
          
          // Transform response to match UI expectations
          return {
            Id: createdPrescription.Id,
            patientId: createdPrescription.patient_id,
            medication: createdPrescription.medication,
            dosage: createdPrescription.dosage,
            instructions: createdPrescription.instructions,
            refills: createdPrescription.refills,
            prescribedDate: createdPrescription.prescribed_date,
            status: createdPrescription.status
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating prescription:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, prescriptionData) {
    try {
      const updateData = {
        Id: id
      };
      
      // Only include fields that are being updated
      if (prescriptionData.name !== undefined) updateData.Name = prescriptionData.name;
      if (prescriptionData.tags !== undefined) updateData.Tags = prescriptionData.tags;
      if (prescriptionData.patientId !== undefined) updateData.patient_id = parseInt(prescriptionData.patientId);
      if (prescriptionData.medication !== undefined) updateData.medication = prescriptionData.medication;
      if (prescriptionData.dosage !== undefined) updateData.dosage = prescriptionData.dosage;
      if (prescriptionData.instructions !== undefined) updateData.instructions = prescriptionData.instructions;
      if (prescriptionData.refills !== undefined) updateData.refills = prescriptionData.refills;
      if (prescriptionData.prescribedDate !== undefined) updateData.prescribed_date = prescriptionData.prescribedDate;
      if (prescriptionData.status !== undefined) updateData.status = prescriptionData.status;
      
      const params = {
        records: [updateData]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.updateRecord('prescription', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} prescriptions:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedPrescription = successfulUpdates[0].data;
          toast.success('Prescription updated successfully');
          
          // Transform response to match UI expectations
          return {
            Id: updatedPrescription.Id,
            patientId: updatedPrescription.patient_id,
            medication: updatedPrescription.medication,
            dosage: updatedPrescription.dosage,
            instructions: updatedPrescription.instructions,
            refills: updatedPrescription.refills,
            prescribedDate: updatedPrescription.prescribed_date,
            status: updatedPrescription.status
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating prescription:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('prescription', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} prescriptions:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Prescription deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting prescription:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};