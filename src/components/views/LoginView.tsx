import React, { useState } from 'react';

import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  X,
  CheckCircle2,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

import { UserRole } from '../../types/bank';

interface LoginViewProps {
  onLoginSuccess: (emailOrUsername: string, role: UserRole) => void;
  onNavigateRegister: () => void;
  onNavigateLanding: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateRegister,
  onNavigateLanding,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const [username, setUsername] = useState('eleanor_vance');
  const [password, setPassword] = useState('password123');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Login success popup
  const [loggingIn, setLoggingIn] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');

  // Forgot password modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Available login roles
  const rolePresets: Record<
    UserRole,
    {
      username: string;
      label: string;
      icon: React.ReactNode;
      desc: string;
    }
  > = {
    customer: {
      username: 'eleanor_vance',
      label: 'Customer',
      icon: <User className="w-4 h-4" />,
      desc: 'View accounts, transactions, statements, and loans',
    },

    admin: {
      username: 'dba_root',
      label: 'Bank Admin',
      icon: <ShieldAlert className="w-4 h-4" />,
      desc: 'Manage customers, accounts, loans, branches, and reports',
    },
  };

  // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setUsername(rolePresets[role].username);
    setPassword('password123');
    setErrorMessage('');
  };

  // Handle login submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your Username or Email address.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const nameToDisplay =
      selectedRole === 'admin'
        ? 'Alexander Vance (Admin)'
        : 'Eleanor Vance';

    setWelcomeName(nameToDisplay);
    setLoggingIn(true);

    setTimeout(() => {
      onLoginSuccess(username, selectedRole);
    }, 1800);
  };

  // Handle forgot password submission
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      return;
    }

    setForgotSubmitted(true);

    setTimeout(() => {
      setForgotSubmitted(false);
      setForgotModalOpen(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-x-hidden font-sans">
      {/* Background lighting effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header branding */}
      <header className="relative z-10 max-w-7xl mx-auto w-full py-4 flex items-center justify-between">
        <button
          onClick={onNavigateLanding}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform glow-primary">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>

          <div>
            <span className="text-xl font-extrabold tracking-wider text-white block leading-none">
              APEX<span className="text-blue-500">BANK</span>
            </span>

            <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-widest">
              Enterprise Relational BMS
            </span>
          </div>
        </button>

        <button
          onClick={onNavigateLanding}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          ← Main Site
        </button>
      </header>

      {/* Main login card */}
      <main className="relative z-10 max-w-xl mx-auto w-full my-auto py-8">
        <div className="bg-[#151515] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl glass-panel glow-primary">
          <div className="text-center mb-6 space-y-1">
            <h1 className="text-2xl font-extrabold text-white">
              System Security Authentication
            </h1>

            <p className="text-xs text-slate-400">
              Select your authorization role to enter the enterprise banking
              system
            </p>
          </div>

          {/* Role selection */}
          <div className="mb-6 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Select Role Authorization
            </label>

            <div className="grid grid-cols-2 gap-3">
              {(['customer', 'admin'] as UserRole[]).map((role) => {
                const isSelected = selectedRole === role;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`p-4 rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30 glow-primary'
                        : 'bg-[#0B0B0B] text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {rolePresets[role].icon}

                    <span>{rolePresets[role].label}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-cyan-400 text-center font-mono mt-2">
              Active Scope: {rolePresets[selectedRole].desc}
            </p>
          </div>

          {/* Error banner */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />

              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username / Identifier
              </label>

              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />

                <input
                  id="login-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>

                <button
                  type="button"
                  id="forgot-password-link"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />

                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  id="remember-me-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-[#0B0B0B] border-slate-800 text-blue-600 focus:ring-0"
                />

                <span>Remember Session</span>
              </label>
            </div>

            {/* Submit button */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-70 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 glow-primary"
            >
              <span>Authenticate & Enter Dashboard</span>

              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
            Don't have a registered account yet?{' '}

            <button
              id="goto-register-link"
              onClick={onNavigateRegister}
              className="text-blue-400 hover:underline font-semibold"
            >
              Register Here
            </button>
          </div>
        </div>
      </main>

      {/* Login success popup */}
      {loggingIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#151515] border border-slate-800 rounded-2xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl glow-primary">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Login Successful
              </h3>

              <p className="text-sm font-semibold text-blue-400 mt-1">
                Welcome, {welcomeName}
              </p>

              <p className="text-xs text-slate-400 capitalize mt-0.5">
                Role: {rolePresets[selectedRole].label}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-center gap-2 text-xs text-cyan-400">
                <Loader2 className="w-4 h-4 animate-spin" />

                <span>Loading Dashboard...</span>
              </div>

              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 animate-pulse rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forgot password modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151515] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
              aria-label="Close forgot password dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              Reset Password
            </h3>

            <p className="text-xs text-slate-400 mb-4">
              Enter your email address to receive password reset instructions.
            </p>

            {forgotSubmitted ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />

                <span>
                  Password reset instructions dispatched to your inbox.
                </span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>

                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[#0B0B0B] border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full text-center text-[11px] text-slate-500 py-2">
        © 2026 Apex Relational Bank Management System. Secure Authentication Protocol.
      </footer>
    </div>
  );
};