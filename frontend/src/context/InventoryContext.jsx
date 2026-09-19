import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { speakText } from '../utils/speech';

const InventoryContext = createContext();

// Uses Render backend in production.
// Uses Vite proxy locally when VITE_API_URL is not defined.
const API_URL = import.meta.env.VITE_API_URL || '';

export const InventoryProvider = ({ children }) => {
  const { currentLang, activeLanguageObj } = useLanguage();

  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInventoryValue: 0,
    lowStockCount: 0,
    todayTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastVoiceResult, setLastVoiceResult] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [prodRes, txRes, alertRes, statRes] = await Promise.all([
        fetch(`${API_URL}/api/products`).then(r => r.json()),
        fetch(`${API_URL}/api/transactions`).then(r => r.json()),
        fetch(`${API_URL}/api/alerts`).then(r => r.json()),
        fetch(`${API_URL}/api/stats`).then(r => r.json())
      ]);

      if (Array.isArray(prodRes)) setProducts(prodRes);
      if (Array.isArray(txRes)) setTransactions(txRes);
      if (Array.isArray(alertRes)) setAlerts(alertRes);
      if (statRes && !statRes.error) setStats(statRes);

    } catch (err) {
      console.error('Error fetching inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const addProduct = async (productData) => {
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const data = await res.json();

      if (res.ok) {
        await fetchAllData();
        return {
          success: true,
          data
        };
      }

      return {
        success: false,
        error: data.error
      };

    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const data = await res.json();

      if (res.ok) {
        await fetchAllData();

        return {
          success: true,
          data
        };
      }

      return {
        success: false,
        error: data.error
      };

    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  };

  const updateStockDelta = async (id, delta) => {
    try {
      const res = await fetch(
        `${API_URL}/api/products/${id}/stock`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ delta })
        }
      );

      if (res.ok) {
        await fetchAllData();
      }

    } catch (err) {
      console.error('Error updating stock delta:', err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/api/products/${id}`,
        {
          method: 'DELETE'
        }
      );

      if (res.ok) {
        await fetchAllData();

        return {
          success: true
        };
      }

      const data = await res.json().catch(() => ({}));

      return {
        success: false,
        error: data.error || 'Failed to delete product'
      };

    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  };

  const processVoiceCommand = async (spokenText) => {
    try {
      const res = await fetch(
        `${API_URL}/api/voice/process`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            spokenText,
            language: currentLang
          })
        }
      );

      const data = await res.json();

      setLastVoiceResult(data);

      if (data.audioText) {
        speakText(
          data.audioText,
          activeLanguageObj.speechLang
        );
      }

      await fetchAllData();

      return data;

    } catch (err) {
      console.error('Voice processing error:', err);

      return {
        success: false,
        error: err.message
      };
    }
  };

  const resetDatabase = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/seed`,
        {
          method: 'POST'
        }
      );

      if (res.ok) {
        await fetchAllData();

        alert(
          'Database reset & seeded with sample Kirana products!'
        );
      } else {
        console.error('Database reset failed');
      }

    } catch (err) {
      console.error('Database reset failed:', err);
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        transactions,
        alerts,
        stats,
        loading,
        lastVoiceResult,
        fetchAllData,
        addProduct,
        updateProduct,
        updateStockDelta,
        deleteProduct,
        processVoiceCommand,
        resetDatabase
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () =>
  useContext(InventoryContext);