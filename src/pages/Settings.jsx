export default function Settings() {
  return (
    <main className="flex-1 px-8 py-6 pb-24">
      <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
      <p className="mt-2 text-sm text-slate-500">
        Update your preferences for notifications and privacy.
      </p>

      <form className="mt-4 space-y-4 rounded-2xl bg-white p-5 shadow-sm text-sm">
        <label className="flex items-center justify-between">
          <span>Email notifications</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className="flex items-center justify-between">
          <span>Push notifications</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className="flex items-center justify-between">
          <span>Allow chat from all colleges</span>
          <input type="checkbox" />
        </label>
      </form>
    </main>
  );
}