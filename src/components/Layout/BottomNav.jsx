import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const { pathname } = useLocation();

  const itemClasses = (path) =>
    `flex flex-col items-center text-xs ${
      pathname === path ? 'text-brandPurple' : 'text-slate-500'
    }`;

  return (
    <nav className="fixed bottom-0 left-1/2 z-20 flex h-16 w-full max-w-3xl -translate-x-1/2 items-center justify-between rounded-t-3xl bg-white px-10 shadow-[0_-12px_30px_rgba(15,23,42,0.2)]">
      <Link to="/" className={itemClasses('/')}>
        <span>🏠</span>
        <span>Home</span>
      </Link>

      <Link to="/likes" className={itemClasses('/likes')}>
        <span>❤️</span>
        <span>Likes</span>
      </Link>

      <Link
        to="/explore"
        className="flex h-14 w-14 -translate-y-5 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-brandPurple text-3xl text-white shadow-xl"
      >
        +
      </Link>

      <Link to="/explore" className={itemClasses('/explore')}>
        <span>🔍</span>
        <span>Explore</span>
      </Link>

      <Link to="/chats" className={itemClasses('/chats')}>
        <span>💬</span>
        <span>Chats</span>
      </Link>
    </nav>
  );
}