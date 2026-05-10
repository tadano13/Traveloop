import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;

      if (data.user) {
        navigate('/discovery');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          <div className="mb-8">
            <h1 className="text-3xl brand" style={{ color: 'var(--primary)' }}>Traveloop</h1>
            <p className="text-sm text-gray-500">Plan your next adventure with us</p>
          </div>

          <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-8 flex items-center justify-center border-2 border-dashed border-gray-300">
            <span className="text-gray-400 text-xs">Photo</span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md text-sm text-red-600 bg-red-50 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-left">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Username / Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="text-left">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? 'Logging in...' : 'Login Button'}
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold" style={{ color: 'var(--primary)' }}>
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}