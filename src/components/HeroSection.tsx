import { Search, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const HeroSection = ({ searchQuery, onSearchChange }: HeroSectionProps) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 mb-10">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-4">
            <Sparkles size={16} />
            Premium Collection 2025
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Discover Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">Perfect Style</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-lg">
            Shop the latest trends in electronics, fashion, books, and more — all at unbeatable prices.
          </p>
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/95 backdrop-blur-sm border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-400 shadow-lg transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
