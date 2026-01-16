import React, { useState } from 'react';
import { BrainCircuit, LayoutGrid, ShieldHalf, Star as StarIcon, Palette, List, Home, Plus, Search, ArrowRight } from 'lucide-react';
import type { ActiveTool, UserRole, Product } from '../types';
import { discoverCreations, featuredProducts, masterArtisans } from '../constants';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import ProfileSwitcher from './ProfileSwitcher';

// --- ICONS (as components) ---
const LogoIcon = () => ( <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0"><path d="M16 4L22 10L16 16L10 10L16 4Z" fill="#802B3F"/><path d="M10 10L4 16L10 22L16 16L10 10Z" fill="#802B3F"/><path d="M22 10L28 16L22 22L16 16L22 10Z" fill="#802B3F"/><path d="M16 16L22 22L16 28L10 22L16 16Z" fill="#802B3F"/><path d="M17.5 14.5L16 16L14.5 14.5L16 13L17.5 14.5Z" stroke="white" strokeOpacity="0.8" strokeWidth="1.5"/></svg>);
const HomeIcon = () => <Home size={20} />;
const CreateIcon = () => <Palette size={20} />;
const OrdersIcon = () => <List size={20} />;
const StartCreatingIcon = () => <Plus size={20} />;
const ExploreIcon = () => <Search size={20} />;
const ArrowRightIcon = () => <ArrowRight size={16} />;

interface LandingPageProps {
  onNavigate: (tool: ActiveTool) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}
const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, userRole, setUserRole }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const customerNav = [ 
    { id: 'cocreation', label: 'Create', icon: CreateIcon }, 
    { id: 'orders', label: 'Orders', icon: OrdersIcon } 
  ];
  const artisanNav = [ 
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid }, 
    { id: 'orders', label: 'Orders', icon: OrdersIcon }, 
    { id: 'helper', label: 'AI Helper', icon: BrainCircuit },
  ];
  const navItems = userRole === 'Customer' ? customerNav : artisanNav;

  return (
    <div className="bg-brand-bg font-sans text-brand-text">
      <header className="sticky top-0 bg-brand-bg/80 backdrop-blur-md z-50 border-b border-gray-200/60">
        <nav className="max-w-screen-xl mx-auto px-6 flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
                <button onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2"><LogoIcon /><span className="font-serif text-2xl font-bold text-brand-maroon">KalaKriti AI</span></button>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 bg-white/60 border border-gray-200/80 p-1.5 rounded-full">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-brand-gold-light text-white shadow"><HomeIcon /> {userRole === 'Customer' ? 'Explorer' : 'Feed'}</button>
                    <div className="h-6 w-px bg-gray-200"></div>
                    {navItems.map(item => (<button key={item.id} onClick={() => onNavigate(item.id as ActiveTool)} className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-gray-600 hover:text-brand-maroon"><item.icon /> {item.label}</button>))}
                </div>
                <ProfileSwitcher userRole={userRole} setUserRole={setUserRole} />
            </div>
        </nav>
      </header>
      <main>
        <section className="text-center py-24 sm:py-32 px-6">
            <h1 className="font-serif text-5xl sm:text-7xl font-extrabold text-brand-text">Welcome to <span className="text-brand-maroon-light">KalaKriti AI</span></h1>
            <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-600">Where AI-powered creativity meets master artisan craftsmanship. Discover unique handcrafted treasures or co-create your dream product with our intelligent design platform.</p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
                <button onClick={() => onNavigate(userRole === 'Customer' ? 'cocreation' : 'dashboard')} className="flex items-center gap-2 rounded-lg bg-brand-maroon-light px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-maroon transition-transform duration-300 hover:scale-105"><StartCreatingIcon />{userRole === 'Customer' ? 'Start Creating' : 'Go to Dashboard'}</button>
                <a href="#discover" className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-brand-text bg-white/50 hover:bg-white transition-colors"><ExploreIcon /> Explore Marketplace</a>
            </div>
        </section>
        <section id="discover" className="py-16 px-6"><div className="max-w-screen-xl mx-auto"><div className="text-center mb-12"><h2 className="font-serif text-4xl font-bold text-brand-text">Discover Unique Creations</h2><p className="mt-2 text-lg text-gray-500">A gallery of handcrafted wonders, curated for you.</p></div><div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">{discoverCreations.map(p => <ProductCard key={p.id} product={p} isDiscovery={true} onClick={setSelectedProduct}/>)}</div></div></section>
        <section className="py-16 px-6 bg-white/40"><div className="max-w-screen-xl mx-auto"><div className="flex justify-between items-center mb-8"><h2 className="font-serif text-4xl font-bold text-brand-text">✨ Featured of the Week</h2><button className="flex items-center gap-2 font-semibold text-brand-gold-light hover:underline">View All <ArrowRightIcon /></button></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">{featuredProducts.map(p => <ProductCard key={p.id} product={p} onClick={setSelectedProduct} />)}</div></div></section>
        <section className="py-20 px-6"><div className="max-w-screen-xl mx-auto"><div className="text-center mb-12"><h2 className="font-serif text-4xl font-bold text-brand-text">Master Artisans</h2></div><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">{masterArtisans.map(artisan => (<div key={artisan.id} className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 text-center hover:shadow-md transition-shadow duration-300 flex flex-col items-center"><div className="w-20 h-20 bg-brand-gold text-white rounded-full flex items-center justify-center text-4xl font-serif mb-3">{artisan.initial}</div><h3 className="font-semibold text-brand-text">{artisan.name}</h3><p className="text-sm text-gray-500">{artisan.location}</p><div className="flex items-center gap-2 text-sm my-2"><div className="flex items-center gap-1 text-brand-gold-light"><StarIcon size={16} fill="currentColor"/><span>{artisan.rating}</span></div><span className="text-gray-300">|</span><span className="text-gray-500">{artisan.orders} orders</span></div><div className="flex flex-wrap justify-center gap-2 mt-2">{artisan.skills.map(skill => (<span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{skill}</span>))}</div></div>))}</div></div></section>
      </main>
      <footer className="bg-white/30 border-t border-gray-200/60"><div className="max-w-screen-xl mx-auto py-8 px-6 text-center text-sm text-gray-500"><p>&copy; {new Date().getFullYear()} KalaKriti AI. A new era for artisans.</p></div></footer>
      {selectedProduct && <ProductDetailModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}/>}
    </div>
  );
};

export default LandingPage;