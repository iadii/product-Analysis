import mongoose, { Schema } from 'mongoose';
const ProductSchema = new Schema({
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
}, { timestamps: true });
ProductSchema.index({ category: 1, gender: 1, inStock: 1 });
export const Product = mongoose.model('Product', ProductSchema);
