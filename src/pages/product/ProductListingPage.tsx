import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts, searchProducts } from '../../store/productSlice';
import { addToCart } from '../../store/cartSlice';
import { toast } from 'react-toastify';
import { Search, ShoppingCart, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

const ProductListingPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, loading, totalPages, currentPage } = useAppSelector((state) => state.product);
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);

  // Fetch products on mount and when filters change
  useEffect(() => {
    if (keyword || category !== 'All') {
      dispatch(searchProducts({
        keyword: keyword || undefined,
        category: category !== 'All' ? category : undefined,
        page,
        size: 8,
      }));
    } else {
      dispatch(fetchProducts({ page, size: 8, sortBy, sortDir }));
    }
  }, [keyword, category, sortBy, sortDir, page, dispatch]);

  const handleAddToCart = async (productId: number) => {
    if (!isLoggedIn) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    const result = await dispatch(addToCart({ productId, quantity: 1 }));
    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart!');
    } else {
      toast.error('Failed to add to cart');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setPage(0);
  };

  const handleCategory = (cat: string) => {
    setCategory(cat);
    setPage(0);
  };

  return (
    <div>
      {/* Search + Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Sort */}
       <select
  title="Sort products"
  value={`${sortBy}-${sortDir}`}
  onChange={(e) => {
    const [by, dir] = e.target.value.split('-');
    setSortBy(by);
    setSortDir(dir);
    setPage(0);
  }}
  className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
>
          <option value="id-asc">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              category === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
          <p className="text-gray-500 mt-2">Try a different search or category</p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-48 bg-gray-100">
                <img
                  src={product.imageUrl || 'https://placehold.co/400x300?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {product.stock === 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <span className="text-xs text-indigo-500 font-medium uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="font-semibold text-gray-800 mt-1 truncate">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-indigo-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400">Stock: {product.stock}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="flex-1 flex items-center justify-center gap-1 border border-indigo-600 text-indigo-600 py-2 rounded-lg text-sm hover:bg-indigo-50 transition"
                  >
                    <Eye size={15} /> View
                  </button>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0}
                    className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={15} /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={18} /> Prev
          </button>

          <span className="text-gray-600 font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;