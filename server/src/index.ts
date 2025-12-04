import app from './app';
import { getDb } from './db';

const PORT = process.env.PORT || 5002;

app.listen(PORT, async () => {
    // Ensure DB is initialized
    await getDb();
    console.log(`Varsity Server running on http://localhost:${PORT}`);
});
