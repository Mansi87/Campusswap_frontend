import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CATEGORIES = [
  'Electronics', 'Books', 'Furniture', 'Stationery',
  'Clothing', 'Sports', 'Appliances', 'Cycles', 'Music', 'Other'
];
const CONDITIONS = ['New', 'Good', 'Fair', 'Poor'];

export default function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [aiPrice, setAiPrice] = useState(null);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    originalPrice: '',
    sellingPrice: '',
    ageMonths: '',
    attributes: {},
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (files.length > 4) {
      setError('Maximum 4 images allowed');
      return;
    }

    setUploadingImages(true);
    setError('');
    try {
      const formDataImg = new FormData();
      files.forEach(file => formDataImg.append('files', file));

      const res = await API.post('/api/upload/images', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImages(res.data.urls);
    } catch (err) {
      setError('Image upload failed. Try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        originalPrice: parseFloat(formData.originalPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        ageMonths: parseInt(formData.ageMonths) || 0,
        images: images,
      };

      const res = await API.post('/api/products', payload);

      // Show AI suggested price
      setAiPrice(res.data.aiSuggestedPrice);

      setTimeout(() => {
        navigate('/profile');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  // If AI price shown — success screen
  if (aiPrice) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-8 py-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <p className="text-5xl">🎉</p>
          <h2 className="mt-4 text-2xl font-bold text-slate-800">Listed Successfully!</h2>
          <p className="mt-2 text-sm text-slate-500">Your product is now live</p>

          <div className="mt-6 rounded-2xl bg-indigo-50 p-4">
            <p className="text-sm text-slate-600">🤖 AI Suggested Price</p>
            <p className="mt-1 text-3xl font-bold text-brandPurple">
              ₹{aiPrice?.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Based on category, condition and market data
            </p>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Redirecting to your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-8 py-6 pb-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">📦 List an Item</h1>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Image Upload — OLX Style */}
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">
              📷 Product Images <span className="text-slate-400 font-normal">(max 4)</span>
            </h2>

            <div className="grid grid-cols-4 gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative aspect-square">
                  <img
                    src={url}
                    alt={`product-${i}`}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white shadow-md hover:bg-rose-600"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {images.length < 4 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 hover:border-brandPurple hover:bg-indigo-50 transition">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {uploadingImages ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                  ) : (
                    <>
                      <span className="text-2xl text-slate-300">+</span>
                      <span className="mt-1 text-[10px] text-slate-400">Add Photo</span>
                    </>
                  )}
                </label>
              )}

              {Array.from({ length: Math.max(0, 3 - images.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50"
                />
              ))}
            </div>

            {images.length === 0 && (
              <p className="mt-2 text-center text-xs text-slate-400">
                First image will be the cover photo
              </p>
            )}
          </div>

          {/* Product Details */}
          <div className="rounded-3xl bg-white p-5 shadow-lg space-y-3">
            <h2 className="text-sm font-semibold text-slate-700">📝 Product Details</h2>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Title *
              <input
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. iPhone 13 128GB"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item..."
                rows={3}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple resize-none"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Category *
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple"
                >
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Condition *
                <select
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple"
                >
                  <option value="">Select...</option>
                  {CONDITIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-3xl bg-white p-5 shadow-lg space-y-3">
            <h2 className="text-sm font-semibold text-slate-700">💰 Pricing</h2>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Original Price (₹) *
                <input
                  name="originalPrice"
                  type="number"
                  required
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="70000"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Selling Price (₹) *
                <input
                  name="sellingPrice"
                  type="number"
                  required
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  placeholder="45000"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Age in Months
              <input
                name="ageMonths"
                type="number"
                value={formData.ageMonths}
                onChange={handleChange}
                placeholder="12"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple"
              />
            </label>

            <p className="text-xs text-slate-400">
              🤖 AI will suggest an optimal price after listing
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple py-3 text-sm font-medium text-white shadow-lg disabled:opacity-60"
          >
            {loading ? 'Listing...' : '🎉 List Item'}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full rounded-full bg-slate-100 py-3 text-sm text-slate-600 hover:bg-slate-200"
          >
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
}