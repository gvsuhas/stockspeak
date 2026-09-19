/**
 * StockSpeak Multilingual NLP Engine
 * Translates regional spoken product names (Telugu, Hindi, Kannada, Tamil, etc.)
 * into standard English inventory products.
 */

// Global Dictionary mapping Regional Words & Variants -> Standard English Product Title
const REGIONAL_TO_ENGLISH_PRODUCT_MAP = {
  // RICE
  'rice': 'Rice', 'chawal': 'Rice', 'basmati': 'Rice',
  'biyyam': 'Rice', 'biyyamu': 'Rice', 'biyyani': 'Rice', 'biyyanni': 'Rice', 'annam': 'Rice',
  'బియ్యం': 'Rice', 'బియ్యము': 'Rice', 'బియ్యాన్ని': 'Rice', 'బియ్యాలు': 'Rice', 'అన్నం': 'Rice',
  'चावल': 'Rice', 'अन्न': 'Rice', 'akki': 'Rice', 'ಅಕ್ಕಿ': 'Rice', 'arisi': 'Rice', 'அரிசி': 'Rice', 'चाल': 'Rice',

  // WHEAT FLOUR
  'aata': 'Wheat Flour', 'atta': 'Wheat Flour', 'wheat': 'Wheat Flour', 'gehun': 'Wheat Flour',
  'godhuma': 'Wheat Flour', 'godhumapindi': 'Wheat Flour', 'godhuma pindi': 'Wheat Flour',
  'గోధుమ': 'Wheat Flour', 'గోధుమపిండి': 'Wheat Flour', 'గోధుమ పిండి': 'Wheat Flour', 'ఆటా': 'Wheat Flour',
  'आटा': 'Wheat Flour', 'गेहूं': 'Wheat Flour', 'ಹಿಟ್ಟು': 'Wheat Flour', 'ஆட்டா': 'Wheat Flour', 'आटा': 'Wheat Flour',

  // MILK
  'milk': 'Milk', 'doodh': 'Milk', 'dudh': 'Milk',
  'paalu': 'Milk', 'paala': 'Milk', 'palani': 'Milk', 'pala': 'Milk',
  'పాలు': 'Milk', 'పాల': 'Milk', 'పాలని': 'Milk', 'పాలుని': 'Milk', 'పాకెట్ పాలు': 'Milk',
  'दूध': 'Milk', 'haalu': 'Milk', 'ಹಾಲು': 'Milk', 'paal': 'Milk', 'பால்': 'Milk', 'দুধ': 'Milk',

  // SUGAR
  'sugar': 'Sugar', 'cheeni': 'Sugar', 'chini': 'Sugar', 'sakkar': 'Sugar',
  'chakkera': 'Sugar', 'panchadara': 'Sugar', 'sakera': 'Sugar',
  'చక్కెర': 'Sugar', 'పంచదార': 'Sugar', 'సక్కెర': 'Sugar', 'చక్కెరని': 'Sugar', 'పంచదారని': 'Sugar',
  'चीनी': 'Sugar', 'sakkare': 'Sugar', 'ಸಕ್ಕರೆ': 'Sugar', 'சர்க்கரை': 'Sugar', 'ખાંડ': 'Sugar', 'চিনি': 'Sugar',

  // SUNFLOWER OIL / OIL
  'oil': 'Sunflower Oil', 'tel': 'Sunflower Oil', 'sunflower': 'Sunflower Oil', 'cooking oil': 'Sunflower Oil',
  'noone': 'Sunflower Oil', 'nonney': 'Sunflower Oil', 'nooneni': 'Sunflower Oil',
  'నూనె': 'Sunflower Oil', 'నూనెలు': 'Sunflower Oil', 'నూనెని': 'Sunflower Oil',
  'तेल': 'Sunflower Oil', 'enne': 'Sunflower Oil', 'ಎಣ್ಣೆ': 'Sunflower Oil', 'எண்ணெய்': 'Sunflower Oil', 'તેલ': 'Sunflower Oil',

  // TOOR DAL / DAL
  'dal': 'Toor Dal', 'toor': 'Toor Dal', 'tuvar': 'Toor Dal', 'arhar': 'Toor Dal',
  'pappu': 'Toor Dal', 'kandi': 'Toor Dal', 'kandipappu': 'Toor Dal',
  'పప్పు': 'Toor Dal', 'కందిపప్పు': 'Toor Dal', 'కంది పప్పు': 'Toor Dal', 'పప్పుని': 'Toor Dal',
  'दाल': 'Toor Dal', 'togari': 'Toor Dal', 'ಬೇಳೆ': 'Toor Dal', 'பருப்பு': 'Toor Dal', 'દાળ': 'Toor Dal', 'ডাল': 'Toor Dal',

  // TEA POWDER / CHAI
  'tea': 'Tea Powder', 'chai': 'Tea Powder', 'teapowder': 'Tea Powder',
  'teakupodi': 'Tea Powder', 'teapodi': 'Tea Powder', 'tea podi': 'Tea Powder',
  'టీ': 'Tea Powder', 'టీపొడి': 'Tea Powder', 'టీ పొడి': 'Tea Powder',
  'चाय': 'Tea Powder', 'chaha': 'Tea Powder', 'ಚಹಾ': 'Tea Powder', 'தேயிலை': 'Tea Powder', 'চা': 'Tea Powder',

  // BATH SOAP / SOAP
  'soap': 'Bath Soap', 'sabun': 'Bath Soap',
  'sabbu': 'Bath Soap', 'sabbulu': 'Bath Soap', 'sabbuni': 'Bath Soap',
  'సబ్బు': 'Bath Soap', 'సబ్బులు': 'Bath Soap', 'సబ్బుని': 'Bath Soap',
  'साबुन': 'Bath Soap', 'ಸಾಬೂನು': 'Bath Soap', 'சோப்பு': 'Bath Soap', 'સાબુ': 'Bath Soap', 'সাবান': 'Bath Soap'
};

