import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('traveloop_users') || '[]');
      const user = users.find(u => u.email === form.email && u.password === form.password);

      if (user) {
        localStorage.setItem('traveloop_user', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f3c 50%, #0d1117 100%)' }}>

      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #f5a623, transparent)' }} />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

      <div className="w-full max-w-md px-6 z-10">

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
          <p className="text-gray-400 text-sm">Your personalized travel planner</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back 👋</h2>
          <p className="text-gray-400 text-sm mb-6">Sign in to continue your journey</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-red-300"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>

            {/* Forgot */}
            <div className="text-right">
              <span className="text-xs cursor-pointer" style={{ color: '#f5a623' }}>
                Forgot Password?
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all"
              style={{ background: loading ? 'rgba(245,166,35,0.5)' : 'linear-gradient(135deg, #f5a623, #f093fb)' }}>
              {loading ? '⏳ Signing in...' : '🚀 Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#f5a623' }} className="font-semibold">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © 2025 Traveloop. Made with ❤️ for travelers
        </p>
      </div>
    </div>
  );
}