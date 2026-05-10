import { FileText, Download, PieChart, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';

const invoices = [
  { id: 'INV-001', vendor: 'Grand Hyatt Bali', date: '2025-06-15', amount: 450.00, status: 'Paid', category: 'Accommodation' },
  { id: 'INV-002', vendor: 'AirAsia', date: '2025-06-10', amount: 280.50, status: 'Paid', category: 'Travel' },
  { id: 'INV-003', vendor: 'Grab Rides', date: '2025-06-16', amount: 45.00, status: 'Pending', category: 'Transport' },
  { id: 'INV-004', vendor: 'Locavore Restaurant', date: '2025-06-17', amount: 120.00, status: 'Paid', category: 'Food' },
];

export default function Billing() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Billing & Invoices</h1>
          <p className="text-gray-500">Track your trip expenses and manage your invoices.</p>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-medium">Total Spent</p>
              <h2 className="text-2xl font-bold">$1,245.50</h2>
              <div className="flex items-center gap-1 text-green-600 text-xs font-bold mt-2">
                <ArrowDownRight className="w-3 h-3" /> 12% vs last trip
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <PieChart className="w-6 h-6" />
            </div>
          </div>

          <div className="card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-medium">Active Invoices</p>
              <h2 className="text-2xl font-bold">12</h2>
              <p className="text-xs text-gray-400 mt-2">3 pending payment</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-medium">Avg. Daily Spend</p>
              <h2 className="text-2xl font-bold">$124.00</h2>
              <div className="flex items-center gap-1 text-red-600 text-xs font-bold mt-2">
                <ArrowUpRight className="w-3 h-3" /> 5% over budget
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="card overflow-hidden border-none shadow-sm">
          <div className="p-6 border-b flex items-center justify-between bg-white">
            <h3 className="font-bold text-lg">Recent Invoices</h3>
            <button className="text-blue-600 text-sm font-semibold flex items-center gap-2">
              <Download className="w-4 h-4" /> Download All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{inv.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{inv.vendor}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{inv.date}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                        inv.category === 'Accommodation' ? 'bg-purple-50 text-purple-600' :
                        inv.category === 'Travel' ? 'bg-blue-50 text-blue-600' :
                        inv.category === 'Food' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'
                      }`}>
                        {inv.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">${inv.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${inv.status === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
                        ● {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-gray-400 hover:text-blue-600"><Download className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
