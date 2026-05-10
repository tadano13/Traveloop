import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', description: '', startDate: '', endDate: '',
    budget: '', currency: 'INR', type: ''
  });

  const tripTypes = [
    { label: 'Adventure', emoji: '🧗', color: '#f5a623' },
    { label: 'Relaxation', emoji: '🏖️', color: '#06b6d4' },
    { label: 'Cultural', emoji: '🏛️', color: '#7c3aed' },
    { label: 'Romantic', emoji: '💑', color: '#ec4899' },
    { label: 'Business', emoji: '💼', color: '#3b82f6' },
    { label: 'Budget', emoji: '💰', color: '#22c55e' },
  ];

  const handleSave = () => {
    const user = JSON.parse(localStorage.getItem('traveloop_user'));
    const trips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
    const days = form.startDate && form.endDate
      ? Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))
      : 0;

    const newTrip = {
      id: Date.now(),
      userId: user.id,
      ...form,
      days,
      stops: [],
      activities: [],
      createdAt: new Date().toISOString()
    };

    trips.push(newTrip);
    localStorage.setItem('traveloop_trips', JSON.stringify(trips));
    navigate('/trips');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f3c 100%)' }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(13,17,23,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white mr-2">← Back</button>
          <span className="font-bold text-lg" style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Create New Trip
          </span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: step >= s ? 'linear-gradient(135deg, #f5a623, #f093fb)' : 'rgba(255,255,255,0.1)',
                  color: 'white'
                }}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className="w-16 h-1 rounded-full"
                style={{ background: step > s ? 'linear-gradient(135deg, #f5a623, #f093fb)' : 'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>

        <div className="p-8 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>

          {/* Step 1 - Basic Info */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Trip Details ✈️</h2>
              <p className="text-gray-400 text-sm mb-6">Give your trip a name and description</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Trip Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Europe Summer 2025"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Description</label>
                  <textarea
                    placeholder="What's this trip about?"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-3 block">Trip Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {tripTypes.map(t => (
                      <button key={t.label}
                        onClick={() => setForm({ ...form, type: t.label })}
                        className="p-3 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: form.type === t.label ? `${t.color}33` : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${form.type === t.label ? t.color : 'rgba(255,255,255,0.1)'}`,
                          color: form.type === t.label ? t.color : '#9ca3af'
                        }}>
                        {t.emoji} {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Dates */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Travel Dates 📅</h2>
              <p className="text-gray-400 text-sm mb-6">When are you planning to travel?</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Start Date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={e => setForm({ ...form, startDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">End Date</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={e => setForm({ ...form, endDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' }}
                    />
                  </div>
                </div>

                {form.startDate && form.endDate && (
                  <div className="p-4 rounded-xl text-center"
                    style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)' }}>
                    <span className="text-2xl font-bold" style={{ color: '#f5a623' }}>
                      {Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">days trip planned!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 - Budget */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Trip Budget 💰</h2>
              <p className="text-gray-400 text-sm mb-6">Set your total budget for this trip</p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <select
                    value={form.currency}
                    onChange={e => setForm({ ...form, currency: e.target.value })}
                    className="px-4 py-3 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Enter total budget"
                    value={form.budget}
                    onChange={e => setForm({ ...form, budget: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                  />
                </div>

                {/* Quick Budget Options */}
                <div>
                  <p className="text-gray-400 text-xs mb-2">Quick select:</p>
                  <div className="flex flex-wrap gap-2">
                    {['10000', '25000', '50000', '100000', '200000'].map(amt => (
                      <button key={amt}
                        onClick={() => setForm({ ...form, budget: amt })}
                        className="px-3 py-1 rounded-full text-xs transition-all"
                        style={{
                          background: form.budget === amt ? 'rgba(245,166,35,0.3)' : 'rgba(255,255,255,0.08)',
                          border: `1px solid ${form.budget === amt ? '#f5a623' : 'rgba(255,255,255,0.1)'}`,
                          color: form.budget === amt ? '#f5a623' : '#9ca3af'
                        }}>
                        ₹{parseInt(amt).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-xl space-y-2"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-gray-400 text-sm font-semibold mb-3">Trip Summary</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Trip Name</span>
                    <span className="text-white">{form.name || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type</span>
                    <span className="text-white">{form.type || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="text-white">
                      {form.startDate && form.endDate
                        ? `${Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))} days`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Budget</span>
                    <span style={{ color: '#22c55e' }}>
                      {form.budget ? `${form.currency} ${parseInt(form.budget).toLocaleString()}` : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => { if (step === 1 && !form.name) return; setStep(step + 1); }}
                className="flex-1 py-3 rounded-xl font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)', opacity: step === 1 && !form.name ? 0.5 : 1 }}>
                Next →
              </button>
            ) : (
              <button onClick={handleSave}
                className="flex-1 py-3 rounded-xl font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
                🚀 Create Trip!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}