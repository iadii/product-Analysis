import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/index.js';
import { isAIEnabled } from './services/index.js';
const PORT = process.env.PORT || 5000;
async function start() {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`Outfit Recommendation API running on http://localhost:${PORT}`);
        console.log(`AI Enhancement: ${isAIEnabled() ? 'Enabled' : 'Disabled (set GEMINI_API_KEY)'}`);
    });
}
start().catch(console.error);
