import React, { useEffect, useState } from 'react';
import {
  Bell,
  Check,
  Eye,
  KeyRound,
  LockKeyhole,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  UserRound,
} from 'lucide-react';
import { Customer } from '../../types/bank';

interface SettingsViewProps {
  currentUser: Customer;
  onShowToast: (
    title: string,
    desc: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) => void;
}

type ThemePreference = 'dark' | 'light' | 'system';
interface Preferences {
  transactionAlerts: boolean;
  transferAlerts: boolean;
  loginAlerts: boolean;
  securityAlerts: boolean;
  accountUpdates: boolean;
  maskAccountNumbers: boolean;
  hideBalances: boolean;
  theme: ThemePreference;
}

const defaultPreferences: Preferences = {
  transactionAlerts: true,
  transferAlerts: true,
  loginAlerts: true,
  securityAlerts: true,
  accountUpdates: true,
  maskAccountNumbers: true,
  hideBalances: false,
  theme: 'dark',
};

const preferenceKey = (userId: string) => `apex-bank-settings-${userId}`;

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, onShowToast }) => {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(preferenceKey(currentUser.id));
      setPreferences(stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences);
    } catch {
      setPreferences(defaultPreferences);
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }, [currentUser.id]);

  const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences((previous) => ({ ...previous, [key]: value }));
  };

  const savePreferences = () => {
    try {
      localStorage.setItem(preferenceKey(currentUser.id), JSON.stringify(preferences));
      onShowToast('Settings Saved', 'Your preferences were saved in this browser.', 'success');
    } catch {
      onShowToast('Could Not Save', 'Your browser could not save these preferences.', 'error');
    }
  };

  const handlePasswordUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentPassword.trim()) {
      onShowToast('Current Password Required', 'Enter your current password to continue.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      onShowToast('Password Too Short', 'Your new password must contain at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      onShowToast('Passwords Do Not Match', 'Enter the same new password in both fields.', 'error');
      return;
    }

    // This frontend-only demo validates the form but does not change a real password.
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onShowToast('Demo Form Validated', 'The form is valid, but changing a real password requires backend authentication.', 'info');
  };

  return (
    <div className="space-y-6 font-sans text-white">
      <div>
        <h1 className="text-2xl font-black">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Manage security, notifications, privacy, and appearance preferences.</p>
      </div>

      <section className="rounded-3xl border border-slate-700/80 bg-[#1E293B] p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-700/60 pb-4">
          <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400"><LockKeyhole className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-bold">Security & Password</h2>
            <p className="mt-1 text-xs text-slate-400">Update your password details.</p>
          </div>
        </div>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <PasswordField label="Current Password" value={currentPassword} onChange={setCurrentPassword} show={showPasswords} placeholder="Enter current password" />
            <PasswordField label="New Password" value={newPassword} onChange={setNewPassword} show={showPasswords} placeholder="Minimum 6 characters" />
            <PasswordField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} show={showPasswords} placeholder="Re-enter new password" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => setShowPasswords((show) => !show)} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white">
              <Eye className="h-4 w-4" /> {showPasswords ? 'Hide passwords' : 'Show passwords'}
            </button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600">
              <ShieldCheck className="h-4 w-4" /> Validate Password Form
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-300/90">Demo limitation: this frontend form does not change a real password. Connect it to a secure authentication backend before treating it as functional banking security.</p>
        </form>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-700/80 bg-[#1E293B] p-6 shadow-xl sm:p-8">
          <SectionHeading icon={<Bell className="h-5 w-5" />} title="Notification Preferences" subtitle="Choose which in-app alert preferences to save." />
          <div className="mt-2">
            <ToggleRow label="Transaction Alerts" description="Deposits and withdrawals" checked={preferences.transactionAlerts} onChange={(v) => updatePreference('transactionAlerts', v)} />
            <ToggleRow label="Transfer Alerts" description="Transfer activity" checked={preferences.transferAlerts} onChange={(v) => updatePreference('transferAlerts', v)} />
            <ToggleRow label="Login Alerts" description="New login activity" checked={preferences.loginAlerts} onChange={(v) => updatePreference('loginAlerts', v)} />
            <ToggleRow label="Security Alerts" description="Important security events" checked={preferences.securityAlerts} onChange={(v) => updatePreference('securityAlerts', v)} />
            <ToggleRow label="Account Updates" description="Changes to account information" checked={preferences.accountUpdates} onChange={(v) => updatePreference('accountUpdates', v)} />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700/80 bg-[#1E293B] p-6 shadow-xl sm:p-8">
          <SectionHeading icon={<Eye className="h-5 w-5" />} title="Privacy Preferences" subtitle="Choose how account information is displayed." />
          <div className="mt-2">
            <ToggleRow label="Mask Account Numbers" description="Hide all but the last four digits where supported" checked={preferences.maskAccountNumbers} onChange={(v) => updatePreference('maskAccountNumbers', v)} />
            <ToggleRow label="Hide Balances by Default" description="Preference saved for future UI integration" checked={preferences.hideBalances} onChange={(v) => updatePreference('hideBalances', v)} />
          </div>
          <div className="mt-5 rounded-xl border border-slate-700 bg-[#0F172A]/70 p-3 text-[11px] leading-relaxed text-slate-400">These preferences are saved in this browser. Individual screens must read them before the display behavior changes globally.</div>
        </section>

        <section className="rounded-3xl border border-slate-700/80 bg-[#1E293B] p-6 shadow-xl sm:p-8 xl:col-span-2">
          <SectionHeading icon={<Palette className="h-5 w-5" />} title="Appearance" subtitle="Choose the theme preference for this application." />
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ThemeOption title="Dark Mode" description="Dark background" icon={<Moon className="h-5 w-5" />} selected={preferences.theme === 'dark'} onClick={() => updatePreference('theme', 'dark')} />
            <ThemeOption title="Light Mode" description="Light background" icon={<Sun className="h-5 w-5" />} selected={preferences.theme === 'light'} onClick={() => updatePreference('theme', 'light')} />
            <ThemeOption title="System Default" description="Follow device preference" icon={<UserRound className="h-5 w-5" />} selected={preferences.theme === 'system'} onClick={() => updatePreference('theme', 'system')} />
          </div>
          <p className="mt-4 text-[11px] text-slate-400">The selected theme preference is stored locally. Applying light or system themes throughout every page requires global theme support.</p>
        </section>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={savePreferences} className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600">
          <Check className="h-4 w-4" /> Save Settings
        </button>
      </div>
    </div>
  );
};

