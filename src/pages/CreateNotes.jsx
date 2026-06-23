import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export default function CreateNotes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    semester: '',
    isFree: true,
    price: '',
  });

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: val }));
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Only PDF files allowed');
      return;
    }
    setUploadingPdf(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await API.post('/api/notes/upload-pdf', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPdfUrl(res.data.url);
      setPdfName(file.name);
    } catch {
      setError('PDF upload failed. Try again.');
    } finally {
      setUploadingPdf(false);
    }
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
      setPreviewImages(prev => [...prev, ...res.data.urls].slice(0, 3));
    } catch {
      setError('Image upload failed');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfUrl) { setError('Please upload a PDF first'); return; }
    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('subject', formData.subject);
      form.append('semester', formData.semester);
      form.append('pdfUrl', pdfUrl);
      form.append('isFree', formData.isFree);
      if (!formData.isFree && formData.price) {
        form.append('price', formData.price);
      }
      previewImages.forEach(img => form.append('previewImages', img));

      await API.post('/api/notes', form);
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-8 py-6 pb-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">📚 List Notes</h1>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* PDF Upload */}
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">
              📄 Upload PDF <span className="text-red-500">*</span>
            </h2>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 hover:border-brandPurple hover:bg-indigo-50 transition">
              <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
              {uploadingPdf ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                  <p className="text-sm text-slate-500">Uploading PDF...</p>
                </div>
              ) : pdfUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">✅</span>
                  <p className="text-sm font-medium text-green-600">{pdfName}</p>
                  <p className="text-xs text-slate-400">Click to change PDF</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <span className="text-4xl">📄</span>
                  <p className="text-sm">Click to upload PDF</p>
                  <p className="text-xs">Only .pdf files accepted</p>
                </div>
              )}
            </label>
          </div>

          {/* Preview Images (optional) */}
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <h2 className="mb-1 text-sm font-semibold text-slate-700">
              🖼️ Preview Images <span className="text-slate-400 font-normal">(optional, max 3)</span>
            </h2>
            <p className="mb-3 text-xs text-slate-400">
              Add sample pages so buyers can preview before buying
            </p>
            <div className="grid grid-cols-4 gap-3">
              {previewImages.map((url, i) => (
                <div key={i} className="relative aspect-square">
                  <img src={url} className="h-full w-full rounded-2xl object-cover" />
                  <button
                    type="button"
                    onClick={() => setPreviewImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white"
                  >✕</button>
                </div>
              ))}
              {previewImages.length < 3 && (
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
              {Array.from({ length: Math.max(0, 2 - previewImages.length) }).map((_, i) => (
                <div key={`e-${i}`} className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50" />
              ))}
            </div>
          </div>

          {/* Note Details */}
          <div className="rounded-3xl bg-white p-5 shadow-lg space-y-3">
            <h2 className="text-sm font-semibold text-slate-700">📝 Note Details</h2>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Title *
              <input name="title" required value={formData.title} onChange={handleChange}
                placeholder="e.g. Data Structures Complete Notes"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple bg-white" />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Description
              <textarea name="description" value={formData.description} onChange={handleChange}
                placeholder="What topics are covered? Any special features?"
                rows={3}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple resize-none bg-white" />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Subject *
                <input name="subject" required value={formData.subject} onChange={handleChange}
                  placeholder="e.g. Physics"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple bg-white" />
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Semester *
                <select name="semester" required value={formData.semester} onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple bg-white">
                  <option value="">Select...</option>
                  {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </label>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-3xl bg-white p-5 shadow-lg space-y-3">
            <h2 className="text-sm font-semibold text-slate-700">💰 Pricing</h2>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={() => setFormData(p => ({ ...p, isFree: true, price: '' }))}
                  className="h-4 w-4 accent-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700">🆓 Free</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isFree"
                  checked={!formData.isFree}
                  onChange={() => setFormData(p => ({ ...p, isFree: false }))}
                  className="h-4 w-4 accent-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700">💳 Paid</span>
              </label>
            </div>

            {!formData.isFree && (
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Price (₹) *
                <input
                  name="price"
                  type="number"
                  required={!formData.isFree}
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 49"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brandPurple bg-white"
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || uploadingPdf}
            className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple py-3 text-sm font-medium text-white shadow-lg disabled:opacity-60"
          >
            {loading ? 'Listing...' : '🚀 List Notes'}
          </button>

          <button type="button" onClick={() => navigate(-1)}
            className="w-full rounded-full bg-slate-100 py-3 text-sm text-slate-600 hover:bg-slate-200">
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
}