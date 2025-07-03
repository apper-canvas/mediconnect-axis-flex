import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import Appointments from '@/components/pages/Appointments';
import Patients from '@/components/pages/Patients';
import Consultations from '@/components/pages/Consultations';
import Prescriptions from '@/components/pages/Prescriptions';
import Settings from '@/components/pages/Settings';
import PatientProfile from '@/components/pages/PatientProfile';
import ConsultationRoom from '@/components/pages/ConsultationRoom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:id" element={<PatientProfile />} />
            <Route path="/consultations" element={<Consultations />} />
            <Route path="/consultations/:id" element={<ConsultationRoom />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;