import React, { useState } from 'react';
import { UploadCloud, Bot, BrainCircuit, Loader, AlertTriangle, FileText, Tag, DollarSign, Lightbulb } from 'lucide-react';
import { generateProductListing } from '../services/geminiService';
import type { ProductListing } from '../types';

const ArtisanHelper: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [contextText, setContextText] = useState("The material is teak wood. The artisan is an expert in Kutch Embroidery. This is a new product being listed for the first time.");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedListing, setGeneratedListing] = useState<ProductListing | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setGeneratedListing(null);
            setError(null);
        }
    };

    const handleGenerate = async () => {
        if (!imageFile) {
            setError("Please upload a product image first.");
            return;
        }
        if (!contextText.trim()) {
            setError("Please provide some context about the product.");
            return;
        }

        setError(null);
        setIsLoading(true);
        setGeneratedListing(null);

        try {
            const result = await generateProductListing(imageFile, contextText);
            setGeneratedListing(result);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // UI component to display the result
    const ListingResult = ({ listing }: { listing: ProductListing }) => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-8 animate-fade-in space-y-6">
            <h3 className="text-3xl font-serif font-bold text-brand-maroon">{listing.product_name}</h3>
            
            <div>
                <div className="flex items-center gap-2 text-lg font-semibold text-brand-text mb-2">
                    <FileText size={20} />
                    <span>Description</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{listing.long_description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-brand-text mb-2">
                        <DollarSign size={20} />
                        <span>Price Recommendation</span>
                    </div>
                    <div className="bg-brand-gold-light/10 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-brand-maroon">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: listing.price_recommendation.currency }).format(listing.price_recommendation.low_end)} - {new Intl.NumberFormat('en-IN', { style: 'currency', currency: listing.price_recommendation.currency }).format(listing.price_recommendation.high_end)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{listing.price_recommendation.rationale}</p>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-brand-text mb-2">
                        <Tag size={20} />
                        <span>Suggested Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {listing.suggested_tags.map(tag => (
                            <span key={tag} className="text-sm bg-gray-200/80 text-gray-700 px-3 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 text-lg font-semibold text-brand-text mb-2">
                    <Lightbulb size={20} />
                    <span>Promotion Idea</span>
                </div>
                <p className="text-gray-600 italic">"{listing.promotion_idea}"</p>
            </div>

        </div>
    );

    return (
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <BrainCircuit className="mx-auto h-16 w-16 text-brand-maroon" />
                <h1 className="text-5xl font-serif font-bold text-brand-text mt-4">AI Helper</h1>
                <p className="mt-4 text-lg text-gray-600">Generate compelling product listings in seconds. Just upload an image and provide some context.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Input Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-8 space-y-6">
                    <div>
                        <label className="block text-lg font-semibold text-brand-text mb-3">1. Upload Product Image</label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            {imagePreview ? (
                                <div className="text-center">
                                    <img src={imagePreview} alt="Product preview" className="mx-auto h-48 w-auto rounded-lg" />
                                    <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="text-sm text-red-500 hover:underline mt-2">Remove Image</button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-brand-maroon focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-maroon focus-within:ring-offset-2 hover:text-brand-maroon-light">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="context" className="block text-lg font-semibold text-brand-text mb-3">2. Provide Product Context</label>
                        <textarea
                            id="context"
                            value={contextText}
                            onChange={(e) => setContextText(e.target.value)}
                            rows={4}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold-light focus:border-brand-gold-light transition-colors text-brand-text bg-white"
                            placeholder="e.g., The material is teak wood. The artisan is an expert in Kutch Embroidery..."
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !imageFile}
                        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-brand-maroon-light text-white font-bold rounded-lg hover:bg-brand-maroon transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="animate-spin" size={20} />
                                Generating Listing...
                            </>
                        ) : (
                            <>
                                <Bot size={20} />
                                Generate Listing with AI
                            </>
                        )}
                    </button>
                </div>

                {/* Output Section */}
                <div className="sticky top-28">
                     {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {!isLoading && !generatedListing && !error && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-8 text-center">
                            <Bot className="mx-auto h-16 w-16 text-gray-300" />
                            <h3 className="mt-4 text-xl font-semibold text-brand-text">Your AI-Generated Listing</h3>
                            <p className="mt-2 text-gray-500">The generated product details will appear here once you provide an image and context.</p>
                        </div>
                    )}
                    {isLoading && (
                         <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-8 text-center">
                            <Loader className="mx-auto h-16 w-16 text-brand-maroon animate-spin" />
                            <h3 className="mt-4 text-xl font-semibold text-brand-text">AI is working its magic...</h3>
                            <p className="mt-2 text-gray-500">Crafting the perfect description and pricing for your product.</p>
                        </div>
                    )}
                    {generatedListing && !isLoading && (
                        <ListingResult listing={generatedListing} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtisanHelper;