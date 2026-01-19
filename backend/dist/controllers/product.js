import { Product } from '../models/index.js';
export async function getAllProducts(req, res) {
    const category = req.query.category;
    const query = category ? { category } : {};
    const products = await Product.find(query).lean();
    res.json({ success: true, data: products, total: products.length });
}
export async function getProduct(req, res) {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
    }
    res.json({ success: true, data: product });
}