const SectionHeading: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
  <div className="flex items-start gap-3 border-b border-slate-700/60 pb-4">
    <div className="rounded-xl bg-blue-500/15 p-2 text-blue-400">{icon}</div>
    <div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  </div>
);

const ToggleRow: React.FC<{ label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-700/50 py-4 last:border-b-0">
    <div>
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-[11px] text-slate-400">{description}</p>
    </div>
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-emerald-500' : 'bg-slate-600'}`}>
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  </div>
);

const ThemeOption: React.FC<{ title: string; description: string; icon: React.ReactNode; selected: boolean; onClick: () => void }> = ({ title, description, icon, selected, onClick }) => (
  <button type="button" onClick={onClick} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${selected ? 'border-[#3B82F6] bg-blue-500/10' : 'border-slate-700 bg-[#0F172A] hover:border-slate-500'}`}>
    <span className={selected ? 'text-blue-300' : 'text-slate-400'}>{icon}</span>
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-bold text-white">{title}</span>
      <span className="mt-1 block text-[11px] text-slate-400">{description}</span>
    </span>
    {selected && <Check className="h-4 w-4 text-blue-300" />}
  </button>
);

const PasswordField: React.FC<{ label: string; value: string; onChange: (value: string) => void; show: boolean; placeholder: string }> = ({ label, value, onChange, show, placeholder }) => (
  <div>
    <label className="mb-1 block text-xs font-semibold text-slate-300">{label}</label>
    <div className="relative">
      <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
      <input type={show ? 'text' : 'password'} autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-700 bg-[#0F172A] py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-[#3B82F6]" />
    </div>
  </div>
);

export default SettingsView;
