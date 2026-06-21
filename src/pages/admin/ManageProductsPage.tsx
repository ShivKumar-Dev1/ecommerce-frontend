import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts } from '../../store/productSlice';
import { addProductApi, updateProductApi, deleteProductApi } from '../../api/productApi';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import type { ProductRequest } from '../../types';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

const ManageProductsPage = () => {
  const dispatch = useAppDispatch();
  const { products, loading, totalPages, currentPage } = useAppSelector((state) => state.product);
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductRequest>();

  useEffect(() => { dispatch(fetchProducts({ page, size: 8 })); }, [page, dispatch]);

  const openAddModal = () => {
    setEditingId(null);
    reset({ name: '', description: '', price: 0, category: '', stock: 0, imageUrl: '' });
    setShowModal(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    reset({ name: product.name, description: product.description, price: product.price, category: product.category, stock: product.stock, imageUrl: product.imageUrl });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingId(null); reset(); };

  const onSubmit = async (data: ProductRequest) => {
    setSubmitting(true);
    try {
      if (editingId) { await updateProductApi(editingId, data); toast.success('Product updated!'); }
      else { await addProductApi(data); toast.success('Product added!'); }
      dispatch(fetchProducts({ page, size: 8 }));
      closeModal();
    } catch { toast.error('Something went wrong'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;
    setDeletingId(id);
    try { await deleteProductApi(id); toast.success('Product deleted'); dispatch(fetchProducts({ page, size: 8 })); }
    catch { toast.error('Failed to delete product'); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-100"><Package size={24} className="text-blue-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
            <p className="text-gray-500 text-sm">Add, edit or remove products</p>
          </div>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-5 border-b border-gray-100">
              <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-48 rounded" />
                <div className="skeleton h-3 w-32 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl || 'https://placehold.co/48x48/e2e8f0/64748b?text=N'} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-800">{product.name}</p>
                          <p className="text-gray-400 text-xs truncate max-w-xs">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1.5 rounded-full font-semibold">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">₹{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${product.stock === 0 ? 'text-red-500' : product.stock <= 10 ? 'text-orange-500' : 'text-green-600'}`}>
                        {product.stock === 0 ? 'Out of Stock' : product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(product)} title="Edit" className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(product.id)} disabled={deletingId === product.id} title="Delete" className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40">
                          {deletingId === product.id ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium">
            <ChevronLeft size={18} /> Prev
          </button>
          <span className="text-gray-600 font-semibold">Page {currentPage + 1} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium">
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={closeModal} title="Close modal" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                <input type="text" placeholder="e.g. iPhone 15 Pro" className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-indigo-400'} focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all`} {...register('name', { required: 'Name is required' })} />
                {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea rows={3} placeholder="Product description..." className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-indigo-400'} focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none`} {...register('description', { required: 'Description is required' })} />
                {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹)</label>
                  <input type="number" placeholder="0" className={`w-full px-4 py-3 rounded-xl border ${errors.price ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-indigo-400'} focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all`} {...register('price', { required: 'Price is required', min: { value: 1, message: 'Price must be > 0' }, valueAsNumber: true })} />
                  {errors.price && <p className="text-red-500 text-xs mt-1.5">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock</label>
                  <input type="number" placeholder="0" className={`w-full px-4 py-3 rounded-xl border ${errors.stock ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-indigo-400'} focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all`} {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Stock cannot be negative' }, valueAsNumber: true })} />
                  {errors.stock && <p className="text-red-500 text-xs mt-1.5">{errors.stock.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select title="Select category" className={`w-full px-4 py-3 rounded-xl border ${errors.category ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-indigo-400'} focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all bg-white`} {...register('category', { required: 'Category is required' })}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1.5">{errors.category.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
                <input type="text" placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all" {...register('imageUrl')} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-red-300 hover:text-red-500 transition-all">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all disabled:opacity-60 shadow-md">
                  {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProductsPage;
