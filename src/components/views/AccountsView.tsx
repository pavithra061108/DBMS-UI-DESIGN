import React from 'react';
import {
  Landmark,
  CheckCircle2,
  TrendingUp,
  ArrowLeft,
  Clock,
  XCircle,
  CalendarDays,
  Building2,
  Search,
  ShieldCheck,
  AlertTriangle,
  Snowflake,
  Eye,
} from 'lucide-react';
import { BankAccount, Transaction } from '../../types/bank';

interface AccountsViewProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  // Kept optional so existing App.tsx calls do not break.
  onOpenActionModal?: (
    action: 'deposit' | 'withdraw' | 'transfer',
    targetAccount?: BankAccount
  ) => void;
}

const money = (amount: number, currency = 'USD') =>
  `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  transactions,
}) => {
  const [selectedAccount, setSelectedAccount] =
    React.useState<BankAccount | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [typeFilter, setTypeFilter] = React.useState('All');

  const activeAccounts = accounts.filter(
    (account) => account.status.toLowerCase() === 'active'
  ).length;

  const frozenAccounts = accounts.filter(
    (account) => account.status.toLowerCase() === 'frozen'
  ).length;

  const pendingAccounts = accounts.filter(
    (account) => account.status.toLowerCase() === 'pending'
  ).length;

  const filteredAccounts = accounts.filter((account) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      account.customerName.toLowerCase().includes(search) ||
      account.accountNumber.toLowerCase().includes(search) ||
      account.id.toLowerCase().includes(search) ||
      account.iban.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === 'All' ||
      account.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesType =
      typeFilter === 'All' ||
      account.type.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  const scrollMainToTop = () => {
    requestAnimationFrame(() => {
      const main = document.querySelector('main');
      if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const openAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    scrollMainToTop();
  };

  const backToAccounts = () => {
    setSelectedAccount(null);
    scrollMainToTop();
  };

  const accountTransactions = selectedAccount
    ? transactions.filter(
        (transaction) =>
          transaction.senderIban === selectedAccount.iban ||
          transaction.receiverIban === selectedAccount.iban
      )
    : [];

  if (selectedAccount) {
    const acc = selectedAccount;

    return (
      <div className="space-y-6 font-sans">
        <button
          type="button"
          onClick={backToAccounts}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-[#3B82F6] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Account Records
        </button>

        <section className="rounded-3xl border border-slate-700/80 bg-[#1E293B] p-6 shadow-xl sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <span className="inline-flex rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/20 px-3 py-1 text-xs font-bold text-[#60A5FA]">
                {acc.type} Account
              </span>
              <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Account Details
              </h1>
              <p className="mt-1 text-sm text-slate-400">Account ID: {acc.id}</p>
              <p className="mt-1 text-sm text-slate-300">
                Account holder: {acc.customerName}
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase ${
                acc.status.toLowerCase() === 'active'
                  ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                  : acc.status.toLowerCase() === 'frozen'
                  ? 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                  : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {acc.status}
            </span>
          </div>

          <div className="mt-7 rounded-2xl border border-slate-700 bg-gradient-to-br from-[#0F172A] to-slate-900 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Current Balance
            </p>
            <p className="mt-2 break-words text-3xl font-black text-emerald-400 sm:text-5xl">
              {money(acc.balance, acc.currency)}
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Interest rate: {acc.interestRate}% APY
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Account Number" value={acc.accountNumber} />
            <Detail label="IBAN Code" value={acc.iban} />
            <Detail label="Account Type" value={acc.type} />
            <Detail
              label="Branch"
              value={acc.branch || 'Not available'}
              icon={<Building2 className="h-4 w-4" />}
            />
            <Detail
              label="Date Opened"
              value={acc.openedDate || 'Not available'}
              icon={<CalendarDays className="h-4 w-4" />}
            />
            <Detail label="Account Status" value={acc.status} />
          </div>

          <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
              <div>
                <p className="font-semibold text-white">Administrative account view</p>
                <p className="mt-1 text-sm text-slate-400">
                  This page is for reviewing account details and status. Deposits,
                  withdrawals, and transfers should be handled through authorized
                  transaction workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-700/80 bg-[#1E293B] p-5 shadow-xl sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white">Account Transaction History</h2>
            <p className="mt-1 text-xs text-slate-400">
              Transactions associated with this account's IBAN.
            </p>
          </div>

          {accountTransactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">
              <Landmark className="mx-auto h-8 w-8 text-slate-500" />
              <p className="mt-3 font-semibold text-slate-200">No transactions found</p>
              <p className="mt-1 text-sm text-slate-400">
                Transactions for this account will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pl-2">Reference</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Description / Parties</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {accountTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40">
                      <td className="py-4 pl-2 font-mono font-semibold text-white">
                        {tx.referenceNumber || tx.id}
                      </td>
                      <td className="py-4 text-slate-200">{tx.type}</td>
                      <td className="py-4">
                        <p className="font-semibold text-white">{tx.senderName || '—'}</p>
                        <p className="mt-1 text-slate-400">
                          → {tx.receiverName || '—'}
                        </p>
                      </td>
                      <td className="py-4 font-mono font-bold text-white">
                        {money(tx.amount, tx.currency)}
                      </td>
                      <td className="py-4 text-slate-300">{tx.date}</td>
                      <td className="py-4 pr-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold ${
                            tx.status === 'Completed'
                              ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                              : tx.status === 'Pending'
                              ? 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                              : 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                          }`}
                        >
                          {tx.status === 'Completed' ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : tx.status === 'Pending' ? (
                            <Clock className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <section className="rounded-3xl border border-slate-700/80 bg-[#1E293B] p-6 shadow-xl sm:p-8">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black text-white">
            <Landmark className="h-6 w-6 text-[#3B82F6]" />
            Account Management
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Review bank accounts, monitor account status, and inspect account activity.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Accounts"
          value={accounts.length}
          icon={<Landmark className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Active Accounts"
          value={activeAccounts}
          icon={<ShieldCheck className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Frozen Accounts"
          value={frozenAccounts}
          icon={<Snowflake className="h-5 w-5" />}
          color="red"
        />
        <StatCard
          title="Pending Accounts"
          value={pendingAccounts}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="amber"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-700 bg-[#1E293B] p-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search name, account ID, number, IBAN..."
            className="w-full rounded-xl border border-slate-700 bg-[#0F172A] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-700 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
        >
          <option value="All">All Account Statuses</option>
          <option value="Active">Active</option>
          <option value="Frozen">Frozen</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="rounded-xl border border-slate-700 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
        >
          <option value="All">All Account Types</option>
          <option value="Savings">Savings</option>
          <option value="Checking">Checking</option>
          <option value="Investment">Investment</option>
          <option value="Money Market">Money Market</option>
        </select>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-white">Bank Account Records</h2>
        <p className="text-sm text-slate-400">
          Showing {filteredAccounts.length} of {accounts.length} accounts
        </p>
      </div>

      {filteredAccounts.length === 0 ? (
        <div className="rounded-3xl border border-slate-700 bg-[#1E293B] p-10 text-center">
          <Landmark className="mx-auto h-10 w-10 text-slate-500" />
          <p className="mt-3 font-semibold text-white">No matching accounts found</p>
          <p className="mt-1 text-sm text-slate-400">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAccounts.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => openAccount(acc)}
              className="flex cursor-pointer flex-col justify-between rounded-3xl border border-slate-700/80 bg-[#1E293B] p-6 text-left shadow-xl transition-all hover:-translate-y-1 hover:border-[#3B82F6]/70 hover:shadow-blue-950/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              aria-label={`Open details for ${acc.type} account ${acc.accountNumber}`}
            >
              <div className="w-full">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/20 px-3 py-1 text-xs font-bold text-[#60A5FA]">
                    {acc.type}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                      acc.status.toLowerCase() === 'active'
                        ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                        : acc.status.toLowerCase() === 'frozen'
                        ? 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                        : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {acc.status}
                  </span>
                </div>

                <h3 className="mb-1 text-lg font-bold text-white">{acc.customerName}</h3>
                <p className="mb-4 font-mono text-xs text-slate-400">ID: {acc.id}</p>

                <div className="mb-5 space-y-2 rounded-2xl border border-slate-800 bg-[#0F172A] p-4">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">
                      Account Number
                    </span>
                    <span className="break-all font-mono text-sm font-extrabold tracking-wider text-white">
                      {acc.accountNumber}
                    </span>
                  </div>
                  <div className="border-t border-slate-800 pt-2">
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">
                      IBAN Code
                    </span>
                    <span className="break-all font-mono text-xs font-semibold text-[#60A5FA]">
                      {acc.iban}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-xs font-semibold uppercase text-slate-400">
                    Current Balance
                  </span>
                  <p className="mt-0.5 break-words font-mono-num text-2xl font-black text-emerald-400">
                    {money(acc.balance, acc.currency)}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    Interest Rate: {acc.interestRate}% APY
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center justify-between border-t border-slate-700/60 pt-4">
                <span className="text-xs font-bold text-[#60A5FA]">
                  View account details
                </span>
                <Eye className="h-4 w-4 text-[#60A5FA]" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'amber';
}> = ({ title, value, icon, color }) => {
  const colors = {
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    green: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    red: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-[#1E293B] p-5 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className={`rounded-xl border p-2 ${colors[color]}`}>{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-black text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
};

const Detail: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="rounded-2xl border border-slate-700/80 bg-[#0F172A] p-4">
    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {icon} {label}
    </p>
    <p className="mt-2 break-all text-sm font-semibold text-white">{value}</p>
  </div>
);

export default AccountsView;
