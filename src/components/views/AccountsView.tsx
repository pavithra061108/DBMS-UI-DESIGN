import React from 'react';
import {
  Landmark,
  PlusCircle,
  MinusCircle,
  Send,
  CheckCircle2,
  TrendingUp,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  XCircle,
  CalendarDays,
  Building2,
} from 'lucide-react';
import { BankAccount, Transaction } from '../../types/bank';

interface AccountsViewProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  onOpenActionModal: (
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
  onOpenActionModal,
}) => {
  const [selectedAccount, setSelectedAccount] = React.useState<BankAccount | null>(null);

  const openAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    // The application content is inside a scrollable <main>, not the window.
    requestAnimationFrame(() => {
      const main = document.querySelector('main');
      if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const backToAccounts = () => {
    setSelectedAccount(null);
    requestAnimationFrame(() => {
      const main = document.querySelector('main');
      if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const accountTransactions = selectedAccount
    ? transactions.filter((transaction) =>
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
          Back to My Accounts
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
              <p className="mt-1 text-sm text-slate-300">Account holder: {acc.customerName}</p>
            </div>
            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase ${
                acc.status === 'Active'
                  ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                  : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> {acc.status}
            </span>
          </div>

          <div className="mt-7 rounded-2xl border border-slate-700 bg-gradient-to-br from-[#0F172A] to-slate-900 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Balance</p>
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
            <Detail label="Branch" value={acc.branch || 'Not available'} icon={<Building2 className="h-4 w-4" />} />
            <Detail label="Date Opened" value={acc.openedDate || 'Not available'} icon={<CalendarDays className="h-4 w-4" />} />
            <Detail label="Account Status" value={acc.status} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ActionButton
              label="Deposit"
              icon={<PlusCircle className="h-4 w-4" />}
              className="border-emerald-500/30 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white"
              onClick={() => onOpenActionModal('deposit', acc)}
            />
            <ActionButton
              label="Withdraw"
              icon={<MinusCircle className="h-4 w-4" />}
              className="border-rose-500/30 bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white"
              onClick={() => onOpenActionModal('withdraw', acc)}
            />
            <ActionButton
              label="Transfer"
              icon={<Send className="h-4 w-4" />}
              className="border-blue-500/30 bg-blue-500/15 text-blue-400 hover:bg-blue-500 hover:text-white"
              onClick={() => onOpenActionModal('transfer', acc)}
            />
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
              <p className="mt-1 text-sm text-slate-400">Transactions for this account will appear here.</p>
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
                      <td className="py-4 pl-2 font-mono font-semibold text-white">{tx.referenceNumber || tx.id}</td>
                      <td className="py-4 text-slate-200">{tx.type}</td>
                      <td className="py-4">
                        <p className="font-semibold text-white">{tx.senderName || '—'}</p>
                        <p className="mt-1 text-slate-400">→ {tx.receiverName || '—'}</p>
                      </td>
                      <td className="py-4 font-mono font-bold text-white">{money(tx.amount, tx.currency)}</td>
                      <td className="py-4 text-slate-300">{tx.date}</td>
                      <td className="py-4 pr-2">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold ${
                          tx.status === 'Completed'
                            ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                            : tx.status === 'Pending'
                            ? 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                            : 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                        }`}>
                          {tx.status === 'Completed' ? <CheckCircle2 className="h-3 w-3" /> : tx.status === 'Pending' ? <Clock className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
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
      <div className="rounded-3xl border border-slate-700/80 bg-[#1E293B] p-6 shadow-xl sm:p-8">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black text-white">
            <Landmark className="h-6 w-6 text-[#3B82F6]" /> Bank Account Records
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Select an account to open its complete details, balance, account actions, and transaction history.
          </p>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-3xl border border-slate-700 bg-[#1E293B] p-10 text-center text-slate-400">
          No bank accounts available.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              role="button"
              tabIndex={0}
              onClick={() => openAccount(acc)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openAccount(acc);
                }
              }}
              className="flex cursor-pointer flex-col justify-between rounded-3xl border border-slate-700/80 bg-[#1E293B] p-6 shadow-xl transition-all hover:-translate-y-1 hover:border-[#3B82F6]/70 hover:shadow-blue-950/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              aria-label={`Open details for ${acc.type} account ${acc.accountNumber}`}
            >
              <div>
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/20 px-3 py-1 text-xs font-bold text-[#60A5FA]">{acc.type}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                    acc.status === 'Active'
                      ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                      : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                  }`}>
                    <CheckCircle2 className="h-3 w-3" /> {acc.status}
                  </span>
                </div>
                <h3 className="mb-1 text-lg font-bold text-white">{acc.customerName}</h3>
                <p className="mb-4 font-mono text-xs text-slate-400">ID: {acc.id}</p>

                <div className="mb-5 space-y-2 rounded-2xl border border-slate-800 bg-[#0F172A] p-4">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">Account Number</span>
                    <span className="break-all font-mono text-sm font-extrabold tracking-wider text-white">{acc.accountNumber}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2">
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">IBAN Code</span>
                    <span className="break-all font-mono text-xs font-semibold text-[#60A5FA]">{acc.iban}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-xs font-semibold uppercase text-slate-400">Current Balance</span>
                  <p className="mt-0.5 font-mono-num text-2xl font-black text-emerald-400">{money(acc.balance, acc.currency)}</p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                    <TrendingUp className="h-3 w-3 text-emerald-400" /> Interest Rate: {acc.interestRate}% APY
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700/60 pt-4">
                <p className="text-center text-xs font-bold text-[#60A5FA]">View full account details →</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button type="button" onClick={(event) => { event.stopPropagation(); onOpenActionModal('deposit', acc); }} className="flex flex-col items-center justify-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-1 py-2 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500 hover:text-white" title="Deposit Funds">
                    <PlusCircle className="h-3.5 w-3.5" /><span>Deposit</span>
                  </button>
                  <button type="button" onClick={(event) => { event.stopPropagation(); onOpenActionModal('withdraw', acc); }} className="flex flex-col items-center justify-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-1 py-2 text-xs font-bold text-rose-400 transition hover:bg-rose-500 hover:text-white" title="Withdraw Funds">
                    <MinusCircle className="h-3.5 w-3.5" /><span>Withdraw</span>
                  </button>
                  <button type="button" onClick={(event) => { event.stopPropagation(); onOpenActionModal('transfer', acc); }} className="flex flex-col items-center justify-center gap-1 rounded-xl border border-blue-500/30 bg-blue-500/10 px-1 py-2 text-xs font-bold text-blue-400 transition hover:bg-blue-500 hover:text-white" title="Transfer Funds">
                    <Send className="h-3.5 w-3.5" /><span>Transfer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Detail: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="rounded-2xl border border-slate-700/80 bg-[#0F172A] p-4">
    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {icon} {label}
    </p>
    <p className="mt-2 break-all text-sm font-semibold text-white">{value}</p>
  </div>
);

const ActionButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  className: string;
  onClick: () => void;
}> = ({ label, icon, className, onClick }) => (
  <button type="button" onClick={onClick} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${className}`}>
    {icon} {label}
  </button>
);

export default AccountsView;
