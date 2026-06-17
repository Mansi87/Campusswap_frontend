import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/Layout/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../api/axios.js';

const RegisterLeft = () => (
  <>
    <div>
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-xl">
          🎓
        </div>
        <span className="text-2xl font-bold">CampusSwap</span>
      </div>
      <ul className="mt-6 space-y-2 text-sm">
        {[
          'College-Verified Students Only',
          'AI-Powered Smart Pricing',
          'Real-Time Chat & Meetups',
          'Safe Campus Transactions',
        ].map((item) => (
          <li key={item} className="relative pl-6">
            <span className="absolute left-0 top-0 text-emerald-200">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
    <div>
      <p className="text-2xl font-bold">2,000+</p>
      <p className="text-xs opacity-90">Students Already Using CampusSwap</p>
      <div className="mt-4 flex gap-3 text-xs opacity-90">
        <span>🔒 Secure</span>
        <span>🏫 College-Only</span>
        <span>🚫 No Outsiders</span>
      </div>
    </div>
  </>
);

export default function Register() {
  const { register } = useAuth();
  const [colleges, setColleges]   = useState([]);
  const [formData, setFormData]   = useState({
    fullName: '', email: '', password: '',
    phone: '', collegeId: ''
  });
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  // Load colleges from backend
  useEffect(() => {
    API.get('/api/test/colleges')
      .then(res => setColleges(res.data))
      .catch(() => setColleges([]));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      // AuthContext handles redirect to /
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout left={<RegisterLeft />}>
      <div className="mb-4 flex gap-3">
        <Link
          to="/login"
          className="rounded-full bg-indigo-50 px-5 py-2 text-sm text-slate-700"
        >
          Login
        </Link>
        <button className="rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple px-5 py-2 text-sm text-white">
          Register
        </button>
      </div>

      <h2 className="text-2xl font-semibold">Create Account</h2>
      <p className="mt-1 text-sm text-slate-500">
        Join your campus marketplace in minutes.
      </p>

      {error && (
        <div className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-sm">
        <label className="flex flex-col gap-1 text-slate-700">
          Full Name
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brandPurple"
            placeholder="Your full name"
          />
        </label>

        <label className="flex flex-col gap-1 text-slate-700">
          College Email
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brandPurple"
            placeholder="yourname@college.edu"
          />
        </label>

        <label className="flex flex-col gap-1 text-slate-700">
          Select Your College
          <select
            name="collegeId"
            required
            value={formData.collegeId}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brandPurple"
          >
            <option value="">Choose your college...</option>
            {colleges.map(college => (
              <option key={college.id} value={college.id}>
                {college.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-slate-700">
          Phone Number
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brandPurple"
            placeholder="+91 98765 43210"
          />
        </label>

        <label className="flex flex-col gap-1 text-slate-700">
          Password
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brandPurple"
            placeholder="Create a strong password"
          />
        </label>

        <label className="flex items-start gap-2 text-xs text-slate-600">
          <input type="checkbox" required className="mt-1" />
          <span>I agree to Terms & Conditions and Community Guidelines</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brandPurple">
          Login
        </Link>
      </p>
      <p className="mt-2 text-[11px] text-slate-400">
        🔒 Secure • 🏫 College-Only • 🚫 No Outsiders
      </p>
    </AuthLayout>
  );
}