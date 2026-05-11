import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Shirt, FileText, Laptop, Droplets, Pill, Briefcase,
  ArrowLeft, RotateCcw, Plus, CheckCircle2, Circle, Trash2
} from 'lucide-react';

const defaultItems = [
  { task: 'Passport', category: 'Documents' },
  { task: 'Visa', category: 'Documents' },
  { task: 'Flight Tickets', category: 'Documents' },
  { task: 'Hotel Booking', category: 'Documents' },
  { task: 'Travel Insurance', category: 'Documents' },
  { task: 'T-Shirts', category: 'Clothing' },
  { task: 'Pants/Jeans', category: 'Clothing' },
  { task: 'Comfortable Shoes', category: 'Clothing' },
  { task: 'Jacket', category: 'Clothing' },
  { task: 'Phone Charger', category: 'Electronics' },
  { task: 'Power Bank', category: 'Electronics' },
  { task: 'Earphones', category: 'Electronics' },
  { task: 'Camera', category: 'Electronics' },
  { task: 'Toothbrush', category: 'Toiletries' },
  { task: 'Sunscreen', category: 'Toiletries' },
  { task: 'Pain Killers', category: 'Medicine' },
];

export default function Checklist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ task: '', category: '' });
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = [
    { label: 'Clothing', icon: Shirt, color: 'text-blue-600', bg: 'bg-blue-50', hex: '#2563eb' },
    { label: 'Documents', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', hex: '#d97706' },
    { label: 'Electronics', icon: Laptop, color: 'text-purple-600', bg: 'bg-purple-50', hex: '#9333ea' },
    { label: 'Toiletries', icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50', hex: '#0891b2' },
    { label: 'Medicine', icon: Pill, color: 'text-red-600', bg: 'bg-red-50', hex: '#dc2626' },
    { label: 'Other', icon: Briefcase, color: 'text-slate-600', bg: 'bg-slate-100', hex: '#475569' },
  ];

  useEffect(() => { fetchChecklist(); }, [navigate]);

  const fetchChecklist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/login'); return; }

    const { data, error } = await supabase
      .from('checklist').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) { console.error(error); return; }

    if (data && data.length > 0) {
      setItems(data);
    } else {
      const defaultData = defaultItems.map(item => ({
        user_id: user.id, task: item.task, category: item.category, is_completed: false
      }));
      const { data: inserted } = await supabase.from('checklist').insert(defaultData).select();
      if (inserted) setItems(inserted);
    }
    setLoading(false);
  };

  const toggleItem = async (id, currentStatus) => {
    setItems(items.map(item => item.id === id ? { ...item, is_completed: !currentStatus } : item));
    await supabase.from('checklist').update({ is_completed: !currentStatus }).eq('id', id);
  };

  const addItem = async () => {
    if (!newItem.task) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const itemData = { user_id: user.id, task: newItem.task, category: newItem.category || 'Other', is_completed: false };
    const { data } = await supabase.from('checklist').insert([itemData]).select().single();
    if (data) { setItems([...items, data]); setNewItem({ task: '', category: '' }); }
  };

  const removeItem = async (id) => {
    setItems(items.filter(i => i.id !== id));
    await supabase.from('checklist').delete().eq('id', id);
  };

  const resetAll = async () => {
    setItems(items.map(i => ({ ...i, is_completed: false })));
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('checklist').update({ is_completed: false }).eq('user_id', user.id);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-500 font-bold">Loading Checklist...</p>
    </div>
  );

  const filtered = filter === 'All' ? items : filter === 'unpacked' ? items.filter(i => !i.is_completed) : items.filter(i => i.category === filter);
  const packedCount = items.filter(i => i.is_completed).length;
  const percentage = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  const getCat = (label) => categories.find(c => c.label === label) || categories[5];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" /> Packing Checklist
          </span>
        </div>
        <button onClick={resetAll} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm">
          <RotateCcw className="w-4 h-4" /> Reset All
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-8">

        {/* Progress */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Packing Progress</h2>
              <p className="text-slate-500 text-sm mt-1">{packedCount} of {items.length} items packed</p>
            </div>
            <div className={`text-4xl font-black ${percentage === 100 ? 'text-green-600' : 'text-blue-600'}`}>
              {percentage}%
            </div>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%`, background: percentage === 100 ? '#16a34a' : '#2563eb' }} />
          </div>
          {percentage === 100 && (
            <p className="text-center mt-4 text-green-600 font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> All packed! Ready to go!
            </p>
          )}
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {categories.map(cat => {
            const Icon = cat.icon;
            const catItems = items.filter(i => i.category === cat.label);
            const catPacked = catItems.filter(i => i.is_completed).length;
            const isActive = filter === cat.label;
            return (
              <div key={cat.label}
                className={`p-3 rounded-2xl text-center cursor-pointer transition-all border ${isActive ? `${cat.bg} border-transparent` : 'bg-white border-slate-200 hover:border-slate-300'}`}
                onClick={() => setFilter(isActive ? 'All' : cat.label)}>
                <div className={`w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center ${isActive ? 'bg-white shadow-sm' : cat.bg}`}>
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                </div>
                <div className="text-[10px] font-bold text-slate-500 truncate">{cat.label}</div>
                <div className={`text-xs font-black ${cat.color}`}>{catPacked}/{catItems.length}</div>
              </div>
            );
          })}
        </div>

        {/* Add Item */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" /> Add Item
          </h3>
          <div className="flex gap-3 mb-4">
            <input
              placeholder="Item name..."
              value={newItem.task}
              onChange={e => setNewItem({ ...newItem, task: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 font-medium"
            />
            <button onClick={addItem} className="px-6 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md">
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = newItem.category === cat.label;
              return (
                <button key={cat.label}
                  onClick={() => setNewItem({ ...newItem, category: cat.label })}
                  className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${isSelected ? `${cat.bg} border-transparent ${cat.color}` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  <Icon className="w-3.5 h-3.5" /> {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['All', 'unpacked'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${filter === f ? 'bg-blue-600 text-white border-transparent shadow-md shadow-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
              {f === 'All' ? `All (${items.length})` : `Unpacked (${items.filter(i => !i.is_completed).length})`}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {filtered.map(item => {
            const cat = getCat(item.category);
            const Icon = cat.icon;
            return (
              <div key={item.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all group ${item.is_completed ? 'bg-green-50 border-green-100 opacity-70' : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'}`}>
                <button onClick={() => toggleItem(item.id, item.is_completed)}
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all border-2 ${item.is_completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-blue-400'}`}>
                  {item.is_completed && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.bg} ${cat.color} flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <p className={`font-bold text-sm ${item.is_completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {item.task}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${cat.bg} ${cat.color}`}>
                    {item.category}
                  </span>
                </div>

                <button onClick={() => removeItem(item.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}