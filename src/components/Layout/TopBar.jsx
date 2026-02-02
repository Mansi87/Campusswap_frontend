import { Link } from 'react-router-dom';

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-8 py-3 shadow-md">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-lg text-white">
          🎓
        </div>
        <span className="text-xl font-bold text-brandPurple">CampusSwap</span>
      </Link>

      <div className="mx-10 flex max-w-xl flex-1 items-center rounded-full bg-indigo-50 px-3">
        <input
          className="w-full border-none bg-transparent px-3 py-2 text-sm outline-none"
          placeholder="Search products..."
        />
        <button className="rounded-full bg-brandPurple px-4 py-1 text-sm text-white">
          🔍
        </button>
      </div>

      <nav className="flex items-center gap-4 text-xl">
        <Link to="/notifications" className="relative">
          🔔
          <span className="absolute -right-2 -top-1 rounded-full bg-rose-500 px-1 text-[10px] text-white">
            3
          </span>
        </Link>
        <Link to="/settings">⚙️</Link>
        <Link
          to="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-brandPurple"
        >
          JD
        </Link>
      </nav>
    </header>
  );
}