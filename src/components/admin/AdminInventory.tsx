import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { Layers, AlertTriangle, CheckCircle2, RotateCcw, ArrowUpRight } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, refreshProducts, refreshNotifications } = useStore();

  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState<number>(10);
  const [thresholdValue, setThresholdValue] = useState<number>(5);
  const [updating, setUpdating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const data = await res.json();
        setInventoryList(data.inventory);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [products]);

  const handleAdjustStock = async (productId: string, newStock: number, threshold?: number) => {
    setUpdating(true);
    setNotice(null);
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          newStock,
          threshold
        })
      });

      if (res.ok) {
        await refreshProducts();
        await refreshNotifications();
        await fetchInventory();
        setNotice('Inventory adjusted successfully. Workflows evaluated.');
        setTimeout(() => setNotice(null), 3000);
        setSelectedProductId(null);
      }
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  };

  const totalStock = inventoryList.reduce((acc, item) => acc + item.stock, 0);
  const lowStockItems = inventoryList.filter((item) => item.status === 'low_stock');
  const outOfStockItems = inventoryList.filter((item) => item.status === 'out_of_stock');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E7E2DA] shadow-sm">
          <span className="text-xs text-[#7A7875]">Total Warehouse Units</span>
          <p className="font-serif text-3xl font-bold text-[#1C1C1F] mt-2 font-mono tabular-nums">
            {totalStock}
          </p>
          <span className="text-[11px] text-[#7A7875] mt-1 block">Active across all catalog SKUs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E2DA] shadow-sm">
          <span className="text-xs text-[#D97706] font-medium">Low Stock Alerts</span>
          <p className="font-serif text-3xl font-bold text-[#D97706] mt-2 font-mono tabular-nums">
            {lowStockItems.length}
          </p>
          <span className="text-[11px] text-[#7A7875] mt-1 block">Subject to Workflow B auto-guards</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E2DA] shadow-sm">
          <span className="text-xs text-[#B71C1C] font-medium">Out of Stock</span>
          <p className="font-serif text-3xl font-bold text-[#B71C1C] mt-2 font-mono tabular-nums">
            {outOfStockItems.length}
          </p>
          <span className="text-[11px] text-[#7A7875] mt-1 block">Prevented from checkout</span>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-[#E8F5E9] text-[#2E7D32] rounded-xl border border-[#C8E6C9] text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#E7E2DA] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E7E2DA] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#1C1C1F]">Stock Management & Guard</h2>
            <p className="text-xs text-[#7A7875]">
              Real-time synchronization between order checkouts and warehouse quantities.
            </p>
          </div>
          <button
            onClick={() => fetchInventory()}
            className="p-2 text-[#7A7875] hover:text-[#1C1C1F] hover:bg-[#F3EFEA] rounded-lg transition-colors"
            title="Refresh Inventory"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E7E2DA] text-[#7A7875]">
                <th className="py-3 px-4 font-semibold">Product Name</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Current Stock</th>
                <th className="py-3 px-4 font-semibold">Alert Threshold</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EEE9]">
              {inventoryList.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4 font-medium text-[#1C1C1F]">{item.name}</td>
                  <td className="py-3 px-4 text-[#555350]">{item.category}</td>
                  <td className="py-3 px-4 font-mono tabular-nums text-[#7A7875]">{item.sku}</td>
                  <td className="py-3 px-4 font-mono font-bold tabular-nums text-[#1C1C1F]">
                    {item.stock}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-[#7A7875]">
                    &le; {item.lowStockThreshold} units
                  </td>
                  <td className="py-3 px-4">
                    {item.status === 'out_of_stock' ? (
                      <span className="text-[10px] bg-red-100 text-red-900 font-semibold px-2 py-0.5 rounded">
                        Out of Stock
                      </span>
                    ) : item.status === 'low_stock' ? (
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        Low Stock Alert
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-medium px-2 py-0.5 rounded">
                        Optimal
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleAdjustStock(item.id, item.stock + 5)}
                        className="px-2 py-1 text-[11px] font-medium bg-[#FAF8F5] border border-[#DDD7CE] rounded hover:border-[#1C1C1F] text-[#1C1C1F]"
                        title="Add 5 units"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item.id, item.stock + 10)}
                        className="px-2 py-1 text-[11px] font-medium bg-[#FAF8F5] border border-[#DDD7CE] rounded hover:border-[#1C1C1F] text-[#1C1C1F]"
                        title="Add 10 units"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProductId(item.id);
                          setAdjustmentValue(item.stock);
                          setThresholdValue(item.lowStockThreshold);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium bg-[#1C1C1F] text-white rounded hover:bg-[#2D2D32]"
                      >
                        Custom
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Adjustment Modal */}
      {selectedProductId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl shadow-xl border border-[#E7E2DA] max-w-sm w-full p-6 space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#1C1C1F]">Adjust Inventory Quantity</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#4A4845] font-medium mb-1">New Total Stock:</label>
                <input
                  type="number"
                  min={0}
                  value={adjustmentValue}
                  onChange={(e) => setAdjustmentValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CE] bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[#4A4845] font-medium mb-1">Low Stock Warning Threshold:</label>
                <input
                  type="number"
                  min={1}
                  value={thresholdValue}
                  onChange={(e) => setThresholdValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CE] bg-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setSelectedProductId(null)}
                className="px-3 py-1.5 border border-[#DDD7CE] rounded-lg text-[#4A4845]"
              >
                Cancel
              </button>
              <button
                disabled={updating}
                onClick={() => handleAdjustStock(selectedProductId, adjustmentValue, thresholdValue)}
                className="px-4 py-1.5 bg-[#1C1C1F] text-white font-medium rounded-lg hover:bg-[#2D2D32]"
              >
                {updating ? 'Saving...' : 'Apply Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
