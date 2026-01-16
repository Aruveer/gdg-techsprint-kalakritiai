import React, { useEffect } from 'react';
import type { Product } from '../types';
import { Star, Zap, ShoppingCart, X } from 'lucide-react';

const ProductDetailModal: React.FC<{ isOpen: boolean; onClose: () => void; product: Product | null; }> = ({ isOpen, onClose, product }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen || !product) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="relative z-10 bg-brand-bg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 text-gray-400 hover:text-brand-maroon"><X size={24} /></button>
        <div className="w-full md:w-1/2 flex-shrink-0 p-6 flex items-center justify-center">
          <img src={product.image} alt={product.name} className="w-auto h-auto max-w-full max-h-full object-contain rounded-xl"/>
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
          <div>
            <h1 className="font-serif text-3xl font-bold text-brand-maroon">{product.name}</h1>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 bg-brand-gold text-white rounded-full flex items-center justify-center text-lg font-bold">{product.artisan.initial}</div>
              <div>
                <p className="font-semibold text-brand-text">{product.artisan.name}</p>
                {product.artisan.location && <p className="text-sm text-gray-500">{product.artisan.location}</p>}
              </div>
            </div>
            <div className="flex items-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-1.5 text-brand-gold-light font-semibold"><Star size={18} className="fill-current" /><span>{product.rating} Rating</span></div>
                <div className="flex items-center gap-1.5 text-brand-maroon-light font-semibold"><Zap size={18} className="fill-current"/><span>{product.hype} Hype</span></div>
            </div>
            <div className="mt-6"><h2 className="font-semibold text-brand-text mb-2">Description</h2><p className="text-gray-600 leading-relaxed">{product.description}</p></div>
            {product.tags && product.tags.length > 0 && (
                <div className="mt-6">
                    <h2 className="font-semibold text-brand-text mb-2">Tags</h2>
                    <div className="flex flex-wrap gap-2">{product.tags.map(tag => (<span key={tag} className="text-sm bg-gray-200/80 text-gray-700 px-3 py-1 rounded-full">{tag}</span>))}</div>
                </div>
            )}
          </div>
          <div className="mt-auto pt-8 space-y-3">
             <p className="text-3xl font-bold text-brand-maroon text-right">{product.price}</p>
             <button className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-brand-maroon-light text-white font-bold rounded-lg hover:bg-brand-maroon transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"><ShoppingCart size={20} /> Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
