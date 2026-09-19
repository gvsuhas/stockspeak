import React from 'react';
import { AlertTriangle, ShoppingBag, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useInventory } from '../context/InventoryContext';

export default function StockAlerts() {
  const { t } = useLanguage();
  const { alerts, products } = useInventory();

  // Low stock products from current state
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.minThreshold);

  // Generate WhatsApp Order Message Text
  const generateWhatsAppOrderText = () => {
    if (lowStockProducts.length === 0) return '';
    let text = `🛒 *StockSpeak - Vendor Reorder List*\n\nHello, please deliver the following items to our shop:\n\n`;
    lowStockProducts.forEach((item, i) => {
      const suggestedQty = Math.max(10, item.minThreshold * 2 - item.stockQuantity);
      text += `${i + 1}. *${item.name}*: ${suggestedQty} ${item.unit} (Current Stock: ${item.stockQuantity} ${item.unit})\n`;
    });
    text += `\nThank you!`;
    return encodeURIComponent(text);
  };

  const whatsappUrl = `https://wa.me/?text=${generateWhatsAppOrderText()}`;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">{t('navAlerts')}</h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {lowStockProducts.length} Items Need Attention
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated alerts triggered when product stock drops below reorder threshold.
          </p>
        </div>

        {/* 1-Click WhatsApp Vendor Order Button */}
        {lowStockProducts.length > 0 && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all transform hover:scale-105"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            {t('whatsappOrder')}
          </a>
        )}
      </div>

      {lowStockProducts.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs bg-slate-950/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-2">
          <CheckCircle className="w-10 h-10 text-emerald-400 mb-1" />
          <p className="text-sm font-bold text-white">All Stock Levels Optimal!</p>
          <p className="text-slate-400">No products are currently running low or out of stock.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockProducts.map((prod) => {
            const suggestedQty = Math.max(10, prod.minThreshold * 2 - prod.stockQuantity);
            const isOut = prod.stockQuantity === 0;

            return (
              <div
                key={prod._id}
                className={`p-4 rounded-2xl border transition-all ${
                  isOut
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : 'bg-amber-950/20 border-amber-500/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isOut ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {isOut ? 'OUT OF STOCK' : 'LOW STOCK ALERT'}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{prod.name}</h3>
                    <p className="text-xs text-slate-400">Category: {prod.category}</p>
                  </div>
                  <ShoppingBag className={`w-6 h-6 ${isOut ? 'text-rose-400' : 'text-amber-400'}`} />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Current Stock:</span>{' '}
                    <span className="font-extrabold text-white">{prod.stockQuantity} {prod.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-emerald-400">
                    <span>Reorder Suggestion:</span>
                    <span className="bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                      +{suggestedQty} {prod.unit}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
