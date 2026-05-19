import { useState } from 'react';
import { transfer } from '../services/transactionService';
import { searchUsers } from '../services/userService';

export default function Transfer() {
  const [emailQuery, setEmailQuery] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleSearch = async () => {
    setSearchError('');
    setError('');
    setMessage('');

    if (!emailQuery.trim()) {
      setSearchError('Enter a recipient email or partial email to search.');
      return;
    }

    try {
      const users = await searchUsers(emailQuery.trim());
      setRecipients(users);
      setSelectedRecipient(users[0] || null);
      if (users.length === 0) {
        setSearchError('No matching users found.');
      }
    } catch (err) {
      setSearchError(err.response?.data?.error || 'Search failed');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!selectedRecipient) {
      setError('Select a recipient from the search results.');
      return;
    }

    try {
      const response = await transfer({
        receiverId: selectedRecipient.id,
        amount: parseFloat(amount),
        description,
      });
      setMessage(`Transfer successful: ${response.transaction.reference}`);
      setAmount('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed');
    }
  };

  return (
    <div className="page-container card">
      <div className="header">
        <h1>Transfer Funds</h1>
      </div>

      <div className="input-group">
        <label htmlFor="emailQuery">Recipient email</label>
        <input
          id="emailQuery"
          type="text"
          value={emailQuery}
          onChange={(e) => setEmailQuery(e.target.value)}
          placeholder="Search by email"
        />
        <button type="button" className="button" onClick={handleSearch}>
          Search Recipients
        </button>
        {searchError && <p className="error-text">{searchError}</p>}
      </div>

      {recipients.length > 0 && (
        <div className="input-group">
          <label>Choose recipient</label>
          <select
            value={selectedRecipient?.id || ''}
            onChange={(e) => setSelectedRecipient(recipients.find((user) => user.id === Number(e.target.value)))}
          >
            {recipients.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
      )}

      <form onSubmit={handleSubmit} className="input-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label htmlFor="description">Description (optional)</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Payment note"
        />

        <button type="submit" className="button">Send</button>
        {message && <p>{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}
