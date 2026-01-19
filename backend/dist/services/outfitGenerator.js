import { Product } from '../models/index.js';
import { calculateOutfitScore, generateReasoning } from './scoring.js';
// Accessory type groupings for variety
const ACCESSORY_TYPES = {
    wearable: ['bracelets', 'necklaces & pendants', 'rings', 'analog watches', 'digital watches', 'quartz watches', 'fitness trackers'],
    bags: ['handbags', 'backpacks', 'pouches', 'shoulder_bags'],
    eyewear: ['protective eyewear', 'eyewear'],
    fragrance: ['perfumes', 'colognes & eau de toilette'],
    tech: ['cases', 'earphones', 'airpods'],
    lifestyle: ['mugs', 'decorative trays & holders', 'cushions & throws', 'franchise collectibles'],
    footwearAcc: ['socks', 'shoe laces'],
};
async function getCandidates(category, filters, limit = 10) {
    const query = {
        category,
        inStock: true,
    };
    if (filters.occasion) {
        query.occasion = { $in: [filters.occasion] };
    }
    if (filters.season) {
        query.season = { $in: [filters.season, 'all'] };
    }
    if (filters.style) {
        query.style = { $in: [filters.style] };
    }
    return Product.find(query).limit(limit).lean();
}
async function getVariedAccessories(filters, count = 4) {
    const query = {
        category: 'accessory',
        inStock: true,
    };
    if (filters.occasion) {
        query.occasion = { $in: [filters.occasion] };
    }
    if (filters.style) {
        query.style = { $in: [filters.style] };
    }
    // Fetch more accessories to ensure variety
    const allAccessories = await Product.find(query).limit(50).lean();
    // Group by subcategory type
    const grouped = {};
    for (const acc of allAccessories) {
        const subcat = (acc.subcategory || '').toLowerCase();
        let type = 'other';
        for (const [typeName, subcats] of Object.entries(ACCESSORY_TYPES)) {
            if (subcats.some(s => subcat.includes(s.toLowerCase()))) {
                type = typeName;
                break;
            }
        }
        if (!grouped[type])
            grouped[type] = [];
        grouped[type].push(acc);
    }
    // Pick one from each type for variety
    const selected = [];
    const typeKeys = Object.keys(grouped);
    // Prioritize wearable, bags, fragrance, tech
    const priority = ['wearable', 'bags', 'fragrance', 'tech', 'lifestyle', 'eyewear', 'footwearAcc', 'other'];
    for (const type of priority) {
        if (grouped[type] && grouped[type].length > 0 && selected.length < count) {
            // Pick random item from this type
            const randomIndex = Math.floor(Math.random() * grouped[type].length);
            selected.push(grouped[type][randomIndex]);
        }
    }
    // If still need more, fill from remaining
    if (selected.length < count) {
        const remaining = allAccessories.filter(a => !selected.some(s => s.skuId === a.skuId));
        const shuffled = remaining.sort(() => 0.5 - Math.random());
        selected.push(...shuffled.slice(0, count - selected.length));
    }
    return selected;
}
export async function generateOutfits(baseProduct, filters) {
    const limit = filters.limit || 5;
    // Fetch candidates for each category
    const [tops, bottoms, footwears] = await Promise.all([
        baseProduct.category === 'top' ? Promise.resolve([baseProduct]) : getCandidates('top', filters, 8),
        baseProduct.category === 'bottom' ? Promise.resolve([baseProduct]) : getCandidates('bottom', filters, 8),
        baseProduct.category === 'footwear' ? Promise.resolve([baseProduct]) : getCandidates('footwear', filters, 6),
    ]);
    const outfits = [];
    const seen = new Set();
    for (const top of tops) {
        for (const bottom of bottoms) {
            for (const foot of footwears) {
                const key = `${top._id}-${bottom._id}-${foot._id}`;
                if (seen.has(key))
                    continue;
                seen.add(key);
                // Get 3-4 varied accessories for this outfit
                const accessoryCount = 3 + Math.floor(Math.random() * 2); // 3-4
                const accessories = baseProduct.category === 'accessory'
                    ? [baseProduct, ...(await getVariedAccessories(filters, accessoryCount - 1))]
                    : await getVariedAccessories(filters, accessoryCount);
                const allProducts = [top, bottom, foot, ...accessories];
                const { score, breakdown } = calculateOutfitScore(allProducts, filters.maxBudget);
                const totalPrice = allProducts.reduce((sum, p) => sum + p.price, 0);
                outfits.push({
                    products: { top, bottom, footwear: foot, accessories },
                    matchScore: score,
                    breakdown,
                    totalPrice,
                    reasoning: generateReasoning(allProducts, breakdown),
                    aiPowered: false,
                });
                if (outfits.length >= 50)
                    break;
            }
            if (outfits.length >= 50)
                break;
        }
        if (outfits.length >= 50)
            break;
    }
    outfits.sort((a, b) => b.matchScore - a.matchScore);
    return outfits.slice(0, limit);
}
