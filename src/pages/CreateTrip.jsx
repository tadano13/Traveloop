import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Plane, 
  Calendar, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Compass,
  Briefcase,
  Heart,
  Music,
  ShoppingBag,
  Camera
} from 'lucide-react';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    type: ''
  });

  const tripTypes = [
    { label: 'Adventure', icon: Compass, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Relaxation', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Cultural', icon: Camera, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Business', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Festival', icon: Music, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Shopping', icon: ShoppingBag, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('trips')
        .insert([
          {
            user_id: user.id,
            name: form.name,
            description: form.description,
            start_date: form.startDate,
            end_date: form.endDate,
            budget: Number(form.budget),
            type: form.type
          }
        ]);

      if (error) throw error;

      navigate('/trips');
    } catch (err) {
      alert('Error creating trip: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Plan Your Adventure</h1>
          <p className="text-slate-500">Let's start by setting up the basics of your trip.</p>
        </header>

        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              {s < 3 && <div className={`w-20 h-1 rounded-full ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <div className="card p-8 bg-white border border-slate-200 shadow-sm min-h-[400px] flex flex-col rounded-3xl">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Trip Basics</h2>
              <div className="text-left">
                <label className="text-sm font-bold text-slate-700 mb-2 block">Trip Name</label>
                <input
                  type="text"
                  placeholder="e.g. Summer in Tokyo"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                />
              </div>
              <div className="text-left">
                <label className="text-sm font-bold text-slate-700 mb-2 block">Description (Optional)</label>
                <textarea
                  placeholder="What's the vibe of this trip?"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                ></textarea>
              </div>
              <div className="text-left">
                <label className="text-sm font-bold text-slate-700 mb-2 block">Trip Style</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tripTypes.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.label}
                        onClick={() => setForm({ ...form, type: t.label })}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all shadow-sm ${
                          form.type === t.label 
                            ? `${t.bg} border-blue-500 ring-2 ring-blue-500` 
                            : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${t.color}`} />
                        <span className="text-xs font-bold text-slate-700">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">When are you going?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-left">
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-900"
                  />
                </div>
                <div className="text-left">
                  <label className="text-sm font-bold text-slate-700 mb-2 block">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-900"
                  />
                </div>
              </div>
              <div className="p-8 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center gap-4 text-blue-600 shadow-sm">
                 <Calendar className="w-8 h-8" />
                 <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-500">Duration</p>
                    <p className="text-3xl font-black">
                      {form.startDate && form.endDate 
                        ? Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) 
                        : 0} Days
                    </p>
                 </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Set Your Budget</h2>
              <div className="text-left">
                <label className="text-sm font-bold text-slate-700 mb-2 block">Total Budget ($)</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={form.budget}
                    onChange={e => setForm({ ...form, budget: e.target.value })}
                    className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 shadow-sm"
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 shadow-sm">
                 <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Daily Limit</span>
                    <span className="font-black text-slate-900 text-lg">
                      ${form.budget && form.startDate && form.endDate 
                        ? (Number(form.budget) / (Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) || 1)).toFixed(2) 
                        : '0.00'}
                    </span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Currency</span>
                    <span className="font-black text-slate-900">USD ($)</span>
                 </div>
              </div>
            </div>
          )}

          <div className="mt-auto pt-10 flex gap-4">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200 shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
            )}
            <button
              onClick={() => step < 3 ? setStep(step + 1) : handleSave()}
              disabled={loading}
              className="flex-1 btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-200"
            >
              {loading ? 'Processing...' : step === 3 ? 'Finalize Trip' : 'Continue'} 
              {!loading && <ArrowRight className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}