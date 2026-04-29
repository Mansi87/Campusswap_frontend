import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout.jsx';

import Home from './pages/Home.jsx';
import Likes from './pages/Likes.jsx';
import Explore from './pages/Explore.jsx';
import Chats from './pages/Chats.jsx';
import Category from './pages/Category.jsx';
import Notifications from './pages/Notifications.jsx';
import Settings from './pages/Settings.jsx';
import Profile from './pages/Profile.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/likes" element={<Likes />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
