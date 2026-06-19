import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProductById, clearSelectedProduct } from '../../store/productSlice';
import { addToCart } from '../../store/cartSlice';
import { toast } from 'react-toastify';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { selectedProduct: product, loading } = useAppSelector((state) => state.product);
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) dispatch(fetchProductById(Number(id)));
    return () => { dispatch(clearSelectedProduct()); };
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (!product) return;
    const result = await dispatch(addToCart({ productId: product.id, quantity: 1 }));
    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart!');
    } else {
      toast.error('Failed to add to cart');
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <svg className="animate-spin h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  // Not found
  if (!product) {
    return (
      <div className="text-center py-32">
        <p className="text-5xl mb-4">😕</p>
        <h3 className="text-xl font-semibold text-gray-700">Product not found</h3>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft size={18} /> Back to Products
      </button>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Product Image */}
          <div className="bg-gray-100 flex items-center justify-center min-h-80">
            <img
              src={product.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover max-h-[500px]"
            />
          </div>

          {/* Product Info */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              {/* Category + Name */}
              <span className="text-sm text-indigo-500 font-medium uppercase tracking-wide">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-800 mt-2">{product.name}</h1>

              {/* Price */}
              <div className="mt-4">
                <span className="text-4xl font-bold text-indigo-600">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mt-6 leading-relaxed">{product.description}</p>

              {/* Stock Info */}
              <div className="flex items-center gap-2 mt-6">
                <Package size={18} className="text-gray-400" />
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={22} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 py-4 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:border-indigo-400 hover:text-indigo-600 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;