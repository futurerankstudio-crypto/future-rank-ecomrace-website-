import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { Product } from '../../types/index.ts';
import { Plus, Edit3, Trash2, Eye, Check, X, Star } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, formatPrice, refreshProducts, openProductDetail } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = [
    'Everyday Essentials',
    'Elegant Pret',
    'Contemporary Formal',
    'Seasonal Edit',
    'Accessories'
  ];

  const handleStartCreate = () => {
    setEditingProduct({
      name: '',
      category: 'Elegant Pret',
      price: 15000,
      description: '',
      fabricDetails: '',
      stock: 10,
      lowStockThreshold: 5,
      sku: `NC-NEW-${Math.floor(100 + Math.random() * 900)}`,
      availableSizes: ['S', 'M', 'L'],
      availableColours: [{ name: 'Ivory Cream', hex: '#F9F6F0' }],
      images: ['/images/product_embroidered_pret_1792821527541.jpg'],
      isFeatured: false,
      status: 'published',
      tags: ['pret', 'new']
    });
    setIsEditing(true);
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsEditing(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.category) {
      setErrorMessage('Name, price, and category are required.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      const isUpdate = !!editingProduct.id;
      const url = isUpdate ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      await refreshProducts();
      setIsEditing(false);
      setEditingProduct(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the catalogue?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshProducts();
      }
    } catch {
      // ignore
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !product.isFeatured })
      });
      await refreshProducts();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2DA]">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#1C1C1F]">Catalog Management</h2>
          <p className="text-xs text-[#7A7875]">
            Create, update prices, manage variants, and publish designs across the storefront.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2.5 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32] transition-colors flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-2xl border border-[#E7E2DA] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E7E2DA] text-[#7A7875]">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Price (PKR)</th>
                <th className="py-3 px-4 font-semibold">Stock Level</th>
                <th className="py-3 px-4 font-semibold">Featured</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EEE9]">
              {products.map((p) => {
                const isLow = p.stock <= p.lowStockThreshold && p.stock > 0;
                const isOut = p.stock <= 0;

                return (
                  <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-12 object-cover rounded bg-[#F4F1EA] shrink-0"
                        />
                        <div>
                          <p className="font-medium text-[#1C1C1F] line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-[#7A7875] truncate max-w-[200px]">
                            {p.availableSizes.join(', ')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#555350]">{p.category}</td>
                    <td className="py-3 px-4 font-mono text-[#7A7875] tabular-nums">{p.sku}</td>
                    <td className="py-3 px-4 font-mono font-medium text-[#1C1C1F] tabular-nums">
                      {formatPrice(p.salePrice || p.price)}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">
                      {isOut ? (
                        <span className="text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded">
                          0 (Out)
                        </span>
                      ) : isLow ? (
                        <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                          {p.stock} (Low)
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">
                          {p.stock} units
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded transition-colors ${
                          p.isFeatured ? 'text-[#B89758] bg-[#FAF8F5]' : 'text-neutral-300 hover:text-[#B89758]'
                        }`}
                        title="Toggle featured status"
                      >
                        <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-[#B89758]' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-medium bg-[#F3EFEA] text-[#4A4845]">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openProductDetail(p.id)}
                          className="p-1.5 text-[#7A7875] hover:text-[#1C1C1F] rounded hover:bg-[#F3EFEA]"
                          title="View on Storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-1.5 text-[#7A7875] hover:text-[#1C1C1F] rounded hover:bg-[#F3EFEA]"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-[#9A9690] hover:text-[#B71C1C] rounded hover:bg-[#F3EFEA]"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Product Modal */}
      {isEditing && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E7E2DA] max-w-2xl w-full p-6 sm:p-8 overflow-hidden my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E2DA]">
              <h3 className="font-serif text-2xl font-medium text-[#1C1C1F]">
                {editingProduct.id ? 'Edit Product' : 'Create New Product'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-[#7A7875] hover:text-[#1C1C1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="py-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#4A4845] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Zari Embroidered Raw Silk Kurta"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#4A4845] mb-1">Category *</label>
                  <select
                    value={editingProduct.category || 'Elegant Pret'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#4A4845] mb-1">SKU</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-[#4A4845] mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#4A4845] mb-1">Sale Price (Optional)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.salePrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Leave empty if regular"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#4A4845] mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.stock ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#4A4845] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#4A4845] mb-1">Fabric & Craftsmanship Details</label>
                <input
                  type="text"
                  value={editingProduct.fabricDetails || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fabricDetails: e.target.value })}
                  placeholder="e.g. Pure 80g Raw Silk Kurta with Chiffon Dupatta"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#4A4845] mb-1">
                    Image Asset URL
                  </label>
                  <input
                    type="text"
                    value={editingProduct.images?.[0] || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#4A4845] mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingProduct.lowStockThreshold ?? 5}
                    onChange={(e) => setEditingProduct({ ...editingProduct, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1C1C1F]">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="rounded border-[#DDD7CE] text-[#1C1C1F] focus:ring-0"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1C1C1F]">
                  <input
                    type="checkbox"
                    checked={editingProduct.status === 'published'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.checked ? 'published' : 'draft' })}
                    className="rounded border-[#DDD7CE] text-[#1C1C1F] focus:ring-0"
                  />
                  <span>Published & Live</span>
                </label>
              </div>

              {errorMessage && (
                <p className="text-red-700 bg-red-50 p-2.5 rounded border border-red-200">
                  {errorMessage}
                </p>
              )}

              <div className="pt-4 border-t border-[#E7E2DA] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-[#DDD7CE] rounded-lg text-[#4A4845] hover:bg-[#F3EFEA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#1C1C1F] text-white font-medium rounded-lg hover:bg-[#2D2D32] flex items-center gap-2 disabled:bg-neutral-400"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
