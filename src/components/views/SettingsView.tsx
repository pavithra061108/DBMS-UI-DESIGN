  import React, { useEffect, useMemo, useState } from 'react';
  import {
    Activity,
    Bell,
    Check,
    ChevronRight,
    Eye,
    LockKeyhole,
    Moon,
    Monitor,
    Palette,
    RotateCcw,
    Save,
    ShieldAlert,
    ShieldCheck,
    SlidersHorizontal,
    Sun,
    UserRound,
    Users,
    FileClock,
    ServerCog,
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
  type SettingsTab = 'general' | 'notifications' | 'privacy' | 'security' | 'overview' | 'system' | 'adminAlerts';

  interface Preferences {
    theme: ThemePreference;
    transactionAlerts: boolean;
    transferAlerts: boolean;
    loginAlerts: boolean;
    securityAlerts: boolean;
    accountUpdates: boolean;
    promotionalEmails: boolean;
    emailNotifications: boolean;
    maskAccountNumbers: boolean;
    hideBalances: boolean;
    compactTables: boolean;
    autoLockNotice: boolean;
    failedTransactionAlerts: boolean;
    roleChangeAlerts: boolean;
    systemHealthAlerts: boolean;
    auditAlerts: boolean;
  }

  const DEFAULT_PREFERENCES: Preferences = {
    theme: 'dark',
    transactionAlerts: true,
    transferAlerts: true,
    loginAlerts: true,
    securityAlerts: true,
    accountUpdates: true,
    promotionalEmails: false,
    emailNotifications: true,
    maskAccountNumbers: true,
    hideBalances: false,
    compactTables: false,
    autoLockNotice: true,
    failedTransactionAlerts: true,
    roleChangeAlerts: true,
    systemHealthAlerts: true,
    auditAlerts: true,
  };

  const settingsKey = (userId: string, isAdmin: boolean) =>
    `apex-bank-settings-${isAdmin ? 'admin' : 'customer'}-${userId}`;

  export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, onShowToast }) => {
    // The same component renders different settings for customers and admins.
    const isAdmin = String((currentUser as Customer & { role?: string }).role ?? '').toLowerCase() === 'admin';
    const [activeTab, setActiveTab] = useState<SettingsTab>(isAdmin ? 'overview' : 'general');
    const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
    const [savedPreferences, setSavedPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      const defaultTab: SettingsTab = isAdmin ? 'overview' : 'general';
      setActiveTab(defaultTab);
      let loaded = DEFAULT_PREFERENCES;
      try {
        const stored = localStorage.getItem(settingsKey(String(currentUser.id), isAdmin));
        if (stored) loaded = { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      } catch {
        loaded = DEFAULT_PREFERENCES;
      }
      setPreferences(loaded);
      setSavedPreferences(loaded);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, [currentUser.id, isAdmin]);

    const hasUnsavedChanges = JSON.stringify(preferences) !== JSON.stringify(savedPreferences);
    const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
      setPreferences((previous) => ({ ...previous, [key]: value }));

    const savePreferences = () => {
      setSaving(true);
      try {
        localStorage.setItem(settingsKey(String(currentUser.id), isAdmin), JSON.stringify(preferences));
        setSavedPreferences(preferences);
        onShowToast('Settings saved', 'Your preferences have been saved in this browser.', 'success');
      } catch {
        onShowToast('Could not save settings', 'Your browser could not save these preferences.', 'error');
      } finally {
        window.setTimeout(() => setSaving(false), 250);
      }
    };

    const resetPreferences = () => {
      setPreferences(DEFAULT_PREFERENCES);
      try {
        localStorage.setItem(settingsKey(String(currentUser.id), isAdmin), JSON.stringify(DEFAULT_PREFERENCES));
        setSavedPreferences(DEFAULT_PREFERENCES);
        onShowToast('Preferences reset', 'Default settings have been restored.', 'info');
      } catch {
        onShowToast('Reset not saved', 'Defaults were applied for this session but could not be stored.', 'warning');
      }
    };

    const handlePasswordUpdate = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!currentPassword.trim()) return onShowToast('Current password required', 'Enter your current password to continue.', 'error');
      if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        return onShowToast('Choose a stronger password', 'Use at least 8 characters, including a letter and a number.', 'error');
      }
      if (newPassword !== confirmPassword) return onShowToast('Passwords do not match', 'Enter the same new password in both fields.', 'error');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onShowToast('Demo form validated', 'This form does not change a real password; connect a secure authentication backend for that.', 'info');
    };

    const tabs = useMemo(() => isAdmin ? [
      { id: 'overview' as const, label: 'Admin overview', description: 'Profile and admin workspace', icon: <UserRound className="h-4 w-4" /> },
      { id: 'system' as const, label: 'System preferences', description: 'Tables and access guidance', icon: <ServerCog className="h-4 w-4" /> },
      { id: 'adminAlerts' as const, label: 'Admin alerts', description: 'Operational notifications', icon: <ShieldAlert className="h-4 w-4" /> },
      { id: 'security' as const, label: 'Security', description: 'Password and sessions', icon: <ShieldCheck className="h-4 w-4" /> },
      { id: 'general' as const, label: 'Appearance', description: 'Display preferences', icon: <Palette className="h-4 w-4" /> },
    ] : [
      { id: 'general' as const, label: 'General', description: 'Appearance and display', icon: <SlidersHorizontal className="h-4 w-4" /> },
      { id: 'notifications' as const, label: 'Notifications', description: 'Transaction and account alerts', icon: <Bell className="h-4 w-4" /> },
      { id: 'privacy' as const, label: 'Privacy', description: 'Sensitive information', icon: <Eye className="h-4 w-4" /> },
      { id: 'security' as const, label: 'Security', description: 'Password and protection', icon: <ShieldCheck className="h-4 w-4" /> },
    ], [isAdmin]);

    return (
      <div className="space-y-6 font-sans text-white">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
              {isAdmin ? <ShieldCheck className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
              {isAdmin ? 'Administrator control centre' : 'Account control centre'}
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Settings</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              {isAdmin
                ? 'Configure admin preferences, operational alerts, and security settings.'
                : 'Personalize your APEX BANK experience, manage alerts, and review privacy preferences.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs ${hasUnsavedChanges ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${hasUnsavedChanges ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
            </span>
            <button type="button" onClick={resetPreferences} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white">
              <RotateCcw className="h-3.5 w-3.5" /> Reset defaults
            </button>
            <button type="button" onClick={savePreferences} disabled={!hasUnsavedChanges || saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
              <Save className="h-3.5 w-3.5" /> {saving ? 'Saving...' : 'Save settings'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-800 bg-[#151515] p-3">
            <div className="px-3 pb-3 pt-2"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{isAdmin ? 'Administrator settings' : 'Preferences'}</p></div>
            <nav className="space-y-1" aria-label="Settings sections">
              {tabs.map((tab) => (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${activeTab === tab.id ? 'border border-blue-500/20 bg-blue-600/15 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  <span className={`rounded-lg p-2 ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{tab.icon}</span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{tab.label}</span><span className="mt-0.5 block text-[11px] text-slate-500">{tab.description}</span></span>
                  <ChevronRight className={`h-4 w-4 ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </nav>
            <div className="mt-4 rounded-xl border border-slate-800 bg-[#0B0B0B] p-4">
              <div className="flex items-center gap-2 text-emerald-400"><ShieldCheck className="h-4 w-4" /><span className="text-xs font-semibold">{isAdmin ? 'Admin workspace' : 'Privacy first'}</span></div>
              <p className="mt-2 text-xs leading-5 text-slate-500">Preferences are stored locally in this browser for this demo account.</p>
            </div>
          </aside>

          <main className="min-w-0 space-y-5">
            {activeTab === 'overview' && isAdmin && <>
              <SectionCard icon={<UserRound className="h-5 w-5" />} title="Administrator profile" subtitle="Information about the currently signed-in administrator." >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-500/25 bg-violet-500/10 text-lg font-bold text-violet-300">{(currentUser.name || 'Admin').split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div>
                  <div className="min-w-0 flex-1"><p className="text-base font-bold text-white">{currentUser.name}</p><p className="mt-1 break-all text-sm text-slate-400">{currentUser.email || 'Email not provided'}</p><p className="mt-2 text-xs text-slate-500">Account ID: {currentUser.id}</p></div>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300"><ShieldCheck className="h-3.5 w-3.5" /> Administrator</span>
                </div>
              </SectionCard>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoCard icon={<Users className="h-5 w-5" />} title="User administration" description="Manage users and role assignments from the relevant admin page." />
                <InfoCard icon={<FileClock className="h-5 w-5" />} title="Audit & access review" description="Review administrative activity when audit logging is connected." />
                <InfoCard icon={<Activity className="h-5 w-5" />} title="System health" description="Operational monitoring must be connected to show live system status." />
                <InfoCard icon={<ShieldAlert className="h-5 w-5" />} title="Risk alerts" description="Choose which operational events should notify administrators." />
              </div>
              <Notice>These are informational cards. Use the sidebar to navigate to the relevant admin pages.</Notice>
            </>}

            {activeTab === 'general' && <>
              <SectionCard icon={<Palette className="h-5 w-5" />} title="Appearance" subtitle="Choose how APEX BANK looks on this device.">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <ThemeOption title="Dark mode" description="Comfortable low-light interface" icon={<Moon className="h-5 w-5" />} selected={preferences.theme === 'dark'} onClick={() => updatePreference('theme', 'dark')} />
                  <ThemeOption title="Light mode" description="Bright interface" icon={<Sun className="h-5 w-5" />} selected={preferences.theme === 'light'} onClick={() => updatePreference('theme', 'light')} />
                  <ThemeOption title="System default" description="Follow device preference" icon={<Monitor className="h-5 w-5" />} selected={preferences.theme === 'system'} onClick={() => updatePreference('theme', 'system')} />
                </div>
                <Notice>Theme choice is saved as a preference. Applying it across the entire application requires connecting this setting to your app theme.</Notice>
              </SectionCard>
              {isAdmin && <SectionCard icon={<SlidersHorizontal className="h-5 w-5" />} title="Display preferences" subtitle="Set how data-heavy admin pages should appear.">
                <ToggleRow label="Compact tables" description="Prefer denser tables on pages that support this setting." checked={preferences.compactTables} onChange={(value) => updatePreference('compactTables', value)} />
                <ToggleRow label="Mask account numbers" description="Prefer hiding account digits except the last four where supported." checked={preferences.maskAccountNumbers} onChange={(value) => updatePreference('maskAccountNumbers', value)} />
              </SectionCard>}
            </>}

            {activeTab === 'notifications' && !isAdmin && <SectionCard icon={<Bell className="h-5 w-5" />} title="Notifications" subtitle="Choose which account updates you want to receive.">
              <ToggleRow label="Transaction alerts" description="Notify me when money enters or leaves my account." checked={preferences.transactionAlerts} onChange={(value) => updatePreference('transactionAlerts', value)} />
              <ToggleRow label="Transfer alerts" description="Notify me about transfers and payment activity." checked={preferences.transferAlerts} onChange={(value) => updatePreference('transferAlerts', value)} />
              <ToggleRow label="Login alerts" description="Notify me when a new sign-in is detected." checked={preferences.loginAlerts} onChange={(value) => updatePreference('loginAlerts', value)} />
              <ToggleRow label="Security alerts" description="Notify me about important security-related events." checked={preferences.securityAlerts} onChange={(value) => updatePreference('securityAlerts', value)} />
              <ToggleRow label="Account updates" description="Receive important information about my account." checked={preferences.accountUpdates} onChange={(value) => updatePreference('accountUpdates', value)} />
              <ToggleRow label="Email notifications" description="Allow account notifications to be sent by email when email delivery is configured." checked={preferences.emailNotifications} onChange={(value) => updatePreference('emailNotifications', value)} />
              <ToggleRow label="Promotional emails" description="Receive product news and promotional updates." checked={preferences.promotionalEmails} onChange={(value) => updatePreference('promotionalEmails', value)} />
            </SectionCard>}

            {activeTab === 'adminAlerts' && isAdmin && <SectionCard icon={<ShieldAlert className="h-5 w-5" />} title="Administrator alerts" subtitle="Select operational events to flag in the admin experience.">
              <ToggleRow label="Failed transaction alerts" description="Flag failed or repeatedly rejected transactions where monitoring is integrated." checked={preferences.failedTransactionAlerts} onChange={(value) => updatePreference('failedTransactionAlerts', value)} />
              <ToggleRow label="Role change alerts" description="Flag user-role changes for administrative review." checked={preferences.roleChangeAlerts} onChange={(value) => updatePreference('roleChangeAlerts', value)} />
              <ToggleRow label="System health alerts" description="Flag service health issues when monitoring is connected." checked={preferences.systemHealthAlerts} onChange={(value) => updatePreference('systemHealthAlerts', value)} />
              <ToggleRow label="Audit alerts" description="Flag security-sensitive events when audit logs are connected." checked={preferences.auditAlerts} onChange={(value) => updatePreference('auditAlerts', value)} />
              <Notice>These preferences are stored locally. They do not send real notifications until connected to backend services.</Notice>
            </SectionCard>}

            {activeTab === 'system' && isAdmin && <>
              <SectionCard icon={<ServerCog className="h-5 w-5" />} title="System preferences" subtitle="Set display preferences for administrative workflows.">
                <ToggleRow label="Mask account numbers" description="Prefer hiding account digits except the last four where supported." checked={preferences.maskAccountNumbers} onChange={(value) => updatePreference('maskAccountNumbers', value)} />
                <ToggleRow label="Compact data tables" description="Use a denser layout on tables that support this preference." checked={preferences.compactTables} onChange={(value) => updatePreference('compactTables', value)} />
                <ToggleRow label="Show auto-lock guidance" description="Show session timeout guidance where supported." checked={preferences.autoLockNotice} onChange={(value) => updatePreference('autoLockNotice', value)} />
              </SectionCard>
              <SectionCard icon={<ShieldCheck className="h-5 w-5" />} title="Access governance" subtitle="Security practices for administrative actions.">
                <InfoLine title="Role changes" description="Restrict role assignment to authorized administrators and record changes in server-side audit logs." />
                <InfoLine title="Account deactivation" description="Require confirmation and record who made each change and when." />
                <InfoLine title="Sensitive data" description="Use least-privilege access and mask account details unless required for an authorized task." />
              </SectionCard>
            </>}

            {activeTab === 'privacy' && !isAdmin && <SectionCard icon={<Eye className="h-5 w-5" />} title="Privacy preferences" subtitle="Choose how sensitive information should be displayed.">
              <ToggleRow label="Hide account balances" description="Save your preference to hide balances on pages that support it." checked={preferences.hideBalances} onChange={(value) => updatePreference('hideBalances', value)} />
              <ToggleRow label="Mask account numbers" description="Prefer showing only the last four digits where account masking is implemented." checked={preferences.maskAccountNumbers} onChange={(value) => updatePreference('maskAccountNumbers', value)} />
              <Notice>These are display preferences only. Actual data access must be protected by backend authorization.</Notice>
            </SectionCard>}

            {activeTab === 'security' && <>
              <SectionCard icon={<LockKeyhole className="h-5 w-5" />} title="Password & security" subtitle="Validate the password-change form for this demo.">
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <PasswordInput label="Current password" value={currentPassword} onChange={setCurrentPassword} show={showPasswords} placeholder="Enter current password" />
                    <PasswordInput label="New password" value={newPassword} onChange={setNewPassword} show={showPasswords} placeholder="At least 8 characters, letter + number" />
                    <PasswordInput label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} show={showPasswords} placeholder="Re-enter new password" />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button type="button" onClick={() => setShowPasswords((show) => !show)} className="text-xs font-semibold text-slate-300 hover:text-white">{showPasswords ? 'Hide passwords' : 'Show passwords'}</button>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-white transition hover:bg-emerald-600"><ShieldCheck className="h-4 w-4" /> Validate password form</button>
                  </div>
                </form>
                <Notice tone="amber">Demo limitation: this form does not change a real password. Real password changes must be handled by your authentication backend.</Notice>
              </SectionCard>
              {isAdmin && <SectionCard icon={<Activity className="h-5 w-5" />} title="Session & access" subtitle="Security controls for a production application.">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><InfoStat label="Session status" value="Authenticated demo session" /><InfoStat label="Device" value="Current browser" /></div>
                <p className="mt-4 text-xs leading-5 text-slate-500">Multi-factor authentication, session revocation, and trusted-device management require backend support.</p>
              </SectionCard>}
            </>}
          </main>
        </div>
      </div>
    );
  };

  const SectionCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }> = ({ icon, title, subtitle, children }) => (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#151515]">
      <div className="flex items-start gap-3 border-b border-slate-800 px-5 py-4 sm:px-6"><span className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5 text-blue-400">{icon}</span><div><h2 className="text-sm font-bold text-white">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-400">{subtitle}</p></div></div>
      <div className="space-y-4 p-5 sm:p-6">{children}</div>
    </section>
  );

  const ToggleRow: React.FC<{ label: string; description: string; checked: boolean; onChange: (value: boolean) => void }> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-4 last:border-0 last:pb-0"><div className="min-w-0"><p className="text-sm font-semibold text-slate-200">{label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div><button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${checked ? 'left-6' : 'left-1'}`} /></button></div>
  );

  const ThemeOption: React.FC<{ title: string; description: string; icon: React.ReactNode; selected: boolean; onClick: () => void }> = ({ title, description, icon, selected, onClick }) => (
    <button type="button" onClick={onClick} className={`rounded-xl border p-4 text-left transition ${selected ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-800 bg-[#0D0D0D] hover:border-slate-700'}`}><div className="flex items-center justify-between"><span className={selected ? 'text-blue-400' : 'text-slate-400'}>{icon}</span>{selected && <Check className="h-4 w-4 text-blue-400" />}</div><p className="mt-4 text-sm font-bold text-white">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></button>
  );

  const PasswordInput: React.FC<{ label: string; value: string; onChange: (value: string) => void; show: boolean; placeholder: string }> = ({ label, value, onChange, show, placeholder }) => (
    <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-300">{label}</span><input type={show ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete="off" className="w-full rounded-xl border border-slate-700 bg-[#0B0B0B] px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500" /></label>
  );

  const InfoCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="rounded-2xl border border-slate-800 bg-[#151515] p-5"><div className="mb-3 inline-flex rounded-xl bg-blue-500/10 p-2.5 text-blue-400">{icon}</div><h3 className="text-sm font-bold text-white">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-400">{description}</p></div>
  );

  const InfoLine: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="flex gap-3 rounded-xl border border-slate-800 bg-[#0D0D0D] p-4"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><div><p className="text-xs font-semibold text-slate-200">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div></div>
  );

  const InfoStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="rounded-xl border border-slate-800 bg-[#0D0D0D] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 text-sm font-semibold text-slate-200">{value}</p></div>
  );

  const Notice: React.FC<{ children: React.ReactNode; tone?: 'blue' | 'amber' }> = ({ children, tone = 'blue' }) => (
    <div className={`rounded-xl border px-4 py-3 text-xs leading-5 ${tone === 'amber' ? 'border-amber-500/20 bg-amber-500/5 text-amber-200/80' : 'border-blue-500/20 bg-blue-500/5 text-slate-400'}`}>{children}</div>
  );
