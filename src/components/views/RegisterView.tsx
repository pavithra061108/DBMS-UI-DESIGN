import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Phone, MapPin, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import API from '../../services/api'; // Connected to live backend

interface RegisterViewProps {
  onRegisterSuccess: () => void;
  onNavigateLogin: () => void;
  onNavigateLanding: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onRegisterSuccess,
  onNavigateLogin,
  onNavigateLanding,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // LIVE DATABASE REGISTRATION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password.length < 6) return setErrorMessage('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setErrorMessage('Passwords do not match.');

    try {
      // Send the data to your PostgreSQL Backend!
      await API.post('/auth/register', {
        name: fullName,
        email: email,
        phone: mobileNumber,
        address: address,
        city: 'City (Default)',
        dob: '1990-01-01',
        password: password
      });

      setSuccessMessage('Account registered successfully! You can now log in.');
      setTimeout(() => {
        onRegisterSuccess();
        onNavigateLogin();
      }, 2000);

    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || 'Registration failed. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-x-hidden font-sans">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <header className="relative z-10 max-w-7xl mx-auto w-full py-4 flex items-center justify-between">
        <button onClick={onNavigateLanding} className="flex items-center gap-3 text-left focus:outline-none group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform glow-primary">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-wider text-white block leading-none">APEX<span className="text-blue-500">BANK</span></span>
            <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-widest">New Account Registration</span>
          </div>
        </button>
        <button onClick={onNavigateLanding} className="text-xs text-slate-400 hover:text-white transition-colors">← Main Site</button>
      </header>

      <main className="relative z-10 max-w-xl mx-auto w-full my-auto py-6">
        <div className="bg-[#151515] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl glass-panel glow-primary">
          <div className="text-center mb-6 space-y-1">
            <h1 className="text-2xl font-extrabold text-white">Open Customer Account</h1>
            <p className="text-xs text-slate-400">Register securely with your database.</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /><span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input required type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Residential Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3 text-slate-400 hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input required type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 mt-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 glow-primary">
              <span>Submit Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
            Already registered? <button onClick={onNavigateLogin} className="text-blue-400 hover:underline font-semibold">Sign In Here</button>
          </div>
        </div>
      </main>
    </div>
  );
};