import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get(`/api/products/${productId}`)
      .then(res => {
        setProduct(res.data);
        setActiveImg(0);
        // Fetch similar products by category
        API.get(`/api/products/recommendations/category?category=${res.data.category}&topN=4`)
          .then(r => setSimilar(r.data.filter(p => p.id !== productId)))
          .catch(() => setSimilar([]));
      })
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleLike = async () => {
    try {
      await API.post(`/api/likes/${productId}`);
      setLiked(true);
    } catch {
      setLiked(true);
    }
  };

  const handleChat = () => {
    navigate('/chats', {
      state: { productId: product.id, sellerId: product.sellerId }
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [];

  return (
    <main className="px-8 py-6 pb-24">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr,1fr]">

        {/* Left — Images */}
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-lg">
            {images.length > 0 ? (
              <img
                src={images[activeImg]}
                alt={product.title}
                className="h-[420px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[420px] w-full items-center justify-center text-6xl">
                📦
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg(i => (i === 0 ? images.length - 1 : i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white"
                >
                  ◀
                </button>
                <button
                  onClick={() => setActiveImg(i => (i === images.length - 1 ? 0 : i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white"
                >
                  ▶
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                    activeImg === i ? 'border-brandPurple' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mt-6 rounded-3xl bg-white p-5 shadow-lg">
            <h2 className="text-sm font-semibold text-slate-700">Description</h2>
            <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">
              {product.description || 'No description provided.'}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Category</p>
                <p className="font-medium text-slate-700">{product.category}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Condition</p>
                <p className="font-medium text-slate-700">{product.condition}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Age</p>
                <p className="font-medium text-slate-700">{product.ageMonths || 0} months</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Price + Seller + Actions */}
        <div className="space-y-4">

          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <h1 className="text-xl font-semibold text-slate-800">{product.title}</h1>
            <p className="mt-2 text-3xl font-bold text-brandPurple">
              ₹{product.sellingPrice?.toLocaleString('en-IN')}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-slate-400 line-through">
                ₹{product.originalPrice?.toLocaleString('en-IN')}
              </p>
            )}

            <div className="mt-4 flex gap-3">
               {product.sellerId === user?.userId ? (
    <div className="flex-1 rounded-full bg-slate-100 py-2.5 text-center text-sm font-medium text-slate-500">
      📦 This is your listing
    </div>
  ) : (
    <>
      <button
        onClick={handleChat}
        className="flex-1 rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple py-2.5 text-sm font-medium text-white shadow-md hover:opacity-90"
      >
        💬 Chat with Seller
      </button>
      <button
        onClick={handleLike}
        disabled={liked}
        className={`flex h-11 w-11 items-center justify-center rounded-full text-lg shadow-md transition ${
          liked ? 'bg-pink-200' : 'bg-pink-100 hover:bg-pink-200'
        }`}
      >
        {liked ? '❤️' : '🤍'}
      </button>
    </>
  )}
            </div>
          </div>
          

          {/* Seller Info */}
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">Seller Info</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-brandPurple">
                {product.sellerName?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-slate-800">{product.sellerName}</p>
                <p className="text-xs text-slate-500">🏫 {product.collegeName}</p>
                <p className="text-xs text-slate-500">⭐ {product.sellerRating?.toFixed(1) || '0.0'} rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Similar Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {similar.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition"
              >
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="h-32 w-full object-cover" />
                ) : (
                  <div className="flex h-32 items-center justify-center bg-indigo-50 text-3xl">📦</div>
                )}
                <div className="p-2">
                  <p className="text-xs font-medium text-slate-700 line-clamp-1">{p.title}</p>
                  <p className="text-sm font-bold text-brandPurple">
                    ₹{p.sellingPrice?.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}