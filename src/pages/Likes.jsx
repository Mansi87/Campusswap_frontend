import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Likes() {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/api/likes/my-likes')
      .then(res => setLikes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUnlike = async (productId) => {
    try {
      await API.delete(`/api/likes/${productId}`);
      setLikes(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error(err);
    }
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
      <h1 className="mb-6 text-2xl font-bold text-slate-800">❤️ Liked Products</h1>

      {likes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl">💔</p>
          <p className="mt-4 text-lg font-semibold text-slate-700">No liked products yet</p>
          <p className="text-sm text-slate-500">Swipe right on products you like!</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple px-6 py-2 text-sm text-white"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {likes.map((product) => (
            <div key={product.id} className="rounded-3xl bg-white p-4 shadow-lg">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-40 w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-indigo-50 text-4xl">
                  📦
                </div>
              )}
              <div className="mt-3">
                <h3 className="font-semibold text-slate-800 line-clamp-1">{product.title}</h3>
                <p className="text-lg font-bold text-brandPurple">
                  ₹{product.sellingPrice?.toLocaleString('en-IN')}
                </p>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>{product.condition}</span>
                  <span>{product.category}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => navigate('/chats', {
                      state: { productId: product.id, sellerId: product.sellerId }
                    })}
                    className="flex-1 rounded-full bg-emerald-100 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-200"
                  >
                    💬 Chat
                  </button>
                  <button
                    onClick={() => handleUnlike(product.id)}
                    className="flex-1 rounded-full bg-rose-100 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-200"
                  >
                    💔 Unlike
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}