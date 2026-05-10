import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Budget() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: '' });

  const categories = [
    { label: 'Transport', emoji: '✈️', color: '#3b82f6' },
    { label: 'Hotel', emoji: '🏨', color: '#7c3aed' },
    { label: 'Food', emoji: '🍜', color: '#ef4444' },
    { label: 'Activities', emoji: '🎯', color: '#f5a623' },
    { label: 'Shopping', emoji: '🛍️', color: '#ec4899' },
    { label: 'Other', emoji: '💸', color: '#6b7280' },
  ];

  useEffect(() => {
    const allTrips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
    const found = allTrips.find(t => t.id === parseInt(id));
    if (found) {
      setTrip(found);
      // Activity costs se expenses nikalo
      const actExpenses = [];
      (found.stops || []).forEach(stop => {
        (stop.activities || []).forEach(act => {
          if (act.cost) {
            actExpenses.push({
              id: act.id,
              name: act.name,
              amount: parseInt(act.cost),
              category: act.type || 'Activities',
              city: stop.city,
              auto: true
            });
          }
        });
      });
      const manualExpenses = JSON.parse(localStorage.getItem(`expenses_${id}`) || '[]');
      setExpenses([...actExpenses, ...manualExpenses]);
    }
  }, [id]);

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    const exp = {
      id: Date.now(),
      name: newExpense.name,
      amount: parseInt(newExpense.amount),
      category: newExpense.category || 'Other',
      auto: false
    };
    const manualExpenses = JSON.parse(localStorage.getItem(`expenses_${id}`) || '[]');
    manualExpenses.push(exp);
    localStorage.setItem(`expenses_${id}`, JSON.stringify(manualExpenses));
    setExpenses(prev => [...prev, exp]);
    setNewExpense({ name: '', amount: '', category: '' });
  };

  const removeExpense = (expId) => {
    const manualExpenses = JSON.parse(localStorage.getItem(`expenses_${id}`) || '[]');
    const updated = manualExpenses.filter(e => e.id !== expId);
    localStorage.setItem(`expenses_${id}`, JSON.stringify(updated));
    setExpenses(prev => prev.filter(e => e.id !== expId));
  };

  const totalBudget = parseInt(trip?.budget || 0);
  const totalSpent = expenses.reduce((a, e) => a + (e.amount || 0), 0);
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  // Category wise breakdown
  const categoryTotals = categories.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.label).reduce((a, e) => a + e.amount, 0)
  })).filter(c => c.total > 0);

  if (!trip) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
      <p className="text-white">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f3c 100%)' }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{ background: 'rgba(13,17,23,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/itinerary/${id}`)} className="text-gray-400 hover:text-white">← Back</button>
          <span className="font-bold text-white">💰 Budget Tracker</span>
        </div>
        <span className="text-sm" style={{ color: remaining >= 0 ? '#22c55e' : '#ef4444' }}>
          {remaining >= 0 ? '✅ On Budget' : '⚠️ Over Budget'}
        </span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Budget Overview */}
        <div className="p-6 rounded-2xl mb-6"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-xl font-bold text-white mb-4">📊 Budget Overview</h2>

          {/* Big Numbers */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-gray-400 text-xs mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-white">₹{totalBudget.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <p className="text-gray-400 text-xs mb-1">Total Spent</p>
              <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>₹{totalSpent.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-xl"
              style={{ background: remaining >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
              <p className="text-gray-400 text-xs mb-1">Remaining</p>
              <p className="text-2xl font-bold" style={{ color: remaining >= 0 ? '#22c55e' : '#ef4444' }}>
                ₹{Math.abs(remaining).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Budget Used</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  background: percentage > 90 ? '#ef4444' : percentage > 70 ? '#f5a623' : 'linear-gradient(90deg, #22c55e, #06b6d4)'
                }} />
            </div>
            {percentage > 90 && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>⚠️ Almost over budget!</p>
            )}
          </div>

          {/* Per Day */}
          {trip.days > 0 && (
            <div className="mt-4 p-3 rounded-xl flex justify-between items-center"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <span className="text-gray-400 text-sm">Average per day</span>
              <span className="font-bold" style={{ color: '#f5a623' }}>
                ₹{Math.round(totalSpent / trip.days).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        {categoryTotals.length > 0 && (
          <div className="p-6 rounded-2xl mb-6"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-lg font-bold text-white mb-4">📈 Category Breakdown</h2>
            <div className="space-y-3">
              {categoryTotals.map(cat => (
                <div key={cat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{cat.emoji} {cat.label}</span>
                    <span className="font-semibold" style={{ color: cat.color }}>
                      ₹{cat.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full"
                      style={{
                        width: `${totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0}%`,
                        background: cat.color
                      }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Expense */}
        <div className="p-6 rounded-2xl mb-6"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-lg font-bold text-white mb-4">➕ Add Expense</h2>
          <div className="space-y-3">
            <input
              placeholder="Expense name"
              value={newExpense.name}
              onChange={e => setNewExpense({ ...newExpense, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            />
            <input
              placeholder="Amount (₹)"
              type="number"
              value={newExpense.amount}
              onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            />
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat.label}
                  onClick={() => setNewExpense({ ...newExpense, category: cat.label })}
                  className="px-3 py-1.5 rounded-full text-xs transition-all"
                  style={{
                    background: newExpense.category === cat.label ? `${cat.color}33` : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${newExpense.category === cat.label ? cat.color : 'rgba(255,255,255,0.1)'}`,
                    color: newExpense.category === cat.label ? cat.color : '#9ca3af'
                  }}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
            <button onClick={addExpense}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
              Add Expense ✓
            </button>
          </div>
        </div>

        {/* Expense List */}
        <div className="p-6 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-lg font-bold text-white mb-4">🧾 All Expenses ({expenses.length})</h2>
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No expenses yet. Add activities or manual expenses!</p>
          ) : (
            <div className="space-y-2">
              {expenses.map(exp => {
                const cat = categories.find(c => c.label === exp.category);
                return (
                  <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-3">
                      <span>{cat?.emoji || '💸'}</span>
                      <div>
                        <p className="text-white text-sm">{exp.name}</p>
                        <div className="flex gap-2">
                          <span className="text-xs px-2 rounded-full"
                            style={{ background: `${cat?.color || '#6b7280'}22`, color: cat?.color || '#6b7280' }}>
                            {exp.category}
                          </span>
                          {exp.city && <span className="text-xs text-gray-500">{exp.city}</span>}
                          {exp.auto && <span className="text-xs text-gray-600">auto</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold" style={{ color: '#22c55e' }}>
                        ₹{exp.amount.toLocaleString()}
                      </span>
                      {!exp.auto && (
                        <button onClick={() => removeExpense(exp.id)}
                          className="text-red-400 text-xs hover:text-red-300">✕</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}