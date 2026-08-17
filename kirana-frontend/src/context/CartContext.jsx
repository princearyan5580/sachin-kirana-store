// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // LocalStorage se save kiya hua cart initially load karein
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('sachin_cart');
    return localData ? JSON.parse(localData) : [];
  });

  // Jab bhi cart items change hon, local storage update ho jaye
  useEffect(() => {
    localStorage.setItem('sachin_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    clearCart();
  }, [user]);

  // 1. ADD TO CART LOGIC
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const isItemInCart = prevItems.find((item) => item._id === product._id);
      
      if (isItemInCart) {
        // Agar product pehle se cart me hai, toh quantity 1 badha do
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Naya product pehle baar add ho raha hai
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // 2. REMOVE / DECREMENT QUANTITY LOGIC
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const targetItem = prevItems.find((item) => item._id === productId);
      
      if (targetItem.quantity === 1) {
        // Agar quantity 1 hai aur user minus kare, toh item array se nikaal do
        return prevItems.filter((item) => item._id !== productId);
      }
      // Warna quantity 1 kam kar do
      return prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // 3. CLEAR CART (Order success hone ke baad)
  const clearCart = () => setCartItems([]);

  // 4. CALCULATIONS LOGIC (Global values)
  const totalItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalCartAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      totalItemsCount,
      totalCartAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to consume global states easily
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};