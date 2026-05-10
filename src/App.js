import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import Trips from './pages/Trips';
import Itinerary from './pages/Itinerary';
import Budget from './pages/Budget';
import Checklist from './pages/Checklist';
import Journal from './pages/Journal';

const isLoggedIn = () => !!localStorage.getItem('traveloop_user');

const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/create-trip" element={
          <ProtectedRoute><CreateTrip /></ProtectedRoute>
        } />
        <Route path="/trips" element={
          <ProtectedRoute><Trips /></ProtectedRoute>
        } />
        <Route path="/itinerary/:id" element={
          <ProtectedRoute><Itinerary /></ProtectedRoute>
        } />
        <Route path="/budget/:id" element={
          <ProtectedRoute><Budget /></ProtectedRoute>
        } />
        <Route path="/checklist" element={
          <ProtectedRoute><Checklist /></ProtectedRoute>
        } />
        <Route path="/journal" element={
          <ProtectedRoute><Journal /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}