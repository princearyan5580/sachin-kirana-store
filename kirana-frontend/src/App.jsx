// src/App.jsx
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

  const { user, logout } = useAuth();

  const categories = [
    { id: 'Rice', icon: '🌾' },
    { id: 'Pulses', icon: '🌾' },
    { id: 'Flours', icon: '🥖' },
    { id: 'Whole Spices Masalas', icon: '🌶️' },
    { id: 'Vegetables', icon: '🌶️' },
    { id: 'Ghee', icon: '🍯' },
    { id: 'Oil', icon: '🍯' },
    { id: 'Beverages Dairy', icon: '🥛' },
    { id: 'Dry Fruits', icon: '🌰' },
    { id: 'Sweets', icon: '🌰' },
    { id: 'Ice Cream Milk Products', icon: '🥛' },
    { id: 'Tea Coffee Milk Drink Mixes', icon: '🥛' },
    { id: 'Biscuit Chocolates Snacks', icon: '🥖' },
    { id: 'Baby Care', icon: '🙌' },
    { id: 'Feminine Hygiene', icon: '🙌' },
    { id: 'Personal Care', icon: '❤' },
    { id: 'Hair Oral Care', icon: '👩' },
    { id: 'Home Care', icon: '🏡' },
    { id: 'Health Care', icon: '🎣' },
    { id: 'Stationery Agabattis', icon: '🖊' },
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
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-sky-600 text-white p-2 rounded-lg font-black text-xl tracking-tight shadow-md shadow-sky-200">
              S
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 leading-none tracking-tight text-base uppercase">Sachin Dipartmental Store</h1>
              <span className="text-[10px] text-sky-600 font-semibold tracking-wider uppercase">A Grocery Platform</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text"
              placeholder="Search wholesale groceries, rice, pulses, brands..."
              className="w-full bg-slate-100 text-sm text-slate-800 pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-sky-500 focus:outline-none transition-all duration-200"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-700 font-extrabold text-xs rounded-xl hover:bg-sky-100 transition-all flex items-center gap-1.5"
                  title="Profile & Security Settings"
                >
                  👤 <span>{user.name}</span>
                </button>

                {user.role === 'admin' && (
                  <button 
                    onClick={() => setIsAdminOpen(true)}
                    className="px-3 py-1.5 bg-amber-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-amber-600 transition-all"
                  >
                    ⚙️ Admin
                  </button>
                )}
                
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-colors"
                >
                  📦 Orders
                </button>

                <button 
                  onClick={logout}
                  className="px-2 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
                  title="Logout Account"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-sky-700 transition-all"
              >
                Sign In
              </button>
            )}

            <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:text-sky-600 transition-colors"
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
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 flex gap-6 pt-6 pb-12">
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sticky top-24 shadow-sm max-h-[80vh] overflow-y-auto">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4 px-2">Store Categories</h2>
            <nav className="space-y-1">
              <button 
                onClick={() => setSelectedCategory('')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${selectedCategory === '' ? 'bg-sky-50 text-sky-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <span>📦</span> All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 text-left ${selectedCategory === cat.id ? 'bg-sky-50 text-sky-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <span>{cat.icon}</span> {cat.id}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {selectedCategory || 'All Wholesale Inventory'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Verified wholesale products direct from Sachin Store</p>
            </div>
            <span className="text-xs bg-slate-200 font-bold px-2.5 py-1 rounded-full text-slate-600">
              {products.length} Products Found
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 h-64 animate-pulse flex flex-col justify-between">
                  <div className="w-full h-32 bg-slate-100 rounded-lg"></div>
                  <div className="h-4 bg-slate-100 rounded-md w-3/4 my-2"></div>
                  <div className="h-8 bg-slate-100 rounded-lg w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center max-w-md mx-auto mt-12">
                  <span className="text-4xl block mb-3">📦</span>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Stock empty ya matched item nahi mila</h3>
                  <p className="text-slate-400 text-sm">Please check your keyboard query parameters options.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

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