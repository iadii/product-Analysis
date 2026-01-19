import { Request, Response, NextFunction } from 'express';
import { Product, IProduct } from '../models/index.js';
import { generateOutfits, getCached, setCache, generateCacheKey, enhanceTopOutfits, getCacheStats as getStats } from '../services/index.js';
import { RecommendationFilters } from '../types/index.js';

export async function getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();

    try {
        const { productId, filters = {} } = req.body;

        if (!productId) {
            res.status(400).json({ success: false, error: 'productId is required' });
            return;
        }

        const cacheKey = generateCacheKey(productId, filters);
        const cached = getCached(cacheKey);

        if (cached) {
            const baseProduct = await Product.findById(productId).lean();
            res.json({
                success: true,
                baseProduct,
                recommendations: cached,
                responseTimeMs: Date.now() - startTime,
                cached: true,
            });
            return;
        }

        const baseProduct = await Product.findById(productId).lean() as IProduct | null;
        if (!baseProduct) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }

        const recommendationFilters: RecommendationFilters = {
            occasion: filters.occasion,
            season: filters.season,
            maxBudget: filters.maxBudget,
            limit: filters.limit || 5,
            style: filters.style,
        };

        let outfits = await generateOutfits(baseProduct, recommendationFilters);
        outfits = await enhanceTopOutfits(outfits, 3);

        setCache(cacheKey, outfits);

        res.json({
            success: true,
            baseProduct,
            recommendations: outfits,
            generatedAt: new Date().toISOString(),
            responseTimeMs: Date.now() - startTime,
            cached: false,
        });
    } catch (error) {
        next(error);
    }
}

export async function getQuickRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();

    try {
        const { productId } = req.params;
        const limit = parseInt(req.query.limit as string) || 3;

        const cacheKey = generateCacheKey(productId, { limit });
        const cached = getCached(cacheKey);

        if (cached) {
            res.json({
                success: true,
                recommendations: cached,
                responseTimeMs: Date.now() - startTime,
                cached: true,
            });
            return;
        }

        const baseProduct = await Product.findById(productId).lean() as IProduct | null;
        if (!baseProduct) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }

        const outfits = await generateOutfits(baseProduct, { limit });
        setCache(cacheKey, outfits);

        res.json({
            success: true,
            recommendations: outfits,
            responseTimeMs: Date.now() - startTime,
            cached: false,
        });
    } catch (error) {
        next(error);
    }
}

export function getCacheStats(_req: Request, res: Response): void {
    res.json({
        success: true,
        cache: getStats(),
    });
}
