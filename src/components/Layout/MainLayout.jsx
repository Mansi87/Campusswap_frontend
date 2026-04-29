import { Outlet } from 'react-router-dom';
import TopBar from './TopBar.jsx';
import BottomNav from './BottomNav.jsx';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <TopBar />
      <Outlet />
      <BottomNav />
    </div>
  );
}
