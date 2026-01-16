import React from 'react';
import { BrainCircuit, LayoutGrid, Brush, Check, ShieldHalf, User, ChevronRight, Home, List, Palette, LucideProps } from 'lucide-react';
import type { ActiveTool, UserRole } from '../types';
import ProfileSwitcher from './ProfileSwitcher';

// --- ICONS (as components) ---
const LogoIcon = () => ( <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0"><path d="M16 4L22 10L16 16L10 10L16 4Z" fill="#802B3F"/><path d="M10 10L4 16L10 22L16 16L10 10Z" fill="#802B3F"/><path d="M22 10L28 16L22 22L16 16L22 10Z" fill="#802B3F"/><path d="M16 16L22 22L16 28L10 22L16 16Z" fill="#802B3F"/><path d="M17.5 14.5L16 16L14.5 14.5L16 13L17.5 14.5Z" stroke="white" strokeOpacity="0.8" strokeWidth="1.5"/></svg>);
const HomeIcon = () => <Home size={20} className="flex-shrink-0"/>;
const CreateIcon = () => <Palette size={20} className="flex-shrink-0"/>;
const OrdersIcon = () => <List size={20} className="flex-shrink-0"/>;

interface MainLayoutProps {
  children: React.ReactNode;
  onNavigate: (tool: ActiveTool) => void;
  activeTool: ActiveTool;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children, onNavigate, activeTool, userRole, setUserRole }) => {
    const customerNav = [ 
        { id: 'cocreation', label: 'Create', icon: CreateIcon, active: activeTool === 'cocreation' }, 
        { id: 'orders', label: 'Orders', icon: OrdersIcon, active: activeTool === 'orders' } 
    ];
    const artisanNav = [ 
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, active: activeTool === 'dashboard' }, 
        { id: 'orders', label: 'Orders', icon: OrdersIcon, active: activeTool === 'orders' }, 
        { id: 'helper', label: 'AI Helper', icon: BrainCircuit, active: activeTool === 'helper' },
    ];
    const navItems = userRole === 'Customer' ? customerNav : artisanNav;

    return (
        <div className="bg-brand-bg font-sans text-brand-text min-h-screen flex flex-col">
            <header className="sticky top-0 bg-brand-bg/80 backdrop-blur-md z-50 border-b border-gray-200/60">
                <nav className="max-w-screen-xl mx-auto px-6 flex justify-between items-center h-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => onNavigate('feed')} className="flex items-center gap-2"><LogoIcon /><span className="font-serif text-2xl font-bold text-brand-maroon">KalaKriti AI</span></button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-white/60 border border-gray-200/80 p-1.5 rounded-full">
                            <button onClick={() => onNavigate('feed')} className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-gray-600 hover:text-brand-maroon"><HomeIcon /> {userRole === 'Customer' ? 'Explorer' : 'Feed'}</button>
                            <div className="h-6 w-px bg-gray-200"></div>
                            {navItems.map(item => (<button key={item.id} onClick={() => onNavigate(item.id as ActiveTool)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${item.active ? 'bg-brand-gold-light text-white shadow' : 'text-gray-600 hover:text-brand-maroon'}`}><item.icon /> {item.label}</button>))}
                        </div>
                        <ProfileSwitcher userRole={userRole} setUserRole={setUserRole} />
                    </div>
                </nav>
            </header>
            <main className="flex-grow">{children}</main>
            <footer className="bg-white/30 border-t border-gray-200/60 mt-auto"><div className="max-w-screen-xl mx-auto py-8 px-6 text-center text-sm text-gray-500"><p>&copy; {new Date().getFullYear()} KalaKriti AI. A new era for artisans.</p></div></footer>
        </div>
    );
};

export default MainLayout;