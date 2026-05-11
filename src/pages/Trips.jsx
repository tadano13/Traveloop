import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, MapPin, Trash2, ChevronRight, MoreVertical, Map } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Trips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchTrips();
  }, [navigate]);

  const fetchTrips = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/login'); return; }

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trips:', error);
    } else {
      setTrips(data);
    }
    setLoading(false);
  };

  const deleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting trip: ' + error.message);
    } else {
      setTrips(trips.filter(t => t.id !== id));
    }
  };

  const tripTypes = ['All', 'Adventure', 'Relaxation', 'Cultural', 'Romantic', 'Business', 'Budget'];

  const filteredTrips = filter === 'All' ? trips : trips.filter(t => t.type === filter);

  return (
    <div className="p-8 md:p-12 bg-slate-50 min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-slate-900">My Trips</h1>
          <p className="text-slate-500">Manage all your upcoming and past adventures.</p>
        </div>
        <button onClick={() => navigate('/create-trip')} className="btn-primary flex items-center gap-2 rounded-xl shadow-lg shadow-blue-200">
          <Plus className="w-5 h-5" /> New Trip
        </button>
      </header>

<<<<<<< HEAD
      {/* Filters & Search */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search trips..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {tripTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                filter === type 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

<<<<<<< HEAD
      {/* Trips Grid */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
      {filteredTrips.length === 0 ? (
        <div className="card p-20 text-center bg-white border border-slate-200 shadow-sm rounded-2xl">
           <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-slate-400" />
           </div>
           <h3 className="text-xl font-bold mb-2 text-slate-900">No trips found</h3>
           <p className="text-slate-500 mb-8 max-w-xs mx-auto">
             You haven't planned any trips in this category yet. Start your next adventure today!
           </p>
           <button onClick={() => navigate('/create-trip')} className="btn-primary px-8 rounded-xl font-bold">
             Plan Your First Trip
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="card bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden group hover:border-blue-200 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate(`/itinerary/${trip.id}`)}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                      <Map className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{trip.name}</h3>
                      <span className="inline-block mt-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {trip.type || 'General'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button onClick={() => deleteTrip(trip.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold">{trip.start_date ? new Date(trip.start_date).toLocaleDateString() : trip.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold">{trip.stops?.length || 0} Cities</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/150?u=${trip.id + i}`} alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold border-2 border-white text-slate-500">+2</div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-blue-600 transition-all">
                    Manage Trip <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}