import React, { useState, useEffect } from 'react';
import { TrendingUp, Loader, AlertTriangle } from 'lucide-react';
import { generateMonthlyOrderData } from '../services/geminiService';
import type { ChartData } from '../types';
import MonthlyOrdersChart from './MonthlyOrdersChart';

const ArtisanDashboardPage: React.FC = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [isChartLoading, setIsChartLoading] = useState(true);
    const [chartError, setChartError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setIsChartLoading(true);
                setChartError(null);
                const data = await generateMonthlyOrderData();
                setChartData(data);
            } catch (err: any) {
                setChartError(err.message || "Failed to load chart data.");
                console.error(err);
            } finally {
                setIsChartLoading(false);
            }
        };
        fetchChartData();
    }, []);

    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-brand-text mb-4">Real-Time Analytics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="text-gray-500">Completed Orders (Past Month)</h3>
                                <p className="text-4xl font-bold text-brand-text mt-2">45</p>
                                <div className="flex items-center text-green-600 mt-1">
                                    <TrendingUp size={16} className="mr-1"/>
                                    <span>12% increase</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="text-gray-500">Pending Orders</h3>
                                <p className="text-4xl font-bold text-brand-text mt-2">8</p>
                                <p className="text-sm text-gray-500 mt-1">Awaiting confirmation</p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold text-brand-text mb-4">{chartData?.chart_title || 'Orders per Month'}</h2>
                        <div className="bg-white p-6 rounded-lg shadow-sm border h-80 flex items-center justify-center">
                            {isChartLoading && (
                                <div className="text-center text-gray-500">
                                    <Loader className="animate-spin mx-auto h-8 w-8 text-brand-maroon" />
                                    <p className="mt-2 text-sm">Loading chart data...</p>
                                </div>
                            )}
                            {chartError && !isChartLoading && (
                                <div className="text-center text-red-600">
                                    <AlertTriangle className="mx-auto h-8 w-8" />
                                    <p className="mt-2 text-sm font-semibold">Could not load chart</p>
                                    <p className="text-xs">{chartError}</p>
                                </div>
                            )}
                            {chartData && !isChartLoading && !chartError && (
                                <MonthlyOrdersChart data={chartData} />
                            )}
                        </div>
                    </section>
                </div>
                <div className="space-y-8">
                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-semibold text-brand-text mb-4">Hype Points Tracker</h2>
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full" viewBox="0 0 36 36"><path className="text-gray-200" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /><path className="text-brand-gold" strokeWidth="3" strokeDasharray="65, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /></svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xs text-gray-500">Your Rank</span>
                                    <span className="text-3xl font-bold">#15</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">65% to next tier</p>
                        </div>
                    </section>
                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-semibold text-brand-text mb-2">Leaderboard Logic</h2>
                        <p className="text-sm text-gray-600">Hype points are earned by completing orders, receiving positive reviews, and engaging with the community feed. Rank up to unlock new perks!</p>
                    </section>
                </div>
            </div>
            <section className="mt-12">
                <h2 className="text-2xl font-semibold text-brand-text mb-4">Master Artisan Leaderboard</h2>
                <div className="space-y-4">
                    {[ { name: 'Priya Sharma', initial: 'PS', location: 'Jaipur, Rajasthan', desc: 'Master potter from Jaipur, blending traditional blue pottery techniques with contemporary designs.', followers: '1.2k', rating: 4.9, rank: 67 }, { name: 'Anand Patel', initial: 'AP', location: 'Kutch, Gujarat', desc: 'Specializes in Kutchi embroidery and mirror work, creating vibrant and intricate textiles.', followers: '850', rating: 4.8, rank: 62 }, { name: 'Rohan Das', initial: 'RD', location: 'Kolkata, West Bengal', desc: 'A terracotta artist known for detailed sculptures and traditional Dokra craft figurines.', followers: '950', rating: 4.9, rank: 58 } ].map((a, index) => (
                        <div key={a.name} className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4">
                            <span className="text-2xl font-bold text-gray-400 w-8 text-center flex-shrink-0">{index + 1}</span>
                            <div className="w-16 h-16 bg-brand-gold text-white rounded-full flex items-center justify-center text-2xl font-serif flex-shrink-0">{a.initial}</div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-brand-text">{a.name}</h3>
                                <p className="text-sm text-gray-500">{a.location}</p>
                                <p className="text-sm text-gray-600 mt-1">{a.desc}</p>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-end">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-brand-maroon">{a.rank}</div>
                                <button className="mt-4 w-full px-6 py-2 bg-brand-maroon text-white text-sm font-semibold rounded-lg hover:bg-brand-maroon-light">View Profile</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ArtisanDashboardPage;