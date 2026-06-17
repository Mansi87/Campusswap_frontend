import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function RightBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    unreadMessages: 0,
    likedProducts: 0,
    myListings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [unread, likes, listings] = await Promise.all([
          API.get('/api/chat/unread-count'),
          API.get('/api/likes/my-likes'),
          API.get('/api/products/my-listings'),
        ]);
        setStats({
          unreadMessages: unread.data.unreadCount,
          likedProducts: likes.data.length,
          myListings: listings.data.length,
        });
      } catch (err) {
        console.error('Stats error:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <aside className="hidden rounded-3xl bg-white p-5 shadow-lg lg:block">
      <h3 className="text-sm font-semibold">My Activity</h3>
      <div className="mt-3 space-y-2">
        <div
          onClick={() => navigate('/chats')}
          className="flex cursor-pointer items-center justify-between rounded-full bg-indigo-50 px-4 py-2 text-xs hover:bg-indigo-100"
        >
          <span>New Messages</span>
          <span className="font-medium text-brandPurple">
            {stats.unreadMessages} unread
          </span>
        </div>
        <div
          onClick={() => navigate('/likes')}
          className="flex cursor-pointer items-center justify-between rounded-full bg-indigo-50 px-4 py-2 text-xs hover:bg-indigo-100"
        >
          <span>Liked Products</span>
          <span className="font-medium text-brandPurple">
            {stats.likedProducts} items
          </span>
        </div>
        <div
          className="flex items-center justify-between rounded-full bg-indigo-50 px-4 py-2 text-xs"
        >
          <span>My Listings</span>
          <span className="font-medium text-brandPurple">
            {stats.myListings} active
          </span>
        </div>
      </div>

      <h3 className="mt-6 text-sm font-semibold">Seller Info</h3>
      <div className="mt-2 rounded-2xl bg-indigo-50 p-3 text-xs">
        <p className="font-medium">👤 {user?.fullName}</p>
        <p className="mt-2 text-slate-500">
          List your items using the + button below
        </p>
        <button
          onClick={() => navigate('/explore')}
          className="mt-2 w-full rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple py-1.5 text-center text-white"
        >
          + List Item
        </button>
      </div>
    </aside>
  );
}