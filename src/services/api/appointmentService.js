import { toast } from 'react-toastify';

export const AppointmentService = {
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
          { "field": { "Name": "provider_id" } },
          { "field": { "Name": "scheduled_time" } },
          { "field": { "Name": "duration" } },
          { "field": { "Name": "type" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "video_room_url" } }
        ],
        "orderBy": [
          {
            "fieldName": "scheduled_time",
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
      
      const response = await apperClient.fetchRecords('appointment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform data to match existing UI expectations
      const transformedData = response.data?.map(appointment => ({
        Id: appointment.Id,
        patientId: appointment.patient_id?.Id,
        providerId: appointment.provider_id,
        scheduledTime: appointment.scheduled_time,
        duration: appointment.duration,
        type: appointment.type,
        status: appointment.status,
        videoRoomUrl: appointment.video_room_url
      })) || [];
      
      return transformedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching appointments:", error?.response?.data?.message);
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
          { "field": { "Name": "provider_id" } },
          { "field": { "Name": "scheduled_time" } },
          { "field": { "Name": "duration" } },
          { "field": { "Name": "type" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "video_room_url" } }
        ]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.getRecordById('appointment', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (!response.data) {
        return null;
      }
      
      // Transform data to match existing UI expectations
      const appointment = response.data;
      return {
        Id: appointment.Id,
        patientId: appointment.patient_id?.Id,
        providerId: appointment.provider_id,
        scheduledTime: appointment.scheduled_time,
        duration: appointment.duration,
        type: appointment.type,
        status: appointment.status,
        videoRoomUrl: appointment.video_room_url
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching appointment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(appointmentData) {
    try {
      const params = {
        records: [
          {
            Name: appointmentData.name || `Appointment for ${appointmentData.type}`,
            Tags: appointmentData.tags || "",
            patient_id: parseInt(appointmentData.patientId),
            provider_id: appointmentData.providerId || "",
            scheduled_time: appointmentData.scheduledTime,
            duration: appointmentData.duration,
            type: appointmentData.type,
            status: appointmentData.status || "scheduled",
            video_room_url: appointmentData.videoRoomUrl || ""
          }
        ]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.createRecord('appointment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} appointments:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdAppointment = successfulRecords[0].data;
          toast.success('Appointment created successfully');
          
          // Transform response to match UI expectations
          return {
            Id: createdAppointment.Id,
            patientId: createdAppointment.patient_id,
            providerId: createdAppointment.provider_id,
            scheduledTime: createdAppointment.scheduled_time,
            duration: createdAppointment.duration,
            type: createdAppointment.type,
            status: createdAppointment.status,
            videoRoomUrl: createdAppointment.video_room_url
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating appointment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, appointmentData) {
    try {
      const updateData = {
        Id: id
      };
      
      // Only include fields that are being updated
      if (appointmentData.name !== undefined) updateData.Name = appointmentData.name;
      if (appointmentData.tags !== undefined) updateData.Tags = appointmentData.tags;
      if (appointmentData.patientId !== undefined) updateData.patient_id = parseInt(appointmentData.patientId);
      if (appointmentData.providerId !== undefined) updateData.provider_id = appointmentData.providerId;
      if (appointmentData.scheduledTime !== undefined) updateData.scheduled_time = appointmentData.scheduledTime;
      if (appointmentData.duration !== undefined) updateData.duration = appointmentData.duration;
      if (appointmentData.type !== undefined) updateData.type = appointmentData.type;
      if (appointmentData.status !== undefined) updateData.status = appointmentData.status;
      if (appointmentData.videoRoomUrl !== undefined) updateData.video_room_url = appointmentData.videoRoomUrl;
      
      const params = {
        records: [updateData]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.updateRecord('appointment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} appointments:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedAppointment = successfulUpdates[0].data;
          toast.success('Appointment updated successfully');
          
          // Transform response to match UI expectations
          return {
            Id: updatedAppointment.Id,
            patientId: updatedAppointment.patient_id,
            providerId: updatedAppointment.provider_id,
            scheduledTime: updatedAppointment.scheduled_time,
            duration: updatedAppointment.duration,
            type: updatedAppointment.type,
            status: updatedAppointment.status,
            videoRoomUrl: updatedAppointment.video_room_url
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating appointment:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('appointment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} appointments:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Appointment deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting appointment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};