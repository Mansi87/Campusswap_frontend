export default function Profile() {
  return (
    <main className="flex-1 px-8 py-6 pb-24">
      <h1 className="text-2xl font-semibold text-slate-800">My Profile</h1>

      <div className="mt-4 flex flex-col gap-6 md:flex-row">
        <div className="rounded-2xl bg-white p-5 shadow-sm md:w-1/3">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-semibold text-brandPurple">
              JD
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-slate-500">john@college.edu</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="text-lg font-semibold text-brandPurple">5</p>
              <p className="text-slate-500">Listings</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-brandPurple">12</p>
              <p className="text-slate-500">Likes</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-brandPurple">24</p>
              <p className="text-slate-500">Views</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm md:flex-1">
          <h2 className="text-sm font-semibold">About</h2>
          <p className="mt-2 text-xs text-slate-600">
            Final-year student at Main Campus. I love trading books, gadgets and
            helping juniors find affordable deals.
          </p>
        </div>
      </div>
    </main>
  );
}