import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/Layout/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const LoginLeft = () => (
  <>
    <div>
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-xl">
          🎓
        </div>
        <span className="text-2xl font-bold">CampusSwap</span>
      </div>
      <h1 className="text-3xl font-semibold leading-tight">
        Buy, Sell, Save
        <br />
        Within Your Campus!
      </h1>
      <p className="mt-4 max-w-xs text-sm opacity-90">
        Join thousands of students saving money by trading
        second-hand items within your college community.
      </p>
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

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // AuthContext handles redirect to /
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout left={<LoginLeft />}>
      <div className="mb-4 flex gap-3">
        <button className="rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple px-5 py-2 text-sm text-white">
          Login
        </button>
        <Link
          to="/register"
          className="rounded-full bg-indigo-50 px-5 py-2 text-sm text-slate-700"
        >
          Register
        </Link>
      </div>

      <h2 className="text-2xl font-semibold">Welcome Back!</h2>
      <p className="mt-1 text-sm text-slate-500">
        Login to continue buying and selling
      </p>

      {/* Error message */}
      {error && (
        <div className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-sm">
        <label className="flex flex-col gap-1 text-slate-700">
          College Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brandPurple"
            placeholder="yourname@college.edu"
          />
        </label>

        <label className="flex flex-col gap-1 text-slate-700">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brandPurple"
            placeholder="Enter your password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login to CampusSwap'}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-brandPurple">
          Create one
        </Link>
      </p>
      <p className="mt-2 text-[11px] text-slate-400">
        🔒 Secure • 🏫 College-Only • 🚫 No Outsiders
      </p>
    </AuthLayout>
  );
}