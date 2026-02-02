export default function AuthLayout({ left, children }) {
  return (
    <div className="flex min-h-screen items-stretch justify-center bg-slate-100">
      <div className="m-8 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[1.1fr,1fr]">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-pink-400 via-indigo-500 to-slate-900 px-10 py-10 text-white md:flex">
          {left}
        </section>
        <section className="flex flex-col justify-center px-10 py-10">{children}</section>
      </div>
    </div>
  );
}