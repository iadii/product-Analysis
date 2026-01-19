'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/services/api';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
    selected?: boolean;
}

export default function ProductCard({ product, onClick, selected }: ProductCardProps) {
    const content = (
        <div
            className={`
        group cursor-pointer flex flex-col gap-2
        transition-opacity duration-300
        ${selected ? 'opacity-100' : 'opacity-100 hover:opacity-70'}
      `}
        >
            <div className={`
        relative aspect-[3/4] w-full overflow-hidden bg-gray-50
        ${selected ? 'ring-1 ring-black ring-offset-2' : ''}
      `}>
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                        <span className="text-2xl font-serif italic text-gray-400">
                            {product.category}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-0.5 mt-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 truncate">
                    {product.brand}
                </h3>
                <p className="text-sm font-medium text-gray-900 truncate font-serif italic">
                    {product.name}
                </p>
                <p className="text-xs text-black font-semibold mt-1">
                    {formatPrice(product.price)}
                </p>
            </div>
        </div>
    );

    if (onClick) {
        return <div onClick={onClick}>{content}</div>;
    }

    return (
        <Link href={`/product/${product._id}`}>
            {content}
        </Link>
    );
}
