import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import MainLayout from './components/Layout/MainLayout.jsx';

import Home from './pages/Home.jsx';
import Likes from './pages/Likes.jsx';
import Explore from './pages/Explore.jsx';
import Chats from './pages/Chats.jsx';
import Category from './pages/Category.jsx';
import Notifications from './pages/Notifications.jsx';
import Settings from './pages/Settings.jsx';
import Profile from './pages/Profile.jsx';
import CreateListing from './pages/CreateListing.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import EditListing from './pages/EditListing.jsx';
import ProductDetail from './pages/ProductDetail.jsx';


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Home />} />
        <Route path="/likes" element={<Likes />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/edit-listing/:productId" element={<EditListing />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}