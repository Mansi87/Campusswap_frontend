export default function CenterHero() {
  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-brandPurple p-5 text-white shadow-2xl">
        <div className="mb-4 flex justify-between text-xs">
          <span className="rounded-full bg-white/70 px-3 py-1 text-slate-800">
            AI Suggested: ₹45,000
          </span>
          <span className="rounded-full bg-emerald-500 px-3 py-1">Electronics</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex h-44 w-72 items-center justify-center rounded-3xl bg-gradient-to-tr from-fuchsia-500 to-sky-500 shadow-2xl">
            <div className="h-24 w-24 rounded-3xl bg-white shadow-xl" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-1.5 w-6 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-lg">
        <h2 className="text-lg font-semibold">iPhone 13 - 128GB Blue</h2>
        <p className="mt-1 text-2xl font-bold text-brandPurple">₹45,000</p>

        <div className="mt-4 flex gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-lg shadow-md">
            ✖
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-lg shadow-md">
            ⭐
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 text-lg shadow-md">
            ❤
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-lg shadow-md">
            💬
          </button>
        </div>

        <div className="mt-3 flex gap-5 text-xs text-slate-500">
          <span>Main Campus</span>
          <span>Posted 2 hrs ago</span>
        </div>
      </div>
    </section>
  );
}