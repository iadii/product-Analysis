import { IProduct } from '../models/index.js';

export interface OutfitProducts {
    top: IProduct;
    bottom: IProduct;
    footwear: IProduct;
    accessories: IProduct[];
}

export interface ScoreBreakdown {
    colorHarmony: number;
    styleMatch: number;
    occasionFit: number;
    seasonRelevance: number;
    budgetAlignment: number;
}

export interface Outfit {
    products: OutfitProducts;
    matchScore: number;
    breakdown: ScoreBreakdown;
    totalPrice: number;
    reasoning: string;
    aiPowered: boolean;
}

export interface RecommendationFilters {
    occasion?: string;
    season?: string;
    maxBudget?: number;
    limit?: number;
    style?: string;
}
