import { getDb } from './index';
import { seed } from './seed';

async function resetAndSeed() {
    console.log('--- Initializing Fresh Database ---');
    const db = await getDb();
    console.log('--- Tables Established ---');
    await seed();
    console.log('--- Database Reset Complete ---');
}

resetAndSeed();
