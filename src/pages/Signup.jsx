import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    additionalInfo: '',
    password: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
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
    
    try {
      // 1. Create Auth User in Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Upsert Profile — works whether trigger created the row or not
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(
            {
              id: authData.user.id,
              first_name: form.firstName,
              last_name: form.lastName,
              phone: form.phone,
              city: form.city,
              country: form.country,
              additional_info: form.additionalInfo,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'id' }
          );

        // If RLS blocks it (email not confirmed yet), we still proceed —
        // the trigger will have created a blank profile row automatically.
        if (profileError && profileError.code !== '42501') {
          throw profileError;
        }

        alert('Registration successful! Please check your email to verify your account, then log in.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 py-12">
      <div className="w-full max-w-2xl">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl brand" style={{ color: 'var(--primary)' }}>Traveloop</h1>
            <h2 className="text-xl font-semibold mt-2">Registration</h2>
            <p className="text-sm text-gray-500">Join our community of travelers</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-md text-sm text-red-600 bg-red-50 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                <label className="text-sm font-medium text-gray-700 mb-1 block">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="text-left">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="text-left">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="text-left">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 0000000000"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="text-left">
                <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="text-left">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Country</label>
                <input
                  type="text"
                  placeholder="India"
                  value={form.country}
                  onChange={e => setForm({ ...form, country: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="text-left">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Additional Information</label>
              <textarea
                placeholder="Tell us about your travel preferences..."
                value={form.additionalInfo}
                onChange={e => setForm({ ...form, additionalInfo: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="text-left">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-4"
            >
              {loading ? 'Creating account...' : 'Register User'}
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-500 text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: 'var(--primary)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}