const sampleProducts = [
  {
    name: 'Rice',
    category: 'Grains & Pulses',
    stockQuantity: 50,
    unit: 'kg',
    minThreshold: 15,
    pricePerUnit: 60,
    aliases: [
      'rice', 'chawal', 'basmati', 'biyyam', 'biyyamu', 'biyyani', 'biyyanni', 'annam',
      'బియ్యం', 'బియ్యము', 'బియ్యాన్ని', 'బియ్యాలు', 'అన్నం',
      'चावल', 'अन्न', 'akki', 'ಅಕ್ಕಿ', 'arisi', 'அரிசி', 'चाल'
    ]
  },
  {
    name: 'Wheat Flour',
    category: 'Grains & Pulses',
    stockQuantity: 30,
    unit: 'kg',
    minThreshold: 10,
    pricePerUnit: 45,
    aliases: [
      'wheat flour', 'aata', 'atta', 'wheat', 'gehun', 'godhuma', 'godhumapindi', 'godhuma pindi',
      'గోధుమ', 'గోధుమపిండి', 'గోధుమ పిండి', 'ఆటా',
      'आटा', 'गेहूं', 'ಹಿಟ್ಟು', 'ஆட்டா'
    ]
  },
  {
    name: 'Milk',
    category: 'Dairy',
    stockQuantity: 6,
    unit: 'packets',
    minThreshold: 12,
    pricePerUnit: 30,
    aliases: [
      'milk', 'doodh', 'dudh', 'packet milk', 'paalu', 'paala', 'palani', 'pala',
      'పాలు', 'పాల', 'పాలని', 'పాలుని',
      'दूध', 'haalu', 'ಹಾಲು', 'paal', 'பால்', 'দুধ'
    ]
  },
  {
    name: 'Sugar',
    category: 'Groceries',
    stockQuantity: 40,
    unit: 'kg',
    minThreshold: 10,
    pricePerUnit: 42,
    aliases: [
      'sugar', 'cheeni', 'chini', 'sakkar', 'chakkera', 'panchadara', 'sakera',
      'చక్కెర', 'పంచదార', 'సక్కెర', 'చక్కెరని', 'పంచదారని',
      'चीनी', 'sakkare', 'ಸಕ್ಕರೆ', 'சர்க்கரை', 'খাંડ', 'চিনি'
    ]
  },
  {
    name: 'Sunflower Oil',
    category: 'Oils & Ghee',
    stockQuantity: 3,
    unit: 'cartons',
    minThreshold: 5,
    pricePerUnit: 1400,
    aliases: [
      'sunflower oil', 'oil', 'tel', 'cooking oil', 'noone', 'nonney', 'nooneni',
      'నూనె', 'నూనెలు', 'నూనెని',
      'तेल', 'enne', 'ಎಣ್ಣೆ', 'எண்ணெய்', 'તેલ', 'তেল'
    ]
  },
  {
    name: 'Toor Dal',
    category: 'Grains & Pulses',
    stockQuantity: 25,
    unit: 'kg',
    minThreshold: 8,
    pricePerUnit: 150,
    aliases: [
      'toor dal', 'dal', 'tuvar dal', 'arhar dal', 'pappu', 'kandi', 'kandipappu',
      'పప్పు', 'కందిపప్పు', 'కంది పప్పు', 'పప్పుని',
      'दाल', 'togari bele', 'ತೊಗರಿ ಬೇಳೆ', 'tuvaram paruppu', 'துவரம் பருப்பு', 'દાળ', 'ডাল'
    ]
  },
  {
    name: 'Tea Powder',
    category: 'Beverages',
    stockQuantity: 15,
    unit: 'packets',
    minThreshold: 5,
    pricePerUnit: 120,
    aliases: [
      'tea powder', 'tea', 'chai', 'chai patti', 'teaku podi', 'tea podi',
      'టీ పొడి', 'టీపొడి', 'టీ',
      'चाय', 'chaha', 'ಚಹಾ', 'தேயிலை', 'চা'
    ]
  },
  {
    name: 'Bath Soap',
    category: 'Personal Care',
    stockQuantity: 2,
    unit: 'boxes',
    minThreshold: 5,
    pricePerUnit: 250,
    aliases: [
      'bath soap', 'soap', 'sabun', 'sabbu', 'sabbulu', 'sabbuni',
      'సబ్బు', 'సబ్బులు', 'సబ్బుని',
      'साबुन', 'sabunu', 'ಸಾಬೂನು', 'சோப்பு', 'સાબુ', 'সাবান'
    ]
  }
];

const seedProducts = async () => {
  try {
    const Product = require('../models/Product');
    
    // Reset and re-seed clean English named products
    await Product.deleteMany({});
    console.log('Seeding clean English product catalog...');
    await Product.insertMany(sampleProducts);
  } catch (error) {
    console.error('Error seeding data:', error.message);
  }
};

module.exports = { seedProducts, sampleProducts };
