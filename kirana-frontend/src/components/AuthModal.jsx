import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    let result;
    if (isLoginView) {
      result = await login(email, password);
    } else {
      result = await register(name, email, password);
    }

    if (result.success) {
        toast.success(isLoginView ? "Welcome back! Store session initialized securely " : "Wholesale Account Registered Sucessfully! 🎉");
      onClose();
      // Clean up fields
      setName('');
      setEmail('');
      setPassword('');
    } else {
        toast.error(`Registration Trigger Failed! Detail Error: ${result.message}`);
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col animation-scale-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-extrabold text-slate-900 uppercase tracking-tight text-base">
            {isLoginView ? '🔒 Secure Store Login' : '📝 Create Wholesale Account'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold p-2.5 rounded-xl mb-4 text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLoginView && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input 
                type="text" required placeholder="Sachin Kumar"
                className="w-full bg-slate-50 text-sm p-2.5 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-none"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
            <input 
              type="email" required placeholder="sachin@kirana.com"
              className="w-full bg-slate-50 text-sm p-2.5 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-none"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
            <input 
              type="password" required placeholder="••••••••"
              className="w-full bg-slate-50 text-sm p-2.5 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-none"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full py-2.5 bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-sky-100 hover:bg-sky-700">
            {isLoginView ? 'PROCEED SECURELY' : 'REGISTER ACCOUNT'}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
          {isLoginView ? "New to store? " : "Already have account? "}
          <button 
            onClick={() => { setIsLoginView(!isLoginView); setErrorMsg(''); }}
            className="text-sky-600 font-bold underline hover:text-sky-700"
          >
            {isLoginView ? 'Register Here' : 'Login Here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;