import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

const CATEGORIES = [
  'Electronics', 'Books', 'Furniture', 'Stationery',
  'Clothing', 'Sports', 'Appliances', 'Cycles', 'Music', 'Other'
];
const CONDITIONS = ['New', 'Good', 'Fair', 'Poor'];

export default function EditListing() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    originalPrice: '',
    sellingPrice: '',
    ageMonths: '',
  });

  // Load existing product data
  useEffect(() => {
    API.get(`/api/products/${productId}`)
      .then(res => {
        const p = res.data;
        setFormData({
          title: p.title || '',
          description: p.description || '',
          category: p.category || '',
          condition: p.condition || '',
          originalPrice: p.originalPrice || '',
          sellingPrice: p.sellingPrice || '',
          ageMonths: p.ageMonths || '',
        });
        setImages(p.images || []);
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingImages(true);
    try {
      const formDataImg = new FormData();
      files.forEach(file => formDataImg.append('files', file));
      const res = await API.post('/api/upload/images', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImages(prev => [...prev, ...res.data.urls].slice(0, 4));
    } catch {
      setError('Image upload failed');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await API.put(`/api/products/${productId}`, {
        ...formData,
        originalPrice: parseFloat(formData.originalPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        ageMonths: parseInt(formData.ageMonths) || 0,
        images,
      });
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    } catch {
      setError('Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-8">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <p className="text-5xl">✅</p>
          <h2 className="mt-4 text-2xl font-bold text-slate-800">Updated!</h2>
          <p className="mt-2 text-sm text-slate-500">Redirecting to profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-8 py-6 pb-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">✏️ Edit Listing</h1>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Images */}
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">
              📷 Images <span className="font-normal text-slate-400">(max 4)</span>
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative aspect-square">
                  <img src={url} className="h-full w-full rounded-2xl object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 hover:border-brandPurple hover:bg-indigo-50">
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  {uploadingImages ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                  ) : (
                    <>
                      <span className="text-2xl text-slate-300">+</span>
                      <span className="mt-1 text-[10px] text-slate-400">Add</span>
                    </>
                  )}
                </label>
              )}
              {Array.from({ length: Math.max(0, 3 - images.length) }).map((_, i) => (
                <div key={`e-${i}`} className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50" />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="rounded-3xl bg-white p-5 shadow-lg space-y-3">
            <h2 className="text-sm font-semibold text-slate-700">📝 Details</h2>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Title *
              <input name="title" required value={formData.title} onChange={handleChange}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple" />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Description
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple resize-none" />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Category *
                <select name="category" required value={formData.category} onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple">
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Condition *
                <select name="condition" required value={formData.condition} onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple">
                  <option value="">Select...</option>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-3xl bg-white p-5 shadow-lg space-y-3">
            <h2 className="text-sm font-semibold text-slate-700">💰 Pricing</h2>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Original Price (₹)
                <input name="originalPrice" type="number" value={formData.originalPrice} onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple" />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Selling Price (₹) *
                <input name="sellingPrice" type="number" required value={formData.sellingPrice} onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple" />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Age in Months
              <input name="ageMonths" type="number" value={formData.ageMonths} onChange={handleChange}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple" />
            </label>
          </div>

          <button type="submit" disabled={saving}
            className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple py-3 text-sm font-medium text-white disabled:opacity-60">
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>

          <button type="button" onClick={() => navigate('/profile')}
            className="w-full rounded-full bg-slate-100 py-3 text-sm text-slate-600 hover:bg-slate-200">
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
}