import express from 'express';
import cors from 'cors';
import { productRoutes, recommendationRoutes } from './routes/index.js';
import { errorHandler, requestLogger } from './middleware/index.js';
import { isAIEnabled } from './services/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        aiEnabled: isAIEnabled(),
    });
});

app.use('/api/products', productRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.use(errorHandler);

export default app;
