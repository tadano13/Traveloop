import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Trips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('traveloop_user') || 'null');
    if (!u) { navigate('/login'); return; }
    setUser(u);
    const allTrips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
    setTrips(allTrips.filter(t => t.userId === u.id));
  }, [navigate]);

  const deleteTrip = (id) => {
    const allTrips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
    const updated = allTrips.filter(t => t.id !== id);
    localStorage.setItem('traveloop_trips', JSON.stringify(updated));
    setTrips(updated.filter(t => t.userId === user.id));
  };

  const tripTypes = ['All', 'Adventure', 'Relaxation', 'Cultural', 'Romantic', 'Business', 'Budget'];

  const filtered = filter === 'All' ? trips : trips.filter(t => t.type === filter);

  const typeColors = {
    Adventure: '#f5a623', Relaxation: '#06b6d4',
    Cultural: '#7c3aed', Romantic: '#ec4899',
    Business: '#3b82f6', Budget: '#22c55e'
  };

  const typeEmojis = {
    Adventure: '🧗', Relaxation: '🏖️', Cultural: '🏛️',
    Romantic: '💑', Business: '💼', Budget: '💰'
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f3c 100%)' }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{ background: 'rgba(13,17,23,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white">← Back</button>
          <span className="font-bold text-lg" style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            My Trips
          </span>
        </div>
        <button onClick={() => navigate('/create-trip')}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
          + New Trip
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {tripTypes.map(type => (
            <button key={type}
              onClick={() => setFilter(type)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: filter === type ? 'linear-gradient(135deg, #f5a623, #f093fb)' : 'rgba(255,255,255,0.06)',
                color: filter === type ? 'white' : '#9ca3af',
                border: filter === type ? 'none' : '1px solid rgba(255,255,255,0.1)'
              }}>
              {type}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-white mb-2">No trips yet!</h3>
            <p className="text-gray-400 mb-6">Start planning your first adventure</p>
            <button onClick={() => navigate('/create-trip')}
              className="px-6 py-3 rounded-xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
              🚀 Plan First Trip
            </button>
          </div>
        )}

        {/* Trip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((trip) => (
            <div key={trip.id} className="rounded-2xl overflow-hidden transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>

              {/* Card Header */}
              <div className="p-5" style={{
                background: trip.type ? `linear-gradient(135deg, ${typeColors[trip.type]}22, transparent)` : 'transparent'
              }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{typeEmojis[trip.type] || '✈️'}</span>
                    <div>
                      <h3 className="font-bold text-white text-lg">{trip.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: trip.type ? `${typeColors[trip.type]}33` : 'rgba(255,255,255,0.1)',
                          color: trip.type ? typeColors[trip.type] : '#9ca3af'
                        }}>
                        {trip.type || 'General'}
                      </span>
                    </div>
                  </div>
                </div>

                {trip.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{trip.description}</p>
                )}

                {/* Trip Info */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-white font-semibold text-sm">{trip.days || 0}d</p>
                  </div>
                  <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <p className="text-xs text-gray-500">Cities</p>
                    <p className="text-white font-semibold text-sm">{trip.stops?.length || 0}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-semibold text-sm" style={{ color: '#22c55e' }}>
                      ₹{trip.budget ? parseInt(trip.budget).toLocaleString() : '0'}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                {trip.startDate && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    <span>📅</span>
                    <span>{trip.startDate} → {trip.endDate}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/itinerary/${trip.id}`)}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
                    🗺️ View Itinerary
                  </button>
                  <button
                    onClick={() => navigate(`/budget/${trip.id}`)}
                    className="px-3 py-2 rounded-xl text-sm transition-all"
                    style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                    💰
                  </button>
                  <button
                    onClick={() => deleteTrip(trip.id)}
                    className="px-3 py-2 rounded-xl text-sm transition-all"
                    style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}