import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'free', 'paid'
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/api/notes')
      .then(res => setNotes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = notes.filter(n => {
    if (filter === 'free') return n.isFree;
    if (filter === 'paid') return !n.isFree;
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="px-8 py-6 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">📚 Notes Marketplace</h1>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2">
        {['all', 'free', 'paid'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f
                ? 'bg-gradient-to-r from-indigo-500 to-brandPurple text-white'
                : 'bg-white text-slate-600 shadow-sm hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? '📚 All' : f === 'free' ? '🆓 Free' : '💳 Paid'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-5xl">📭</p>
          <p className="mt-4 text-lg font-semibold text-slate-700">No notes yet</p>
          <p className="text-sm text-slate-500">Be the first to share notes!</p>
          <button
            onClick={() => navigate('/create-notes')}
            className="mt-4 rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple px-6 py-2 text-sm text-white"
          >
            + List Notes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(note => (
            <div
              key={note.id}
              onClick={() => navigate(`/notes/${note.id}`)}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:rotate-1"
            >
              {/* Preview Image or PDF placeholder */}
              {note.previewImages?.length > 0 ? (
                <img
                  src={note.previewImages[0]}
                  alt={note.title}
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 transition-transform duration-300 group-hover:scale-105">
                  <span className="text-5xl">📄</span>
                </div>
              )}

              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm text-slate-800 line-clamp-1">
                    {note.title}
                  </p>
                  <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    note.isFree
                      ? 'bg-green-100 text-green-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {note.isFree ? 'FREE' : `₹${note.price}`}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {note.subject} • Sem {note.semester}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  by {note.sellerName}
                </p>

                <div className="mt-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/notes/${note.id}`); }}
                    className={`w-full rounded-full py-1.5 text-xs font-medium transition ${
                      note.isFree
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : note.canDownload
                        ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    {note.isFree ? '⬇️ Download Free' :
                     note.canDownload ? '⬇️ Download' :
                     `💳 Buy ₹${note.price}`}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}