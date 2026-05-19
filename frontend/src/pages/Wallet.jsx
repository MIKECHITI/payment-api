import { useEffect, useState } from 'react';
import { getBalance, deposit } from '../services/walletService';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBalance() {
      try {
        const data = await getBalance();
        setBalance(data.balance);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to fetch balance');
      }
    }
    loadBalance();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await deposit(parseFloat(amount));
      setBalance(response.balance);
      setMessage(`Deposited ${response.amount} successfully.`);
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.error || 'Deposit failed');
    }
  };

  return (
    <div className="page-container">
      <div className="header">
        <div>
          <h1>Wallet</h1>
          <p>Current balance: ${balance.toFixed(2)}</p>
        </div>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit} className="input-group">
          <label htmlFor="amount">Deposit Amount</label>
          <input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <button type="submit" className="button">Deposit</button>
          {message && <p>{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
}
