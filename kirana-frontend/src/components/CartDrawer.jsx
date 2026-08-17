import toast from 'react-hot-toast';
import React from 'react';
import API from '../api/axios';

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  totalCartAmount, 
  addToCart, 
  removeFromCart, 
  clearCart 
}) => {
  
  if (!isOpen) return null;

  const handleCheckout = async () => {
    try {
      console.log("Sending amount to backend:", totalCartAmount);

      // 1. Backend se Razorpay Order ID generate karein
      const orderResponse = await API.post('/orders/checkout', { 
        amount: Number(totalCartAmount) 
      });
      
      if (!orderResponse.data.success) {
        toast.success("Server Error in generating Order ID");
        return;
      }

      const { id: razorpayOrderId, amount, currency } = orderResponse.data.order;

      // 2. Razorpay Options Configuration Setup
      const options = {
        key: "rzp_test_TEYkzgaq4VdaWu", // Aapki verified Active Key ID
        amount: amount,
        currency: currency,
        name: "Sachin Departmental Store",
        description: "Wholesale Grocery Order Checkout",
        order_id: razorpayOrderId,
        
        // Payment Success Handler Callback
        handler: async function (response) {
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartItems,
              totalAmount: totalCartAmount
            };

            // Backend signature cross verification trigger karein
            const verifyResponse = await API.post('/orders/verify', verifyPayload);

            if (verifyResponse.data.success) {
              toast.success("🎉 Order Placed Successfully! Order saved in database.");
              
              // Safely clear global context cart items tracking
              if (typeof clearCart === 'function') {
                clearCart();
              } else {
                console.error("clearCart hook is still not structured inside props context map.");
              }
              onClose(); // Close the drawer element panels
            }
          } catch (err) {
            console.error("Payment Verification Error", err);
            const verifyErrLog = err.response?.data?.error || err.response?.data?.message || err.message;
            toast.error(`Payment verification failure on node! Error: ${verifyErrLog}`);
          }
        },
        prefill: {
          name: "Sachin Customer",
          email: "customer@sachinkirana.com",
          contact: "9999999999",
        },
        theme: {
          color: "#0284c7",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Checkout System Error:", error);
      
      // 🔥 DYNAMIC ERROR POPUP LOG: Backend ka exact crash description popup me show hoga
      const backendError = error.response?.data?.error || error.response?.data?.message || error.message;
      toast.error(`Checkout sequence failure! Backend Error: ${backendError}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm">
      {/* Backdrop overlay to close drawer */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* Drawer content frame container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animation-slide-in">
        
        {/* Header Console element */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h3 className="font-extrabold text-slate-900 tracking-tight text-base uppercase">Your Wholesale Cart</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Dynamic Items Map Body Loop */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <span className="text-4xl mb-2">📦</span>
              <p className="text-sm font-medium text-slate-500">Cart is empty. Add products to get started!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden flex-shrink-0">
                  <img 
                    src={`http://localhost:5000/${item.image_url}`} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Grocery'; }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="text-xs text-sky-600 font-semibold mt-0.5">₹{item.price} x {item.quantity}</p>
                </div>

                {/* Counter control configuration mapping element buttons */}
                <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-1 py-0.5">
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="w-6 h-6 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-50 rounded"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-6 h-6 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-50 rounded"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right pl-2">
                  <span className="text-sm font-bold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dynamic Summary Billing Element Actions Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Subtotal Amount:</span>
                <span className="font-semibold">₹{totalCartAmount}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Delivery Charge:</span>
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">FREE</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-dashed border-slate-200">
                <span>Total Payable:</span>
                <span className="text-sky-600 text-base">₹{totalCartAmount}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-orange-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-orange-200 hover:bg-orange-600 active:scale-[0.99] transition-all duration-150"
            >
              PLACE ORDER (PROCEED TO PAYMENT)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;