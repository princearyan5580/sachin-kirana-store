import { useEffect, useState } from 'react';
import API from '../api/axios';
import { generateInvoice } from '../utils/generateInvoice';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const OrderHistoryModal = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        const res = await API.get('/orders/history');
        if (isMounted && res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          toast.error("Failed to load your personal order ledger statements!");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrderHistory();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <motion.div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 flex flex-col max-h-[85vh]"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-extrabold text-slate-900 uppercase tracking-tight text-sm flex items-center gap-2">
            📦 Your Personal Order History Logs
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {loading ? (
            <div className="text-center py-12 text-slate-400 font-medium animate-pulse text-xs">🔄 Compiling history records...</div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="border border-slate-100 rounded-xl bg-slate-50/50 p-4 space-y-3 relative shadow-sm">
                <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                  <div>
                    <span className="font-black text-xs text-slate-800 block">ORDER ID: #{order._id.slice(-6).toUpperCase()}</span>
                    <span className="text-[10px] text-slate-400 font-medium block">Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block mb-1">
                      {order.status}
                    </span>
                    <button 
                      onClick={() => {
                        generateInvoice(order);
                        toast.success("Branded PDF Receipt Downloaded! 📄");
                      }}
                      className="text-[10px] bg-sky-50 border border-sky-200 text-sky-700 font-black px-2.5 py-1 rounded-lg hover:bg-sky-100 transition-all uppercase tracking-wide inline-flex items-center gap-1"
                    >
                      📄 Download Invoice
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-medium">{idx + 1}.</span>
                        <span className="font-semibold text-slate-800">{item.productId?.name || "Wholesale Grocery Pack"}</span>
                        <span className="text-[10px] text-slate-400">({item.quantity} x ₹{item.price})</span>
                      </div>
                      <span className="font-bold text-slate-700">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[10px] text-slate-400 font-medium">Payment Mode: Razorpay Link</span>
                  <div className="font-black text-slate-900 text-sm">
                    Net Paid: <span className="text-sky-600">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs font-medium">Aapke account ledger profile par koi dynamic placement logs record nahi hain.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OrderHistoryModal;