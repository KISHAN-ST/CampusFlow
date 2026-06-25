import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Notices from './pages/Notices';
import Flashcards from './pages/Flashcards';
import PlacementTracker from './pages/PlacementTracker';
import Register from './pages/Register';

const getStudentId = () => localStorage.getItem('campusflow_student_id');

const ProtectedLayout = () => {
  if (!getStudentId()) return <Navigate to="/register" replace />;
  return <Layout />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/tasks"      element={<Tasks />} />
          <Route path="/notices"    element={<Notices />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/placement"  element={<PlacementTracker />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
