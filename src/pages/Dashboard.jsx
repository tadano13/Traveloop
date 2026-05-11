import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, CreditCard, ChevronRight, Plus, Compass, Briefcase, BookOpen, Plane, Map } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/login'); return; }

<<<<<<< HEAD
    // 1. Fetch Profile
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    setProfile(profileData);

<<<<<<< HEAD
    // 2. Fetch Trips
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
    const { data: tripsData } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setTrips(tripsData || []);
    setLoading(false);
  };

  return (
    <div className="p-8 md:p-12 bg-slate-50 min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-slate-900">Welcome back, {profile?.first_name || 'Traveler'}!</h1>
          <p className="text-slate-500">You have {trips.length} active trips planned.</p>
        </div>
        <button onClick={() => navigate('/create-trip')} className="btn-primary flex items-center gap-2 rounded-xl shadow-lg shadow-blue-200">
          <Plus className="w-5 h-5" /> Plan a New Trip
        </button>
      </header>

<<<<<<< HEAD
      {/* Stats Quick View */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="card p-6 border-none shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <MapPin className="w-7 h-7" />
           </div>
           <div>
              <p className="text-sm text-slate-500 font-medium">Total Trips</p>
              <h3 className="text-2xl font-bold text-slate-900">{trips.length}</h3>
           </div>
        </div>
        <div className="card p-6 border-none shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Compass className="w-7 h-7" />
           </div>
           <div>
              <p className="text-sm text-slate-500 font-medium">Cities Visited</p>
              <h3 className="text-2xl font-bold text-slate-900">{trips.reduce((a, t) => a + (t.stops?.length || 0), 0)}</h3>
           </div>
        </div>
        <div className="card p-6 border-none shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
              <CreditCard className="w-7 h-7" />
           </div>
           <div>
              <p className="text-sm text-slate-500 font-medium">Total Budget</p>
              <h3 className="text-2xl font-bold text-slate-900">${trips.reduce((a, t) => a + (Number(t.budget) || 0), 0)}</h3>
           </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Trips List */}
=======
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Itineraries</h2>
            <button onClick={() => navigate('/trips')} className="text-blue-600 text-sm font-semibold hover:text-blue-700">View All</button>
          </div>
          
          {trips.length === 0 ? (
            <div className="card p-12 text-center border-dashed border-2 border-slate-200 bg-transparent shadow-none">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Map className="w-8 h-8" />
              </div>
              <p className="text-slate-500 mb-4 font-medium">No trips planned yet.</p>
              <button onClick={() => navigate('/create-trip')} className="text-blue-600 font-bold hover:text-blue-700">Start planning now →</button>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.slice(0, 5).map((trip) => (
                <div key={trip.id} 
                  onClick={() => navigate(`/itinerary/${trip.id}`)}
                  className="card p-5 flex items-center justify-between group cursor-pointer border border-slate-100 hover:border-blue-200 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                      <Map className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{trip.name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> {trip.startDate || new Date(trip.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Budget</p>
                      <p className="text-sm font-bold text-slate-900">${trip.budget || 0}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

<<<<<<< HEAD
        {/* Sidebar / Quick Tools */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
        <div className="space-y-8">
           <div>
              <h2 className="text-xl font-bold mb-6 text-slate-900">Quick Tools</h2>
              <div className="grid grid-cols-1 gap-4">
                <button onClick={() => navigate('/checklist')} className="card p-4 flex items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all group border border-slate-100 shadow-sm">
                   <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                     <Briefcase className="w-5 h-5" />
                   </div>
                   <div className="text-left">
                     <span className="font-bold text-sm text-slate-900 block">Packing Checklist</span>
                     <span className="text-xs text-slate-500">Don't forget anything</span>
                   </div>
                </button>
                <button onClick={() => navigate('/journal')} className="card p-4 flex items-center gap-4 hover:border-orange-200 hover:shadow-md transition-all group border border-slate-100 shadow-sm">
                   <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                     <BookOpen className="w-5 h-5" />
                   </div>
                   <div className="text-left">
                     <span className="font-bold text-sm text-slate-900 block">Travel Journal</span>
                     <span className="text-xs text-slate-500">Record your memories</span>
                   </div>
                </button>
              </div>
           </div>

           <div className="card p-6 bg-blue-600 text-white border-none relative overflow-hidden shadow-lg shadow-blue-200">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Invite Friends</h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">Plan trips together and share memories in real-time.</p>
                <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors w-full">Invite Now</button>
              </div>
              <Plane className="absolute -bottom-8 -right-8 w-32 h-32 text-white opacity-10 rotate-[-15deg]" />
           </div>
        </div>
      </div>
    </div>
  );
}