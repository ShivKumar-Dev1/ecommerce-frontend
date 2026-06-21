import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProductById, clearSelectedProduct } from '../../store/productSlice';
import { addToCart } from '../../store/cartSlice';
import { toast } from 'react-toastify';
import { ShoppingCart, ArrowLeft, Package, Shield, Truck, RotateCcw, Check } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedProduct: product, loading } = useAppSelector((state) => state.product);
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchProductById(Number(id)));
    return () => { dispatch(clearSelectedProduct()); };
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) { toast.info('Please login to add items to cart'); navigate('/login'); return; }
    if (!product) return;
    setAdding(true);
    const result = await dispatch(addToCart({ productId: product.id, quantity: 1 }));
    if (addToCart.fulfilled.match(result)) { toast.success('Added to cart!'); } else { toast.error('Failed to add to cart'); }
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="skeleton h-5 w-40 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skeleton aspect-[4/3] rounded-3xl" />
          <div className="space-y-4">
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-10 w-3/4 rounded" />
            <div className="skeleton h-12 w-40 rounded mt-4" />
            <div className="skeleton h-32 w-full rounded mt-6" />
            <div className="skeleton h-6 w-48 rounded" />
            <div className="skeleton h-14 w-full rounded-xl mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32 animate-fade-in">
        <p className="text-6xl mb-4">📦</p>
        <h3 className="text-2xl font-bold text-gray-700">Product not found</h3>
        <p className="text-gray-500 mt-2">This product may have been removed</p>
        <button onClick={() => navigate('/products')} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">Browse Products</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors duration-200 font-medium">
        <ArrowLeft size={18} /> Back to Products
      </button>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 lg:p-12">
            <img
              src={product.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image'}
              alt={product.name}
              className="w-full h-full max-h-[500px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full">{product.category}</span>
              {product.stock > 0 ? (
                <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><Check size={14} /> In Stock</span>
              ) : (
                <span className="text-red-500 text-xs font-medium">Out of Stock</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl lg:text-5xl font-bold text-indigo-600">₹{product.price.toLocaleString()}</span>
              <span className="text-gray-400 line-through text-lg">₹{(product.price * 1.25).toLocaleString()}</span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">20% OFF</span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <Package size={16} />
              {product.stock > 0
                ? <span><span className="font-medium text-gray-700">{product.stock}</span> units available</span>
                : <span className="text-red-500 font-medium">Currently unavailable</span>
              }
            </div>

            <p className="text-gray-600 mt-6 leading-relaxed border-t border-gray-100 pt-6">{product.description}</p>

            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Truck, label: 'Free Shipping', desc: 'On orders above ₹499' },
                { icon: Shield, label: 'Secure', desc: '100% secure payment' },
                { icon: RotateCcw, label: 'Easy Returns', desc: '30-day return policy' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-gray-50">
                  <Icon size={20} className="mx-auto text-indigo-500 mb-1" />
                  <p className="text-xs font-semibold text-gray-700">{label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 hover:shadow-xl"
              >
                {adding ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                ) : <ShoppingCart size={24} />}
                {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={() => navigate('/products')} className="w-full py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all duration-200">Continue Shopping</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
