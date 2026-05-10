import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Calendar, Users, Star } from 'lucide-react';

const regions = [
  { name: 'Europe', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400', trips: '1.2k+' },
  { name: 'Asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400', trips: '2.5k+' },
  { name: 'Africa', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400', trips: '800+' },
  { name: 'America', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc39?w=400', trips: '1.8k+' },
];

export default function Discovery() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen pb-12">
      {/* Header / Search */}
      <div className="bg-white border-b sticky top-0 z-20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search destinations, activities, or trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="btn-primary py-2 px-6 rounded-full text-sm">Search</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        {/* Hero Banner */}
        <div className="relative h-[400px] rounded-3xl overflow-hidden mb-12 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-12 text-white">
            <h1 className="text-5xl font-bold mb-4">Discover Your Next Adventure</h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl">
              Explore thousands of curated travel itineraries and plan your dream trip in minutes.
            </p>
            <div className="flex gap-4">
              <button onClick={() => navigate('/create-trip')} className="btn-primary py-3 px-8 text-lg rounded-xl">
                Plan Trip
              </button>
              <button className="bg-white/20 backdrop-blur-md text-white py-3 px-8 text-lg rounded-xl border border-white/30 hover:bg-white/30 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Regions */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Explore Regions</h2>
            <button className="text-blue-600 font-semibold text-sm">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {regions.map((region) => (
              <div key={region.name} className="card group cursor-pointer overflow-hidden border-none shadow-sm">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={region.image} 
                    alt={region.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{region.name}</h3>
                  <p className="text-xs text-gray-500">{region.trips} trips shared</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Trips / Community Preview */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Trending Itineraries</h2>
            <button onClick={() => navigate('/community')} className="text-blue-600 font-semibold text-sm">See Community Feed</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                   <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=600`} alt="Trip" className="w-full h-full object-cover" />
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.9
                   </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Europe Tour</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded">10 Days</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Summer in the Swiss Alps</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Zurich</div>
                    <div className="flex items-center gap-1"><Users className="w-4 h-4" /> 2 People</div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold">JD</div>
                      <span className="text-xs font-medium">John Doe</span>
                    </div>
                    <span className="font-bold text-blue-600">$1,250</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
