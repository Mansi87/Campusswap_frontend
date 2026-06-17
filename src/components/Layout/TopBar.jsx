import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function TopBar() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await API.get('/api/chat/unread-count');
        setUnreadCount(res.data.unreadCount);
      } catch { }
    };
    fetchUnread();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const initials = user?.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && search.trim()) {
              window.location.href = `/explore?keyword=${search}`;
            }
          }}
        />
        <button
          onClick={() => search.trim() && (window.location.href = `/explore?keyword=${search}`)}
          className="rounded-full bg-brandPurple px-4 py-1 text-sm text-white"
        >
          🔍
        </button>
      </div>

      <nav className="flex items-center gap-4 text-xl">
        <Link to="/notifications" className="relative">
          🔔
          {unreadCount > 0 && (
            <span className="absolute -right-2 -top-1 rounded-full bg-rose-500 px-1 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link to="/settings">⚙️</Link>
        <Link
          to="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-brandPurple"
        >
          {initials}
        </Link>
      </nav>
    </header>
  );
}