// Spoken numbers dictionary
const NUMBER_MAP = {
  'zero': 0, 'shunya': 0, 'one': 1, 'ek': 1, 'two': 2, 'do': 2, 'rendu': 2,
  'three': 3, 'teen': 3, 'moodu': 3, 'four': 4, 'char': 4, 'chaar': 4, 'nalugu': 4,
  'five': 5, 'paanch': 5, 'panch': 5, 'aidu': 5, 'six': 6, 'che': 6, 'aaru': 6,
  'seven': 7, 'saat': 7, 'aedu': 7, 'eight': 8, 'aath': 8, 'enimidi': 8,
  'nine': 9, 'nau': 9, 'tommidi': 9, 'ten': 10, 'das': 10, 'dus': 10, 'padi': 10,
  'fifteen': 15, 'pandra': 15, 'padihenu': 15, 'twenty': 20, 'bees': 20, 'iravai': 20,
  'fifty': 50, 'pachas': 50, 'yabhai': 50, 'hundred': 100, 'sau': 100, 'vanda': 100,

  // Telugu script numbers
  'ఒకటి': 1, 'రెండు': 2, 'రెండులు': 2, 'మూడు': 3, 'నాలుగు': 4, 'ఐదు': 5,
  'ఆరు': 6, 'ఏడు': 7, 'ఎనిమిది': 8, 'తొమ్మిది': 9, 'పది': 10, 'పదిహేను': 15,
  'ఇరవై': 20, 'ముప్పై': 30, 'యాభై': 50, 'వంద': 100,

  // Hindi script numbers
  'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5,
  'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10, 'पंद्रह': 15,

  // Kannada & Tamil script numbers
  'ಒಂದು': 1, 'ಎರಡು': 2, 'ಮೂರು': 3, 'ನಾಲ್ಕು': 4, 'ಐದು': 5,
  'ஒன்று': 1, 'இரண்டு': 2, 'மூன்று': 3, 'நான்கு': 4, 'ஐந்து': 5
};

