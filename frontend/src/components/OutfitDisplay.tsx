'use client';

import { GeneratedOutfit, Product } from '@/types';
import { formatPrice } from '@/services/api';
import ProductCard from './ProductCard';

interface OutfitDisplayProps {
    outfit: GeneratedOutfit;
    index: number;
}

export default function OutfitDisplay({ outfit, index }: OutfitDisplayProps) {
    // Determine the "Hero" product
    const heroProduct = outfit.products.top;

    // Remaining products for the grid
    const products: Product[] = [
        outfit.products.bottom,
        outfit.products.footwear,
        ...outfit.products.accessories,
    ];

    return (
        <div className="w-full max-w-7xl mx-auto mb-32 border-b border-gray-100 pb-20 last:border-0">
            {/* Editorial Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 px-4 md:px-0">
                <div className="max-w-xl">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4 block">
                        Look {String(index + 1).padStart(2, '0')} — {outfit.aiAnalysis?.styleDescription || 'Curated'}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                        {outfit.reasoning ? `"${outfit.reasoning.split('.')[0]}"` : 'Effortless Style'}
                    </h2>
                </div>
                <div className="mt-6 md:mt-0 text-right">
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Total Estimated</p>
                    <p className="text-xl font-serif italic">{formatPrice(outfit.totalPrice)}</p>
                </div>
            </div>

            {/* Asymmetric Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">

                {/* HERO SECTION (Large Image) */}
                <div className="md:col-span-6 lg:col-span-5 relative">
                    <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
                        {heroProduct.imageUrl ? (
                            <img
                                src={heroProduct.imageUrl}
                                alt={heroProduct.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                                <span className="text-9xl opacity-10 font-serif">{index + 1}</span>
                            </div>
                        )}

                        {/* Overlay Tag */}
                        <div className="absolute top-0 left-0 p-6">
                            <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold tracking-widest uppercase">
                                {heroProduct.brand}
                            </span>
                        </div>
                    </div>

                    {/* Stylist Note */}
                    <div className="mt-6 pr-8">
                        <p className="text-sm leading-relaxed text-gray-600 font-serif italic">
                            Stylist Note: {outfit.aiAnalysis?.stylingTips?.[0] || outfit.reasoning}
                        </p>
                        {outfit.aiAnalysis?.occasionSuggestions && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {outfit.aiAnalysis.occasionSuggestions.map(occ => (
                                    <span key={occ} className="text-[10px] uppercase tracking-widest border border-gray-200 px-2 py-1 text-gray-400">
                                        {occ}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* PRODUCT GRID (Smaller Items) */}
                <div className="md:col-span-6 lg:col-span-7">
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-12">
                        {/* Always show the Top again? Or just the rest? Let's show the rest + Top small if wanted.
                            For now, let's show the full outfit components grid.
                         */}
                        {[outfit.products.top, ...products].map((prod, i) => (
                            <ProductCard
                                key={prod._id || i}
                                product={prod}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
