const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', ProductSchema);

async function clean() {
  await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
  const res = await Product.deleteMany({
    $or: [
      { name: 'Test Product' },
      { category: 'Voice Added' },
      { name: /బియ్యం/i }
    ]
  });
  console.log('Deleted orphaned Atlas records:', res.deletedCount);
  process.exit(0);
}
clean();
