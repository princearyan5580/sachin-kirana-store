import { useState } from 'react';
import UserProfileModal from './UserProfileModal';

const Navbar = ({ 
  user, 
  onLogout, 
  onOpenAuth, 
  onOpenCart,
  onOpenOrders, 
  onOpenAdmin,
  cartCount = 0,
  searchQuery = '',
  setSearchQuery = () => {}
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-sky-500 text-white font-black text-lg w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
              S
            </div>
            <div>
              <h1 className="font-black text-sm text-slate-900 leading-none tracking-tight">
                SACHIN DIPARTMENTAL STORE
              </h1>
              <span className="text-[9px] font-bold text-sky-500 tracking-wider uppercase block mt-0.5">
                A GROCERY PLATFORM
              </span>
            </div>
          </div>

          {/* Search Bar Input */}
          <div className="flex-1 max-w-xl mx-2">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 text-sm">🔍</span>
              <input 
                type="text"
                placeholder="Search wholesale groceries, rice, pulses, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* User Controls & Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Profile Settings Trigger Button */}
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-600 font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 border border-slate-200"
                  title="Manage Profile & Security"
                >
                  👤 <span>{user.name}</span>
                </button>

                {/* Orders Modal Trigger */}
                <button 
                  onClick={onOpenOrders}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[11px] px-3 py-1.5 rounded-xl uppercase tracking-wider transition-all flex items-center gap-1"
                >
                  📦 MY ORDERS
                </button>

                {/* Admin Panel Trigger (Only for Admin Role) */}
                {user.role === 'admin' && (
                  <button 
                    onClick={onOpenAdmin}
                    className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-black text-[11px] px-2.5 py-1.5 rounded-xl uppercase tracking-wide transition-all"
                  >
                    👑 ADMIN
                  </button>
                )}

                {/* Logout Button */}
                <button 
                  onClick={onLogout}
                  className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors px-1"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-sky-100"
              >
                LOGIN / REGISTER
              </button>
            )}

            {/* Cart Drawer Trigger */}
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="View Cart"
            >
              <span className="text-xl">🛍️</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* User Profile Settings Modal Container */}
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user} 
      />
    </>
  );
};

export default Navbar;