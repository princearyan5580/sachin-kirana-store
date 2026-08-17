import { useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen) return null;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/auth/profile', formData);
      if (res.data.success) {
        toast.success("Profile details updated! 👤");
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setTimeout(() => window.location.reload(), 800);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed!");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/auth/change-password', passwordData);
      if (res.data.success) {
        toast.success("Password updated successfully! 🔐");
        setPasswordData({ oldPassword: '', newPassword: '' });
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-tight">⚙️ Account Settings</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <div className="flex gap-4 border-b border-slate-100 mb-4">
          <button 
            onClick={() => setActiveTab('details')}
            className={`pb-2 text-xs font-bold transition-all ${activeTab === 'details' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-400'}`}
          >
            Personal Details
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`pb-2 text-xs font-bold transition-all ${activeTab === 'security' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-400'}`}
          >
            Password & Security
          </button>
        </div>

        {activeTab === 'details' && (
          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:bg-white focus:border-sky-500 outline-none"
                required 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:bg-white focus:border-sky-500 outline-none"
                required 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+91 Mobile Number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:bg-white focus:border-sky-500 outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md mt-2">
              Save Profile Changes
            </button>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Current Password</label>
              <input 
                type="password" 
                value={passwordData.oldPassword} 
                onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:bg-white focus:border-sky-500 outline-none"
                required 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">New Password</label>
              <input 
                type="password" 
                value={passwordData.newPassword} 
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:bg-white focus:border-sky-500 outline-none"
                required 
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md mt-2">
              Update Password
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default UserProfileModal;