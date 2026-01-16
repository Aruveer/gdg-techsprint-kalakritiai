import React, { useState, useEffect, useRef } from 'react';
import { User, Brush, ChevronRight, Check } from 'lucide-react';
import type { UserRole } from '../types';

const ProfileSwitcher: React.FC<{ userRole: UserRole; setUserRole: (role: UserRole) => void; }> = ({ userRole, setUserRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectRole = (role: UserRole) => {
    setUserRole(role);
    setIsOpen(false);
  };

  const RoleIcon = userRole === 'Customer' ? User : Brush;
  const roleText = userRole === 'Customer' ? 'Customer View' : 'Artisan Hub';

  return (
    <div className="relative" ref={switcherRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-semibold text-brand-text bg-white/60 border border-gray-200/80 px-4 py-2 rounded-full hover:bg-white transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <RoleIcon size={18} />
        <span>{roleText}</span>
        <ChevronRight size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200/80 p-2 animate-fade-in-up z-50">
          <div className="p-2">
            <h3 className="font-semibold text-brand-text">Switch View</h3>
            <p className="text-xs text-gray-500">Change your role to access different features.</p>
          </div>
          <div className="mt-1 space-y-1">
            <button
              onClick={() => selectRole('Customer')}
              className={`w-full text-left flex items-center gap-3 p-2 rounded-lg transition-colors ${userRole === 'Customer' ? 'bg-brand-gold-light/10 text-brand-maroon' : 'hover:bg-gray-100'}`}
            >
              <User size={20} className="flex-shrink-0" />
              <div className="flex-grow">
                <p className="font-semibold text-sm">Customer</p>
                <p className="text-xs text-gray-500">Explore & co-create.</p>
              </div>
              {userRole === 'Customer' && <Check size={18} className="text-brand-maroon" />}
            </button>
            <button
              onClick={() => selectRole('Artisan')}
              className={`w-full text-left flex items-center gap-3 p-2 rounded-lg transition-colors ${userRole === 'Artisan' ? 'bg-brand-gold-light/10 text-brand-maroon' : 'hover:bg-gray-100'}`}
            >
              <Brush size={20} className="flex-shrink-0" />
              <div className="flex-grow">
                <p className="font-semibold text-sm">Artisan</p>
                <p className="text-xs text-gray-500">Manage & access tools.</p>
              </div>
              {userRole === 'Artisan' && <Check size={18} className="text-brand-maroon" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSwitcher;
