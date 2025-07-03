import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StatusIndicator from '@/components/molecules/StatusIndicator';

const VideoConsultation = ({ appointment, patient, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('excellent');
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleMute = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? 'Microphone enabled' : 'Microphone muted');
  };
  
  const handleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast.success(isVideoOff ? 'Video enabled' : 'Video disabled');
  };
  
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const handleRecord = () => {
    setIsRecording(!isRecording);
    toast.success(isRecording ? 'Recording stopped' : 'Recording started');
  };
  
  const handleEndCall = () => {
    if (window.confirm('Are you sure you want to end this consultation?')) {
      onEndCall?.();
      toast.success('Consultation ended');
    }
  };
  
  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'h-96'} bg-gray-900 rounded-lg overflow-hidden`}>
      {/* Video Feed */}
      <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        {isVideoOff ? (
          <div className="text-center">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="User" className="w-12 h-12 text-white" />
            </div>
            <p className="text-white text-lg font-medium">{patient.name}</p>
            <p className="text-gray-400">Video is off</p>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="User" className="w-16 h-16 text-white" />
              </div>
              <p className="text-white text-xl font-medium">{patient.name}</p>
              <p className="text-gray-400">Simulated video feed</p>
            </div>
          </div>
        )}
        
        {/* Doctor's Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="absolute top-4 left-4 flex items-center space-x-4">
          <div className="bg-black bg-opacity-50 rounded-lg px-3 py-2">
            <StatusIndicator status={connectionStatus} type="connection" />
          </div>
          
          <div className="bg-black bg-opacity-50 rounded-lg px-3 py-2">
            <span className="text-white font-medium">{formatDuration(callDuration)}</span>
          </div>
          
          {isRecording && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="bg-error rounded-lg px-3 py-2 flex items-center space-x-2"
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white text-sm font-medium">REC</span>
            </motion.div>
          )}
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 bg-black bg-opacity-50 rounded-lg px-6 py-3">
            <Button
              variant={isMuted ? 'danger' : 'ghost'}
              size="sm"
              icon={isMuted ? 'MicOff' : 'Mic'}
              onClick={handleMute}
              className="text-white hover:bg-white hover:bg-opacity-20"
            />
            
            <Button
              variant={isVideoOff ? 'danger' : 'ghost'}
              size="sm"
              icon={isVideoOff ? 'VideoOff' : 'Video'}
              onClick={handleVideo}
              className="text-white hover:bg-white hover:bg-opacity-20"
            />
            
            <Button
              variant="ghost"
              size="sm"
              icon="Monitor"
              onClick={handleFullscreen}
              className="text-white hover:bg-white hover:bg-opacity-20"
            />
            
            <Button
              variant={isRecording ? 'danger' : 'ghost'}
              size="sm"
              icon="Circle"
              onClick={handleRecord}
              className="text-white hover:bg-white hover:bg-opacity-20"
            />
            
            <Button
              variant="danger"
              size="sm"
              icon="PhoneOff"
              onClick={handleEndCall}
            >
              End Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;