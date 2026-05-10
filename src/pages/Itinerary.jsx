import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Itinerary() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [showAddStop, setShowAddStop] = useState(false);
  const [newStop, setNewStop] = useState({ city: '', days: '', activities: [] });
  const [newActivity, setNewActivity] = useState({ name: '', cost: '', time: '', type: '' });

  const cities = [
    { name: 'Mumbai', country: 'India', emoji: '🏙️' },
    { name: 'Delhi', country: 'India', emoji: '🕌' },
    { name: 'Goa', country: 'India', emoji: '🏖️' },
    { name: 'Jaipur', country: 'India', emoji: '🏰' },
    { name: 'Paris', country: 'France', emoji: '🗼' },
    { name: 'Tokyo', country: 'Japan', emoji: '🗾' },
    { name: 'Bali', country: 'Indonesia', emoji: '🌴' },
    { name: 'Dubai', country: 'UAE', emoji: '🏙️' },
    { name: 'Singapore', country: 'Singapore', emoji: '🦁' },
    { name: 'London', country: 'UK', emoji: '🎡' },
    { name: 'New York', country: 'USA', emoji: '🗽' },
    { name: 'Bangkok', country: 'Thailand', emoji: '🛕' },
  ];

  const activityTypes = [
    { label: 'Sightseeing', emoji: '👁️', color: '#f5a623' },
    { label: 'Food', emoji: '🍜', color: '#ef4444' },
    { label: 'Adventure', emoji: '🧗', color: '#22c55e' },
    { label: 'Shopping', emoji: '🛍️', color: '#ec4899' },
    { label: 'Culture', emoji: '🏛️', color: '#7c3aed' },
    { label: 'Relaxation', emoji: '🧘', color: '#06b6d4' },
  ];

  useEffect(() => {
    const allTrips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
    const found = allTrips.find(t => t.id === parseInt(id));
    if (found) {
      setTrip(found);
      setStops(found.stops || []);
    }
  }, [id]);

  const saveStops = (updatedStops) => {
    const allTrips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
    const updated = allTrips.map(t =>
      t.id === parseInt(id) ? { ...t, stops: updatedStops } : t
    );
    localStorage.setItem('traveloop_trips', JSON.stringify(updated));
    setStops(updatedStops);
  };

  const addStop = () => {
    if (!newStop.city) return;
    const stop = {
      id: Date.now(),
      city: newStop.city,
      days: parseInt(newStop.days) || 1,
      activities: [],
      emoji: cities.find(c => c.name === newStop.city)?.emoji || '📍'
    };
    const updated = [...stops, stop];
    saveStops(updated);
    setNewStop({ city: '', days: '', activities: [] });
    setShowAddStop(false);
  };

  const removeStop = (stopId) => {
    saveStops(stops.filter(s => s.id !== stopId));
  };

  const addActivity = (stopId) => {
    if (!newActivity.name) return;
    const updated = stops.map(s =>
      s.id === stopId
        ? { ...s, activities: [...s.activities, { ...newActivity, id: Date.now() }] }
        : s
    );
    saveStops(updated);
    setNewActivity({ name: '', cost: '', time: '', type: '' });
  };

  const removeActivity = (stopId, actId) => {
    const updated = stops.map(s =>
      s.id === stopId
        ? { ...s, activities: s.activities.filter(a => a.id !== actId) }
        : s
    );
    saveStops(updated);
  };

  const typeColors = {
    Sightseeing: '#f5a623', Food: '#ef4444', Adventure: '#22c55e',
    Shopping: '#ec4899', Culture: '#7c3aed', Relaxation: '#06b6d4'
  };

  if (!trip) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: '#0d1117' }}>
      <p className="text-white">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f3c 100%)' }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{ background: 'rgba(13,17,23,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/trips')} className="text-gray-400 hover:text-white">← Back</button>
          <div>
            <span className="font-bold text-white">{trip.name}</span>
            <span className="text-gray-500 text-xs ml-2">{trip.days} days • {stops.length} cities</span>
          </div>
        </div>
        <button onClick={() => navigate(`/budget/${trip.id}`)}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #22c55e, #06b6d4)' }}>
          💰 Budget
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Trip Info Bar */}
        <div className="flex gap-4 mb-8 p-4 rounded-2xl flex-wrap"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span className="text-gray-300 text-sm">{trip.startDate} → {trip.endDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💰</span>
            <span className="text-gray-300 text-sm">₹{parseInt(trip.budget || 0).toLocaleString()} budget</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏙️</span>
            <span className="text-gray-300 text-sm">{stops.length} stops planned</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span className="text-gray-300 text-sm">
              ₹{stops.reduce((a, s) => a + s.activities.reduce((b, act) => b + (parseInt(act.cost) || 0), 0), 0).toLocaleString()} spent
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {stops.map((stop, index) => (
            <div key={stop.id} className="flex gap-4 mb-6">

              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
                  {index + 1}
                </div>
                {index < stops.length - 1 && (
                  <div className="w-0.5 flex-1 mt-2" style={{ background: 'rgba(245,166,35,0.3)', minHeight: '20px' }} />
                )}
              </div>

              {/* Stop Card */}
              <div className="flex-1 rounded-2xl overflow-hidden mb-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>

                {/* Stop Header */}
                <div className="flex items-center justify-between p-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{stop.emoji}</span>
                    <div>
                      <h3 className="font-bold text-white text-lg">{stop.city}</h3>
                      <span className="text-gray-400 text-sm">{stop.days} day{stop.days > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <button onClick={() => removeStop(stop.id)}
                    className="px-3 py-1 rounded-lg text-xs"
                    style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                    Remove
                  </button>
                </div>

                {/* Activities */}
                <div className="p-4">
                  {stop.activities.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {stop.activities.map(act => (
                        <div key={act.id} className="flex items-center justify-between p-3 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {activityTypes.find(t => t.label === act.type)?.emoji || '📌'}
                            </span>
                            <div>
                              <p className="text-white text-sm font-medium">{act.name}</p>
                              <div className="flex gap-2 mt-0.5">
                                {act.time && <span className="text-gray-500 text-xs">⏰ {act.time}</span>}
                                {act.type && (
                                  <span className="text-xs px-2 rounded-full"
                                    style={{ background: `${typeColors[act.type]}22`, color: typeColors[act.type] }}>
                                    {act.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {act.cost && <span className="text-sm font-semibold" style={{ color: '#22c55e' }}>₹{parseInt(act.cost).toLocaleString()}</span>}
                            <button onClick={() => removeActivity(stop.id, act.id)}
                              className="text-red-400 text-xs hover:text-red-300">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Activity Form */}
                  <div className="p-3 rounded-xl space-y-2"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <p className="text-gray-500 text-xs font-semibold">+ Add Activity</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Activity name"
                        value={newActivity.name}
                        onChange={e => setNewActivity({ ...newActivity, name: e.target.value })}
                        className="px-3 py-2 rounded-lg text-white text-xs outline-none col-span-2"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                      <input
                        placeholder="Cost (₹)"
                        type="number"
                        value={newActivity.cost}
                        onChange={e => setNewActivity({ ...newActivity, cost: e.target.value })}
                        className="px-3 py-2 rounded-lg text-white text-xs outline-none"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                      <input
                        placeholder="Time (e.g. 10:00 AM)"
                        value={newActivity.time}
                        onChange={e => setNewActivity({ ...newActivity, time: e.target.value })}
                        className="px-3 py-2 rounded-lg text-white text-xs outline-none"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {activityTypes.map(t => (
                        <button key={t.label}
                          onClick={() => setNewActivity({ ...newActivity, type: t.label })}
                          className="px-2 py-1 rounded-full text-xs transition-all"
                          style={{
                            background: newActivity.type === t.label ? `${t.color}33` : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${newActivity.type === t.label ? t.color : 'rgba(255,255,255,0.1)'}`,
                            color: newActivity.type === t.label ? t.color : '#6b7280'
                          }}>
                          {t.emoji} {t.label}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => addActivity(stop.id)}
                      className="w-full py-2 rounded-lg text-xs font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
                      Add Activity ✓
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Stop */}
        {!showAddStop ? (
          <button onClick={() => setShowAddStop(true)}
            className="w-full py-4 rounded-2xl font-semibold text-sm transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(245,166,35,0.4)', color: '#f5a623' }}>
            + Add New City Stop
          </button>
        ) : (
          <div className="p-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,166,35,0.3)' }}>
            <h3 className="text-white font-semibold mb-4">🏙️ Add New Stop</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Select City</label>
                <select
                  value={newStop.city}
                  onChange={e => setNewStop({ ...newStop, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <option value="">Choose a city...</option>
                  {cities.map(c => (
                    <option key={c.name} value={c.name}>{c.emoji} {c.name}, {c.country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Number of Days</label>
                <input
                  type="number"
                  min="1"
                  placeholder="How many days?"
                  value={newStop.days}
                  onChange={e => setNewStop({ ...newStop, days: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={addStop}
                  className="flex-1 py-3 rounded-xl font-semibold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
                  ✓ Add Stop
                </button>
                <button onClick={() => setShowAddStop(false)}
                  className="px-6 py-3 rounded-xl text-sm"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}