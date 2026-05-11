import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Plane, 
  Hotel, 
  Utensils, 
  Ticket, 
  ShoppingBag, 
  Wallet,
  ArrowLeft,
  PieChart,
  Plus,
  Trash2,
  TrendingUp
} from 'lucide-react';

export default function Budget() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: '' });
  const [loading, setLoading] = useState(true);

  const categories = [
    { label: 'Transport', icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50', hex: '#2563eb' },
    { label: 'Hotel', icon: Hotel, color: 'text-purple-600', bg: 'bg-purple-50', hex: '#9333ea' },
    { label: 'Food', icon: Utensils, color: 'text-red-600', bg: 'bg-red-50', hex: '#dc2626' },
    { label: 'Activities', icon: Ticket, color: 'text-orange-600', bg: 'bg-orange-50', hex: '#ea580c' },
    { label: 'Shopping', icon: ShoppingBag, color: 'text-pink-600', bg: 'bg-pink-50', hex: '#db2777' },
    { label: 'Other', icon: Wallet, color: 'text-slate-600', bg: 'bg-slate-100', hex: '#475569' },
  ];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/login'); return; }

    // Fetch Trip
    const { data: tripData } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();

    if (tripData) {
      // Calculate days
      const start = new Date(tripData.start_date || tripData.startDate);
      const end = new Date(tripData.end_date || tripData.endDate);
      tripData.days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 0;
      setTrip(tripData);
    }

    // Fetch Itinerary Items (which serve as expenses)
    const { data: itemsData } = await supabase
      .from('itinerary_items')
      .select('*')
      .eq('trip_id', id);

    if (itemsData) {
      const mappedExpenses = itemsData.map(item => {
        let category = 'Other';
        let auto = true;
        
        if (item.notes && categories.some(c => c.label === item.notes)) {
          category = item.notes; // Manual expense category
          auto = false;
        } else if (item.section === 'travel') {
          category = 'Transport';
        } else if (item.section === 'hotel') {
          category = 'Hotel';
        } else if (item.section === 'activities') {
          category = 'Activities';
        }

        return {
          id: item.id,
          name: item.title,
          amount: Number(item.cost) || 0,
          category: category,
          auto: auto
        };
      }).filter(e => e.amount > 0);
      
      setExpenses(mappedExpenses);
    }
    setLoading(false);
  };

  const addExpense = async () => {
    if (!newExpense.name || !newExpense.amount) return;

    // Use 'activities' section for manual expenses but store the category in 'notes'
    const itemData = {
      trip_id: id,
      section: 'activities', // Fallback section since we can't use custom ones
      title: newExpense.name,
      cost: Number(newExpense.amount),
      notes: newExpense.category || 'Other'
    };

    const { data, error } = await supabase
      .from('itinerary_items')
      .insert([itemData])
      .select()
      .single();

    if (!error && data) {
      setExpenses(prev => [...prev, {
        id: data.id,
        name: data.title,
        amount: Number(data.cost),
        category: data.notes,
        auto: false
      }]);
      setNewExpense({ name: '', amount: '', category: '' });
    }
  };

  const removeExpense = async (expId) => {
    setExpenses(prev => prev.filter(e => e.id !== expId));
    await supabase.from('itinerary_items').delete().eq('id', expId);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-500 font-bold">Loading Budget...</p>
    </div>
  );

  const totalBudget = parseInt(trip?.budget || 0);
  const totalSpent = expenses.reduce((a, e) => a + (e.amount || 0), 0);
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  // Category wise breakdown
  const categoryTotals = categories.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.label).reduce((a, e) => a + e.amount, 0)
  })).filter(c => c.total > 0);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/itinerary/${id}`)} className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" /> Budget Tracker
          </span>
        </div>
        <div className={`text-sm font-bold px-3 py-1.5 rounded-full ${remaining >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {remaining >= 0 ? 'On Budget' : 'Over Budget'}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-8">

        {/* Budget Overview */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-slate-400" /> Budget Overview
          </h2>

          {/* Big Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Budget</p>
              <p className="text-3xl font-black text-slate-900">${totalBudget.toLocaleString()}</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-red-50 border border-red-100">
              <p className="text-red-500 text-xs font-bold uppercase tracking-wider mb-2">Total Spent</p>
              <p className="text-3xl font-black text-red-600">${totalSpent.toLocaleString()}</p>
            </div>
            <div className={`text-center p-6 rounded-2xl border ${remaining >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${remaining >= 0 ? 'text-green-600' : 'text-red-500'}`}>Remaining</p>
              <p className={`text-3xl font-black ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(remaining).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm font-bold text-slate-500 mb-3">
              <span>Budget Used</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  background: percentage > 90 ? '#ef4444' : percentage > 70 ? '#f5a623' : '#2563eb'
                }} />
            </div>
            {percentage > 90 && (
              <p className="text-xs font-bold mt-2 text-red-500">Almost over budget!</p>
            )}
          </div>

          {/* Per Day */}
          {trip?.days > 0 && (
            <div className="mt-6 p-4 rounded-xl flex justify-between items-center bg-blue-50 border border-blue-100">
              <span className="text-blue-600 font-bold text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Average per day
              </span>
              <span className="font-black text-blue-700 text-lg">
                ${Math.round(totalSpent / trip.days).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Expense */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Add Expense
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expense Name</label>
                <input
                  placeholder="e.g. Taxi to hotel"
                  value={newExpense.name}
                  onChange={e => setNewExpense({ ...newExpense, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount ($)</label>
                <input
                  placeholder="0.00"
                  type="number"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = newExpense.category === cat.label;
                    return (
                      <button key={cat.label}
                        onClick={() => setNewExpense({ ...newExpense, category: cat.label })}
                        className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                          isSelected ? `${cat.bg} border-transparent ${cat.color}` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}>
                        <Icon className="w-3.5 h-3.5" /> {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <button onClick={addExpense}
                className="w-full mt-2 py-3.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md">
                Save Expense
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Category Breakdown */}
            {categoryTotals.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-600" /> Category Breakdown
                </h2>
                <div className="space-y-5">
                  {categoryTotals.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <div key={cat.label}>
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="font-bold flex items-center gap-2 text-slate-700">
                            <div className={`p-1.5 rounded-md ${cat.bg} ${cat.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            {cat.label}
                          </span>
                          <span className="font-black text-slate-900">
                            ${cat.total.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0}%`,
                              background: cat.hex
                            }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expense List */}
        <div className="mt-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-green-600" /> All Expenses ({expenses.length})
          </h2>
          {expenses.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No expenses yet. Add activities or manual expenses!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map(exp => {
                const cat = categories.find(c => c.label === exp.category) || categories[5];
                const Icon = cat.icon;
                return (
                  <div key={exp.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bg} ${cat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{exp.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${cat.bg} ${cat.color}`}>
                            {exp.category}
                          </span>
                          {exp.auto && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">auto</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-slate-900">
                        ${exp.amount.toLocaleString()}
                      </span>
                      {!exp.auto && (
                        <button onClick={() => removeExpense(exp.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
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