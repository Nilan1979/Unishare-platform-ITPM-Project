import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page-container" style={{
      background: '#f4f7ff',
      minHeight: '100vh',
      padding: '60px 40px 80px',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        .page-container {
          max-width: 900px;
          margin: 0 auto;
        }
        
        .dashboard-card {
          background: white;
          border-radius: 18px;
          border: 1px solid #e8f0fe;
          padding: 48px 52px;
          box-shadow: 0 8px 32px rgba(21,101,192,0.11);
        }
        
        .page-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0d2257;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }
        
        .dashboard-card p {
          font-size: 0.95rem;
          color: #666;
          margin-bottom: 32px;
          line-height: 1.6;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        
        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          color: white;
          border: none;
          border-radius: 11px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.22s;
          box-shadow: 0 4px 16px rgba(21,101,192,0.28);
          text-decoration: none;
          gap: 8px;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(21,101,192,0.38);
        }
        
        .btn-secondary {
          background: #f4f7ff;
          color: #1565C0;
          box-shadow: 0 2px 12px rgba(21,101,192,0.10);
        }
        
        .btn-secondary:hover {
          background: #e8f0fe;
          box-shadow: 0 4px 16px rgba(21,101,192,0.18);
        }
        
        .btn-danger {
          background: #fce8ef;
          color: #993556;
          border: 1px solid #f5c2cf;
          box-shadow: 0 2px 10px rgba(212,83,126,0.15);
        }
        
        .btn-danger:hover {
          background: #f5c2cf;
          box-shadow: 0 4px 14px rgba(212,83,126,0.25);
        }
        
        /* ══════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════ */
        @media (max-width: 1024px) {
          .page-container {
            padding: 50px 36px 70px;
          }
          .dashboard-card {
            padding: 42px 48px;
          }
          .page-title {
            font-size: 1.85rem;
          }
          .form-row {
            gap: 14px;
          }
        }
        
        @media (max-width: 900px) {
          .page-container {
            padding: 44px 28px 64px;
          }
          .dashboard-card {
            padding: 36px 40px;
          }
          .page-title {
            font-size: 1.7rem;
          }
          .form-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .btn-primary {
            padding: 11px 20px;
            font-size: 0.82rem;
          }
        }
        
        @media (max-width: 768px) {
          .page-container {
            padding: 40px 24px 60px;
          }
          .dashboard-card {
            padding: 32px 32px;
            border-radius: 16px;
          }
          .page-title {
            font-size: 1.5rem;
            margin-bottom: 12px;
          }
          .dashboard-card p {
            font-size: 0.9rem;
            margin-bottom: 28px;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .btn-primary {
            padding: 10px 18px;
            font-size: 0.8rem;
            width: 100%;
          }
        }
        
        @media (max-width: 600px) {
          .page-container {
            padding: 32px 16px 50px;
          }
          .dashboard-card {
            padding: 24px 20px;
            border-radius: 14px;
          }
          .page-title {
            font-size: 1.3rem;
            margin-bottom: 10px;
          }
          .dashboard-card p {
            font-size: 0.85rem;
            margin-bottom: 24px;
          }
          .form-row {
            gap: 8px;
          }
          .btn-primary {
            padding: 9px 16px;
            font-size: 0.77rem;
          }
        }
        
        @media (max-width: 480px) {
          .page-container {
            padding: 24px 12px 40px;
          }
          .dashboard-card {
            padding: 18px 16px;
            border-radius: 12px;
          }
          .page-title {
            font-size: 1.15rem;
            margin-bottom: 8px;
          }
          .dashboard-card p {
            font-size: 0.8rem;
            margin-bottom: 20px;
          }
          .btn-primary {
            padding: 8px 14px;
            font-size: 0.75rem;
          }
        }
        
        @media (max-width: 360px) {
          .page-container {
            padding: 16px 8px 30px;
          }
          .dashboard-card {
            padding: 14px 12px;
            border-radius: 10px;
          }
          .page-title {
            font-size: 1rem;
            margin-bottom: 6px;
          }
          .dashboard-card p {
            font-size: 0.75rem;
            margin-bottom: 16px;
          }
          .btn-primary {
            padding: 7px 12px;
            font-size: 0.72rem;
          }
        }
      `}</style>

      <div className="dashboard-card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px'}}>
          <h2 className="page-title" style={{margin: 0}}>Hello, {user.fullName} 👋</h2>
          <button onClick={handleLogout} className="btn-primary btn-danger" style={{textDecoration: 'none'}}>Logout</button>
        </div>
        
        <p style={{color: '#666', marginBottom: '30px'}}>Welcome to your UniShare Dashboard. What would you like to do today?</p>

        <div className="form-row">
          <Link to="/profile" className="btn-primary btn-secondary" style={{textDecoration: 'none'}}>My Profile</Link>
          <Link to="/library" className="btn-primary" style={{textDecoration: 'none'}}>Browse Library</Link>
          {user.role === 'admin' && (
            <Link to="/admin/users" className="btn-primary" style={{background: '#0d2257', textDecoration: 'none'}}>Manage Users</Link>
          )}
        </div>
      </div>
    </div>
  );
}