import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, AlertCircle, CheckCircle2, XCircle, Tag, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useInventory } from '../context/InventoryContext';

export default function ProductList({ onOpenAddModal, onEditProduct }) {
  const { t } = useLanguage();
  const { products, updateStockDelta, deleteProduct, loading } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Categories list
  const categories = ['ALL', ...new Set(products.map(p => p.category))];

  // Filtered Products logic
  const filteredProducts = products.filter(p => {
    // Search query match
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.aliases && p.aliases.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())));

    // Category match
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

    // Status match
    let matchesStatus = true;
    const isLow = p.stockQuantity <= p.minThreshold && p.stockQuantity > 0;
    const isOut = p.stockQuantity === 0;
    const isInStock = p.stockQuantity > p.minThreshold;

    if (selectedStatus === 'IN_STOCK') matchesStatus = isInStock;
    if (selectedStatus === 'LOW_STOCK') matchesStatus = isLow;
    if (selectedStatus === 'OUT_OF_STOCK') matchesStatus = isOut;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (product) => {
    if (product.stockQuantity === 0) {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
          <XCircle className="w-3.5 h-3.5" />
          {t('outOfStock')}
        </span>
      );
    }
    if (product.stockQuantity <= product.minThreshold) {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
          <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
          {t('lowStock')} ({product.stockQuantity} {product.unit})
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {t('inStock')}
      </span>
    );
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`${t('confirmDelete')} "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-xl">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            {t('navInventory')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {filteredProducts.length} of {products.length} products stored in MongoDB Atlas
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          {t('addProduct')}
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 text-slate-200 text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">📁 {t('filterCategory')}</option>
            {categories.filter(c => c !== 'ALL').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Stock Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 text-slate-200 text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">📊 {t('filterStatus')}</option>
            <option value="IN_STOCK">🟩 {t('inStock')}</option>
            <option value="LOW_STOCK">🟧 {t('lowStock')}</option>
            <option value="OUT_OF_STOCK">🟥 {t('outOfStock')}</option>
          </select>
        </div>

      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
          Loading MongoDB catalog...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs bg-slate-950/40 rounded-2xl border border-slate-800">
          <Tag className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          {t('noProductsFound')}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Product & Category</th>
                <th className="py-3 px-4">Available Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4 text-center">Quick Adjust</th>
                <th className="py-3 px-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((prod) => (
                <tr key={prod._id} className="hover:bg-slate-800/40 transition-colors">
                  
                  {/* Name & Aliases */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{prod.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-indigo-400 font-medium px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                        {prod.category}
                      </span>
                      {prod.lastUpdatedByVoice && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          🎙️ Voice Updated
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stock Quantity */}
                  <td className="py-3.5 px-4 font-extrabold text-sm text-slate-100">
                    {prod.stockQuantity} <span className="text-xs font-normal text-slate-400">{prod.unit}</span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    {getStatusBadge(prod)}
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">
                    ₹{prod.pricePerUnit} <span className="text-[11px] text-slate-500 font-normal">/ {prod.unit}</span>
                  </td>

                  {/* Quick +/- Buttons */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => updateStockDelta(prod._id, -5)}
                        className="px-1.5 py-1 text-[10px] font-bold rounded bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-700 text-slate-300"
                        title="Reduce 5"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => updateStockDelta(prod._id, -1)}
                        className="w-7 h-7 font-bold rounded bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-700 text-slate-300 flex items-center justify-center text-xs"
                        title="Reduce 1"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => updateStockDelta(prod._id, 1)}
                        className="w-7 h-7 font-bold rounded bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-400 border border-slate-700 text-slate-300 flex items-center justify-center text-xs"
                        title="Add 1"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => updateStockDelta(prod._id, 5)}
                        className="px-1.5 py-1 text-[10px] font-bold rounded bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-400 border border-slate-700 text-slate-300"
                        title="Add 5"
                      >
                        +5
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditProduct(prod)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 hover:text-indigo-300 text-slate-400 transition-colors"
                        title={t('editProduct')}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id, prod.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 hover:text-rose-400 text-slate-400 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
