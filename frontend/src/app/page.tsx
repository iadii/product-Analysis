'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { getProducts } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Category = 'top' | 'bottom' | 'footwear' | 'accessory';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  useEffect(() => {
    loadProducts();
  }, [categoryFilter]);

  async function loadProducts() {
    setLoadingProducts(true);
    try {
      const params: { limit: number; category?: string } = { limit: 50 };
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }
      const response = await getProducts(params);
      setProducts(response.data);
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoadingProducts(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-[0.9]">
            Curate Your <br /> <i className="text-gray-400">Signature</i> Look.
          </h2>
          <p className="text-gray-500 text-lg font-light leading-relaxed max-w-lg">
            Click on any piece to view complete outfit recommendations curated by our AI stylist.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 mb-12 border-b border-gray-100 pb-4 sticky top-20 bg-white z-40 pt-4">
          {(['all', 'top', 'bottom', 'footwear', 'accessory'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`
                text-sm uppercase tracking-widest transition-colors relative
                ${categoryFilter === cat ? 'text-black font-bold' : 'text-gray-400 hover:text-black'}
              `}
            >
              {cat}
              {categoryFilter === cat && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-black"></span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 mb-8 text-sm">
            {error}
          </div>
        )}

        <div className="min-h-[50vh]">
          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
