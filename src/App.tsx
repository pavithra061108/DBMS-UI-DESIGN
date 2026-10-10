import React, { useState } from 'react';
import {
  Customer,
  BankAccount,
  Transaction,
  SystemNotification,
  ToastMessage,
  NavigationTab,
  PublicPage,
  UserRole,
  LoanApplication,
} from './types/bank';
import {
  INITIAL_CUSTOMERS,
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_LOANS,
} from './data/mockData';

// Layout & Global Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { NotificationModal } from './components/NotificationModal';
import { ActionModal } from './components/modals/ActionModal';

// Public & Common Views
import { LandingView } from './components/views/LandingView';
import { AboutView } from './components/views/AboutView';
import { ContactView } from './components/views/ContactView';
import { LoginView } from './components/views/LoginView';
import { RegisterView } from './components/views/RegisterView';
import { DashboardView } from './components/views/DashboardView';
import { CustomersView } from './components/views/CustomersView';
import { AccountsView } from './components/views/AccountsView';
import { TransactionsView } from './components/views/TransactionsView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';
import { AccessDeniedView } from './components/views/AccessDeniedView';

// Role-Specific Concept Views
import {
  BalanceOverviewView,
  AtomicTransferView,
  AccountStatementView,
} from './components/views/CustomerViews';
import { LoanStatusView } from './components/views/LoanStatusView';
import {
  TellerDashboardView,
  TellerDepositView,
  TellerWithdrawalView,
  TellerDailySummaryView,
  ChequeClearingView,
} from './components/views/TellerViews';
import {
  ManagerDashboardView,
  BranchLiquidityView,
  LoanManagementView,
  BranchMetricsView,
  ManagerReportsView,
} from './components/views/ManagerViews';
import {
  AdminDashboardView,
  UserManagementView,
  RoleManagementView,
  AuditLogsView,
  DatabaseHealthView,
  DatabaseBackupView,
} from './components/views/AdminViews';

