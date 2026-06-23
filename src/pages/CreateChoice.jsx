import { useNavigate } from 'react-router-dom';

export default function CreateChoice() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-8">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="mb-2 text-center text-xl font-bold text-slate-800">
          What do you want to list?
        </h2>
        <p className="mb-6 text-center text-sm text-slate-500">
          Choose what you'd like to sell on CampusSwap
        </p>

        <div className="space-y-4">
          {/* Product Option */}
          <button
            onClick={() => navigate('/create-listing')}
            className="flex w-full items-center gap-4 rounded-2xl border-2 border-slate-100 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-3xl">
              📦
            </div>
            <div>
              <p className="font-semibold text-slate-800">Product</p>
              <p className="text-xs text-slate-500">
                Sell second-hand items like phones, books, furniture
              </p>
            </div>
          </button>

          {/* Notes Option */}
          <button
            onClick={() => navigate('/create-notes')}
            className="flex w-full items-center gap-4 rounded-2xl border-2 border-slate-100 p-4 text-left transition hover:border-purple-300 hover:bg-purple-50"
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
              📚
            </div>
            <div>
              <p className="font-semibold text-slate-800">Notes</p>
              <p className="text-xs text-slate-500">
                Share or sell your study notes as PDF
              </p>
            </div>
          </button>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 w-full rounded-full bg-slate-100 py-2.5 text-sm text-slate-600 hover:bg-slate-200"
        >
          Cancel
        </button>
      </div>
    </main>
  );
}