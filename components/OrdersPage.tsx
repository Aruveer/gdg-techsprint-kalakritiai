import React, { useState } from 'react';
import { ongoingOrders, pastOrders } from '../constants';
import OrderCard from './OrderCard';

const OrdersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ongoing' | 'past'>('ongoing');
    const ordersToShow = activeTab === 'ongoing' ? ongoingOrders : pastOrders;
    return (
        <div className="bg-brand-bg min-h-screen"><div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12"><div className="text-center mb-12"><h1 className="text-5xl font-serif font-bold text-brand-text">Your Orders</h1><p className="mt-4 text-lg text-gray-600">Track your custom creations from concept to completion</p></div><div className="max-w-md mx-auto mb-10"><div className="bg-white/60 p-1.5 rounded-full flex items-center border border-gray-200/80"><button onClick={() => setActiveTab('ongoing')} className={`w-1/2 py-2.5 text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-colors ${activeTab === 'ongoing' ? 'bg-white text-brand-maroon shadow' : 'text-gray-500 hover:text-brand-text'}`}>Ongoing ({ongoingOrders.length})</button><button onClick={() => setActiveTab('past')} className={`w-1/2 py-2.5 text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-colors ${activeTab === 'past' ? 'bg-white text-brand-maroon shadow' : 'text-gray-500 hover:text-brand-text'}`}>Past ({pastOrders.length})</button></div></div><div className="space-y-6">{ordersToShow.map(order => (<OrderCard key={order.id} order={order} />))}</div></div></div>
    );
};

export default OrdersPage;
