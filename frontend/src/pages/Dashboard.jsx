import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import SummaryCard from '../components/ui/SummaryCard';
import RecentTransactions from '../components/ui/RecentTransactions';
import { getBalance } from '../services/walletService';
import { getHistory } from '../services/transactionService';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const b = await getBalance();
        setBalance(b.balance || 0);
        const h = await getHistory();
        setTransactions(h.transactions || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load dashboard');
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="header">
        <div>
          <h1>Welcome, {user?.name || 'User'}</h1>
          <p>Overview of your wallet and recent activity.</p>
        </div>
        <button className="button secondary" onClick={logout}>Logout</button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 18 }}>
        <div>
          <SummaryCard balance={balance} recentCount={transactions.length} />
          <div style={{ marginTop: 18 }} className="card">
            <h3 style={{ marginTop: 0 }}>Quick Links</h3>
            <div className="nav-list">
              <Link className="nav-link" to="/wallet">Wallet</Link>
              <Link className="nav-link" to="/transfer">Transfer</Link>
              <Link className="nav-link" to="/history">History</Link>
            </div>
          </div>
        </div>

        <aside>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
            <RecentTransactions transactions={transactions} />
          </div>
        </aside>
      </div>
    </div>
  );
}
