// Register.jsx
import { Link } from 'react-router-dom';
import AuthLayout from '../components/Layout/AuthLayout.jsx';

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
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Account created! (front-end demo only)');
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

      <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-sm">
        <label className="flex flex-col gap-1 text-slate-700">
          College Email
          <input
            type="email"
            required
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brandPurple"
            placeholder="yourname@college.edu"
          />
        </label>

        <label className="flex flex-col gap-1 text-slate-700">
          Select Your College
          <select
            required
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brandPurple"
          >
            <option value="">Choose your college...</option>
            <option>ABC Engineering College</option>
            <option>XYZ University</option>
            <option>Other</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-slate-700">
          Phone Number
          <input
            type="tel"
            required
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brandPurple"
            placeholder="+91 98765 43210"
          />
        </label>

        <label className="flex flex-col gap-1 text-slate-700">
          Password
          <input
            type="password"
            required
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brandPurple"
            placeholder="Create a strong password"
          />
        </label>

        <label className="flex items-start gap-2 text-xs text-slate-600">
          <input type="checkbox" required className="mt-1" />
          <span>I agree to Terms &amp; Conditions and Community Guidelines</span>
        </label>

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple px-4 py-2 text-sm font-medium text-white"
        >
          Create Account
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

      <p className="mt-2 text-[11px] text-slate-500">
        <Link to="/">← Back to Home</Link>
      </p>
    </AuthLayout>
  );
}