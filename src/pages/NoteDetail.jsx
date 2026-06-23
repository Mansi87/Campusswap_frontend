import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function NoteDetail() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    API.get(`/api/notes/${noteId}`)
      .then(res => setNote(res.data))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [noteId]);

  const handleDownload = async () => {
    try {
      const res = await API.get(`/api/notes/${noteId}/download`);
      window.open(res.data.downloadUrl, '_blank');
    } catch {
      alert('Download failed. Please try again.');
    }
  };

  const handleBuy = async () => {
    setPaymentLoading(true);
    try {
      // Step 1 — Create Razorpay order via our backend
      const orderRes = await API.post('/api/payment/create-order', { noteId });
      const { orderId, amount, keyId, noteTitle } = orderRes.data;

      // Step 2 — Open Razorpay checkout popup
      const options = {
        key: keyId,
        amount: amount,
        currency: 'INR',
        name: 'CampusSwap',
        description: noteTitle,
        order_id: orderId,
        handler: async (response) => {
          // Step 3 — Verify payment on our backend
          try {
            const verifyRes = await API.post('/api/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              noteId: noteId,
            });

            if (verifyRes.data.success) {
              // Refresh note to show download button
              const updated = await API.get(`/api/notes/${noteId}`);
              setNote(updated.data);
              alert('Payment successful! You can now download the notes. 🎉');
            } else {
              alert('Payment verification failed. Contact support.');
            }
          } catch {
            alert('Verification failed. Contact support.');
          }
        },
        prefill: {
          name: user?.fullName || '',
        },
        theme: { color: '#6366f1' },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (err) {
      alert(err.response?.data?.error || 'Payment failed. Try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!note) return null;

  return (
    <main className="px-8 py-6 pb-24">
      <button onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        ← Back
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr,1fr]">

        {/* Left — Preview Images */}
        <div>
          {note.previewImages?.length > 0 ? (
            <>
              <div className="overflow-hidden rounded-3xl shadow-lg">
                <img
                  src={note.previewImages[activeImg]}
                  alt={note.title}
                  className="h-[400px] w-full object-cover"
                />
              </div>
              {note.previewImages.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {note.previewImages.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                        activeImg === i ? 'border-brandPurple' : 'border-transparent'
                      }`}>
                      <img src={img} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-100 shadow-lg">
              <div className="text-center">
                <p className="text-8xl">📄</p>
                <p className="mt-4 text-slate-500 text-sm">No preview available</p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mt-6 rounded-3xl bg-white p-5 shadow-lg">
            <h2 className="text-sm font-semibold text-slate-700">About These Notes</h2>
            <p className="mt-2 text-sm text-slate-600">
              {note.description || 'No description provided.'}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Subject</p>
                <p className="font-medium text-slate-700">{note.subject}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Semester</p>
                <p className="font-medium text-slate-700">Semester {note.semester}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">College</p>
                <p className="font-medium text-slate-700">{note.collegeName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Price + Actions */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-xl font-semibold text-slate-800">{note.title}</h1>
              <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                note.isFree ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {note.isFree ? 'FREE' : 'PAID'}
              </span>
            </div>

            {!note.isFree && (
              <p className="mt-2 text-3xl font-bold text-brandPurple">
                ₹{note.price}
              </p>
            )}

            <div className="mt-4">
              {note.canDownload ? (
                <button
                  onClick={handleDownload}
                  className="w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 py-3 text-sm font-medium text-white shadow-md hover:opacity-90"
                >
                  ⬇️ Download PDF
                </button>
              ) : (
                <button
                  onClick={handleBuy}
                  disabled={paymentLoading}
                  className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple py-3 text-sm font-medium text-white shadow-md hover:opacity-90 disabled:opacity-60"
                >
                  {paymentLoading ? 'Processing...' : `💳 Buy for ₹${note.price}`}
                </button>
              )}
            </div>

            {!note.isFree && !note.canDownload && (
              <p className="mt-2 text-center text-xs text-slate-400">
                Secure payment via Razorpay • UPI, Cards accepted
              </p>
            )}
          </div>

          {/* Seller Info */}
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">Shared By</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-brandPurple">
                {note.sellerName?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-slate-800">{note.sellerName}</p>
                <p className="text-xs text-slate-500">🏫 {note.collegeName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}