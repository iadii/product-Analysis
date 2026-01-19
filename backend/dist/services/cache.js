const cache = new Map();
const TTL_MS = 60 * 60 * 1000;
const MAX_SIZE = 500;
export function getCached(key) {
    const entry = cache.get(key);
    if (!entry)
        return null;
    if (Date.now() - entry.timestamp > TTL_MS) {
        cache.delete(key);
        return null;
    }
    return entry.outfits;
}
export function setCache(key, outfits) {
    if (cache.size >= MAX_SIZE) {
        const firstKey = cache.keys().next().value;
        if (firstKey)
            cache.delete(firstKey);
    }
    cache.set(key, { outfits, timestamp: Date.now() });
}
export function generateCacheKey(productId, filters) {
    return `${productId}:${JSON.stringify(filters)}`;
}
export function clearCache() {
    cache.clear();
}
export function getCacheStats() {
    return { size: cache.size, maxSize: MAX_SIZE };
}
