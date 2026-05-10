import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultItems = [
  { name: 'Passport', category: 'Documents' },
  { name: 'Visa', category: 'Documents' },
  { name: 'Flight Tickets', category: 'Documents' },
  { name: 'Hotel Booking', category: 'Documents' },
  { name: 'Travel Insurance', category: 'Documents' },
  { name: 'T-Shirts', category: 'Clothing' },
  { name: 'Pants/Jeans', category: 'Clothing' },
  { name: 'Comfortable Shoes', category: 'Clothing' },
  { name: 'Jacket', category: 'Clothing' },
  { name: 'Phone Charger', category: 'Electronics' },
  { name: 'Power Bank', category: 'Electronics' },
  { name: 'Earphones', category: 'Electronics' },
  { name: 'Camera', category: 'Electronics' },
  { name: 'Toothbrush', category: 'Toiletries' },
  { name: 'Sunscreen', category: 'Toiletries' },
  { name: 'Pain Killers', category: 'Medicine' },
];

export default function Checklist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: '' });
  const [filter, setFilter] = useState('All');

  const categories = [
    { label: 'Clothing', emoji: '👕', color: '#3b82f6' },
    { label: 'Documents', emoji: '📄', color: '#f5a623' },
    { label: 'Electronics', emoji: '💻', color: '#7c3aed' },
    { label: 'Toiletries', emoji: '🧴', color: '#06b6d4' },
    { label: 'Medicine', emoji: '💊', color: '#ef4444' },
    { label: 'Other', emoji: '🎒', color: '#6b7280' },
  ];

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    const saved = localStorage.getItem('traveloop_checklist');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      const defaults = defaultItems.map((item, i) => ({
        ...item, id: i + 1, packed: false
      }));
      setItems(defaults);
      localStorage.setItem('traveloop_checklist', JSON.stringify(defaults));
    }
  }, []);

  const saveItems = (updated) => {
    setItems(updated);
    localStorage.setItem('traveloop_checklist', JSON.stringify(updated));
  };

  const toggleItem = (id) => {
    saveItems(items.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const addItem = () => {
    if (!newItem.name) return;
    const item = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category || 'Other',
      packed: false
    };
    saveItems([...items, item]);
    setNewItem({ name: '', category: '' });
  };

  const removeItem = (id) => {
    saveItems(items.filter(i => i.id !== id));
  };

  const resetAll = () => {
    saveItems(items.map(i => ({ ...i, packed: false })));
  };

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);
  const packedCount = items.filter(i => i.packed).length;
  const percentage = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  const catColors = Object.fromEntries(categories.map(c => [c.label, c.color]));
  const catEmojis = Object.fromEntries(categories.map(c => [c.label, c.emoji]));

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f3c 100%)' }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{ background: 'rgba(13,17,23,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white">← Back</button>
          <span className="font-bold text-white">🎒 Packing Checklist</span>
        </div>
        <button onClick={resetAll}
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }}>
          Reset All
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Progress */}
        <div className="p-6 rounded-2xl mb-6"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-xl font-bold text-white">Packing Progress</h2>
              <p className="text-gray-400 text-sm">{packedCount} of {items.length} items packed</p>
            </div>
            <div className="text-4xl font-bold" style={{ color: percentage === 100 ? '#22c55e' : '#f5a623' }}>
              {percentage}%
            </div>
          </div>
          <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                background: percentage === 100 ? '#22c55e' : 'linear-gradient(90deg, #f5a623, #f093fb)'
              }} />
          </div>
          {percentage === 100 && (
            <p className="text-center mt-3 text-green-400 font-semibold">🎉 All packed! Ready to go!</p>
          )}
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {categories.map(cat => {
            const catItems = items.filter(i => i.category === cat.label);
            const catPacked = catItems.filter(i => i.packed).length;
            return (
              <div key={cat.label} className="p-3 rounded-xl text-center cursor-pointer transition-all"
                style={{
                  background: filter === cat.label ? `${cat.color}22` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${filter === cat.label ? cat.color : 'rgba(255,255,255,0.08)'}`
                }}
                onClick={() => setFilter(filter === cat.label ? 'All' : cat.label)}>
                <div className="text-xl mb-1">{cat.emoji}</div>
                <div className="text-xs text-gray-400">{cat.label}</div>
                <div className="text-sm font-bold" style={{ color: cat.color }}>
                  {catPacked}/{catItems.length}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Item */}
        <div className="p-5 rounded-2xl mb-6"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 className="text-white font-semibold mb-3">+ Add Item</h3>
          <div className="flex gap-2 mb-3">
            <input
              placeholder="Item name..."
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              onKeyPress={e => e.key === 'Enter' && addItem()}
              className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            />
            <button onClick={addItem}
              className="px-4 py-2.5 rounded-xl font-semibold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat.label}
                onClick={() => setNewItem({ ...newItem, category: cat.label })}
                className="px-3 py-1 rounded-full text-xs transition-all"
                style={{
                  background: newItem.category === cat.label ? `${cat.color}33` : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${newItem.category === cat.label ? cat.color : 'rgba(255,255,255,0.1)'}`,
                  color: newItem.category === cat.label ? cat.color : '#9ca3af'
                }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-4">
          <button onClick={() => setFilter('All')}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: filter === 'All' ? 'linear-gradient(135deg, #f5a623, #f093fb)' : 'rgba(255,255,255,0.06)',
              color: filter === 'All' ? 'white' : '#9ca3af',
              border: filter === 'All' ? 'none' : '1px solid rgba(255,255,255,0.1)'
            }}>
            All ({items.length})
          </button>
          <button onClick={() => setFilter('unpacked')}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: filter === 'unpacked' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)',
              color: filter === 'unpacked' ? '#ef4444' : '#9ca3af',
              border: filter === 'unpacked' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)'
            }}>
            Unpacked ({items.filter(i => !i.packed).length})
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          {(filter === 'unpacked' ? items.filter(i => !i.packed) : filtered).map(item => (
            <div key={item.id}
              className="flex items-center gap-3 p-4 rounded-xl transition-all"
              style={{
                background: item.packed ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${item.packed ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)'}`,
                opacity: item.packed ? 0.7 : 1
              }}>
              {/* Checkbox */}
              <button onClick={() => toggleItem(item.id)}
                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
                style={{
                  background: item.packed ? '#22c55e' : 'transparent',
                  border: `2px solid ${item.packed ? '#22c55e' : 'rgba(255,255,255,0.2)'}`
                }}>
                {item.packed && <span className="text-white text-xs">✓</span>}
              </button>

              {/* Item Info */}
              <span className="text-lg">{catEmojis[item.category] || '🎒'}</span>
              <div className="flex-1">
                <p className="text-sm font-medium"
                  style={{ color: item.packed ? '#6b7280' : 'white', textDecoration: item.packed ? 'line-through' : 'none' }}>
                  {item.name}
                </p>
                <span className="text-xs px-2 rounded-full"
                  style={{ background: `${catColors[item.category] || '#6b7280'}22`, color: catColors[item.category] || '#6b7280' }}>
                  {item.category}
                </span>
              </div>

              <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-400 text-sm">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}