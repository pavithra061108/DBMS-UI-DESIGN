import React from 'react';
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  Database,
  Download,
  Eye,
  ShieldAlert,
  Users,
  Wallet,
} from 'lucide-react';

type ApexAdminDashboardProps = {
  onShowToast?: (
    title: string,
    description: string,
    type?: 'success' | 'error' | 'warning' | 'info'
  ) => void;
  onSelectTab?: (tab: string) => void;
};

const stats = [
  { label: 'Total customers', value: '12,480', change: '+8.2%', icon: Users, tone: 'blue' },
  { label: 'Total deposits', value: '$8.42M', change: '+4.6%', icon: Wallet, tone: 'green' },
  { label: 'Transactions today', value: '2,845', change: '+12.4%', icon: CreditCard, tone: 'cyan' },
  { label: 'Pending approvals', value: '18', change: 'Needs review', icon: Clock3, tone: 'amber' },
  { label: 'Active branches', value: '24', change: 'All operational', icon: Building2, tone: 'violet' },
  { label: 'Security alerts', value: '3', change: 'Review required', icon: ShieldAlert, tone: 'rose' },
] as const;

const weeklyActivity = [
  { day: 'Mon', amount: 42 },
  { day: 'Tue', amount: 62 },
  { day: 'Wed', amount: 49 },
  { day: 'Thu', amount: 76 },
  { day: 'Fri', amount: 58 },
  { day: 'Sat', amount: 88 },
  { day: 'Sun', amount: 69 },
];

const transactions = [
  { id: 'TXN-1024', customer: 'Rahul Sharma', type: 'Deposit', time: '10:42 AM', amount: '+$12,000', status: 'Completed' },
  { id: 'TXN-1025', customer: 'Priya Reddy', type: 'Transfer', time: '10:28 AM', amount: '-$5,500', status: 'Pending' },
  { id: 'TXN-1026', customer: 'Arjun Kumar', type: 'Withdrawal', time: '10:16 AM', amount: '-$2,000', status: 'Completed' },
  { id: 'TXN-1027', customer: 'Sneha Rao', type: 'Payment', time: '09:54 AM', amount: '-$8,200', status: 'Flagged' },
];

const activity = [
  { title: 'New customer account created', detail: 'Customer onboarding · 4 min ago', tone: 'blue' },
  { title: 'Transaction flagged for review', detail: 'Risk monitoring · 18 min ago', tone: 'amber' },
  { title: 'Branch information updated', detail: 'Branch management · 32 min ago', tone: 'green' },
];

const toneClasses: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-300 border-blue-400/20',
  green: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20',
  cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-400/20',
  amber: 'bg-amber-500/10 text-amber-300 border-amber-400/20',
  violet: 'bg-violet-500/10 text-violet-300 border-violet-400/20',
  rose: 'bg-rose-500/10 text-rose-300 border-rose-400/20',
};