export function App() {
  // Authentication & Public Pages State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [publicPage, setPublicPage] = useState<PublicPage>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Entities Data State
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [loans, setLoans] = useState<LoanApplication[]>(INITIAL_LOANS);

  // Current User
  const [currentUser, setCurrentUser] = useState<Customer>(INITIAL_CUSTOMERS[0]);

  // UI Modals State
  const [notifModalOpen, setNotifModalOpen] = useState<boolean>(false);
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'deposit' | 'withdraw' | 'transfer';
    targetAccount?: BankAccount;
  }>({
    isOpen: false,
    type: 'deposit',
  });

  // Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const showToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      description,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Handlers
  const handleLoginSuccess = (emailOrUsername: string, role: UserRole) => {
    setCurrentRole(role);

    // Pick appropriate demo user profile
    let matchedUser = customers.find(
      (c) =>
        c.email.toLowerCase() === emailOrUsername.toLowerCase() ||
        c.username.toLowerCase() === emailOrUsername.toLowerCase()
    );

    if (!matchedUser) {
      if (role === 'teller') {
        matchedUser = {
          id: 'TELLER-01',
          name: 'David Miller',
          username: 'teller_david',
          email: 'd.miller@apexbank.com',
          phone: '+1 (555) 301-4491',
          address: '458 Branch Plaza, NY',
          accountNumber: 'TEL-8801',
          accountType: 'Savings',
          branch: 'Main Financial Hub',
          status: 'Verified',
          totalBalance: 0,
          creditScore: 820,
          joinedDate: '2021-03-15',
          role: 'teller',
        };
      } else if (role === 'manager') {
        matchedUser = {
          id: 'MGR-01',
          name: 'Sarah Jenkins',
          username: 'mgr_sarah',
          email: 's.jenkins@apexbank.com',
          phone: '+1 (555) 902-1182',
          address: '700 Wall St Executive Suite, NY',
          accountNumber: 'MGR-9901',
          accountType: 'Checking',
          branch: 'Main Financial Hub',
          status: 'Verified',
          totalBalance: 0,
          creditScore: 850,
          joinedDate: '2018-06-01',
          role: 'manager',
        };
      } else if (role === 'admin') {
        matchedUser = {
          id: 'DBA-01',
          name: 'Alexander Vance',
          username: 'dba_root',
          email: 'a.vance@apexbank.com',
          phone: '+1 (555) 000-1337',
          address: 'Data Center HQ, Cluster 01',
          accountNumber: 'ADM-0001',
          accountType: 'Checking',
          branch: 'System Core Node',
          status: 'Verified',
          totalBalance: 0,
          creditScore: 850,
          joinedDate: '2015-01-01',
          role: 'admin',
        };
      } else {
        matchedUser = customers[0];
      }
    } else {
      matchedUser = { ...matchedUser, role };
    }

    setCurrentUser(matchedUser);
    setIsAuthenticated(true);

    if (role === 'teller') setCurrentTab('teller_dashboard');
    else if (role === 'manager') setCurrentTab('manager_dashboard');
    else if (role === 'admin') setCurrentTab('admin_dashboard');
    else setCurrentTab('dashboard');

    showToast(
      'Session Authorized',
      `Authenticated as ${matchedUser.name} [${role.toUpperCase()}].`,
      'success'
    );
  };

  const handleRegisterSuccess = (newUserData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    username: string;
  }) => {
    const newAccNum = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
      1000 + Math.random() * 9000
    )}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCustomer: Customer = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newUserData.fullName,
      username: newUserData.username,
      phone: newUserData.phone,
      email: newUserData.email,
      address: newUserData.address,
      accountNumber: newAccNum,
      accountType: 'Savings',
      branch: 'Main Financial Hub',
      status: 'Verified',
      totalBalance: 10000,
      creditScore: 750,
      joinedDate: new Date().toISOString().split('T')[0],
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    };

    const newBankAccount: BankAccount = {
      id: `ACC-${Math.floor(1000 + Math.random() * 9000)}`,
      accountNumber: newAccNum,
      iban: `US${Math.floor(10 + Math.random() * 89)}APEX${Math.floor(
        100000000000 + Math.random() * 899999999999
      )}`,
      customerName: newUserData.fullName,
      type: 'Savings',
      balance: 10000,
      currency: 'USD',
      interestRate: 3.5,
      status: 'Active',
      branch: 'Main Financial Hub',
      openedDate: new Date().toISOString().split('T')[0],
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setAccounts((prev) => [newBankAccount, ...prev]);

    setCurrentUser(newCustomer);
    setCurrentRole('customer');
    setIsAuthenticated(true);
    setCurrentTab('dashboard');

    showToast(
      'Account Created',
      `Welcome to Apex Bank! Account #${newAccNum} initialized with $10,000 USD.`,
      'success'
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPublicPage('landing');
    showToast('Logged Out', 'You have been securely signed out of your account.', 'info');
  };

  // Role Switcher Handler inside App
  const handleSwitchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);

    let matchedUser = customers[0];
    if (newRole === 'teller') {
      matchedUser = {
        id: 'TELLER-01',
        name: 'David Miller',
        username: 'teller_david',
        email: 'd.miller@apexbank.com',
        phone: '+1 (555) 301-4491',
        address: '458 Branch Plaza, NY',
        accountNumber: 'TEL-8801',
        accountType: 'Savings',
        branch: 'Main Financial Hub',
        status: 'Verified',
        totalBalance: 0,
        creditScore: 820,
        joinedDate: '2021-03-15',
        role: 'teller',
      };
      setCurrentTab('teller_dashboard');
    } else if (newRole === 'manager') {
      matchedUser = {
        id: 'MGR-01',
        name: 'Sarah Jenkins',
        username: 'mgr_sarah',
        email: 's.jenkins@apexbank.com',
        phone: '+1 (555) 902-1182',
        address: '700 Wall St Executive Suite, NY',
        accountNumber: 'MGR-9901',
        accountType: 'Checking',
        branch: 'Main Financial Hub',
        status: 'Verified',
        totalBalance: 0,
        creditScore: 850,
        joinedDate: '2018-06-01',
        role: 'manager',
      };
      setCurrentTab('manager_dashboard');
    } else if (newRole === 'admin') {
      matchedUser = {
        id: 'DBA-01',
        name: 'Alexander Vance',
        username: 'dba_root',
        email: 'a.vance@apexbank.com',
        phone: '+1 (555) 000-1337',
        address: 'Data Center HQ, Cluster 01',
        accountNumber: 'ADM-0001',
        accountType: 'Checking',
        branch: 'System Core Node',
        status: 'Verified',
        totalBalance: 0,
        creditScore: 850,
        joinedDate: '2015-01-01',
        role: 'admin',
      };
      setCurrentTab('admin_dashboard');
    } else {
      setCurrentTab('dashboard');
    }

    setCurrentUser(matchedUser);
    showToast(
      'Role Scope Changed',
      `Switched to ${newRole.toUpperCase()} mode. Access controls adjusted.`,
      'info'
    );
  };

  // Deposit, Withdraw & Transfer Actions Handler
  const handleActionSubmit = (data: {
    type: 'deposit' | 'withdraw' | 'transfer';
    accountId: string;
    amount: number;
    receiverName?: string;
    receiverIban?: string;
  }) => {
    const accountIndex = accounts.findIndex((a) => a.id === data.accountId);
    if (accountIndex === -1) return;

    const targetAcc = accounts[accountIndex];
    let newBalance = targetAcc.balance;

    if (data.type === 'deposit') {
      newBalance += data.amount;
    } else {
      newBalance -= data.amount;
    }

    const updatedAccounts = [...accounts];
    updatedAccounts[accountIndex] = {
      ...targetAcc,
      balance: newBalance,
    };
    setAccounts(updatedAccounts);

    const updatedCustomers = customers.map((c) => {
      if (c.name === targetAcc.customerName) {
        return {
          ...c,
          totalBalance: Math.max(0, c.totalBalance + (data.type === 'deposit' ? data.amount : -data.amount)),
        };
      }
      return c;
    });
    setCustomers(updatedCustomers);

    if (currentUser.name === targetAcc.customerName) {
      setCurrentUser((prev) => ({
        ...prev,
        totalBalance: Math.max(0, prev.totalBalance + (data.type === 'deposit' ? data.amount : -data.amount)),
      }));
    }

    const txnType =
      data.type === 'deposit'
        ? 'Deposit'
        : data.type === 'withdraw'
        ? 'Withdrawal'
        : 'Transfer';

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 89999)}`,
      referenceNumber: `TXN-2026-${Math.floor(100000 + Math.random() * 899999)}`,
      senderName: targetAcc.customerName,
      senderIban: targetAcc.iban,
      receiverName: data.type === 'transfer' ? data.receiverName || 'External Receiver' : targetAcc.customerName,
      receiverIban: data.type === 'transfer' ? data.receiverIban || 'US00EXT102930101' : targetAcc.iban,
      amount: data.amount,
      currency: targetAcc.currency,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: txnType as any,
      status: 'Completed',
      branch: targetAcc.branch,
      category: txnType,
      fee: data.type === 'transfer' ? 15 : 0,
    };

    setTransactions((prev) => [newTxn, ...prev]);

    const newNotif: SystemNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `${txnType} Processed`,
      message: `${txnType} of $${data.amount.toLocaleString()} USD completed successfully.`,
      timestamp: 'Just now',
      type: 'success',
      read: false,
      category: txnType,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      'Transaction Completed',
      `${txnType} of $${data.amount.toLocaleString()} ${targetAcc.currency} processed successfully.`,
      'success'
    );

    setActionModal({ isOpen: false, type: 'deposit' });
  };

  const handleProcessDeposit = (accountId: string, amount: number) => {
    handleActionSubmit({ type: 'deposit', accountId, amount });
  };

  const handleProcessWithdrawal = (accountId: string, amount: number) => {
    handleActionSubmit({ type: 'withdraw', accountId, amount });
  };

  const handleApplyLoan = (newLoanData: Partial<LoanApplication>) => {
    const newLoan: LoanApplication = {
      id: `LOAN-${Math.floor(7000 + Math.random() * 2999)}`,
      customerName: newLoanData.customerName || currentUser.name,
      customerId: newLoanData.customerId || currentUser.id,
      loanType: newLoanData.loanType || 'Personal Loan',
      amount: newLoanData.amount || 50000,
      interestRate: newLoanData.interestRate || 6.5,
      termMonths: newLoanData.termMonths || 48,
      emi: newLoanData.emi || 1200,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      creditScore: currentUser.creditScore || 800,
    };
    setLoans((prev) => [newLoan, ...prev]);
  };

  const handleUpdateLoanStatus = (loanId: string, status: 'Approved' | 'Rejected', reason?: string) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status, reason: reason || l.reason } : l))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleUpdateCustomer = (updated: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  // Helper to check role permission for current tab
  const isTabAllowed = (role: UserRole, tab: string): boolean => {
    const allowedMap: Record<UserRole, string[]> = {
      customer: [
        'customer_dashboard',
        'dashboard',
        'my_accounts',
        'accounts',
        'balance_overview',
        'money_transfer',
        'transaction_history',
        'transactions',
        'account_statement',
        'loan_status',
        'notifications',
        'profile',
        'settings',
      ],
      teller: [
        'teller_dashboard',
        'dashboard',
        'customer_search',
        'customers',
        'deposit',
        'withdrawal',
        'cheque_clearing',
        'transaction_queue',
        'daily_transactions',
        'notifications',
        'settings',
        'profile',
      ],
      manager: [
        'manager_dashboard',
        'dashboard',
        'branch_liquidity',
        'loan_approval',
        'branch_metrics',
        'manager_reports',
        'notifications',
        'settings',
        'profile',
      ],
      admin: [
        'admin_dashboard',
        'dashboard',
        'user_management',
        'customers',
        'role_management',
        'audit_logs',
        'database_health',
        'database_backup',
        'notifications',
        'settings',
        'profile',
      ],
    };

    return allowedMap[role]?.includes(tab) ?? false;
  };

  // --- UNAUTHENTICATED RENDER ---
  if (!isAuthenticated) {
    return (
      <div className="bg-[#0B0B0B] min-h-screen text-white font-sans">
        {publicPage === 'landing' && (
          <LandingView
            onNavigateLogin={() => setPublicPage('login')}
            onNavigatePage={setPublicPage}
          />
        )}

        {publicPage === 'about' && (
          <AboutView
            onNavigateLogin={() => setPublicPage('login')}
            onNavigatePage={setPublicPage}
          />
        )}

        {publicPage === 'contact' && (
          <ContactView
            onNavigateLogin={() => setPublicPage('login')}
            onNavigatePage={setPublicPage}
          />
        )}

        {publicPage === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onNavigateRegister={() => setPublicPage('register')}
            onNavigateLanding={() => setPublicPage('landing')}
          />
        )}

        {publicPage === 'register' && (
          <RegisterView
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateLogin={() => setPublicPage('login')}
            onNavigateLanding={() => setPublicPage('landing')}
          />
        )}

        {/* Global Toast Alerts */}
        <Toast toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // --- AUTHENTICATED SYSTEM RENDER ---
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen bg-[#0B0B0B] text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentRole={currentRole}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <Header
          currentRole={currentRole}
          currentUser={currentUser}
          unreadNotifCount={unreadNotifCount}
          onOpenNotifications={() => setNotifModalOpen(true)}
          onOpenQuickAction={(action) => setActionModal({ isOpen: true, type: action })}
          onSelectTab={setCurrentTab}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        />

        {/* View Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {!isTabAllowed(currentRole, currentTab) ? (
            <AccessDeniedView
              currentRole={currentRole}
              attemptedTab={currentTab}
              onGoDashboard={() => {
                if (currentRole === 'teller') setCurrentTab('teller_dashboard');
                else if (currentRole === 'manager') setCurrentTab('manager_dashboard');
                else if (currentRole === 'admin') setCurrentTab('admin_dashboard');
                else setCurrentTab('dashboard');
              }}
            />
          ) : (
            <>
              {/* Customer Scope Views */}
              {(currentTab === 'dashboard' || currentTab === 'customer_dashboard') && currentRole === 'customer' && (
                <DashboardView
                  currentRole={currentRole}
                  currentUser={currentUser}
                  accounts={accounts}
                  transactions={transactions}
                  customers={customers}
                  onOpenActionModal={(action) => setActionModal({ isOpen: true, type: action })}
                  onSelectTab={setCurrentTab}
                  onShowToast={showToast}
                />
              )}

              {(currentTab === 'my_accounts' || currentTab === 'accounts') && (
                <AccountsView
                  accounts={accounts}
                  transactions={transactions}
                  onOpenActionModal={(action, acc) =>
                    setActionModal({ isOpen: true, type: action, targetAccount: acc })
                  }
                />
              )}

              {currentTab === 'balance_overview' && (
                <BalanceOverviewView accounts={accounts} currentUser={currentUser} />
              )}

              {currentTab === 'money_transfer' && (
                <AtomicTransferView accounts={accounts} currentUser={currentUser} onShowToast={showToast} />
              )}

              {(currentTab === 'transaction_history' || currentTab === 'transactions') && (
                <TransactionsView
                  transactions={transactions}
                  onOpenTransferModal={() => setActionModal({ isOpen: true, type: 'transfer' })}
                  onShowToast={showToast}
                />
              )}

              {currentTab === 'account_statement' && (
                <AccountStatementView
                  accounts={accounts}
                  transactions={transactions}
                  currentUser={currentUser}
                  onShowToast={showToast}
                />
              )}

              {currentTab === 'loan_status' && (
                <LoanStatusView
                  loans={loans}
                  currentUser={currentUser}
                  onShowToast={showToast}
                  onApplyLoan={handleApplyLoan}
                />
              )}

              {/* Profile Page */}
              {currentTab === 'profile' && (
                <ProfileView
                  currentUser={currentUser}
                  onUpdateProfile={handleUpdateCustomer}
                  onShowToast={showToast}
                />
              )}

              {/* Settings Page */}
              {currentTab === 'settings' && (
                <SettingsView
                  currentUser={currentUser}
                  onShowToast={showToast}
                />
              )}

              {/* Teller Scope Views */}
              {(currentTab === 'teller_dashboard' || (currentTab === 'dashboard' && currentRole === 'teller') || currentTab === 'transaction_queue') && (
                <TellerDashboardView
                  currentTab={currentTab}
                  customers={customers}
                  accounts={accounts}
                  transactions={transactions}
                  onOpenActionModal={(action, acc) => setActionModal({ isOpen: true, type: action, targetAccount: acc })}
                  onShowToast={showToast}
                />
              )}

              {(currentTab === 'customer_search' || (currentTab === 'customers' && currentRole === 'teller')) && (
                <CustomersView
                  customers={customers}
                  onUpdateCustomer={handleUpdateCustomer}
                  onShowToast={showToast}
                />
              )}

              {currentTab === 'deposit' && (
                <TellerDepositView
                  customers={customers}
                  accounts={accounts}
                  transactions={transactions}
                  onShowToast={showToast}
                  onProcessDeposit={handleProcessDeposit}
                />
              )}

              {currentTab === 'withdrawal' && (
                <TellerWithdrawalView
                  customers={customers}
                  accounts={accounts}
                  transactions={transactions}
                  onShowToast={showToast}
                  onProcessWithdrawal={handleProcessWithdrawal}
                />
              )}

              {currentTab === 'daily_transactions' && (
                <TellerDailySummaryView transactions={transactions} />
              )}

              {currentTab === 'cheque_clearing' && (
                <ChequeClearingView onShowToast={showToast} />
              )}

              {/* Branch Manager Scope Views */}
              {(currentTab === 'manager_dashboard' || (currentTab === 'dashboard' && currentRole === 'manager')) && (
                <ManagerDashboardView
                  currentTab={currentTab}
                  loans={loans}
                  onShowToast={showToast}
                  onUpdateLoanStatus={handleUpdateLoanStatus}
                />
              )}

              {currentTab === 'branch_liquidity' && <BranchLiquidityView />}

              {currentTab === 'loan_approval' && (
                <LoanManagementView
                  loans={loans}
                  onShowToast={showToast}
                  onUpdateLoanStatus={handleUpdateLoanStatus}
                />
              )}

              {currentTab === 'branch_metrics' && <BranchMetricsView />}

              {currentTab === 'manager_reports' && <ManagerReportsView onShowToast={showToast} />}

              {/* Database Administrator (DBA) Scope Views */}
              {(currentTab === 'admin_dashboard' || (currentTab === 'dashboard' && currentRole === 'admin')) && (
                <AdminDashboardView currentTab={currentTab} onShowToast={showToast} />
              )}

              {currentTab === 'user_management' && <UserManagementView onShowToast={showToast} />}

              {currentTab === 'role_management' && <RoleManagementView onShowToast={showToast} />}

              {currentTab === 'audit_logs' && <AuditLogsView onShowToast={showToast} />}

              {currentTab === 'database_health' && <DatabaseHealthView onShowToast={showToast} />}

              {currentTab === 'database_backup' && <DatabaseBackupView onShowToast={showToast} />}
            </>
          )}
        </main>
      </div>

      {/* Global Action Modal (Deposit, Withdraw, Transfer) */}
      {actionModal.isOpen && (
        <ActionModal
          type={actionModal.type}
          accounts={accounts}
          initialAccount={actionModal.targetAccount}
          onClose={() => setActionModal({ isOpen: false, type: 'deposit' })}
          onSubmit={handleActionSubmit}
        />
      )}

      {/* System Notifications Modal */}
      <NotificationModal
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllRead}
        onToggleRead={handleToggleRead}
      />

      {/* Toast Notifications Overlay */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
