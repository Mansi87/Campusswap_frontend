import { Link } from 'react-router-dom';

export default function Sidebar() {
  const categories = ['books', 'electronics', 'furniture', 'stationery', 'clothing', 'sports'];

  return (
    <aside className="hidden rounded-3xl bg-white p-5 shadow-lg lg:block">
      <h3 className="mb-3 text-sm font-semibold">Categories</h3>
      <ul className="mb-5 space-y-1 text-sm">
        <li className="cursor-pointer rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple px-3 py-2 text-white">
          <Link to="/">All Products</Link>
        </li>
        {categories.map((slug) => (
          <li
            key={slug}
            className="cursor-pointer rounded-full px-3 py-2 text-slate-600 hover:bg-slate-100"
          >
            <Link to={`/category/${slug}`} className="block">
              {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </Link>
          </li>
        ))}
      </ul>

      <h3 className="mb-2 text-sm font-semibold">Filters</h3>
      <div className="rounded-2xl bg-indigo-50 p-3 text-xs text-slate-700">
        <label className="font-medium">Price Range</label>
        <input type="range" min="0" max="100000" defaultValue="45000" className="mt-2 w-full" />
        <p className="mt-1 text-[11px] text-slate-500">Up to ₹45,000</p>
      </div>
    </aside>
  );
}