import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Discovery from './pages/Discovery';
import Community from './pages/Community';
import Billing from './pages/Billing';
import CreateTrip from './pages/CreateTrip';
import Trips from './pages/Trips';
import Itinerary from './pages/Itinerary';
import Budget from './pages/Budget';
import Checklist from './pages/Checklist';
import Journal from './pages/Journal';
import Layout from './components/Layout';

import Search from './pages/Search';
import Admin from './pages/Admin';

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return <div className="p-12 text-center">Loading...</div>;
  return session ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/discovery" element={
          <ProtectedRoute><Discovery /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/create-trip" element={
          <ProtectedRoute><CreateTrip /></ProtectedRoute>
        } />
        <Route path="/trips" element={
          <ProtectedRoute><Trips /></ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute><Search /></ProtectedRoute>
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
        <Route path="/community" element={
          <ProtectedRoute><Community /></ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute><Billing /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute><Admin /></ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/discovery" />} />
      </Routes>
    </Router>
  );
}