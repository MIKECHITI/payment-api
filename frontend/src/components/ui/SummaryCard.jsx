export default function SummaryCard({ balance = 0, recentCount = 0 }) {
  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ margin: 0 }}>Wallet Balance</h3>
        <p style={{ fontSize: '1.5rem', margin: '8px 0' }}>${Number(balance).toFixed(2)}</p>
        <p style={{ margin: 0, color: '#6b7c93' }}>{recentCount} recent transactions</p>
      </div>
    </div>
  );
}
