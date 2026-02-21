/**
 * Seed all collections — runs seedCountries and seedFoods in sequence.
 *
 * Usage:  npm run seed
 */
import dotenv from 'dotenv';
dotenv.config();

// Firebase must be imported after dotenv so env vars are available
import { db } from '../config/firebase.js';
import { seedCountries } from './seedCountries.js';
import { seedFoods } from './seedFoods.js';

const seed = async () => {
  console.log('🌱 Starting full database seed…\n');

  try {
    const countries = await seedCountries();
    console.log(`  ✅ Seeded ${countries.length} countries`);

    const foods = await seedFoods(countries);
    console.log(`  ✅ Seeded ${foods.length} foods`);

    console.log('\n🎉 Seed complete!');
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    process.exit(1);
  }

  process.exit(0);
};

seed();
