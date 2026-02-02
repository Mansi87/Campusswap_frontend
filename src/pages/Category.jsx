import { useParams } from 'react-router-dom';

export default function Category() {
  const { slug } = useParams();

  const name = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <main className="flex-1 px-8 py-6 pb-24">
      <h1 className="text-2xl font-semibold text-slate-800">{name} Products</h1>
      <p className="mt-2 text-sm text-slate-500">
        Showing items in the <span className="font-medium">{name}</span> category.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="h-32 rounded-xl bg-indigo-100" />
            <h3 className="mt-3 text-sm font-semibold">
              {name} item #{i}
            </h3>
            <p className="mt-1 text-xs text-slate-500">Sample description</p>
            <p className="mt-2 text-base font-bold text-brandPurple">₹{i * 1000}</p>
          </div>
        ))}
      </div>
    </main>
  );
}