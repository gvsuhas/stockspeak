const express = require('express');
const router = express.Router();
const store = require('../config/store');
const { parseVoiceCommand } = require('../utils/nlpParser');

const AUDIO_RESPONSES = {
  en: {
    stockIn: (qty, unit, name, newStock) => `Added ${qty} ${unit} of ${name}. New stock level is ${newStock} ${unit}.`,
    stockOut: (qty, unit, name, newStock) => `Removed ${qty} ${unit} of ${name}. Remaining stock is ${newStock} ${unit}.`,
    lowStockAlert: (name, stock) => ` Warning: ${name} is low in stock! Only ${stock} left.`,
    queryProduct: (name, stock, unit) => `You currently have ${stock} ${unit} of ${name} in stock.`,
    notFound: (name) => `Product ${name} was not found in your inventory.`,
    queryLowStock: (items) => items.length > 0 ? `The following items are low in stock: ${items.join(', ')}.` : `All your products have sufficient stock!`,
    summary: (count, value, lowCount) => `You have ${count} total items worth ₹${value}. ${lowCount} items are running low on stock.`,
    unknown: `Sorry, I couldn't understand that inventory command.`
  },
  te: {
    stockIn: (qty, unit, name, newStock) => `${name} లో ${qty} ${unit} స్టాక్ యాడ్ చేయబడింది. ప్రస్తుతం ${newStock} ${unit} ఉంది.`,
    stockOut: (qty, unit, name, newStock) => `${name} నుండి ${qty} ${unit} అమ్మబడింది. మిగిలిన స్టాక్ ${newStock} ${unit}.`,
    lowStockAlert: (name, stock) => ` హెచ్చరిక: ${name} స్టాక్ తక్కువగా ఉంది! కేవలం ${stock} మాత్రమే మిగిలింది.`,
    queryProduct: (name, stock, unit) => `మీ వద్ద ${name} - ${stock} ${unit} స్టాక్ ఉనికిలో ఉంది.`,
    notFound: (name) => `${name} మీ సరుకుల జాబితాలో లభించలేదు.`,
    queryLowStock: (items) => items.length > 0 ? `ఈ ఐటమ్‌లు తక్కువ స్టాక్‌లో ఉన్నాయి: ${items.join(', ')}.` : `అన్ని ప్రొడక్ట్‌ల స్టాక్ తగినంతగా ఉంది!`,
    summary: (count, value, lowCount) => `మీ వద్ద మొత్తం ${count} ఐటమ్‌లు (మొత్తం విలువ ₹${value}) ఉన్నాయి.`
  },
  hi: {
    stockIn: (qty, unit, name, newStock) => `${name} में ${qty} ${unit} स्टॉक जोड़ा गया। कुल स्टॉक ${newStock} ${unit} है।`,
    stockOut: (qty, unit, name, newStock) => `${name} से ${qty} ${unit} निकाला गया। अब ${newStock} ${unit} बचा है।`,
    lowStockAlert: (name, stock) => ` चेतावनी: ${name} का स्टॉक कम है! सिर्फ ${stock} बचा है।`,
    queryProduct: (name, stock, unit) => `आपके पास ${name} का ${stock} ${unit} स्टॉक में है।`,
    notFound: (name) => `${name} इन्वेंटरी में नहीं मिला।`
  }
};

router.post('/process', async (req, res) => {
  try {
    const { spokenText, language = 'en' } = req.body;

    if (!spokenText || typeof spokenText !== 'string') {
      return res.status(400).json({ error: 'spokenText string is required' });
    }

    const existingProducts = await store.getProducts();
    const parsed = parseVoiceCommand(spokenText, existingProducts);
    
    // Choose appropriate language response dictionary
    const langKey = AUDIO_RESPONSES[language] ? language : (AUDIO_RESPONSES[language?.slice(0, 2)] ? language.slice(0, 2) : 'en');
    const langTemplates = AUDIO_RESPONSES[langKey] || AUDIO_RESPONSES.en;

    let responseMessage = '';
    let updatedProduct = null;
    let transactionRecord = null;

    if (parsed.intent === 'STOCK_IN' || parsed.intent === 'STOCK_OUT') {
      let product = parsed.matchedProduct;

      if (!product) {
        if (parsed.intent === 'STOCK_IN') {
          product = await store.createProduct({
            name: parsed.extractedProductName,
            category: 'Voice Added',
            stockQuantity: 0,
            unit: parsed.unit,
            minThreshold: 5,
            pricePerUnit: parsed.price || 0,
            aliases: [parsed.extractedProductName.toLowerCase()],
            lastUpdatedByVoice: true
          });
        } else {
          responseMessage = langTemplates.notFound(parsed.extractedProductName);
          return res.json({
            success: false,
            parsed,
            message: responseMessage,
            audioText: responseMessage
          });
        }
      }

      const delta = parsed.intent === 'STOCK_IN' ? parsed.quantity : -parsed.quantity;
      const prevStock = product.stockQuantity;
      updatedProduct = await store.updateProductStock(product._id, delta);
      const newStock = updatedProduct ? updatedProduct.stockQuantity : (prevStock + delta);

      transactionRecord = await store.saveTransaction({
        product: product._id,
        productName: product.name,
        type: parsed.intent === 'STOCK_IN' ? 'IN' : 'OUT',
        quantity: parsed.quantity,
        unit: parsed.unit,
        unitPrice: parsed.price || product.pricePerUnit,
        totalAmount: (parsed.price || product.pricePerUnit) * parsed.quantity,
        previousStock: prevStock,
        newStock: newStock,
        spokenText: spokenText,
        language: language,
        isVoice: true
      });

      if (parsed.intent === 'STOCK_IN') {
        responseMessage = langTemplates.stockIn(parsed.quantity, parsed.unit, product.name, newStock);
      } else {
        responseMessage = langTemplates.stockOut(parsed.quantity, parsed.unit, product.name, newStock);
        if (newStock <= product.minThreshold && langTemplates.lowStockAlert) {
          responseMessage += langTemplates.lowStockAlert(product.name, newStock);
        }
      }
    } else if (parsed.intent === 'QUERY_PRODUCT') {
      const product = parsed.matchedProduct;
      if (product) {
        responseMessage = langTemplates.queryProduct(product.name, product.stockQuantity, product.unit);
      } else {
        responseMessage = langTemplates.notFound(parsed.extractedProductName);
      }
    } else if (parsed.intent === 'QUERY_LOW_STOCK') {
      const lowItems = existingProducts.filter(p => p.stockQuantity <= p.minThreshold);
      const itemNames = lowItems.map(p => `${p.name} (${p.stockQuantity} ${p.unit})`);
      responseMessage = langTemplates.queryLowStock ? langTemplates.queryLowStock(itemNames) : AUDIO_RESPONSES.en.queryLowStock(itemNames);
    } else if (parsed.intent === 'QUERY_SUMMARY') {
      const totalCount = existingProducts.length;
      const totalVal = existingProducts.reduce((sum, p) => sum + (p.stockQuantity * p.pricePerUnit), 0);
      const lowCount = existingProducts.filter(p => p.stockQuantity <= p.minThreshold).length;
      responseMessage = langTemplates.summary ? langTemplates.summary(totalCount, totalVal, lowCount) : AUDIO_RESPONSES.en.summary(totalCount, totalVal, lowCount);
    } else {
      responseMessage = langTemplates.unknown || AUDIO_RESPONSES.en.unknown;
    }

    res.json({
      success: true,
      parsed,
      message: responseMessage,
      audioText: responseMessage,
      updatedProduct,
      transactionRecord
    });

  } catch (err) {
    console.error('Voice Route Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
