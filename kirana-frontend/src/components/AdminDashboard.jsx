import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import API from '../api/axios';
import { motion } from 'framer-motion';

const AdminDashboard = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState({ totalOrdersCount: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);

  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Rice');
  const [pPrice, setPPrice] = useState('');
  const [pImage, setPImage] = useState('');
  const [pStock, setPStock] = useState('100');
  const [pUnit, setPUnit] = useState('kg');
  const [editingId, setEditingId] = useState(null);

  const refreshData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await API.get('/orders/admin/dashboard', config);
      if (res.data.success) {
        setMetrics(res.data.metrics);
        setOrders(res.data.orders);
      }
      const prodRes = await API.get('/products');
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [ordersRes, prodRes] = await Promise.all([
          API.get('/orders/admin/dashboard', config),
          API.get('/products')
        ]);

        if (isMounted) {
          if (ordersRes.data.success) {
            setMetrics(ordersRes.data.metrics);
            setOrders(ordersRes.data.orders);
          }
          setProducts(prodRes.data);
        }
      } catch (err) {
        if (isMounted) {
          toast.error(err.response?.data?.message || "Session Expired or Unauthorized Account Access Attempt!");
          onClose();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, onClose]);

  const startEditing = (prod) => {
    setEditingId(prod._id);
    setPName(prod.name);
    setPCategory(prod.category);
    setPPrice(prod.price);
    setPStock(prod.stock || 100);
    setPUnit(prod.unit || 'kg');
    setPImage(prod.image_url);
  };

  const handleAddOrEditProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: pName,
        category: pCategory,
        price: Number(pPrice),
        image_url: pImage,
        stock: Number(pStock),
        unit: pUnit
      };

      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload, config);
        toast.success("Product record parameters updated successfully! 🎉");
      } else {
        await API.post('/products', payload, config);
        toast.success("New inventory stock mapped successfully! 📦");
      }

      setPName('');
      setPPrice('');
      setPStock('100');
      setPImage('');
      setPUnit('kg');
      setEditingId(null);
      refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation Error!");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this item from the database inventory?")) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await API.delete(`/products/${id}`, config);
        if (res.data.success) {
          toast.success("Item catalogue records cleared perfectly! 🗑️");
          refreshData();
        }
      } catch (err) {
        toast.error("Deletion failed runtime error: " + err.message);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm overflow-y-auto p-4 md:p-8 flex flex-col items-center">
      <motion.div
        className="bg-white w-full max-w-5xl rounded-2xl p-6 relative space-y-5"
        initial={{ opacity: 0, y: 30, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Sachin Kirana Admin Core</h2>
            <p className="text-xs text-slate-400">Inventory assets, units scaling modifier controls, deletion pipeline active</p>
          </div>
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl uppercase tracking-wider transition-all">
            Exit Panel
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 font-medium animate-pulse">🔄 Loading metrics statements...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl flex justify-between items-center shadow-sm">
                <div>
                  <span className="text-xs text-sky-600 font-bold uppercase tracking-wider block">Gross Turnover</span>
                  <span className="text-xl font-black text-slate-900">₹{metrics.totalRevenue}</span>
                </div>
                <span className="text-2xl">💰</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center shadow-sm">
                <div>
                  <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider block">Completed Transactions</span>
                  <span className="text-xl font-black text-slate-900">{metrics.totalOrdersCount} Shipments</span>
                </div>
                <span className="text-2xl">📦</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-4 h-fit">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2">
                  {editingId ? '✏️ Edit / Modify Catalogue' : '➕ Add Fresh Stock Item'}
                </h3>
                
                <form onSubmit={handleAddOrEditProduct} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Item Name</label>
                    <input 
                      type="text" required placeholder="Premium Basmati Rice"
                      className="w-full bg-white text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                      value={pName} onChange={(e) => setPName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Wholesale Price (₹)</label>
                      <input 
                        type="number" required placeholder="140"
                        className="w-full bg-white text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                        value={pPrice} onChange={(e) => setPPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Stock Quantity</label>
                      <input 
                        type="number" required placeholder="100"
                        className="w-full bg-white text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                        value={pStock} onChange={(e) => setPStock(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category Group</label>
                      <select 
                        className="w-full bg-white text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none text-slate-700"
                        value={pCategory} onChange={(e) => setPCategory(e.target.value)}
                      >
                        <option value="Rice">Rice</option>
                        <option value="Pulses">Pulses</option>
                        <option value="Flours">Flours</option>
                        <option value="Whole Spices Masalas">Whole Spices & Masalas</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Ghee">Ghee</option>
                        <option value="Oil">Oil</option>
                        <option value="Beverages Dairy">Beverages & Dairy</option>
                        <option value="Dry Fruits">Dry Fruits</option>
                        <option value="Home Care">Home Care</option>
                        <option value="Sweets">Sweets</option>
                        <option value="Ice Cream Milk Products">Ice Cream Milk Products</option>
                        <option value="Tea Coffee Milk Drink Mixes">Tea Coffee Milk Drink Mixes</option>
                        <option value="Biscuit Chocolates Snacks">Biscuit Chocolates Snacks</option>
                        <option value="Baby Care">Baby Care</option>
                        <option value="Feminine Hygiene">Feminine Hygiene</option>
                        <option value="Personal Care">Personal Care</option>
                        <option value="Hair Oral Care">Hair Oral Care</option>
                        <option value="Health Care">Health Care</option>
                        <option value="Stationery Agabattis">Stationery Agabattis</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Scale Unit Type</label>
                      <select 
                        className="w-full bg-white text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none text-slate-700 font-bold"
                        value={pUnit} onChange={(e) => setPUnit(e.target.value)}
                      >
                        <option value="kg">kg (Kilograms)</option>
                        <option value="Pcs">Pcs (Pieces/Pack)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Image URL Address Path</label>
                    <input 
                      type="text" placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none text-slate-600 font-mono"
                      value={pImage} onChange={(e) => setPImage(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all">
                    {editingId ? 'CONFIRM AND UPDATE CATALOG' : 'SAVE DIRECTLY INTO WAREHOUSE'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setPName(''); setPPrice(''); setPImage(''); }} className="w-full py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wide hover:underline text-center">
                      Cancel Modify Mode
                    </button>
                  )}
                </form>
              </div>

              <div className="lg:col-span-2 bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col max-h-[55vh]">
                <div className="flex gap-2 border-b border-slate-200 pb-2 mb-3">
                  <button 
                    onClick={() => setActiveTab('products')}
                    className={`px-3 py-1.5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all ${activeTab === 'products' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                  >
                    📦 Stock Catalog ({products.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`px-3 py-1.5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all ${activeTab === 'orders' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                  >
                    📋 Sales Orders ({orders.length})
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {activeTab === 'products' ? (
                    products.map((prod) => (
                      <div key={prod._id} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between text-xs gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <img 
                            src={prod.image_url && prod.image_url.startsWith('http') ? prod.image_url : `http://localhost:5000/${prod.image_url}`}
                            alt="" 
                            className="w-8 h-8 rounded bg-slate-100 object-cover border border-slate-200 flex-shrink-0"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50x50?text=Groceries'; }}
                          />
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-800 block truncate max-w-[160px]">{prod.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-medium">{prod.category}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="text-right whitespace-nowrap min-w-[55px]">
                            <span className="font-black text-slate-900 block">₹{prod.price}</span>
                            <span className="text-[10px] text-slate-400 font-medium">Stock: {prod.stock || 0} {prod.unit || 'kg'}</span>
                          </div>
                          
                          <button 
                            onClick={() => startEditing(prod)}
                            className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 font-extrabold rounded-lg text-[10px] uppercase hover:bg-amber-100 transition-all"
                          >
                            ✏️
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="px-2 py-1 bg-rose-50 border border-rose-200 text-rose-600 font-extrabold rounded-lg text-[10px] hover:bg-rose-100 transition-all"
                            title="Delete Item"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    orders.map((order) => (
                      <div key={order._id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between text-xs gap-4">
                        <div className="min-w-0">
                          <span className="font-black text-slate-700 block">ORDER: #{order._id.slice(-6).toUpperCase()}</span>
                          <p className="text-[10px] text-slate-400 truncate max-w-[280px]">
                            Items Count: {order.items?.length || 0} packs | Status: <span className="text-emerald-600 font-bold uppercase">{order.status}</span>
                          </p>
                        </div>
                        <div className="text-right font-black text-sky-600 text-sm whitespace-nowrap">
                          ₹{order.totalAmount}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;