import { useState } from 'react';
import Sidebar from '../components/Home/Sidebar.jsx';
import CenterHero from '../components/Home/CenterHero.jsx';
import RightBar from '../components/Home/RightBar.jsx';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <main className="grid flex-1 grid-cols-1 gap-6 px-8 py-6 pb-24 lg:grid-cols-[240px,1.6fr,320px]">
      <Sidebar onCategorySelect={setSelectedCategory} selectedCategory={selectedCategory} />
      <CenterHero selectedCategory={selectedCategory} />
      <RightBar />
    </main>
  );
}