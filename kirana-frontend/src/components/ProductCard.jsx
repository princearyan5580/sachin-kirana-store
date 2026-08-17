// src/components/ProductCard.jsx
import 'react';
import { useCart } from '../context/CartContext'; // Hook consume karein

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  
  // Check karein ki ye particular product cart me kitni quantity me hai
  const cartItem = cartItems.find((item) => item._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col justify-between hover:shadow-md transition-all">
      <div>
        <div className="w-full h-40 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center mb-3">
          <img 
            src={
              product.image_url && product.image_url.startsWith('http')
                ? product.image_url
                : product.image_url
                  ? `http://localhost:5000/${product.image_url}`
                  : 'https://placehold.co/300*300?text=Groceries'
            } 
            alt={product.name}
            className="object-contain h-full w-full p-2 mix-blend-multiply"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/300*300?text=Sachin+Store';
            }}
          />
        </div>
        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded uppercase">{product.category}</span>
        <h3 className="font-semibold text-slate-900 text-sm mt-1 line-clamp-2 h-10">{product.name}</h3>
      </div>

      <div className="mt-4">
        <div className="text-lg font-bold text-slate-900 mb-3">₹{product.price}</div>
        
        {/* Dynamic Cart Logic Display */}
        {quantity > 0 ? (
          <div className="flex items-center justify-between border border-sky-600 rounded-lg bg-sky-50 overflow-hidden h-9">
            <button 
              onClick={() => removeFromCart(product._id)}
              className="px-3 py-1 bg-sky-100 hover:bg-sky-200 text-sky-700 font-extrabold text-sm h-full"
            >
              -
            </button>
            <span className="font-bold text-sky-800 text-sm">{quantity}</span>
            <button 
              onClick={() => addToCart(product)}
              className="px-3 py-1 bg-sky-100 hover:bg-sky-200 text-sky-700 font-extrabold text-sm h-full"
            >
              +
            </button>
          </div>
        ) : (
          <button 
            onClick={() => addToCart(product)}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;