// Trade units map
const UNIT_MAP = {
  'kg': 'kg', 'kilo': 'kg', 'kilogram': 'kg', 'kilograms': 'kg', 'keji': 'kg',
  'g': 'grams', 'gram': 'grams', 'grams': 'grams',
  'bag': 'bags', 'bags': 'bags', 'bori': 'bags', 'katta': 'bags', 'basta': 'bags',
  'carton': 'cartons', 'cartons': 'cartons', 'peti': 'cartons',
  'box': 'boxes', 'boxes': 'boxes', 'dabba': 'boxes', 'pette': 'boxes',
  'dozen': 'dozens', 'dozens': 'dozens', 'darjan': 'dozens',
  'litre': 'litres', 'litres': 'litres', 'liter': 'litres', 'liters': 'litres', 'l': 'litres',
  'piece': 'pieces', 'pieces': 'pieces', 'pcs': 'pieces', 'nag': 'pieces',
  'packet': 'packets', 'packets': 'packets', 'pkt': 'packets', 'pauch': 'packets', 'pouch': 'packets',

  // Regional script units
  'కేజీలు': 'kg', 'కేజీ': 'kg', 'కిలో': 'kg', 'కిలోలు': 'kg', 'కేజీల': 'kg',
  'గ్రాములు': 'grams', 'గ్రాము': 'grams',
  'బస్తాలు': 'bags', 'బస్తా': 'bags', 'మూటలు': 'bags', 'మూట': 'bags',
  'కార్టన్లు': 'cartons', 'కార్టన్': 'cartons',
  'పెట్టెలు': 'boxes', 'పెట్టె': 'boxes', 'డబ్బాలు': 'boxes',
  'డజన్లు': 'dozens', 'డజన్': 'dozens',
  'లీటర్లు': 'litres', 'లీటర్': 'litres',
  'పీసులు': 'pieces', 'పీస్': 'pieces',
  'ప్యాకెట్లు': 'packets', 'ప్యాకెట్': 'packets', 'పాకెట్లు': 'packets', 'పాకెట్': 'packets',

  'केजी': 'kg', 'किलो': 'kg', 'ग्राम': 'grams', 'बोरी': 'bags', 'पैकेट': 'packets', 'लीटर': 'litres'
};

// Action Intent Keywords
const IN_KEYWORDS = [
  'aaya', 'aaye', 'aaya hai', 'add', 'added', 'buy', 'bought', 'receive', 'received', 'plus', 'lana', 'incoming', 'stock in', 'in', 'kharida', 'mangwaya',
  'యాడ్', 'యాడ్ చెయ్', 'చేర్చు', 'వచ్చింది', 'వచ్చాయి', 'వచ్చినవి', 'కొన్నాను', 'కొన్నాం', 'చేర్చబడింది', 'చేయి', 'చెయ్యి', 'ఆడ్',
  'आया', 'जोड़ें', 'सैकड़ों', 'ಸೇರಿಸಿ', 'ಬಂತು', 'சேர்', 'வந்தது'
];

const OUT_KEYWORDS = [
  'gaya', 'gaye', 'gaya hai', 'sold', 'sale', 'becha', 'bech diya', 'remove', 'removed', 'issue', 'issued', 'minus', 'out', 'outgoing', 'stock out', 'diya',
  'పోయింది', 'పోయాయి', 'అమ్మాను', 'అమ్మాం', 'అమ్మకం', 'సేల్', 'తీసివేయి', 'పంపించాం', 'అమ్మాము',
  'गया', 'बेचा', 'ಮಾರಾಟ', 'ಹೋಯಿತು', 'விற்றது', 'போனது'
];

const QUERY_LOW_KEYWORDS = [
  'low', 'kam', 'khatam', 'finish', 'reorder', 'shortage', 'alert', 'alerts', 'empty', 'shunya',
  'తక్కువ', 'తక్కువగా', 'అయిపోయింది', 'ఖాలీ', 'कम', 'ಖಾಲಿ', 'குறைவாக'
];

const QUERY_PRODUCT_KEYWORDS = [
  'kitna', 'how much', 'check', 'stock of', 'available', 'bacha', 'bachha', 'baki', 'quantity', 'kitne',
  'ఎంత', 'ఎంత ఉంది', 'ఎన్ని', 'మిగిలింది', 'ఉంది', 'ఎంత ఉంది?', '<ctrl42>', '<ctrl42><ctrl42>', 'ಎಷ್ಟು', 'எவ்வளவு', 'कितना'
];

const QUERY_SUMMARY_KEYWORDS = [
  'total', 'summary', 'overall', 'all stock', 'sab stock', 'kitna maal', 'report',
  'మొత్తం', 'అన్నీ', 'ఒಟ್ಟು', 'மொத்தம்'
];

/**
 * Robust Multilingual Voice Command Parser
 */
