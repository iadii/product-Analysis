import { IProduct, PriceTier } from '../models/index.js';
import { ScoreBreakdown } from '../types/index.js';

const NEUTRAL_COLORS = ['black', 'white', 'gray', 'grey', 'beige', 'cream', 'navy', 'khaki', 'tan', 'olive', 'brown', 'silver', 'gold'];

const WEIGHTS = {
    colorHarmony: 0.25,
    styleMatch: 0.30,
    occasionFit: 0.20,
    seasonRelevance: 0.15,
    budgetAlignment: 0.10,
};

function calculateColorScore(color1: string, color2: string): number {
    if (color1 === color2) return 0.95;
    const c1Neutral = NEUTRAL_COLORS.includes(color1.toLowerCase());
    const c2Neutral = NEUTRAL_COLORS.includes(color2.toLowerCase());
    if (c1Neutral && c2Neutral) return 0.90;
    if (c1Neutral || c2Neutral) return 0.88;
    return 0.70;
}

function calculateStyleScore(styles1: string[], styles2: string[]): number {
    const common = styles1.filter(s => styles2.includes(s)).length;
    if (common > 0) return Math.min(0.85 + common * 0.05, 1.0);
    return 0.60;
}

function calculateOccasionScore(occasions1: string[], occasions2: string[]): number {
    const common = occasions1.filter(o => occasions2.includes(o)).length;
    return common > 0 ? 0.90 : 0.65;
}

function calculateSeasonScore(seasons1: string[], seasons2: string[]): number {
    if (seasons1.includes('all') || seasons2.includes('all')) return 0.95;
    const common = seasons1.filter(s => seasons2.includes(s)).length;
    return common > 0 ? 0.90 : 0.50;
}

function calculateBudgetScore(totalPrice: number, maxBudget?: number): number {
    if (!maxBudget) return 0.85;
    if (totalPrice <= maxBudget) return 1.0;
    if (totalPrice <= maxBudget * 1.3) return 0.7;
    return 0.4;
}

export function calculateOutfitScore(
    products: IProduct[],
    maxBudget?: number
): { score: number; breakdown: ScoreBreakdown } {
    const colors = products.map(p => p.primaryColor);
    let colorHarmony = 0;
    let pairs = 0;

    for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
            colorHarmony += calculateColorScore(colors[i], colors[j]);
            pairs++;
        }
    }
    colorHarmony = pairs > 0 ? colorHarmony / pairs : 0.8;

    const allStyles = products.flatMap(p => p.style);
    const styleMatch = calculateStyleScore(allStyles, allStyles) * 0.9;

    const allOccasions = products.flatMap(p => p.occasion);
    const occasionFit = calculateOccasionScore(allOccasions, allOccasions) * 0.95;

    const allSeasons = products.flatMap(p => p.season);
    const seasonRelevance = calculateSeasonScore(allSeasons, allSeasons);

    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
    const budgetAlignment = calculateBudgetScore(totalPrice, maxBudget);

    const breakdown: ScoreBreakdown = {
        colorHarmony: Math.round(colorHarmony * 100) / 100,
        styleMatch: Math.round(styleMatch * 100) / 100,
        occasionFit: Math.round(occasionFit * 100) / 100,
        seasonRelevance: Math.round(seasonRelevance * 100) / 100,
        budgetAlignment: Math.round(budgetAlignment * 100) / 100,
    };

    const score =
        breakdown.colorHarmony * WEIGHTS.colorHarmony +
        breakdown.styleMatch * WEIGHTS.styleMatch +
        breakdown.occasionFit * WEIGHTS.occasionFit +
        breakdown.seasonRelevance * WEIGHTS.seasonRelevance +
        breakdown.budgetAlignment * WEIGHTS.budgetAlignment;

    return { score: Math.round(score * 100) / 100, breakdown };
}

export function generateReasoning(products: IProduct[], breakdown: ScoreBreakdown): string {
    const colors = [...new Set(products.map(p => p.primaryColor))];
    const styles = [...new Set(products.flatMap(p => p.style))];

    if (breakdown.colorHarmony >= 0.9 && colors.length <= 2) {
        return `A cohesive ${styles[0] || 'casual'} look with harmonious ${colors.join(' and ')} tones.`;
    }
    if (breakdown.styleMatch >= 0.8 && styles.length > 0) {
        return `Consistent ${styles[0]} aesthetic creating a well-coordinated outfit.`;
    }
    return `Versatile combination featuring ${colors[0]} and ${colors[1] || colors[0]} tones.`;
}
