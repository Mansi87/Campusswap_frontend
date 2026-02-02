export default function RightBar() {
  return (
    <aside className="hidden rounded-3xl bg-white p-5 shadow-lg lg:block">
      <h3 className="text-sm font-semibold">My Activity</h3>
      <div className="mt-3 space-y-2">
        {[
          ['New Messages', '3 unread'],
          ['Liked Products', '12 items'],
          ['My Listings', '5 active'],
          ['Profile Views', '24 today'],
        ].map(([title, meta]) => (
          <div
            key={title}
            className="flex items-center justify-between rounded-full bg-indigo-50 px-4 py-2 text-xs"
          >
            <span>{title}</span>
            <span className="font-medium text-brandPurple">{meta}</span>
          </div>
        ))}
      </div>

      <h3 className="mt-6 text-sm font-semibold">Trending Today</h3>
      <div className="mt-2 rounded-2xl bg-indigo-50 p-3 text-xs">
        <p className="font-medium">Most Searched:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {['iPhone', 'Laptop', 'Books'].map((t) => (
            <span
              key={t}
              className="rounded-full bg-white px-3 py-1 text-[11px] text-slate-700 shadow-sm"
            >
              {t}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[11px]">
          <span className="font-medium">New Today:</span> 52 products
        </p>
      </div>
    </aside>
  );
}