function parseVoiceCommand(text, existingProducts = []) {
  if (!text || typeof text !== 'string') {
    return { error: 'Empty or invalid speech input' };
  }

  const cleanText = text.toLowerCase().trim();

  // 1. Determine Intent
  let intent = 'UNKNOWN';
  if (QUERY_SUMMARY_KEYWORDS.some(k => cleanText.includes(k))) {
    intent = 'QUERY_SUMMARY';
  } else if (QUERY_LOW_KEYWORDS.some(k => cleanText.includes(k))) {
    intent = 'QUERY_LOW_STOCK';
  } else if (QUERY_PRODUCT_KEYWORDS.some(k => cleanText.includes(k)) && !IN_KEYWORDS.some(k => cleanText.includes(k)) && !OUT_KEYWORDS.some(k => cleanText.includes(k))) {
    intent = 'QUERY_PRODUCT';
  } else if (IN_KEYWORDS.some(k => cleanText.includes(k))) {
    intent = 'STOCK_IN';
  } else if (OUT_KEYWORDS.some(k => cleanText.includes(k))) {
    intent = 'STOCK_OUT';
  } else {
    if (cleanText.includes('sell') || cleanText.includes('given') || cleanText.includes('అమ్మకం')) {
      intent = 'STOCK_OUT';
    } else {
      intent = 'STOCK_IN';
    }
  }

  // 2. Extract Quantity
  let quantity = 1;
  const matchNum = cleanText.match(/(\d+(\.\d+)?)/);
  if (matchNum) {
    quantity = parseFloat(matchNum[1]);
  } else {
    for (const [word, numVal] of Object.entries(NUMBER_MAP)) {
      if (cleanText.includes(word)) {
        quantity = numVal;
        break;
      }
    }
  }

  // 3. Extract Unit
  let unit = 'pieces';
  for (const [key, standardUnit] of Object.entries(UNIT_MAP)) {
    if (cleanText.includes(key)) {
      unit = standardUnit;
      break;
    }
  }

  // 4. Extract Price
  let price = 0;
  const matchPrice = cleanText.match(/(?:rs\.?|rupees|₹|rate|price|at|mein|me|రూపాయలు|రూ)\s*(\d+(\.\d+)?)|(\d+(\.\d+)?)\s*(?:rs\.?|rupees|₹|రూపాయలు|రూ)/i);
  if (matchPrice) {
    price = parseFloat(matchPrice[1] || matchPrice[3] || 0);
  }

  // 5. Match Product Name (Maps Regional terms -> English Inventory Items)
  let matchedProduct = null;
  let targetEnglishName = '';

  // Step 5A: Check Regional Map first (e.g. 'బియ్యం', 'biyyam', 'chawal' -> 'Rice')
  for (const [regTerm, englishCanonicalName] of Object.entries(REGIONAL_TO_ENGLISH_PRODUCT_MAP)) {
    if (cleanText.includes(regTerm.toLowerCase())) {
      targetEnglishName = englishCanonicalName;
      break;
    }
  }

  // Step 5B: If mapped to an English canonical name, find product in DB by exact/fuzzy English name
  if (targetEnglishName && existingProducts.length > 0) {
    matchedProduct = existingProducts.find(p => 
      p.name.toLowerCase().includes(targetEnglishName.toLowerCase()) ||
      targetEnglishName.toLowerCase().includes(p.name.toLowerCase())
    );
  }

  // Step 5C: Fallback match against DB product names & aliases
  if (!matchedProduct && existingProducts.length > 0) {
    for (const prod of existingProducts) {
      const prodName = prod.name.toLowerCase();
      const aliases = (prod.aliases || []).map(a => a.toLowerCase());

      if (cleanText.includes(prodName)) {
        matchedProduct = prod;
        break;
      }

      for (const alias of aliases) {
        if (cleanText.includes(alias)) {
          matchedProduct = prod;
          break;
        }
      }
      if (matchedProduct) break;
    }
  }

  // Determine extracted English product name for response (NEVER return raw regional text for product creation)
  let extractedProductName = 'Item';
  if (matchedProduct) {
    extractedProductName = matchedProduct.name;
  } else if (targetEnglishName) {
    extractedProductName = targetEnglishName;
  } else {
    // If no match found, sanitize to English title case
    extractedProductName = 'Custom Product';
  }

  return {
    spokenText: text,
    intent,
    quantity,
    unit,
    price,
    matchedProduct,
    extractedProductName
  };
}

module.exports = { parseVoiceCommand, REGIONAL_TO_ENGLISH_PRODUCT_MAP, UNIT_MAP, NUMBER_MAP };
