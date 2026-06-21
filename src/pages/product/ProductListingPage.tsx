import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts, searchProducts } from '../../store/productSlice';
import { addToCart } from '../../store/cartSlice';
import { toast } from 'react-toastify';
import { ShoppingCart, Eye, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import HeroSection from '../../components/HeroSection';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

const SORT_OPTIONS = [
  { value: 'id-asc', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
] as const;

const ProductSkeleton = () => (
  <div className="skeleton-card animate-fade-in">
    <div className="skeleton-image" />
    <div className="p-4 space-y-3">
      <div className="skeleton-text-sm w-20" />
      <div className="skeleton-text w-3/4" />
      <div className="skeleton-text-sm w-full" />
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton-text w-24 h-6" />
        <div className="skeleton-text-sm w-12" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="skeleton-btn flex-1" />
        <div className="skeleton-btn flex-1" />
      </div>
    </div>
  </div>
);

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
  const [addingId, setAddingId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const loadProducts = useCallback(() => {
    if (keyword || category !== 'All') {
      dispatch(searchProducts({ keyword: keyword || undefined, category: category !== 'All' ? category : undefined, page, size: 8 }));
    } else {
      dispatch(fetchProducts({ page, size: 8, sortBy, sortDir }));
    }
  }, [keyword, category, sortBy, sortDir, page, dispatch]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleSearchChange = (value: string) => {
    setKeyword(value);
    setPage(0);
  };

  const handleAddToCart = async (productId: number) => {
    if (!isLoggedIn) { toast.info('Please login to add items to cart'); navigate('/login'); return; }
    setAddingId(productId);
    const result = await dispatch(addToCart({ productId, quantity: 1 }));
    if (addToCart.fulfilled.match(result)) { toast.success('Added to cart!'); } else { toast.error('Failed to add to cart'); }
    setAddingId(null);
  };

  const hasActiveFilters = keyword || category !== 'All' || sortBy !== 'id' || sortDir !== 'asc';

  return (
    <div>
      <HeroSection searchQuery={keyword} onSearchChange={handleSearchChange} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(0); }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all shrink-0 ${
            showFilters || hasActiveFilters
              ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <SlidersHorizontal size={16} />
          Sort
          {hasActiveFilters && <button title="Clear filters" onClick={(e) => { e.stopPropagation(); setSortBy('id'); setSortDir('asc'); setCategory('All'); setKeyword(''); setPage(0); }}><X size={14} /></button>}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 animate-slide-up">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 font-medium">Sort by:</label>
              <select
                title="Sort products"
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => { const [by, dir] = e.target.value.split('-'); setSortBy(by); setSortDir(dir); setPage(0); }}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => { setSortBy('id'); setSortDir('asc'); setCategory('All'); setKeyword(''); setPage(0); }}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm animate-fade-in">
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          {hasActiveFilters && (
            <button
              onClick={() => { setKeyword(''); setCategory('All'); setSortBy('id'); setSortDir('asc'); setPage(0); }}
              className="mt-4 text-indigo-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
                <img
                  src={product.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full">Out of Stock</span>
                  </div>
                )}
                {product.stock > 0 && product.stock <= 10 && (
                  <span className="absolute top-3 right-3 bg-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">Only {product.stock} left</span>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2 flex-1">{product.description}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-lg font-bold text-indigo-600">₹{product.price.toLocaleString()}</span>
                  {product.stock > 0 && <span className="text-xs text-gray-400">{product.stock} in stock</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:border-indigo-600 hover:text-indigo-600 transition-all duration-200"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0 || addingId === product.id}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    {addingId === product.id ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    ) : (
                      <ShoppingCart size={16} />
                    )}
                    {addingId === product.id ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            <ChevronLeft size={18} /> Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = Math.max(0, Math.min(currentPage - 2, totalPages - 5)) + i;
              if (pageNum >= totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                    pageNum === currentPage
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'border border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
