import { Outfit } from '../types/index.js';

interface CacheEntry {
    outfits: Outfit[];
    timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const TTL_MS = 60 * 60 * 1000;
const MAX_SIZE = 500;

export function getCached(key: string): Outfit[] | null {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > TTL_MS) {
        cache.delete(key);
        return null;
    }
    return entry.outfits;
}

export function setCache(key: string, outfits: Outfit[]): void {
    if (cache.size >= MAX_SIZE) {
        const firstKey = cache.keys().next().value;
        if (firstKey) cache.delete(firstKey);
    }
    cache.set(key, { outfits, timestamp: Date.now() });
}

export function generateCacheKey(productId: string, filters: Record<string, unknown>): string {
    return `${productId}:${JSON.stringify(filters)}`;
}

export function clearCache(): void {
    cache.clear();
}

export function getCacheStats(): { size: number; maxSize: number } {
    return { size: cache.size, maxSize: MAX_SIZE };
}
