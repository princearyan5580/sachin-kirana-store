import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginView) {
        // Clean trim to remove accidental spaces
        const res = await login(email.trim(), password);
        if (res.success) {
          toast.success("Login successful! Welcome back 🎉");
          onClose();
        } else {
          toast.error(res.message || "Invalid credentials!");
        }
      } else {
        const res = await register(name.trim(), email.trim(), password);
        if (res.success) {
          toast.success("Account created successfully! 🚀");
          onClose();
        } else {
          toast.error(res.message || "Registration failed!");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 z-10">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-tight flex items-center gap-1.5">
            🔒 {isLoginView ? 'Secure Store Login' : 'Create New Account'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLoginView && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Sachin Kumar"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:bg-white focus:border-sky-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:bg-white focus:border-sky-500 outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:bg-white focus:border-sky-500 outline-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md mt-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLoginView ? 'Proceed Securely' : 'Register Account')}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-xs text-slate-500 hover:text-sky-600 font-semibold"
          >
            {isLoginView ? (
              <>New to store? <span className="text-sky-600 underline">Register Here</span></>
            ) : (
              <>Already have an account? <span className="text-sky-600 underline">Login</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;