import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  'Electronics', 'Books', 'Furniture',
  'Stationery', 'Clothing', 'Sports',
  'Appliances', 'Cycles', 'Music', 'Other'
];

export default function Sidebar({ onCategorySelect, selectedCategory }) {
  const navigate = useNavigate();

  return (
    <aside className="hidden rounded-3xl bg-white p-5 shadow-lg lg:block">
      <h3 className="mb-3 text-sm font-semibold">Categories</h3>
      <ul className="mb-5 space-y-1 text-sm">
        <li
          onClick={() => onCategorySelect(null)}
          className={`cursor-pointer rounded-full px-3 py-2 ${
            !selectedCategory
              ? 'bg-gradient-to-r from-indigo-500 to-brandPurple text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Products
        </li>
        {CATEGORIES.map((cat) => (
          <li
            key={cat}
            onClick={() => onCategorySelect(cat)}
            className={`cursor-pointer rounded-full px-3 py-2 ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-indigo-500 to-brandPurple text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </li>
        ))}
      </ul>

      <h3 className="mb-2 text-sm font-semibold">Quick Links</h3>
      <div className="space-y-1 text-sm">
        <button
          onClick={() => navigate('/explore')}
          className="w-full rounded-full bg-indigo-50 px-3 py-2 text-left text-slate-600 hover:bg-indigo-100"
        >
          🔍 Search Products
        </button>
        <button
          onClick={() => navigate('/likes')}
          className="w-full rounded-full bg-indigo-50 px-3 py-2 text-left text-slate-600 hover:bg-indigo-100"
        >
          ❤️ My Liked Items
        </button>
      </div>
    </aside>
  );
}