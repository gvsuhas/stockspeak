import React, { useState, useEffect } from 'react';
import { X, Save, PackagePlus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useInventory } from '../context/InventoryContext';

export default function AddProductModal({ isOpen, onClose, editingProduct }) {
  const { t } = useLanguage();
  const { addProduct, updateProduct } = useInventory();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Grains & Pulses',
    stockQuantity: 0,
    unit: 'kg',
    minThreshold: 5,
    pricePerUnit: 0,
    aliases: ''
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        stockQuantity: editingProduct.stockQuantity,
        unit: editingProduct.unit,
        minThreshold: editingProduct.minThreshold,
        pricePerUnit: editingProduct.pricePerUnit,
        aliases: (editingProduct.aliases || []).join(', ')
      });
    } else {
      setFormData({
        name: '',
        category: 'Grains & Pulses',
        stockQuantity: 0,
        unit: 'kg',
        minThreshold: 5,
        pricePerUnit: 0,
        aliases: ''
      });
    }
    setError('');
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      ...formData,
      stockQuantity: Number(formData.stockQuantity),
      minThreshold: Number(formData.minThreshold),
      pricePerUnit: Number(formData.pricePerUnit),
      aliases: formData.aliases ? formData.aliases.split(',').map(s => s.trim()) : []
    };

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct._id, payload);
    } else {
      result = await addProduct(payload);
    }

    setSubmitting(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to save product');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-card border border-slate-700/80 rounded-3xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              {editingProduct ? t('editProduct') : t('addProduct')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rice (Chawal), Toor Dal, Milk"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Grains & Pulses">Grains & Pulses</option>
                <option value="Dairy">Dairy</option>
                <option value="Groceries">Groceries</option>
                <option value="Oils & Ghee">Oils & Ghee</option>
                <option value="Beverages">Beverages</option>
                <option value="Personal Care">Personal Care</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t('unit')} *</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="grams">grams</option>
                <option value="bags">bags (Bori / Katta)</option>
                <option value="cartons">cartons (Peti)</option>
                <option value="boxes">boxes (Dabba)</option>
                <option value="dozens">dozens (Darjan)</option>
                <option value="litres">litres</option>
                <option value="pieces">pieces (Nag)</option>
                <option value="quintals">quintals</option>
                <option value="packets">packets (Pkt)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t('quantity')}</label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t('threshold')}</label>
              <input
                type="number"
                min="1"
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t('price')} (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Spoken Aliases (Voice Recognition)</label>
            <input
              type="text"
              placeholder="e.g. chawal, rice bag, basmati (comma separated)"
              value={formData.aliases}
              onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Helps the voice engine match regional terms spoken by shopkeeper.</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <Save className="w-4 h-4" />
              {t('save')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
