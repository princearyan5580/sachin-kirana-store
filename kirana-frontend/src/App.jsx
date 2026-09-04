import { useState, useEffect, useCallback } from 'react';
import API from './api/axios';
import ProductCard from './components/ProductCard';
import { useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import OrderHistoryModal from './components/OrderHistoryModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import UserProfileModal from './components/UserProfileModal';
import { useAuth } from './context/AuthContext';

function App() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const { totalItemsCount, cartItems, totalCartAmount, addToCart, removeFromCart, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, login, register, logout } = useAuth();

  const categories = [
    { id: 'Rice', icon: '🌾' },
    { id: 'Pulses', icon: '🌾' },
    { id: 'Flours', icon: '🥖' },
    { id: 'Whole Spices Masalas', icon: '🌶️' },
    { id: 'Vegetables', icon: '🥦' },
    { id: 'Ghee', icon: '🍯' },
    { id: 'Oil', icon: '🛢️' },
    { id: 'Beverages Dairy', icon: '🥛' },
    { id: 'Dry Fruits', icon: '🌰' },
    { id: 'Sweets', icon: '🍬' },
    { id: 'Ice Cream Milk Products', icon: '🍦' },
    { id: 'Tea Coffee Milk Drink Mixes', icon: '☕' },
    { id: 'Biscuit Chocolates Snacks', icon: '🍪' },
    { id: 'Baby Care', icon: '👶' },
    { id: 'Feminine Hygiene', icon: '🧴' },
    { id: 'Personal Care', icon: '🧼' },
    { id: 'Hair Oral Care', icon: '🪥' },
    { id: 'Home Care', icon: '🏡' },
    { id: 'Health Care', icon: '🩹' },
    { id: 'Stationery Agabattis', icon: '🖊️' },
  ];

  const fetchFilteredProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get(`/products/search?keyword=${keyword}&category=${selectedCategory}`);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error connecting with storage server API:", error);
    } finally {
      setLoading(false);
    }
  }, [keyword, selectedCategory]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFilteredProducts();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchFilteredProducts]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 🟢 Responsive Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Top Bar: Brand & Action Icons (Mobile Row) */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-sky-600 text-white p-2 rounded-lg font-black text-lg sm:text-xl tracking-tight shadow-md shadow-sky-200">
                S
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 leading-none tracking-tight text-sm sm:text-base uppercase truncate">
                  Sachin Dipartmental Store
                </h1>
                <span className="text-[9px] sm:text-[10px] text-sky-600 font-semibold tracking-wider uppercase">
                  Grocery Platform
                </span>
              </div>
            </div>

            {/* Mobile-Only Actions */}
            <div className="flex items-center gap-2 sm:hidden">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-700 bg-slate-100 rounded-xl"
              >
                🛒
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              </button>
            </div>
          </div>

          {/* Search Bar (Adapts Full Width on Mobile) */}
          <div className="w-full sm:flex-1 sm:max-w-md md:max-w-lg relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              🔍
            </span>
            <input 
              type="text"
              placeholder="Search groceries, rice, spices..."
              className="w-full bg-slate-100 text-xs sm:text-sm text-slate-800 pl-9 pr-4 py-2 sm:py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-sky-500 focus:outline-none transition-all duration-200"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* Desktop & Tablet Action Buttons */}
          <div className="flex items-center justify-end w-full sm:w-auto gap-2 overflow-x-auto pb-1 sm:pb-0">
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="px-2.5 py-1.5 bg-sky-50 border border-sky-200 text-sky-700 font-bold text-[11px] sm:text-xs rounded-xl hover:bg-sky-100 transition-all flex items-center gap-1 whitespace-nowrap"
                  title="Profile & Settings"
                >
                  👤 <span className="max-w-[70px] sm:max-w-[100px] truncate">{user.name}</span>
                </button>

                {user.role === 'admin' && (
                  <button 
                    onClick={() => setIsAdminOpen(true)}
                    className="px-2.5 py-1.5 bg-amber-500 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-xl shadow-sm hover:bg-amber-600 transition-all whitespace-nowrap"
                  >
                    ⚙️ Admin
                  </button>
                )}
                
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="px-2.5 py-1.5 bg-slate-100 text-slate-700 font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  📦 Orders
                </button>

                <button 
                  onClick={logout}
                  className="px-2 py-1.5 text-[11px] sm:text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors whitespace-nowrap"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="w-full sm:w-auto px-4 py-1.5 bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-sky-700 transition-all text-center"
              >
                Sign In
              </button>
            )}

            {/* Desktop Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hidden sm:flex relative p-2 text-slate-600 hover:text-sky-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {totalItemsCount}
              </span>
            </button>
          </div>
        </div>

        {/* 🟢 Mobile Horizontal Categories Slider */}
        <div className="md:hidden border-t border-slate-100 px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === '' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            📦 All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${selectedCategory === cat.id ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
            >
              <span>{cat.icon}</span> {cat.id}
            </button>
          ))}
        </div>
      </header>

      {/* 🟢 Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 flex gap-6 pt-4 sm:pt-6 pb-12">
        {/* Desktop Sidebar (Categories) */}
        <aside className="w-60 lg:w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sticky top-24 shadow-sm max-h-[82vh] overflow-y-auto">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 px-2">Store Categories</h2>
            <nav className="space-y-1">
              <button 
                onClick={() => setSelectedCategory('')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all duration-150 ${selectedCategory === '' ? 'bg-sky-50 text-sky-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <span>📦</span> All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all duration-150 text-left ${selectedCategory === cat.id ? 'bg-sky-50 text-sky-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <span>{cat.icon}</span> {cat.id}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1 min-w-0">
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {selectedCategory || 'All Wholesale Inventory'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Verified wholesale products direct from Sachin Store</p>
            </div>
            <span className="text-[11px] sm:text-xs bg-slate-200 font-bold px-2.5 py-1 rounded-full text-slate-600">
              {products.length} Items
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl p-3 sm:p-4 h-56 sm:h-64 animate-pulse flex flex-col justify-between">
                  <div className="w-full h-28 sm:h-32 bg-slate-100 rounded-lg"></div>
                  <div className="h-4 bg-slate-100 rounded-md w-3/4 my-2"></div>
                  <div className="h-7 bg-slate-100 rounded-lg w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                /* 🟢 Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto mt-8">
                  <span className="text-4xl block mb-2">📦</span>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Stock empty ya item nahi mila</h3>
                  <p className="text-slate-400 text-xs">Search query ya category change karke dekhein.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating Cart Button for Mobile Screens */}
      {totalItemsCount > 0 && (
        <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-sky-600 text-white font-extrabold py-3 px-4 rounded-2xl shadow-xl flex items-center justify-between border border-sky-400"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white text-sky-700 text-xs font-black px-2 py-0.5 rounded-full">
                {totalItemsCount}
              </span>
              <span className="text-xs uppercase tracking-wider">View Cart</span>
            </div>
            <span className="text-sm font-black">₹{totalCartAmount} →</span>
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        totalCartAmount={totalCartAmount}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart} 
      />

      <OrderHistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        login={login}
        register={register}
      />

      <AdminDashboard 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <UserProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
    </div>
  );
}

export default App;