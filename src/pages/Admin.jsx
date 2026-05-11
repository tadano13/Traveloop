import { Users, MapPin, TrendingUp, AlertTriangle, Settings, ShieldCheck, Search } from 'lucide-react';

const stats = [
  { label: 'Total Users', value: '4,205', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Trips', value: '1,120', change: '+8%', icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Revenue', value: '$45,200', change: '+15%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'System Health', value: '99.9%', change: 'Stable', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
];

export default function Admin() {
  return (
    <div className="p-8 md:p-12">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500">System overview and management console.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <Search className="w-4 h-4" /> System Logs
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <Settings className="w-4 h-4" /> Settings
           </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-6 border-none shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                 </div>
                 <span className={`text-xs font-bold ${stat.change.includes('+') ? 'text-green-600' : 'text-gray-400'}`}>
                    {stat.change}
                 </span>
              </div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* User Activity List */}
         <div className="lg:col-span-2 card border-none shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-white">
               <h3 className="font-bold text-lg">Recent User Activity</h3>
            </div>
            <div className="divide-y divide-gray-100">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm">
                          {String.fromCharCode(64 + i)}U
                       </div>
                       <div>
                          <p className="text-sm font-bold">User_{i} created a new trip to Bali</p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                       </div>
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:underline">Details</button>
                 </div>
               ))}
            </div>
         </div>

         {/* Alerts / Maintenance */}
         <div className="space-y-8">
            <div className="card p-6 border-none shadow-sm bg-white">
               <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" /> System Alerts
               </h3>
               <div className="space-y-4">
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-100">
                     Database latency spike detected (Region: Mumbai)
                  </div>
                  <div className="p-3 bg-orange-50 text-orange-700 rounded-xl text-xs font-medium border border-orange-100">
                     API Rate limit reached for 3 IPs
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-xs font-medium border border-blue-100">
                     New version (v2.1.0) ready for deployment
                  </div>
               </div>
            </div>

            <div className="card p-6 border-none shadow-sm bg-gray-900 text-white">
               <h3 className="font-bold text-lg mb-4">Storage Usage</h3>
               <div className="space-y-4">
                  <div className="flex justify-between text-xs">
                     <span className="text-gray-400">Current Usage</span>
                     <span className="font-bold">75% (1.5TB / 2TB)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-3/4"></div>
                  </div>
                  <p className="text-[10px] text-gray-500">Auto-scaling enabled. Next tier at 90%.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
