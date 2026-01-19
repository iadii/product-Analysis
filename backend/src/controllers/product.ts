import { Request, Response } from 'express';
import { Product } from '../models/index.js';

export async function getAllProducts(req: Request, res: Response): Promise<void> {
    const category = req.query.category as string | undefined;
    const query = category ? { category } : {};
    const products = await Product.find(query).lean();
    res.json({ success: true, data: products, total: products.length });
}

export async function getProduct(req: Request, res: Response): Promise<void> {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
    }
    res.json({ success: true, data: product });
}
