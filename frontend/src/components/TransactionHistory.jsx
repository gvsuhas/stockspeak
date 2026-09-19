import React from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, Mic, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useInventory } from '../context/InventoryContext';

export default function TransactionHistory() {
  const { t } = useLanguage();
  const { transactions } = useInventory();

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            {t('navTransactions')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit history of all voice commands & inventory updates recorded in MongoDB
          </p>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          {transactions.length} Total Logs
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs bg-slate-950/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-2">
          <Calendar className="w-8 h-8 text-slate-600 mb-1" />
          No voice transactions logged yet. Try speaking a command using the microphone button!
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Quantity Delta</th>
                <th className="py-3 px-4">Spoken Transcript</th>
                <th className="py-3 px-4 text-right">Stock Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions.map((tx) => {
                const isStockIn = tx.type === 'IN';
                const dateStr = new Date(tx.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <tr key={tx._id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {dateStr}
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full flex items-center gap-1 w-fit ${
                        isStockIn
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {isStockIn ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        STOCK {tx.type}
                      </span>
                    </td>

                    {/* Product Name */}
                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      {tx.productName}
                    </td>

                    {/* Quantity */}
                    <td className={`py-3.5 px-4 font-extrabold ${isStockIn ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isStockIn ? '+' : '-'}{tx.quantity} {tx.unit}
                    </td>

                    {/* Spoken Transcript */}
                    <td className="py-3.5 px-4 text-slate-300 italic max-w-xs truncate">
                      {tx.spokenText ? (
                        <span className="flex items-center gap-1">
                          <Mic className="w-3 h-3 text-indigo-400 shrink-0" />
                          "{tx.spokenText}"
                        </span>
                      ) : (
                        <span className="text-slate-500 font-normal font-sans">Manual Update</span>
                      )}
                    </td>

                    {/* Stock level diff */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                      <span className="text-slate-500">{tx.previousStock}</span> → <span className="font-bold text-white">{tx.newStock}</span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
