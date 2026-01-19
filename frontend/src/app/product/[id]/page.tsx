'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product, GeneratedOutfit } from '@/types';
import { getProductById, getRecommendations, formatPrice } from '@/services/api';
import OutfitDisplay from '@/components/OutfitDisplay';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductPage() {
    const params = useParams();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [recommendations, setRecommendations] = useState<GeneratedOutfit[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRecs, setLoadingRecs] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (productId) {
            loadProduct();
        }
    }, [productId]);

    async function loadProduct() {
        setLoading(true);
        try {
            const response = await getProductById(productId);
            setProduct(response.data);
            loadRecommendations();
        } catch {
            setError('Failed to load product');
        } finally {
            setLoading(false);
        }
    }

    async function loadRecommendations() {
        setLoadingRecs(true);
        try {
            const response = await getRecommendations(productId, { limit: 5 });
            setRecommendations(response.recommendations);
        } catch {
            console.error('Failed to load recommendations');
        } finally {
            setLoadingRecs(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-white">
                <Navbar showBackLink />
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="animate-pulse">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="aspect-[3/4] bg-gray-100"></div>
                            <div className="space-y-4">
                                <div className="h-6 w-24 bg-gray-200"></div>
                                <div className="h-10 w-3/4 bg-gray-200"></div>
                                <div className="h-8 w-32 bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">{error || 'Product not found'}</p>
                    <Link href="/" className="text-black underline">Back to Shop</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-black">
            <Navbar showBackLink />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    <div className="aspect-[3/4] bg-gray-50 overflow-hidden">
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-6xl font-serif italic text-gray-300">{product.category}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-center">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                            {product.brand}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-serif mb-6">{product.name}</h1>
                        <p className="text-2xl font-semibold mb-8">{formatPrice(product.price)}</p>

                        <div className="space-y-4 mb-8">
                            <div className="flex gap-2">
                                <span className="text-xs uppercase tracking-widest text-gray-500">Category:</span>
                                <span className="text-xs uppercase tracking-widest font-semibold">{product.category}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-xs uppercase tracking-widest text-gray-500">Color:</span>
                                <span className="text-xs uppercase tracking-widest font-semibold">{product.primaryColor}</span>
                            </div>
                            {product.style?.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    <span className="text-xs uppercase tracking-widest text-gray-500">Style:</span>
                                    {product.style.map(s => (
                                        <span key={s} className="text-xs uppercase tracking-widest border border-gray-200 px-2 py-1">{s}</span>
                                    ))}
                                </div>
                            )}
                            {product.occasion?.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    <span className="text-xs uppercase tracking-widest text-gray-500">Occasion:</span>
                                    {product.occasion.map(o => (
                                        <span key={o} className="text-xs uppercase tracking-widest border border-gray-200 px-2 py-1">{o}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {product.description && (
                            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>
                        )}

                        <button
                            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                            className="w-full md:w-auto bg-black text-white py-4 px-8 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition"
                        >
                            View Complete Outfits ↓
                        </button>
                    </div>
                </div>

                <div className="mt-32 border-t border-black pt-20">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">AI Curated</span>
                        <h2 className="text-4xl md:text-5xl font-serif mt-4">Complete the Look</h2>
                        <p className="text-gray-500 mt-4 max-w-lg mx-auto">
                            Our AI has curated complete outfits featuring this piece, considering style, color harmony, and occasion.
                        </p>
                    </div>

                    {loadingRecs ? (
                        <div className="space-y-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-64 bg-gray-100"></div>
                                </div>
                            ))}
                        </div>
                    ) : recommendations.length > 0 ? (
                        <div className="space-y-32">
                            {recommendations.map((outfit, index) => (
                                <OutfitDisplay key={index} outfit={outfit} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400">No outfit recommendations available for this product.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
