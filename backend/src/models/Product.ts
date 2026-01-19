import mongoose, { Schema, Document } from 'mongoose';

export type Category = 'top' | 'bottom' | 'footwear' | 'accessory';
export type Gender = 'male' | 'female' | 'unisex';
export type PriceTier = 'budget' | 'mid' | 'premium' | 'luxury';
export type ColorFamily = 'neutral' | 'warm' | 'cool' | 'earth';

export interface IProduct extends Document {
    skuId: string;
    name: string;
    brand: string;
    sector: string;
    category: Category;
    marketCategory: string;
    subcategory: string;
    productType: string;
    price: number;
    currency: string;
    gender: Gender;
    description: string;
    tags: string[];
    imageUrl: string;

    // Recommendation fields
    primaryColor: string;
    secondaryColors: string[];
    colorFamily: ColorFamily;
    pattern: string;
    style: string[];
    occasion: string[];
    season: string[];
    priceTier: PriceTier;
    inStock: boolean;
}

const ProductSchema = new Schema<IProduct>(
    {
        skuId: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true, index: true },
        brand: { type: String, required: true, index: true },
        sector: { type: String, index: true },
        category: {
            type: String,
            enum: ['top', 'bottom', 'footwear', 'accessory'],
            required: true,
            index: true,
        },
        marketCategory: { type: String },
        subcategory: { type: String },
        productType: { type: String },
        price: { type: Number, required: true },
        currency: { type: String, default: 'INR' },
        gender: {
            type: String,
            enum: ['male', 'female', 'unisex'],
            default: 'unisex',
            index: true,
        },
        description: { type: String },
        tags: [{ type: String }],
        imageUrl: { type: String, default: '' },

        // Computed fields
        primaryColor: { type: String, default: 'neutral' },
        secondaryColors: [{ type: String }],
        colorFamily: {
            type: String,
            enum: ['neutral', 'warm', 'cool', 'earth'],
            default: 'neutral',
            index: true,
        },
        pattern: { type: String, default: 'solid' },
        style: [{ type: String, index: true }],
        occasion: [{ type: String, index: true }],
        season: [{ type: String }],
        priceTier: {
            type: String,
            enum: ['budget', 'mid', 'premium', 'luxury'],
            default: 'mid',
        },
        inStock: { type: Boolean, default: true },
    },
    { timestamps: true }
);

ProductSchema.index({ category: 1, gender: 1, inStock: 1 });


export const Product = mongoose.model<IProduct>('Product', ProductSchema);
