import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/api/notifications')
      .then(res => setNotifications(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    // Mark all as read when page opens
    API.put('/api/notifications/mark-all-read').catch(() => {});
  }, []);

  const handleClick = (notification) => {
    if (notification.type === 'MESSAGE') {
      const [senderId, productId] = notification.relatedId.split(':');
      navigate('/chats', { state: { productId, sellerId: senderId } });
    } else if (notification.type === 'LIKE') {
      navigate(`/product/${notification.relatedId}`);
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="px-8 py-6 pb-24">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-5xl">🔕</p>
          <p className="mt-4 text-lg font-semibold text-slate-700">No notifications yet</p>
          <p className="text-sm text-slate-500">You'll see likes and messages here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl p-4 shadow-sm transition hover:shadow-md ${
                n.read ? 'bg-white' : 'bg-indigo-50'
              }`}
            >
              <span className="text-xl">
                {n.type === 'MESSAGE' ? '💬' : '❤️'}
              </span>
              <div className="flex-1">
                <p className="text-sm text-slate-700">{n.message}</p>
                <p className="mt-1 text-xs text-slate-400">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.read && (
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}