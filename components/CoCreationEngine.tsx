import React, { useState } from 'react';
import { Sparkles, Bot, Image as ImageIcon, Loader, AlertTriangle, Shield, Download } from 'lucide-react';
import { generateImage, checkAuthenticity } from '../services/geminiService';
import GuardianModal from './GuardianModal';

type GuardianStatus = 'idle' | 'verifying' | 'pass' | 'fail';

// This correctly types the component to accept React's special `key` prop when used in lists.
type StyleButtonProps = {
    icon: string;
    title: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
};

// FIX: Explicitly type StyleButton as a React.FC to allow React's special `key` prop to be passed without TypeScript errors.
const StyleButton: React.FC<StyleButtonProps> = ({ icon, title, description, isSelected, onClick }) => (
    <button onClick={onClick} className={`p-4 border rounded-xl text-left transition-all duration-200 w-full flex items-start gap-4 ${isSelected ? 'bg-brand-gold-light/10 border-brand-gold-light ring-2 ring-brand-gold-light/50' : 'bg-white hover:border-gray-300'}`}>
        <div className="text-2xl mt-1">{icon}</div>
        <div>
            <h4 className="font-semibold text-brand-text">{title}</h4>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </button>
);

const CoCreationEngine: React.FC = () => {
    const [description, setDescription] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('Traditional');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [guardianState, setGuardianState] = useState<{ status: GuardianStatus, message: string | null }>({ status: 'idle', message: null });

    const handleGenerateMockup = async () => {
        if (!description.trim()) {
            setError("Please describe your dream product first.");
            return;
        }
        setError(null);
        setGeneratedImage(null);
        setGuardianState({ status: 'verifying', message: null });

        try {
            const result = await checkAuthenticity(description);
            if (result.status === 'PASS') {
                setGuardianState({ status: 'pass', message: result.ui_message });
                setTimeout(() => {
                    setGuardianState({ status: 'idle', message: null });
                    generateImageFlow();
                }, 2000);
            } else {
                setGuardianState({ status: 'fail', message: result.ui_message });
            }
        } catch (err: any) {
            setGuardianState({ status: 'fail', message: err.message || "Verification failed." });
        }
    };

    const generateImageFlow = async () => {
        setIsLoading(true);
        try {
            const imageUrl = await generateImage(description, selectedStyle);
            setGeneratedImage(imageUrl);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadImage = () => {
        if (!generatedImage) return;

        const link = document.createElement('a');
        link.href = generatedImage;

        // Extract file extension from mimeType, default to png
        const mimeTypeMatch = generatedImage.match(/data:(image\/[^;]+);/);
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';
        const extension = mimeType.split('/')[1] || 'png';

        link.download = `kalakriti-ai-mockup.${extension}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const artisticStyles = [
        { id: 'Traditional', icon: '🏺', title: 'Traditional', description: 'Classic Indian craftsmanship' },
        { id: 'Modern', icon: '✨', title: 'Modern', description: 'Contemporary minimalist design' },
        { id: 'Fusion', icon: '☀️', title: 'Fusion', description: 'Blend of traditional and modern' },
        { id: 'Rustic', icon: '🌿', title: 'Rustic', description: 'Natural, earthy aesthetic' },
    ];

    return (
        <>
            <GuardianModal
                status={guardianState.status}
                message={guardianState.message}
                onClose={() => setGuardianState({ status: 'idle', message: null })}
            />
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-serif font-bold text-brand-text">Co-Create with AI</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Describe your vision and watch AI bring it to life. Our artisans will craft your dream into reality.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Panel: Description and Style */}
                    <div className="bg-white/70 border border-gray-200/80 rounded-2xl p-8 space-y-8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-brand-gold-light" size={24} />
                            <h2 className="text-2xl font-serif font-bold text-brand-text">Describe Your Dream Product</h2>
                        </div>
                        <div>
                            <label htmlFor="product-description" className="block text-sm font-semibold text-brand-text mb-2">Product Description</label>
                            <textarea
                                id="product-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g., Hand-painted wooden jewelry box with a peacock design, featuring intricate gold details and velvet interior..."
                                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold-light focus:border-brand-gold-light transition-colors resize-none text-brand-text bg-white"
                                aria-label="Product Description Input"
                            />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-brand-text mb-3">Artistic Style</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {artisticStyles.map(style => (
                                    <StyleButton
                                        key={style.id}
                                        icon={style.icon}
                                        title={style.title}
                                        description={style.description}
                                        isSelected={selectedStyle === style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={handleGenerateMockup}
                                disabled={isLoading || guardianState.status === 'verifying'}
                                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-brand-maroon-light text-white font-bold rounded-lg hover:bg-brand-maroon transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {guardianState.status === 'verifying' ? (
                                    <>
                                        <Shield className="animate-pulse" size={20} />
                                        Verifying...
                                    </>
                                ) : isLoading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Generate AI Mockup
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: AI Mockup Preview */}
                    <div className="bg-white/70 border border-gray-200/80 rounded-2xl p-8 sticky top-28">
                        <div className="flex items-center gap-3 mb-6">
                            <Bot className="text-brand-gold-light" size={24} />
                            <h2 className="text-2xl font-serif font-bold text-brand-text">Live AI Mockup Preview</h2>
                        </div>
                        <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
                            {isLoading && (
                                <div className="text-center text-gray-500">
                                    <Loader className="animate-spin mx-auto h-10 w-10 text-brand-maroon" />
                                    <p className="mt-4 font-semibold">Generating your vision...</p>
                                </div>
                            )}
                            {error && !isLoading && (
                                <div className="text-center text-red-600 p-4">
                                    <AlertTriangle className="mx-auto h-10 w-10" />
                                    <p className="mt-4 font-semibold">Generation Failed</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            {!isLoading && !generatedImage && !error && (
                                <div className="text-center text-gray-500">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                                        <ImageIcon size={32} />
                                    </div>
                                    <p className="mt-4 font-semibold">Your AI-generated mockup will appear here</p>
                                </div>
                            )}
                            {generatedImage && !isLoading && (
                                <img src={generatedImage} alt="AI generated mockup" className="w-full h-full object-cover rounded-xl" />
                            )}
                        </div>
                        {generatedImage && !isLoading && (
                            <button
                                onClick={handleDownloadImage}
                                className="mt-6 w-full flex items-center justify-center gap-3 px-8 py-3 bg-brand-maroon text-white font-bold rounded-lg hover:bg-brand-maroon-light transition-all shadow-md hover:shadow-lg"
                            >
                                <Download size={20} />
                                Download Mockup
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CoCreationEngine;