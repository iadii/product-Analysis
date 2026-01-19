export interface Product {
    _id: string;
    skuId: string; // New
    name: string;
    brand: string;
    sector: string; // New
    category: 'top' | 'bottom' | 'footwear' | 'accessory';
    marketCategory: string; // New
    subcategory: string;
    productType: string; // New
    price: number;
    currency: string;
    primaryColor: string;
    secondaryColors: string[];
    colorFamily: 'neutral' | 'warm' | 'cool' | 'earth';
    pattern: string;
    style: string[];
    occasion: string[];
    season: string[];
    gender: 'male' | 'female' | 'unisex';
    description: string; // New
    tags: string[]; // New
    priceTier: 'budget' | 'mid' | 'premium' | 'luxury';
    imageUrl: string;
    inStock: boolean;
}

export interface ScoreBreakdown {
    colorHarmony: number;
    styleMatch: number;
    occasionFit: number;
    seasonRelevance: number;
    budgetAlignment: number;
}

export interface OutfitProducts {
    top: Product;
    bottom: Product;
    footwear: Product;
    accessories: Product[];
}

export interface GeneratedOutfit {
    products: OutfitProducts;
    matchScore: number;
    breakdown: ScoreBreakdown;
    totalPrice: number;
    reasoning: string;
    aiAnalysis?: {
        styleDescription: string;
        colorAnalysis: string;
        occasionSuggestions: string[];
        stylingTips: string[];
        confidenceScore: number;
    };
    aiPowered: boolean;
}

export interface RecommendationResponse {
    success: boolean;
    baseProduct: Product;
    recommendations: GeneratedOutfit[];
    generatedAt: string;
    responseTimeMs: number;
    cached: boolean;
}

export interface RecommendationFilters {
    occasion?: string;
    season?: string;
    maxBudget?: number;
    limit?: number;
    style?: string;
}
