import { GoogleGenerativeAI } from '@google/generative-ai';
import { Outfit } from '../types/index.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export function isAIEnabled(): boolean {
    return !!process.env.GEMINI_API_KEY;
}

export async function enhanceWithAI(outfit: Outfit): Promise<Outfit> {
    if (!isAIEnabled()) return outfit;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Briefly describe why this outfit works well together: 
      Top: ${outfit.products.top.name} (${outfit.products.top.primaryColor})
      Bottom: ${outfit.products.bottom.name} (${outfit.products.bottom.primaryColor})
      Footwear: ${outfit.products.footwear.name}
      Respond in one concise sentence.`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 100 },
        });

        return {
            ...outfit,
            reasoning: result.response.text().trim(),
            aiPowered: true,
        };
    } catch {
        return outfit;
    }
}

export async function enhanceTopOutfits(outfits: Outfit[], count: number = 3): Promise<Outfit[]> {
    if (!isAIEnabled() || outfits.length === 0) return outfits;

    const enhanced = await Promise.all(
        outfits.slice(0, count).map(enhanceWithAI)
    );

    return [...enhanced, ...outfits.slice(count)];
}
