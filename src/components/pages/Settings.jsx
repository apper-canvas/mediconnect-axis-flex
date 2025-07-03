import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@mediconnect.com',
    phone: '+1 (555) 123-4567',
    specialty: 'Cardiologist',
    license: 'MD-12345'
  });
  
  const [videoSettings, setVideoSettings] = useState({
    camera: 'Default Camera',
    microphone: 'Default Microphone',
    speakers: 'Default Speakers',
    resolution: '1080p',
    autoJoin: true,
    recordConsultations: false
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    prescriptionAlerts: true,
    systemUpdates: false
  });
  
  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };
  
  const handleVideoSave = (e) => {
    e.preventDefault();
    toast.success('Video settings updated successfully');
  };
  
  const handleNotificationSave = (e) => {
    e.preventDefault();
    toast.success('Notification settings updated successfully');
  };
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'video', label: 'Video Settings', icon: 'Video' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>
      
      {/* Settings Navigation */}
      <div className="bg-surface rounded-lg shadow-card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                <p className="text-gray-600 mb-6">Update your personal and professional information</p>
              </div>
              
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      name: e.target.value
                    })}
                    required
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      email: e.target.value
                    })}
                    required
                  />
                  
                  <Input
                    label="Phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      phone: e.target.value
                    })}
                    required
                  />
                  
                  <Input
                    label="Specialty"
                    value={profileForm.specialty}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      specialty: e.target.value
                    })}
                    required
                  />
                  
                  <Input
                    label="License Number"
                    value={profileForm.license}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      license: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    icon="Save"
                  >
                    Save Profile
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
          
          {activeTab === 'video' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Settings</h3>
                <p className="text-gray-600 mb-6">Configure your video consultation preferences</p>
              </div>
              
              <form onSubmit={handleVideoSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Camera
                    </label>
                    <select
                      value={videoSettings.camera}
                      onChange={(e) => setVideoSettings({
                        ...videoSettings,
                        camera: e.target.value
                      })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    >
                      <option value="Default Camera">Default Camera</option>
                      <option value="Built-in Camera">Built-in Camera</option>
                      <option value="External Camera">External Camera</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Microphone
                    </label>
                    <select
                      value={videoSettings.microphone}
                      onChange={(e) => setVideoSettings({
                        ...videoSettings,
                        microphone: e.target.value
                      })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    >
                      <option value="Default Microphone">Default Microphone</option>
                      <option value="Built-in Microphone">Built-in Microphone</option>
                      <option value="External Microphone">External Microphone</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Speakers
                    </label>
                    <select
                      value={videoSettings.speakers}
                      onChange={(e) => setVideoSettings({
                        ...videoSettings,
                        speakers: e.target.value
                      })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    >
                      <option value="Default Speakers">Default Speakers</option>
                      <option value="Built-in Speakers">Built-in Speakers</option>
                      <option value="External Speakers">External Speakers</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Resolution
                    </label>
                    <select
                      value={videoSettings.resolution}
                      onChange={(e) => setVideoSettings({
                        ...videoSettings,
                        resolution: e.target.value
                      })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    >
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                      <option value="4K">4K</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoJoin"
                      checked={videoSettings.autoJoin}
                      onChange={(e) => setVideoSettings({
                        ...videoSettings,
                        autoJoin: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="autoJoin" className="ml-2 text-sm text-gray-700">
                      Auto-join video calls
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="recordConsultations"
                      checked={videoSettings.recordConsultations}
                      onChange={(e) => setVideoSettings({
                        ...videoSettings,
                        recordConsultations: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="recordConsultations" className="ml-2 text-sm text-gray-700">
                      Record consultations (with patient consent)
                    </label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    icon="Save"
                  >
                    Save Video Settings
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
          
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <p className="text-gray-600 mb-6">Choose how you want to receive notifications</p>
              </div>
              
              <form onSubmit={handleNotificationSave} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        smsNotifications: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Appointment Reminders</label>
                      <p className="text-sm text-gray-500">Get reminded about upcoming appointments</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.appointmentReminders}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        appointmentReminders: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Prescription Alerts</label>
                      <p className="text-sm text-gray-500">Get notified about prescription renewals</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.prescriptionAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        prescriptionAlerts: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">System Updates</label>
                      <p className="text-sm text-gray-500">Receive notifications about system updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.systemUpdates}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        systemUpdates: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    icon="Save"
                  >
                    Save Notification Settings
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
          
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                <p className="text-gray-600 mb-6">Manage your account security and privacy</p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      icon="Shield"
                    >
                      Enable 2FA
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Password</h4>
                      <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon="Key"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Active Sessions</h4>
                      <p className="text-sm text-gray-500">Manage your active sessions</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon="Monitor"
                    >
                      View Sessions
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Data Export</h4>
                      <p className="text-sm text-gray-500">Download your account data</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon="Download"
                    >
                      Request Data
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;