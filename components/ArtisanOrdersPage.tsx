import React from 'react';
import { Star } from 'lucide-react';
import OrderCard from './OrderCard';

const ArtisanOrdersPage: React.FC = () => (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif font-bold text-brand-text mb-8">Orders Management</h1>
        <div className="space-y-12">
            <section>
                <h2 className="text-2xl font-semibold text-brand-text mb-4">AI Mockup Requests</h2>
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-start gap-4">
                        <img src="https://storage.googleapis.com/my-ai-app-images-2025/custom%20leather%20bound%20journal.png" className="w-24 h-24 object-cover rounded-md" alt="leather journal"/>
                        <div className="flex-grow">
                            <div className="flex justify-between">
                                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">PERSONAL REQUEST</span>
                            </div>
                            <h3 className="font-bold mt-1">Custom leather-bound journal</h3>
                            <p className="text-sm text-gray-600 mt-1">Request for a journal with custom tooling and silver-leaf initials.</p>
                            <div className="flex items-center gap-2 mt-3">
                                <button className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700">Accept</button>
                                <button className="px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700">Reject</button>
                                <button className="px-4 py-1.5 bg-gray-200 text-gray-800 text-sm font-semibold rounded-md hover:bg-gray-300">Chat</button>
                            </div>
                        </div>
                    </div>
                     <div className="bg-white p-4 rounded-lg shadow-sm border flex items-start gap-4">
                        <img src="https://storage.googleapis.com/my-ai-app-images-2025/ceramic%20mug%20with%20floral%20pattern.png" className="w-24 h-24 object-cover rounded-md" alt="ceramic mug"/>
                        <div className="flex-grow">
                            <span className="text-xs font-semibold bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">OPEN TO ALL</span>
                            <h3 className="font-bold mt-1">Ceramic mug with floral pattern</h3>
                            <p className="text-sm text-gray-600 mt-1">General request for a set of four mugs with a hand-painted daisy design.</p>
                            <div className="flex items-center gap-2 mt-3">
                                <button className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700">Accept</button>
                                <button className="px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700">Reject</button>
                                <button className="px-4 py-1.5 bg-gray-200 text-gray-800 text-sm font-semibold rounded-md hover:bg-gray-300">Chat</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <h2 className="text-2xl font-semibold text-brand-text mb-4">Ongoing Orders</h2>
                <div className="space-y-4">
                    <OrderCard order={{id: '4', title: 'Engraved silver locket', artisan: 'You', orderId: 'ORD-004', status: 'In Progress', image: 'https://storage.googleapis.com/my-ai-app-images-2025/engraved%20silver%20locket.png', orderDate: 'Oct 26, 2025', estDeliveryDate: 'Nov 15, 2025', progressStep: 3}} />
                    <OrderCard order={{id: '5', title: 'Hand-carved wooden bowl', artisan: 'You', orderId: 'ORD-005', status: 'Quality Check', image: 'https://storage.googleapis.com/my-ai-app-images-2025/hand%20carved%20wooden%20bowl.png', orderDate: 'Oct 22, 2025', estDeliveryDate: 'Nov 10, 2025', progressStep: 4}} />
                </div>
            </section>
            <section>
                <h2 className="text-2xl font-semibold text-brand-text mb-4">Completed Orders</h2>
                <div className="bg-white p-4 rounded-lg shadow-sm border flex items-start gap-4">
                    <img src="https://storage.googleapis.com/my-ai-app-images-2025/woven%20wall%20hanging.png" className="w-24 h-24 object-cover rounded-md" alt="Woven wall hanging"/>
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                           <h3 className="font-bold">Woven wall hanging</h3>
                           <span className="text-xs text-gray-500">Completed: Oct 15, 2025</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-yellow-500 mt-1">
                            <Star size={16} fill="currentColor"/> <Star size={16} fill="currentColor"/> <Star size={16} fill="currentColor"/> <Star size={16} fill="currentColor"/> <Star size={16} fill="currentColor"/>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 italic">"Absolutely stunning craftsmanship. It's even more beautiful in person!"</p>
                    </div>
                </div>
            </section>
        </div>
    </div>
);

export default ArtisanOrdersPage;