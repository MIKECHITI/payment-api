import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ width: '100%', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Virtual Wallet</h2>
        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        <NavLink to="/wallet" className="nav-link">Wallet</NavLink>
        <NavLink to="/transfer" className="nav-link">Transfer</NavLink>
        <NavLink to="/history" className="nav-link">History</NavLink>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ color: '#6b7c93' }}>{user?.email}</div>
        <button className="button secondary" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
