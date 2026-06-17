import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axios';

const CATEGORIES = ['Electronics', 'Books', 'Furniture', 'Stationery', 'Clothing', 'Sports', 'Appliances', 'Cycles', 'Music', 'Other'];
const CONDITIONS = ['New', 'Good', 'Fair', 'Poor'];

export default function Explore() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
  });

  const search = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.keyword)  params.append('keyword', filters.keyword);
      if (filters.category) params.append('category', filters.category);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const res = await API.get(`/api/products/search?${params.toString()}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto search when coming from TopBar search
  useEffect(() => {
    if (filters.keyword) search();
  }, []);

  return (
    <main className="px-8 py-6 pb-24">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">🔍 Explore Products</h1>

      {/* Search + Filters */}
      <div className="mb-6 rounded-3xl bg-white p-5 shadow-lg">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.keyword}
            onChange={(e) => setFilters(f => ({ ...f, keyword: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-brandPurple"
          />
          <button
            onClick={search}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple px-6 py-2 text-sm text-white"
          >
            Search
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm outline-none"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filters.condition}
            onChange={(e) => setFilters(f => ({ ...f, condition: e.target.value }))}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm outline-none"
          >
            <option value="">All Conditions</option>
            {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm outline-none"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-5xl">🔎</p>
          <p className="mt-4 text-lg font-semibold text-slate-700">
            {filters.keyword ? 'No results found' : 'Search for something!'}
          </p>
          <p className="text-sm text-slate-500">
            {filters.keyword ? 'Try different keywords or filters' : 'Use the search bar above'}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">{products.length} products found</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="rounded-3xl bg-white p-4 shadow-lg">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-40 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-2xl bg-indigo-50 text-4xl">
                    📦
                  </div>
                )}
                <div className="mt-3">
                  <h3
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="font-semibold line-clamp-1 cursor-pointer hover:text-brandPurple transition"
                  >
  {product.title}
</h3>
                  <p className="text-lg font-bold text-brandPurple">
                    ₹{product.sellingPrice?.toLocaleString('en-IN')}
                  </p>
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>{product.condition}</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => API.post(`/api/likes/${product.id}`).catch(()=>{})}
                      className="flex-1 rounded-full bg-pink-100 py-1.5 text-xs text-pink-700 hover:bg-pink-200"
                    >
                      ❤️ Like
                    </button>
                    <button
                      onClick={() => navigate('/chats', {
                        state: { productId: product.id, sellerId: product.sellerId }
                      })}
                      className="flex-1 rounded-full bg-emerald-100 py-1.5 text-xs text-emerald-700 hover:bg-emerald-200"
                    >
                      💬 Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}