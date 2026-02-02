export default function Notifications() {
  const list = [
    'Your listing "iPhone 13 - 128GB Blue" got 3 new views.',
    'Rahul sent you a new message.',
    'CampusSwap tip: Use clear photos to get more buyers.',
  ];

  return (
    <main className="flex-1 px-8 py-6 pb-24">
      <h1 className="text-2xl font-semibold text-slate-800">Notifications</h1>
      <ul className="mt-4 space-y-3">
        {list.map((n, idx) => (
          <li
            key={idx}
            className="rounded-2xl bg-white p-4 text-sm text-slate-700 shadow-sm"
          >
            {n}
          </li>
        ))}
      </ul>
    </main>
  );
}