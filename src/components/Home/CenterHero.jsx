import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function CenterHero({ selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [actionMsg, setActionMsg] = useState('');
  const navigate = useNavigate();
  const [swipeDir, setSwipeDir] = useState('');

  const fetchFeed = async (pageNum = 0) => {
  try {
    setLoading(true);

    let res;
    if (selectedCategory) {
      // Use search API with category filter
      res = await API.get(`/api/products/search?category=${selectedCategory}`);
      setProducts(res.data);
    } else {
      // Use normal feed
      res = await API.get(`/api/products/feed?page=${pageNum}&size=10`);
      if (res.data.length === 0 && pageNum === 0) {
        setProducts([]);
      } else if (res.data.length === 0) {
        setPage(0);
        setCurrentIndex(0);
        fetchFeed(0);
        showMessage("You've seen everything! Here are some again 🔄");
        return;
      } else {
        setProducts(res.data);
        setCurrentIndex(0);
      }
    }
    setCurrentIndex(0);
  } catch (err) {
    console.error('Feed error:', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  setPage(0);
  setCurrentIndex(0);
  fetchFeed(0);
}, [selectedCategory]);

  const showMessage = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 2000);
  };

  const nextCard = () => {
    if (currentIndex + 1 >= products.length) {
      fetchFeed(page + 1);
      setPage(p => p + 1);
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const handleLike = async () => {
  const product = products[currentIndex];
  setSwipeDir('right');
  setTimeout(async () => {
    setSwipeDir('');
    try {
      await API.post(`/api/likes/${product.id}`);
      showMessage('❤️ Liked!');
    } catch {
      showMessage('Already liked!');
    }
    nextCard();
  }, 300);
};

const handleSkip = () => {
  setSwipeDir('left');
  setTimeout(() => {
    setSwipeDir('');
    showMessage('⏭️ Skipped');
    nextCard();
  }, 300);
};

  const handleChat = () => {
    const product = products[currentIndex];
    navigate('/chats', { state: { productId: product.id, sellerId: product.sellerId } });
  };

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="text-sm text-slate-500">Loading products...</p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-4xl">📭</p>
        <p className="text-lg font-semibold text-slate-700">No products yet!</p>
        <p className="text-sm text-slate-500">Be the first to list something</p>
      </section>
    );
  }

  const product = products[currentIndex];

  return (
    <section className="flex flex-col gap-4">

      {/* Action message toast */}
      {actionMsg && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-800 px-6 py-2 text-sm text-white shadow-lg">
          {actionMsg}
        </div>
      )}

      {/* Product Image Card */}
      <div className={`rounded-3xl bg-gradient-to-br from-indigo-500 to-brandPurple p-5 text-white shadow-2xl transition-all duration-300 ${
        swipeDir === 'right' ? 'translate-x-20 rotate-6 opacity-0' :
        swipeDir === 'left'  ? '-translate-x-20 -rotate-6 opacity-0' : ''
      }`}> 
      
        <div className="mb-4 flex justify-end text-xs">
          <span className="rounded-full bg-emerald-500 px-3 py-1">
            {product.category}
          </span>
        </div>

        {/* Product Image */}
        <div className="flex flex-col items-center">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-48 w-full rounded-3xl object-cover shadow-2xl"
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center rounded-3xl bg-gradient-to-tr from-fuchsia-500 to-sky-500 shadow-2xl">
              <span className="text-6xl">📦</span>
            </div>
          )}

          {/* Card counter dots */}
          <div className="mt-4 flex items-center gap-2">
            {products.slice(0, Math.min(5, products.length)).map((_, i) => (
              <span
                key={i}
                className={`rounded-full ${
                  i === currentIndex
                    ? 'h-1.5 w-6 bg-white'
                    : 'h-1.5 w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Product Info Card */}
      <div className="rounded-3xl bg-white p-5 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2
              onClick={() => navigate(`/product/${product.id}`)}
              className="text-lg font-semibold cursor-pointer hover:text-brandPurple transition"
            >
  {product.title}
</h2>
            <p className="mt-0.5 text-sm text-slate-500 line-clamp-2">
              {product.description}
            </p>
          </div>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${
            product.condition === 'New' ? 'bg-green-100 text-green-700' :
            product.condition === 'Good' ? 'bg-blue-100 text-blue-700' :
            product.condition === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {product.condition}
          </span>
        </div>

        <p className="mt-2 text-2xl font-bold text-brandPurple">
          ₹{product.sellingPrice?.toLocaleString('en-IN')}
        </p>

        
        {/* Action Buttons */}
    <div className="mt-4 flex items-center gap-3">
      {/* Previous */}
      <button
        onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl shadow-md transition hover:scale-110 hover:bg-slate-200"
        title="Previous"
      >
        ◀
      </button>

      {/* Skip */}
      <button
        onClick={handleSkip}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-xl shadow-md transition hover:scale-110 hover:bg-rose-200"
        title="Skip"
      >
        ✖
      </button>

      {/* Like */}
      <button
        onClick={handleLike}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-xl shadow-md transition hover:scale-110 hover:bg-pink-200"
        title="Like"
      >
        ❤️
      </button>

      {/* Chat */}
      <button
        onClick={handleChat}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl shadow-md transition hover:scale-110 hover:bg-emerald-200"
        title="Chat with seller"
      >
        💬
      </button>

      {/* Next */}
      <button
        onClick={nextCard}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl shadow-md transition hover:scale-110 hover:bg-slate-200"
        title="Next"
      >
        ▶
      </button>
    </div>

        {/* Seller + Location info */}
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
          <span>🏫 {product.collegeName}</span>
          <span>👤 {product.sellerName}</span>
          <span>⭐ {product.sellerRating?.toFixed(1)}</span>
        </div>
      </div>
    </section>
  );
}