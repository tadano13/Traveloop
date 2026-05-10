import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('traveloop_user') || 'null');
    if (!u) { navigate('/login'); return; }
    setUser(u);
    const allTrips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
    setTrips(allTrips.filter(t => t.userId === u.id));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('traveloop_user');
    navigate('/login');
  };

  const destinations = [
    { name: 'Paris', country: 'France', emoji: '🗼', cost: '₹85,000', tag: 'Romantic' },
    { name: 'Tokyo', country: 'Japan', emoji: '🗾', cost: '₹1,20,000', tag: 'Adventure' },
    { name: 'Bali', country: 'Indonesia', emoji: '🌴', cost: '₹45,000', tag: 'Budget' },
    { name: 'Dubai', country: 'UAE', emoji: '🏙️', cost: '₹95,000', tag: 'Luxury' },
    { name: 'Goa', country: 'India', emoji: '🏖️', cost: '₹15,000', tag: 'Beach' },
    { name: 'New York', country: 'USA', emoji: '🗽', cost: '₹1,50,000', tag: 'City' },
  ];

  const tagColors = {
    Romantic: '#ec4899', Adventure: '#f5a623',
    Budget: '#22c55e', Luxury: '#7c3aed',
    Beach: '#06b6d4', City: '#3b82f6'
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f3c 100%)' }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{ background: 'rgba(13,17,23,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>✈️</div>
          <span className="font-bold text-lg" style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Traveloop
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/trips')}
            className="text-gray-400 hover:text-white text-sm transition-colors">My Trips</button>
          <button onClick={() => navigate('/checklist')}
            className="text-gray-400 hover:text-white text-sm transition-colors">🎒 Checklist</button>
          <button onClick={() => navigate('/journal')}
            className="text-gray-400 hover:text-white text-sm transition-colors">📓 Journal</button>
          <button onClick={() => navigate('/create-trip')}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
            + New Trip
          </button>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 text-sm transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Hero */}
        <div className="mb-10 p-8 rounded-2xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.15), rgba(240,147,251,0.15))', border: '1px solid rgba(245,166,35,0.2)' }}>
          <div className="absolute top-0 right-0 text-9xl opacity-10">✈️</div>
          <p className="text-sm font-semibold mb-2" style={{ color: '#f5a623' }}>
            👋 Welcome back,
          </p>
          <h1 className="text-4xl font-bold text-white mb-3">
            {user?.name || 'Traveler'}!
          </h1>
          <p className="text-gray-400 mb-6">Where do you want to go next?</p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => navigate('/create-trip')}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
              🗺️ Plan New Trip
            </button>
            <button onClick={() => navigate('/trips')}
              className="px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
              📋 My Trips ({trips.length})
            </button>
            <button onClick={() => navigate('/checklist')}
              className="px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
              🎒 Packing List
            </button>
            <button onClick={() => navigate('/journal')}
              className="px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
              📓 Journal
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Trips', value: trips.length, icon: '🧳', color: '#f5a623' },
            { label: 'Cities Visited', value: trips.reduce((a, t) => a + (t.stops?.length || 0), 0), icon: '🏙️', color: '#7c3aed' },
            { label: 'Days Planned', value: trips.reduce((a, t) => a + (t.days || 0), 0), icon: '📅', color: '#22c55e' },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Trips */}
        {trips.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">🧳 Recent Trips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trips.slice(0, 4).map((trip, i) => (
                <div key={i} className="p-5 rounded-2xl cursor-pointer hover:scale-105 transition-transform"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onClick={() => navigate('/trips')}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-white">{trip.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(245,166,35,0.2)', color: '#f5a623' }}>
                      {trip.stops?.length || 0} cities
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{trip.startDate} → {trip.endDate}</p>
                  <div className="mt-3">
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}>
                      ₹{trip.budget || '0'} budget
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explore Destinations */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">🌍 Explore Destinations</h2>
            <span className="text-sm cursor-pointer" style={{ color: '#f5a623' }}
              onClick={() => navigate('/create-trip')}>Plan a trip →</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {destinations.map((dest, i) => (
              <div key={i}
                className="p-5 rounded-2xl cursor-pointer hover:scale-105 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onClick={() => navigate('/create-trip')}>
                <div className="text-4xl mb-3">{dest.emoji}</div>
                <h3 className="font-semibold text-white">{dest.name}</h3>
                <p className="text-gray-500 text-xs">{dest.country}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>{dest.cost}</span>
                  <span className="text-xs px-2 py-1 rounded-full"
                    style={{ background: `${tagColors[dest.tag]}22`, color: tagColors[dest.tag] }}>
                    {dest.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}