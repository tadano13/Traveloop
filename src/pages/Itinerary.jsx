import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Plane, 
  Hotel, 
  Activity, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Calendar, 
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Itinerary() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('travel');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  // Form State
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
  const [newItem, setNewItem] = useState({
    title: '',
    cost: '',
    location: '',
    start_time: '',
    end_time: '',
    notes: ''
  });

  const tabs = [
    { id: 'travel', name: 'Travel', icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'hotel', name: 'Hotel', icon: Hotel, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { id: 'activities', name: 'Activities', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  ];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/login'); return; }

    const { data: tripData } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();

    if (tripData) setTrip(tripData);

    const { data: itemsData } = await supabase
      .from('itinerary_items')
      .select('*')
      .eq('trip_id', id)
      .order('start_time', { ascending: true });

    if (itemsData) setItems(itemsData);
    setLoading(false);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.title) return;

    const itemData = {
      trip_id: id,
      section: activeTab,
      title: newItem.title,
      cost: newItem.cost ? Number(newItem.cost) : 0,
      location: newItem.location || null,
      start_time: newItem.start_time ? new Date(newItem.start_time).toISOString() : null,
      end_time: newItem.end_time ? new Date(newItem.end_time).toISOString() : null,
      notes: newItem.notes || null
    };

    const { data, error } = await supabase
      .from('itinerary_items')
      .insert([itemData])
      .select()
      .single();

    if (!error && data) {
      setItems([...items, data]);
      setNewItem({ title: '', cost: '', location: '', start_time: '', end_time: '', notes: '' });
      setShowForm(false);
    }
  };

  const handleDelete = async (itemId) => {
    setItems(items.filter(i => i.id !== itemId));
    await supabase.from('itinerary_items').delete().eq('id', itemId);
  };

  if (loading) return <div className="p-12 text-center font-bold">Loading Itinerary...</div>;
  if (!trip) return <div className="p-12 text-center font-bold text-red-500">Trip not found</div>;

  const activeItems = items.filter(item => item.section === activeTab);
  
<<<<<<< HEAD
  // Totals
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
  const travelTotal = items.filter(i => i.section === 'travel').reduce((sum, i) => sum + Number(i.cost), 0);
  const hotelTotal = items.filter(i => i.section === 'hotel').reduce((sum, i) => sum + Number(i.cost), 0);
  const activityTotal = items.filter(i => i.section === 'activities').reduce((sum, i) => sum + Number(i.cost), 0);
  const totalSpent = travelTotal + hotelTotal + activityTotal;
  const remainingBudget = Number(trip.budget) - totalSpent;

  return (
    <div className="p-8 md:p-12 min-h-screen bg-gray-50">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate('/dashboard')}>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="font-medium text-gray-900">{trip.name}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">{trip.name} Itinerary</h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> 
              {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border">
            <div className="text-right">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Budget</p>
              <p className="text-2xl font-black text-green-600">${trip.budget || 0}</p>
            </div>
          </div>
        </div>
      </header>

<<<<<<< HEAD
      {/* Builder Sections Tabs */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
      <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm border overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? `${tab.bg} ${tab.color} ring-1 ring-inset ${tab.border}` 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.name}
            </button>
          );
        })}
      </div>

<<<<<<< HEAD
      {/* Section Content */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-bold capitalize flex items-center gap-2">
              {tabs.find(t => t.id === activeTab).icon({ className: `w-6 h-6 ${tabs.find(t => t.id === activeTab).color}` })}
              {activeTab} Details
            </h2>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-black text-white py-2 px-4 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Item</>}
            </button>
          </div>

<<<<<<< HEAD
          {/* Add Form */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
          {showForm && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-black">
              <h3 className="font-bold text-lg mb-4">Add {activeTab} plan</h3>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                  <input required value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})}
                    placeholder="e.g. Flight to Paris, Louvre Museum..."
                    className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Cost ($)</label>
                    <input type="number" value={newItem.cost} onChange={e => setNewItem({...newItem, cost: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                    <input value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Start Date & Time</label>
                    <input type="datetime-local" value={newItem.start_time} onChange={e => setNewItem({...newItem, start_time: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">End Date & Time</label>
                    <input type="datetime-local" value={newItem.end_time} onChange={e => setNewItem({...newItem, end_time: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all mt-4">
                  Save {activeTab} Item
                </button>
              </form>
            </div>
          )}

<<<<<<< HEAD
          {/* Items List */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
          {activeItems.length === 0 && !showForm ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
              <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${tabs.find(t => t.id === activeTab).bg} ${tabs.find(t => t.id === activeTab).color}`}>
                {tabs.find(t => t.id === activeTab).icon({ className: "w-8 h-8" })}
              </div>
              <h3 className="text-xl font-bold mb-2">No {activeTab} plans added yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Add your {activeTab} details to keep your itinerary organized and track your expenses effectively.
              </p>
              <button onClick={() => setShowForm(true)} className="bg-black text-white py-2 px-6 rounded-xl font-bold hover:bg-gray-800 transition-all">
                Plan {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeItems.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${tabs.find(t => t.id === activeTab).bg} ${tabs.find(t => t.id === activeTab).color}`}>
                      {tabs.find(t => t.id === activeTab).icon({ className: "w-6 h-6" })}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{item.title}</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-500 font-medium">
                        {item.start_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> 
                            {new Date(item.start_time).toLocaleString([], {month:'short', day:'numeric', hour: '2-digit', minute:'2-digit'})}
                          </div>
                        )}
                        {item.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {item.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <span className="font-black text-lg text-green-600">${Number(item.cost).toLocaleString()}</span>
                    <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

<<<<<<< HEAD
        {/* Right Sidebar - Summary */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                 <CreditCard className="w-5 h-5 text-blue-600" /> Expense Summary
              </h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-500">Travel</span>
                    <span className="text-gray-900">${travelTotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-500">Hotel</span>
                    <span className="text-gray-900">${hotelTotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-500">Activities</span>
                    <span className="text-gray-900">${activityTotal.toLocaleString()}</span>
                 </div>
                 <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Estimated</span>
                    <span className="font-black text-xl text-blue-600">${totalSpent.toLocaleString()}</span>
                 </div>
              </div>
           </div>

           {totalSpent > trip.budget ? (
             <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-800">
                <div className="flex items-center gap-2 mb-2">
                   <AlertCircle className="w-5 h-5 text-red-600" />
                   <h4 className="font-bold text-red-900">Over Budget!</h4>
                </div>
                <p className="text-sm font-medium">
                   You are currently <strong>${Math.abs(remainingBudget).toLocaleString()}</strong> over your estimated budget of ${trip.budget}.
                </p>
             </div>
           ) : (
             <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-green-800">
                <div className="flex items-center gap-2 mb-2">
                   <CheckCircle2 className="w-5 h-5 text-green-600" />
                   <h4 className="font-bold text-green-900">On Budget</h4>
                </div>
                <p className="text-sm font-medium">
                   You have <strong>${remainingBudget.toLocaleString()}</strong> remaining from your total budget of ${trip.budget}.
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}