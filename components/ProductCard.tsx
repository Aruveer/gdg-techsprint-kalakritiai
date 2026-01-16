import React from 'react';
import type { Product } from '../types';
import { Star, Flame, MapPin } from 'lucide-react';

const HypeIcon = () => <Flame size={16} className="flex-shrink-0" />;
const LocationIcon = () => <MapPin size={14} className="flex-shrink-0" />;

const ProductCard: React.FC<{ product: Product; isDiscovery?: boolean; onClick: (product: Product) => void; }> = ({ product, isDiscovery = false, onClick }) => (
    <div 
      onClick={() => onClick(product)}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200/80 hover:shadow-lg transition-shadow duration-300 group break-inside-avoid cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(product)}
    >
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full object-cover" />
        <div className="absolute top-2 left-2 bg-brand-gold-light/90 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
          <HypeIcon />
          <span>{product.hype} hype</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-brand-text truncate">{product.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <div className="w-6 h-6 bg-brand-gold text-white rounded-full flex items-center justify-center text-xs font-bold">{product.artisan.initial}</div>
          <span>{product.artisan.name}</span>
        </div>
         {isDiscovery && product.artisan.location && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
            <LocationIcon />
            <span>{product.artisan.location}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <p className="font-bold text-brand-maroon text-lg">{product.price}</p>
          <div className="flex items-center gap-1 text-brand-gold-light font-semibold">
            <Star size={16} fill="currentColor" />
            <span>{product.rating}</span>
          </div>
        </div>
         {isDiscovery && product.tags && (
            <div className="mt-3 flex flex-wrap gap-2">
                {product.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tag}</span>
                ))}
            </div>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); console.log('Hype given!'); }}
          className="mt-4 w-full bg-brand-gold-light/10 text-brand-gold-light font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-brand-gold-light/20 transition-colors"
        >
          <HypeIcon /> Give Hype
        </button>
      </div>
    </div>
);

export default ProductCard;
