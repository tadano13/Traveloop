import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  BookOpen, ArrowLeft, Plus, Trash2, Smile, Star, 
  Wind, Moon, Mountain, Plane, Calendar, X
} from 'lucide-react';

export default function Journal() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', tripId: '', mood: '' });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const moods = [
    { label: 'Excited', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Happy', icon: Smile, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Relaxed', icon: Wind, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Tired', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Adventurous', icon: Mountain, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  useEffect(() => { fetchData(); }, [navigate]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/login'); return; }

    const { data: tripsData } = await supabase.from('trips').select('id, name').eq('user_id', user.id);
    setTrips(tripsData || []);

    const { data: notesData } = await supabase
      .from('notes').select('*, trips ( name )').eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setNotes(notesData || []);
    setLoading(false);
  };

  const saveNote = async () => {
    if (!newNote.title || !newNote.content) { alert('Title and content are required'); return; }
    if (!newNote.tripId) { alert('Please select a trip for this note'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('notes')
      .insert([{ user_id: user.id, trip_id: newNote.tripId, title: newNote.title, content: newNote.content, mood: newNote.mood }])
      .select('*, trips(name)').single();
    if (error) { alert('Error saving note: ' + error.message); return; }
    if (data) { setNotes([data, ...notes]); setNewNote({ title: '', content: '', tripId: '', mood: '' }); setShowForm(false); }
  };

  const deleteNote = async (id) => {
    setNotes(notes.filter(n => n.id !== id));
    await supabase.from('notes').delete().eq('id', id);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-500 font-bold">Loading Journal...</p>
    </div>
  );

  const filtered = filter === 'All' ? notes : notes.filter(n => n.trips?.name === filter);
  const getMood = (label) => moods.find(m => m.label === label);

  return (
    <div className="min-h-screen bg-slate-50">
<<<<<<< HEAD
      {/* Navbar */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" /> Trip Journal
          </span>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md">
          <Plus className="w-4 h-4" /> New Note
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-8">

        {showForm && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-500" /> Write New Note
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Note Title</label>
                <input placeholder="e.g. Sunrise at the Eiffel Tower..."
                  value={newNote.title} onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Memory</label>
                <textarea placeholder="Write your travel memories, tips, reminders..."
                  value={newNote.content} onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                  rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-medium text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Trip</label>
                <select value={newNote.tripId} onChange={e => setNewNote({ ...newNote, tripId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900">
                  <option value="">Select Trip (Required)</option>
                  {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">How are you feeling?</label>
                <div className="flex gap-2 flex-wrap">
                  {moods.map(m => {
                    const Icon = m.icon;
                    const isSelected = newNote.mood === m.label;
                    return (
                      <button key={m.label} onClick={() => setNewNote({ ...newNote, mood: m.label })}
                        className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${isSelected ? `${m.bg} border-transparent ${m.color}` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        <Icon className="w-3.5 h-3.5" /> {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={saveNote} className="w-full py-3.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md mt-2">
                Save Note
              </button>
            </div>
          </div>
        )}

<<<<<<< HEAD
        {/* Filter Tabs */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
        <div className="flex gap-2 flex-wrap mb-8">
          <button onClick={() => setFilter('All')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${filter === 'All' ? 'bg-blue-600 text-white border-transparent shadow-md shadow-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
            All Notes
          </button>
          {trips.map(t => (
            <button key={t.id} onClick={() => setFilter(t.name)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${filter === t.name ? 'bg-blue-600 text-white border-transparent shadow-md shadow-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
              {t.name}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No notes yet!</h3>
            <p className="text-slate-500 mb-6">Start writing your travel memories</p>
            <button onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md">
              Write First Note
            </button>
          </div>
        )}

<<<<<<< HEAD
        {/* Notes Grid */}
=======
>>>>>>> 4dbf9276d2aa7ffcc438ac89259e3f2033fa321b
        <div className="space-y-4">
          {filtered.map(note => {
            const mood = getMood(note.mood);
            const MoodIcon = mood?.icon;
            return (
              <div key={note.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {mood && MoodIcon && (
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mood.bg} ${mood.color}`}>
                        <MoodIcon className="w-5 h-5" />
                      </div>
                    )}
                    <h3 className="font-bold text-slate-900 text-lg">{note.title}</h3>
                  </div>
                  <button onClick={() => deleteNote(note.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{note.content}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 flex items-center gap-1.5">
                      <Plane className="w-3 h-3" /> {note.trips?.name || 'Unknown Trip'}
                    </span>
                    {note.mood && mood && (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${mood.bg} ${mood.color}`}>
                        {note.mood}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(note.created_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}