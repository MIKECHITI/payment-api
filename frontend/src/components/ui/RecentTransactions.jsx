export default function RecentTransactions({ transactions = [] }) {
  if (!transactions || transactions.length === 0) return <p>No recent transactions.</p>;

  return (
    <div>
      {transactions.slice(0, 5).map((t) => (
        <div key={t.id} className="card" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{t.reference}</div>
              <div style={{ color: '#6b7c93', fontSize: '0.9rem' }}>{t.type} • {new Date(t.timestamp).toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>${Number(t.amount).toFixed(2)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
