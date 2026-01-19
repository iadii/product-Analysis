import 'dotenv/config';
import mongoose from 'mongoose';
import { Product } from '../models/index.js';
import { connectDatabase } from '../config/index.js';
import { seedProducts } from './seedData.js';

async function seed() {
    console.log('Starting database seed with static data...');

    try {
        await connectDatabase()
        try {
            await Product.collection.drop();
            console.log('Dropped existing products collection');
        } catch (error: any) {
            if (error.code === 26) {
                console.log('No existing collection to drop');
            } else {
                throw error;
            }
        }

        await Product.insertMany(seedProducts);
        console.log(`Inserted ${seedProducts.length} products`);

        const counts = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);
        console.log('Products by category:');
        counts.forEach((c) => console.log(`   ${c._id}: ${c.count}`));

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seed();
