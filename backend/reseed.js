const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedProducts } = require('./utils/seeder');

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
  await seedProducts();
  console.log('Database successfully reseeded with clean English product catalog!');
  process.exit(0);
}

run();
