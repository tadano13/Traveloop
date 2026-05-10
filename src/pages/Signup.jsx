import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('traveloop_users') || '[]');
      const exists = users.find(u => u.email === form.email);

      if (exists) {
        setError('Email already registered');
        setLoading(false);
        return;
      }

      const newUser = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        password: form.password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('traveloop_users', JSON.stringify(users));
      localStorage.setItem('traveloop_user', JSON.stringify(newUser));
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f3c 50%, #0d1117 100%)' }}>

      {/* Background blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #f5a623, transparent)' }} />
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

      <div className="w-full max-w-md px-6 z-10 py-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
              ✈️
            </div>
            <span className="text-3xl font-bold"
              style={{ background: 'linear-gradient(135deg, #f5a623, #f093fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Traveloop
            </span>
          </div>
          <p className="text-gray-400 text-sm">Start planning your dream trips</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-2xl font-bold text-white mb-1">Create Account 🌍</h2>
          <p className="text-gray-400 text-sm mb-6">Join thousands of smart travelers</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-red-300"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>

            {/* Password strength indicator */}
            <div className="flex gap-1">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-1 flex-1 rounded-full transition-all"
                  style={{
                    background: form.password.length >= i * 3
                      ? i <= 1 ? '#ef4444' : i <= 2 ? '#f5a623' : i <= 3 ? '#3b82f6' : '#22c55e'
                      : 'rgba(255,255,255,0.1)'
                  }} />
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {form.password.length === 0 ? 'Enter password' :
               form.password.length < 4 ? '🔴 Weak' :
               form.password.length < 7 ? '🟡 Fair' :
               form.password.length < 10 ? '🔵 Good' : '🟢 Strong'}
            </p>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all mt-2"
              style={{ background: loading ? 'rgba(245,166,35,0.5)' : 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
              {loading ? '⏳ Creating account...' : '🌟 Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#f5a623' }} className="font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
            ©  Oddo X Parul University Hackathon 2026
        </p>
      </div>
    </div>
  );
}