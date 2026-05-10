import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Journal() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', tripId: '', mood: '' });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');

  const moods = [
    { label: 'Excited', emoji: '🤩' },
    { label: 'Happy', emoji: '😊' },
    { label: 'Relaxed', emoji: '😌' },
    { label: 'Tired', emoji: '😴' },
    { label: 'Adventurous', emoji: '🧗' },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('traveloop_user') || 'null');
    if (!user) { navigate('/login'); return; }
    const allTrips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
    setTrips(allTrips.filter(t => t.userId === user.id));
    const savedNotes = JSON.parse(localStorage.getItem('traveloop_journal') || '[]');
    setNotes(savedNotes.filter(n => n.userId === user.id));
  }, [navigate]);

  const saveNote = () => {
    if (!newNote.title || !newNote.content) return;
    const user = JSON.parse(localStorage.getItem('traveloop_user'));
    const note = {
      id: Date.now(),
      userId: user.id,
      title: newNote.title,
      content: newNote.content,
      tripId: newNote.tripId,
      mood: newNote.mood,
      createdAt: new Date().toISOString(),
      tripName: trips.find(t => t.id === parseInt(newNote.tripId))?.name || 'General'
    };
    const allNotes = JSON.parse(localStorage.getItem('traveloop_journal') || '[]');
    allNotes.push(note);
    localStorage.setItem('traveloop_journal', JSON.stringify(allNotes));
    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', tripId: '', mood: '' });
    setShowForm(false);
  };

  const deleteNote = (id) => {
    const allNotes = JSON.parse(localStorage.getItem('traveloop_journal') || '[]');
    const updated = allNotes.filter(n => n.id !== id);
    localStorage.setItem('traveloop_journal', JSON.stringify(updated));
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const filtered = filter === 'All' ? notes : notes.filter(n => n.tripName === filter);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f3c 100%)' }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{ background: 'rgba(13,17,23,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white">← Back</button>
          <span className="font-bold text-white">📓 Trip Journal</span>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
          + New Note
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Add Note Form */}
        {showForm && (
          <div className="p-6 rounded-2xl mb-6"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,166,35,0.3)' }}>
            <h3 className="text-white font-bold text-lg mb-4">✍️ Write New Note</h3>
            <div className="space-y-3">
              <input
                placeholder="Note title..."
                value={newNote.title}
                onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              />
              <textarea
                placeholder="Write your travel memories, tips, reminders..."
                value={newNote.content}
                onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              />

              {/* Trip Select */}
              <select
                value={newNote.tripId}
                onChange={e => setNewNote({ ...newNote, tripId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <option value="">Select Trip (optional)</option>
                {trips.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              {/* Mood */}
              <div>
                <p className="text-gray-400 text-xs mb-2">How are you feeling?</p>
                <div className="flex gap-2 flex-wrap">
                  {moods.map(m => (
                    <button key={m.label}
                      onClick={() => setNewNote({ ...newNote, mood: m.label })}
                      className="px-3 py-1.5 rounded-full text-xs transition-all"
                      style={{
                        background: newNote.mood === m.label ? 'rgba(245,166,35,0.3)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${newNote.mood === m.label ? '#f5a623' : 'rgba(255,255,255,0.1)'}`,
                        color: newNote.mood === m.label ? '#f5a623' : '#9ca3af'
                      }}>
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={saveNote}
                  className="flex-1 py-3 rounded-xl font-semibold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
                  💾 Save Note
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-xl text-sm"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter by Trip */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button onClick={() => setFilter('All')}
            className="px-4 py-1.5 rounded-full text-sm transition-all"
            style={{
              background: filter === 'All' ? 'linear-gradient(135deg, #f5a623, #f093fb)' : 'rgba(255,255,255,0.06)',
              color: filter === 'All' ? 'white' : '#9ca3af',
              border: filter === 'All' ? 'none' : '1px solid rgba(255,255,255,0.1)'
            }}>
            All Notes
          </button>
          {trips.map(t => (
            <button key={t.id}
              onClick={() => setFilter(t.name)}
              className="px-4 py-1.5 rounded-full text-sm transition-all"
              style={{
                background: filter === t.name ? 'rgba(245,166,35,0.3)' : 'rgba(255,255,255,0.06)',
                color: filter === t.name ? '#f5a623' : '#9ca3af',
                border: filter === t.name ? '1px solid #f5a623' : '1px solid rgba(255,255,255,0.1)'
              }}>
              {t.name}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">📓</div>
            <h3 className="text-xl font-bold text-white mb-2">No notes yet!</h3>
            <p className="text-gray-400 mb-6">Start writing your travel memories</p>
            <button onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
              ✍️ Write First Note
            </button>
          </div>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(note => {
            const mood = moods.find(m => m.label === note.mood);
            return (
              <div key={note.id} className="p-5 rounded-2xl transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {mood && <span className="text-xl">{mood.emoji}</span>}
                    <h3 className="font-bold text-white">{note.title}</h3>
                  </div>
                  <button onClick={() => deleteNote(note.id)}
                    className="text-gray-600 hover:text-red-400 text-sm">🗑️</button>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{note.content}</p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: 'rgba(245,166,35,0.2)', color: '#f5a623' }}>
                      ✈️ {note.tripName}
                    </span>
                    {note.mood && (
                      <span className="text-xs px-2 py-1 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                        {note.mood}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-600 text-xs">
                    {new Date(note.createdAt).toLocaleDateString('en-IN')}
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