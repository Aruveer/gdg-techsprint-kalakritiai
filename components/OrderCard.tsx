import React from 'react';
import type { Order, OrderStatus } from '../types';
import { Check } from 'lucide-react';

const OrderCard: React.FC<{ order: Order; }> = ({ order }) => {
    const statusStyles: Record<OrderStatus, string> = { 'In Progress': 'bg-orange-100 text-orange-800', 'Pending Approval': 'bg-yellow-100 text-yellow-800', 'Completed': 'bg-green-100 text-green-800', 'Quality Check': 'bg-purple-100 text-purple-800' };
    const progressSteps = [ { id: 1, label: 'Accepted' }, { id: 2, label: 'Materials' }, { id: 3, label: 'Production' }, { id: 4, label: 'Quality' }, { id: 5, label: 'Shipped' }];
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-6">
                <img src={order.image} alt={order.title} className="w-full sm:w-32 h-32 object-cover rounded-lg" />
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-bold text-brand-text">{order.title}</h2>
                            <div className="text-sm text-gray-500 mt-1"><span>Artisan: {order.artisan}</span><span className="mx-2 text-gray-300">•</span><span>Order #{order.orderId}</span></div>
                        </div>
                        <div className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 ${statusStyles[order.status]}`}>{order.status}</div>
                    </div>
                    <div className="mt-6">
                        <div className="flex items-center">
                            {progressSteps.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center relative">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${step.id <= order.progressStep ? 'bg-brand-maroon' : 'bg-gray-300'}`}>
                                            {step.id < order.progressStep && <Check size={14} className="text-white"/>}
                                        </div>
                                        <p className={`text-xs font-semibold mt-2 text-center absolute -bottom-6 w-20 ${step.id <= order.progressStep ? 'text-brand-text' : 'text-gray-400'}`}>{step.label}</p>
                                    </div>
                                    {index < progressSteps.length - 1 && (<div className={`flex-1 h-1 ${step.id < order.progressStep ? 'bg-brand-maroon' : 'bg-gray-300'}`}></div>)}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="mt-10 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                        <span>Ordered: {order.orderDate}</span>
                        <span className="mt-1 sm:mt-0">Est. Delivery: {order.estDeliveryDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
