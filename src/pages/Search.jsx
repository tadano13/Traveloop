import { useState, useEffect } from 'react';
import { Search as SearchIcon, SlidersHorizontal, MapPin, Star, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const destinations = [
  { id: 1, name: 'Paris', country: 'France', rating: 4.8, price: 1200, image: 'https://images.unsplash.com/photo-1502602898657-3e917247a184?w=600', tags: ['Culture', 'Romantic'] },
  { id: 2, name: 'Tokyo', country: 'Japan', rating: 4.9, price: 1500, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', tags: ['Modern', 'Food'] },
  { id: 3, name: 'Rome', country: 'Italy', rating: 4.7, price: 1100, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600', tags: ['History', 'Art'] },
  { id: 4, name: 'Bali', country: 'Indonesia', rating: 4.9, price: 800, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', tags: ['Nature', 'Beach'] },
  { id: 5, name: 'New York', country: 'USA', rating: 4.6, price: 1800, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600', tags: ['City', 'Shopping'] },
  { id: 6, name: 'Swiss Alps', country: 'Switzerland', rating: 5.0, price: 2000, image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=600', tags: ['Nature', 'Adventure'] },
];

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [trips, setTrips] = useState([]);
  const [selectedDest, setSelectedDest] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('trips')
      .select('id, name')
      .eq('user_id', user.id);
      
    if (data) setTrips(data);
  };

  const handleAddToTrip = async (tripId) => {
    if (!selectedDest) return;
    setIsAdding(true);

    const itemData = {
      trip_id: tripId,
<<<<<<< HEAD
      section: 'activities', // Add as an activity by default
=======
      section: 'activities',
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
      title: `Visit ${selectedDest.name}`,
      location: `${selectedDest.name}, ${selectedDest.country}`,
      cost: selectedDest.price,
      notes: `Added from Search. Tags: ${selectedDest.tags.join(', ')}`
    };

    const { error } = await supabase
      .from('itinerary_items')
      .insert([itemData]);

    setIsAdding(false);
    
    if (!error) {
      navigate(`/itinerary/${tripId}`);
    } else {
      alert('Error adding to trip: ' + error.message);
    }
  };

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) || 
    d.country.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 min-h-screen bg-gray-50">
      <header className="mb-10">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Explore Destinations</h1>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search cities, activities, or landmarks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all">
              <SlidersHorizontal className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

<<<<<<< HEAD
      {/* Grid */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.map((dest) => (
          <div key={dest.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="relative h-64 overflow-hidden group">
               <img 
                 src={dest.image} 
                 alt={dest.name} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {dest.rating}
               </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{dest.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {dest.country}
                  </p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Avg. Cost</p>
                   <p className="text-lg font-black text-blue-600">${dest.price}</p>
                </div>
              </div>

              <div className="flex gap-2 my-4">
                {dest.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 flex gap-3 border-t border-gray-100">
                 <button 
                    onClick={() => setSelectedDest(dest)}
                    className="flex-1 bg-black text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-gray-800 transition-colors"
                 >
                    Add to Trip
                 </button>
                 <button className="px-4 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition-all text-sm">
                    Details
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      {/* Modal */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
      {selectedDest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
            <button 
              onClick={() => setSelectedDest(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-black text-gray-900 mb-2">Add to Trip</h2>
            <p className="text-gray-500 mb-6">Select a trip to add <strong>{selectedDest.name}</strong> to your itinerary.</p>

            {trips.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You don't have any trips yet.</p>
                <button onClick={() => navigate('/create')} className="bg-black text-white px-6 py-3 rounded-xl font-bold">
                  Create a Trip
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {trips.map(trip => (
                  <button
                    key={trip.id}
                    onClick={() => handleAddToTrip(trip.id)}
                    disabled={isAdding}
                    className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all font-bold text-gray-900 flex justify-between items-center"
                  >
                    {trip.name}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