export default function ApexAdminDashboard({
  onShowToast,
  onSelectTab,
}: ApexAdminDashboardProps) {
  const goTo = (tab: string) => {
    if (onSelectTab) onSelectTab(tab);
    else onShowToast?.('Navigation', `Open ${tab.replaceAll('_', ' ')} from the sidebar.`, 'info');
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 text-slate-100">
      {/* Welcome and system status */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-700/70 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
            <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-2.5 py-1">Admin overview</span>
            <span className="text-slate-500">APEX BANK</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Good day, Administrator <span aria-hidden="true">👋</span></h1>
          <p className="mt-2 text-sm text-slate-400">Here’s an overview of today’s banking operations and system activity.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <div>
              <p className="text-xs font-semibold text-emerald-300">All systems operational</p>
              <p className="text-[11px] text-slate-400">Demo status</p>
            </div>
          </div>
          <button
            onClick={() => onShowToast?.('Report ready', 'The dashboard summary is ready to review. Connect a reporting API to export live data.', 'info')}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
          >
            <Download size={16} /> Export report
          </button>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-400">{item.label}</p>
                  <p className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">{item.value}</p>
                </div>
                <span className={`rounded-xl border p-3 ${toneClasses[item.tone]}`}>
                  <Icon size={20} />
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                {item.tone === 'amber' || item.tone === 'rose' ? (
                  <span className={`rounded-full px-2 py-1 ${toneClasses[item.tone]}`}>{item.change}</span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-400"><ArrowUpRight size={14} /> {item.change}</span>
                )}
                <span className="text-slate-500">vs. previous period</span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">Transaction activity</h2>
              <p className="mt-1 text-sm text-slate-400">Transaction volume over the last 7 days</p>
            </div>
            <span className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300">This week</span>
          </div>
          <div className="mt-6 flex h-48 items-end justify-between gap-3 border-b border-l border-slate-700/80 px-3 pb-0 pt-4 sm:h-56 sm:px-5">
            {weeklyActivity.map((item) => (
              <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    title={`${item.amount}% activity`}
                    className="w-full rounded-t-md bg-gradient-to-t from-blue-700 to-cyan-400 opacity-90 transition hover:opacity-100"
                    style={{ height: `${item.amount}%` }}
                  />
                </div>
                <span className="pb-2 text-[11px] text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400"><span className="h-2 w-2 rounded-full bg-cyan-400" /> Relative activity (illustrative demo data)</div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-white">Transaction distribution</h2>
          <p className="mt-1 text-sm text-slate-400">Breakdown by transaction type</p>
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row xl:flex-col 2xl:flex-row">
            <div className="relative h-40 w-40 shrink-0 rounded-full" style={{ background: 'conic-gradient(#3b82f6 0 36%, #10b981 36% 62%, #06b6d4 62% 82%, #f59e0b 82% 100%)' }}>
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-slate-900">
                <span className="text-2xl font-bold text-white">2,845</span>
                <span className="text-[11px] text-slate-400">Transactions</span>
              </div>
            </div>
            <div className="w-full space-y-3">
              {[['Deposits', '36%', '#3b82f6'], ['Withdrawals', '26%', '#10b981'], ['Transfers', '20%', '#06b6d4'], ['Payments', '18%', '#f59e0b']].map(([label, value, color]) => (
                <div key={label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-slate-300"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />{label}</span>
                  <span className="font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-5 text-xs text-slate-500">Illustrative figures — replace with live transaction aggregates.</p>
        </article>
      </section>

      {/* Transactions and activity */}
      <section className="grid grid-cols-1 gap-5 2xl:grid-cols-[1.5fr_1fr]">
        <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-5">
            <div>
              <h2 className="font-semibold text-white">Recent transactions</h2>
              <p className="mt-1 text-xs text-slate-400">Latest activity across the bank</p>
            </div>
            <button onClick={() => goTo('transaction_management')} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-blue-300 transition hover:border-blue-400/50 hover:bg-blue-500/10">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-800/50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3 font-medium">Transaction</th><th className="px-5 py-3 font-medium">Customer</th><th className="px-5 py-3 font-medium">Type</th><th className="px-5 py-3 font-medium">Amount</th><th className="px-5 py-3 font-medium">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="transition hover:bg-slate-800/30">
                    <td className="px-5 py-4"><span className="font-medium text-slate-200">{txn.id}</span><p className="mt-1 text-xs text-slate-500">{txn.time}</p></td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-300">{txn.customer}</td>
                    <td className="px-5 py-4 text-slate-400">{txn.type}</td>
                    <td className={`px-5 py-4 font-semibold ${txn.amount.startsWith('+') ? 'text-emerald-400' : 'text-slate-200'}`}>{txn.amount}</td>
                    <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${txn.status === 'Completed' ? 'bg-emerald-400/10 text-emerald-300' : txn.status === 'Pending' ? 'bg-amber-400/10 text-amber-300' : 'bg-rose-400/10 text-rose-300'}`}>{txn.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 border-t border-slate-800 px-5 py-3 text-xs text-slate-500"><Eye size={14} /> Sample transactions for interface preview</div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="font-semibold text-white">Recent admin activity</h2><p className="mt-1 text-xs text-slate-400">Important events and actions</p></div>
            <span className="rounded-lg bg-slate-800 p-2 text-slate-400"><Activity size={17} /></span>
          </div>
          <div className="mt-5 space-y-4">
            {activity.map((item, index) => (
              <div key={item.title} className="flex gap-3">
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${toneClasses[item.tone]}`}>
                  {index === 0 ? <Users size={16} /> : index === 1 ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
                </div>
                <div className="min-w-0 flex-1 border-b border-slate-800 pb-4 last:border-0">
                  <p className="text-sm font-medium text-slate-200">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-1 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 shrink-0 text-amber-300" size={18} />
              <div><p className="text-sm font-semibold text-amber-200">3 security alerts need review</p><p className="mt-1 text-xs leading-5 text-slate-400">Review flagged activity before taking action. Demo alert count.</p></div>
            </div>
            <button onClick={() => goTo('audit_logs')} className="mt-3 text-xs font-semibold text-amber-300 hover:text-amber-200">Review audit logs →</button>
          </div>
        </article>
      </section>

      {/* Quick actions and system health */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="font-semibold text-white">Quick actions</h2>
          <p className="mt-1 text-sm text-slate-400">Jump directly to common admin tasks.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { label: 'Customer management', detail: 'Review customer accounts', icon: Users, tab: 'customer_management' },
              { label: 'Transaction management', detail: 'Inspect recent activity', icon: CreditCard, tab: 'transaction_management' },
              { label: 'Branch management', detail: 'Manage branch records', icon: Building2, tab: 'branch_management' },
              { label: 'User & system admin', detail: 'Manage system users', icon: Database, tab: 'user_system_admin' },
            ].map((action) => {
              const Icon = action.icon;
              return <button key={action.tab} onClick={() => goTo(action.tab)} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-left transition hover:border-blue-500/40 hover:bg-blue-500/5">
                <span className="rounded-lg bg-blue-500/10 p-2.5 text-blue-300"><Icon size={18} /></span>
                <span><span className="block text-sm font-semibold text-slate-200">{action.label}</span><span className="mt-1 block text-xs text-slate-500">{action.detail}</span></span>
                <ArrowDownLeft className="ml-auto shrink-0 rotate-180 text-slate-600" size={16} />
              </button>;
            })}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="font-semibold text-white">System health</h2><p className="mt-1 text-sm text-slate-400">Example infrastructure indicators</p></div>
            <Database className="text-blue-300" size={20} />
          </div>
          <div className="mt-5 space-y-5">
            {[{ label: 'CPU utilization', value: 18.4, display: '18.4%', color: 'bg-blue-500' }, { label: 'Memory usage', value: 42.1, display: '42.1%', color: 'bg-emerald-500' }, { label: 'Database capacity', value: 64, display: '64%', color: 'bg-cyan-500' }].map((metric) => (
              <div key={metric.label}>
                <div className="mb-2 flex items-center justify-between text-sm"><span className="text-slate-400">{metric.label}</span><span className="font-semibold text-slate-200">{metric.display}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${metric.color}`} style={{ width: `${metric.value}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-300"><CheckCircle2 size={15} /> Demo indicators only — connect to real monitoring for production.</div>
        </article>
      </section>
      <p className="pb-2 text-center text-xs text-slate-600">APEX BANK · Administrator workspace · Dashboard metrics are illustrative demo data</p>
    </div>
  );
}
