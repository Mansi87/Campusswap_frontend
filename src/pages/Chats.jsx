export default function Chats() {
  const chats = [
    { name: 'Aditi Sharma', last: 'Is this still available?', time: '2 min ago' },
    { name: 'Rahul Verma', last: 'Great, let’s meet at library.', time: '10 min ago' },
    { name: 'Campus Book Club', last: 'New listings for used books.', time: '1 hr ago' },
  ];

  return (
    <main className="flex-1 px-8 py-6 pb-24">
      <h1 className="text-2xl font-semibold text-slate-800">Chats</h1>
      <p className="mt-2 text-sm text-slate-500">
        Chat with buyers and sellers in real time.
      </p>

      <div className="mt-4 space-y-3">
        {chats.map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-brandPurple">
                {c.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-slate-500">{c.last}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">{c.time}</p>
          </div>
        ))}
      </div>
    </main>
  );
}