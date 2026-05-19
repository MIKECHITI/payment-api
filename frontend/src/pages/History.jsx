import { useEffect, useState } from 'react';
import { getHistory } from '../services/transactionService';

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory();
        setTransactions(data.transactions || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load history');
      }
    }

    loadHistory();
  }, []);

  return (
    <div className="page-container">
      <div className="header">
        <div>
          <h1>Transaction History</h1>
          <p>All sent and received transactions.</p>
        </div>
      </div>
      <div className="card">
        {error && <p className="error-text">{error}</p>}
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="transaction-list">
            {transactions.map((item) => (
              <div key={item.id} className="card" style={{ marginBottom: '12px' }}>
                <p><strong>Reference:</strong> {item.reference}</p>
                <p><strong>Amount:</strong> ${item.amount.toFixed(2)}</p>
                <p><strong>Status:</strong> {item.status}</p>
                <p><strong>Type:</strong> {item.type}</p>
                <p><strong>Timestamp:</strong> {new Date(item.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
