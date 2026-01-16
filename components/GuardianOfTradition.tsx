import React, { useState } from 'react';
import { ShieldHalf, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

const GuardianOfTradition: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<any | null>(null);

    const handleScan = async () => {
        if (!inputText.trim()) return;
        setIsScanning(true);
        setScanResult(null);
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsScanning(false);
        setScanResult({
            authenticityScore: 85,
            feedback: [
                { type: 'success', text: 'Use of "peacock motif" is culturally appropriate and well-described.' },
                { type: 'suggestion', text: 'Consider mentioning the specific region in Rajasthan known for this style to add more authenticity.' },
                { type: 'warning', text: 'Avoid using generic terms like "oriental design" as it can be misconstrued. Be specific about the cultural origin.' },
            ]
        });
    };

    return (
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <ShieldHalf className="mx-auto h-16 w-16 text-brand-maroon" />
                <h1 className="text-5xl font-serif font-bold text-brand-text mt-4">Guardian of Tradition</h1>
                <p className="mt-4 text-lg text-gray-600">Ensure your creations are culturally authentic and respectful with our AI-powered analysis.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-8">
                <h2 className="text-2xl font-semibold text-brand-text mb-4">Analyze Your Product Description</h2>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your product description here... For example: A beautifully handcrafted wooden box, meticulously painted with a vibrant peacock motif, a symbol of grace and beauty in Indian culture."
                    className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold-light focus:border-brand-gold-light transition-colors text-brand-text bg-white"
                    aria-label="Product Description Input"
                />
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleScan}
                        disabled={isScanning || !inputText.trim()}
                        className="flex items-center gap-2 px-8 py-3 bg-brand-maroon-light text-white font-bold rounded-lg hover:bg-brand-maroon transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isScanning ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Scanning...
                            </>
                        ) : (
                            <>
                                <ShieldHalf size={20} />
                                Scan for Authenticity
                            </>
                        )}
                    </button>
                </div>
            </div>

            {scanResult && (
                <div className="mt-10 animate-fade-in">
                    <h2 className="text-2xl font-semibold text-brand-text mb-6">Analysis Report</h2>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-8">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center">
                                <div className="text-5xl font-bold text-green-600">{scanResult.authenticityScore}%</div>
                                <div className="text-lg font-semibold text-gray-600">Authenticity Score</div>
                            </div>
                            <div className="w-px bg-gray-200 self-stretch"></div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-brand-text mb-3">AI Feedback & Suggestions:</h3>
                                <ul className="space-y-3">
                                    {scanResult.feedback.map((item: any, index: number) => (
                                        <li key={index} className="flex items-start gap-3 text-sm">
                                            {item.type === 'success' && <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />}
                                            {item.type === 'warning' && <AlertTriangle size={18} className="text-yellow-500 mt-0.5 flex-shrink-0" />}
                                            {item.type === 'suggestion' && <Lightbulb size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />}
                                            <span className="text-gray-700">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuardianOfTradition;