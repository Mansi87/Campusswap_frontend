import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '' });
  const [updateMsg, setUpdateMsg] = useState('');
  const [activeTab, setActiveTab] = useState('listings');
  const [openMenuId, setOpenMenuId] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, listingsRes, likesRes] = await Promise.all([
          API.get('/api/users/profile'),
          API.get('/api/products/my-listings'),
          API.get('/api/likes/my-likes'),
        ]);
        setProfile(profileRes.data);
        setListings(listingsRes.data);
        setLikes(likesRes.data);
        setFormData({
          fullName: profileRes.data.fullName,
          phone: profileRes.data.phone || '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleUpdate = async () => {
    try {
      await API.put('/api/users/profile', formData);
      setProfile(prev => ({ ...prev, ...formData }));
      setEditing(false);
      setUpdateMsg('Profile updated! ✅');
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch (err) {
      setUpdateMsg('Update failed ❌');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await API.put('/api/users/profile/photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, profilePicUrl: res.data.profilePicUrl }));
      setUpdateMsg('Photo updated! ✅');
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch (err) {
      setUpdateMsg('Photo upload failed ❌');
    }
  };

  const handleMarkSold = async (productId) => {
    try {
      await API.put(`/api/products/${productId}/sold`);
      setListings(prev => prev.map(p =>
        p.id === productId ? { ...p, isSold: true } : p
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/api/products/${productId}`);
      setListings(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  const initials = profile?.fullName
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="px-8 py-6 pb-24">

      {updateMsg && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-800 px-6 py-2 text-sm text-white shadow-lg">
          {updateMsg}
        </div>
      )}

      <div className="flex flex-col gap-6 md:flex-row">

        {/* Left — Profile Card */}
        <div className="rounded-3xl bg-white p-6 shadow-lg md:w-72">
          <div className="flex flex-col items-center gap-3">
            <div onClick={() => fileInputRef.current.click()} className="relative cursor-pointer">
              {profile?.profilePicUrl ? (
                <img src={profile.profilePicUrl} alt="Profile" className="h-20 w-20 rounded-full object-cover ring-4 ring-indigo-100" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-brandPurple ring-4 ring-indigo-100">
                  {initials}
                </div>
              )}
              <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-brandPurple text-xs text-white">
                📷
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

            {editing ? (
              <div className="w-full space-y-2">
                <input type="text" value={formData.fullName}
                  onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-brandPurple"
                  placeholder="Full Name" />
                <input type="tel" value={formData.phone}
                  onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-brandPurple"
                  placeholder="Phone" />
                <div className="flex gap-2">
                  <button onClick={handleUpdate} className="flex-1 rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple py-1.5 text-xs text-white">Save</button>
                  <button onClick={() => setEditing(false)} className="flex-1 rounded-full bg-slate-100 py-1.5 text-xs text-slate-600">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-semibold text-slate-800">{profile?.fullName}</p>
                <p className="text-xs text-slate-500">{profile?.email}</p>
                {profile?.phone && <p className="text-xs text-slate-500">{profile.phone}</p>}
                <p className="mt-1 text-xs text-slate-500">🏫 {profile?.collegeName}</p>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-2xl bg-indigo-50 p-2">
              <p className="text-lg font-bold text-brandPurple">{listings.length}</p>
              <p className="text-slate-500">Listings</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-2">
              <p className="text-lg font-bold text-brandPurple">{likes.length}</p>
              <p className="text-slate-500">Likes</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-2">
              <p className="text-lg font-bold text-brandPurple">{profile?.rating?.toFixed(1) || '0.0'}</p>
              <p className="text-slate-500">Rating</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button onClick={() => setEditing(true)} className="w-full rounded-full bg-indigo-50 py-2 text-sm text-brandPurple hover:bg-indigo-100">
              ✏️ Edit Profile
            </button>
            <button onClick={logout} className="w-full rounded-full bg-rose-50 py-2 text-sm text-rose-600 hover:bg-rose-100">
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Right — Tabs */}
        <div className="flex-1 rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setActiveTab('listings')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeTab === 'listings'
                  ? 'bg-gradient-to-r from-indigo-500 to-brandPurple text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              My Listings ({listings.length})
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeTab === 'likes'
                  ? 'bg-gradient-to-r from-indigo-500 to-brandPurple text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Liked Items ({likes.length})
            </button>
          </div>

          {/* My Listings Tab */}
          {activeTab === 'listings' && (
            listings.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <p className="text-4xl">📦</p>
                <p className="mt-3 text-sm font-medium">No listings yet</p>
                <p className="text-xs text-slate-500">Use the + button to list something</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map(product => (
                  <div key={product.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.title} className="h-44 w-full object-cover" />
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 text-4xl">📦</div>
                    )}
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-slate-800 line-clamp-1">{product.title}</p>
                        <div className="relative flex items-center gap-2">
                          <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            product.isSold ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {product.isSold ? 'Sold' : 'Active'}
                          </span>
                          {!product.isSold && (
                            <div className="relative">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                              >
                                ⋮
                              </button>
                              {openMenuId === product.id && (
                                <div className="absolute right-0 top-7 z-10 w-32 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
                                  <button
                                    onClick={() => { setOpenMenuId(null); navigate(`/edit-listing/${product.id}`); }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50"
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button
                                    onClick={() => { setOpenMenuId(null); handleDelete(product.id); }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-500 hover:bg-rose-50"
                                  >
                                    🗑 Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="mt-1 text-brandPurple font-bold">
                        ₹{product.sellingPrice?.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {product.category} • {product.condition}
                      </p>
                      {!product.isSold && (
                        <div className="mt-3">
                          <button
                            onClick={() => handleMarkSold(product.id)}
                            className="w-full rounded-full bg-emerald-500 py-1.5 text-xs font-medium text-white hover:bg-emerald-600 transition"
                          >
                            ✓ Mark Sold
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Liked Items Tab */}
          {activeTab === 'likes' && (
            likes.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <p className="text-4xl">💔</p>
                <p className="mt-3 text-sm font-medium">No liked items yet</p>
                <p className="text-xs text-slate-500">Swipe right on products you like!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {likes.map(product => (
                  <div key={product.id} className="rounded-2xl border border-slate-100 p-3">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.title} className="h-32 w-full rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-xl bg-indigo-50 text-3xl">📦</div>
                    )}
                    <div className="mt-2">
                      <p className="font-medium text-sm line-clamp-1">{product.title}</p>
                      <p className="text-brandPurple font-bold text-sm">
                        ₹{product.sellingPrice?.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-slate-500">{product.sellerName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}