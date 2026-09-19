import React from 'react';
import { Package, IndianRupee, AlertTriangle, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useInventory } from '../context/InventoryContext';

export default function DashboardStats({ onFilterLowStock }) {
  const { t } = useLanguage();
  const { stats } = useInventory();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Products */}
      <div className="glass-card glass-card-hover p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t('totalProducts')}</p>
          <h3 className="text-2xl font-black text-white mt-1">{stats.totalProducts}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Active Kirana catalog items</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Package className="w-6 h-6" />
        </div>
      </div>

      {/* Inventory Value */}
      <div className="glass-card glass-card-hover p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t('totalValue')}</p>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">₹{stats.totalInventoryValue?.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Calculated stock worth</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <IndianRupee className="w-6 h-6" />
        </div>
      </div>

      {/* Low Stock Items */}
      <div 
        onClick={onFilterLowStock}
        className={`glass-card glass-card-hover p-4 rounded-2xl flex items-center justify-between cursor-pointer border ${
          stats.lowStockCount > 0 ? 'border-amber-500/40 bg-amber-500/5' : ''
        }`}
      >
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t('lowStockItems')}</p>
            {stats.lowStockCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </div>
          <h3 className="text-2xl font-black text-amber-400 mt-1">{stats.lowStockCount}</h3>
          <p className="text-[11px] text-amber-400/80 mt-0.5 font-medium">Click to view reorder list →</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>

      {/* Today's Voice Activity */}
      <div className="glass-card glass-card-hover p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t('todayActivity')}</p>
          <h3 className="text-2xl font-black text-indigo-300 mt-1">{stats.todayTransactions}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Stock updates logged today</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Activity className="w-6 h-6" />
        </div>
      </div>

    </div>
  );
}
