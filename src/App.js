import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import AddCode from './components/AddCode';
import MyCode from './components/MyCode';
import TableCodes from './components/TableCodes';
import ResetPassword from './components/ResetPassword';
import './App.css';

// Redirection automatique pour le reset password Supabase (gère aussi le hash)
const search = window.location.search + window.location.hash;
if (
  search.includes('type=recovery') &&
  window.location.pathname !== '/reset-password'
) {
  window.location.replace('/reset-password' + search);
}

function App() {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const tableRef = useRef();
  const [modalImg, setModalImg] = useState(null);

  // Détecte si on est sur la page de reset password
  const isResetPassword = window.location.pathname === '/reset-password';

  useEffect(() => {
    if (isResetPassword) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [isResetPassword]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Rafraîchit les composants enfants après ajout
  const triggerRefresh = () => setRefresh(r => r + 1);

  // Pour rafraîchir la table depuis un bouton
  const handleRefreshTable = () => {
    if (tableRef.current && tableRef.current.fetchCodes) {
      tableRef.current.fetchCodes();
    }
  };

  if (isResetPassword) {
    return <ResetPassword />;
  }

  return (
    <>
      <header className="app-header">
        <img
          src="/red-envelope.png"
          alt="Red Packet Logo"
          className="app-header-logo"
          style={{ width: 48, height: 48, marginRight: 18 }}
        />
        <span className="app-title">Red Packet Share</span>
      </header>
      <main className="app-container">
        {!user ? (
          <Auth onAuth={setUser} />
        ) : (
          <>
            <p style={{textAlign: 'center', fontSize: 18, color: '#F0B90B', marginBottom: 24}}>Bienvenue, <b>{user.email}</b> !</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
              <AddCode onCodeAdded={triggerRefresh} />
              <MyCode user={user} refresh={refresh} />
              <button onClick={handleRefreshTable} style={{ background: '#393C49', color: '#F0B90B', border: '1px solid #F0B90B', width: 180, alignSelf: 'center', marginBottom: 8 }}>Refresh table</button>
              <TableCodes ref={tableRef} />
            </div>
            <button onClick={handleLogout} style={{marginTop: 32, display: 'block', marginLeft: 'auto', marginRight: 'auto', background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer'}}>Sign out</button>
          </>
        )}
      </main>
      <footer className="app-footer">
        &copy; {new Date().getFullYear()} Red Packet Share. Powered by Supabase & React.
        <div style={{
          marginTop: 32,
          background: '#222531',
          borderRadius: 12,
          padding: 24,
          maxWidth: 700,
          marginLeft: 'auto',
          marginRight: 'auto',
          color: '#F0B90B',
          fontSize: 16,
          boxShadow: '0 2px 8px rgba(240,185,11,0.07)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 18
        }}>
          <div style={{flex: 1}}>
            <div style={{fontWeight: 'bold', fontSize: 18, marginBottom: 8}}>
              🎯 What is RedPacket Share?
            </div>
            <div style={{marginBottom: 10}}>
              RedPacket Share is a free platform to share and discover Binance Red Packet codes.<br/>
              On Binance, you can create a Red Packet with as little as $0.01, and get a unique code to share.
            </div>
            <div style={{marginBottom: 10}}>
              ✅ The more people use your code, the more you earn!<br/>
              Binance rewards the code creator with crypto bonuses when certain milestones are reached:
            </div>
            <ul style={{margin: 0, paddingLeft: 18, marginBottom: 10}}>
              <li>🥉 20 users → first reward</li>
              <li>🥈 100 users → second reward</li>
              <li>🥇 300 users → even more</li>
              <li>👑 1000 users → maximum bonus</li>
            </ul>
            <div style={{marginBottom: 10}}>
              👉 People who redeem your code can also receive a small crypto reward
            </div>
            <div style={{marginBottom: 10}}>
              On this site, you can:
            </div>
            <ul style={{margin: 0, paddingLeft: 18, marginBottom: 10}}>
              <li>🔍 Find active Red Packet codes to use in the Binance app</li>
              <li>📤 Share your own code to reach reward milestones</li>
            </ul>
            <div style={{marginBottom: 0}}>
              No account needed — 100% free — made to boost your visibility and maximize your crypto earnings!
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center'}}>
            <img src="/redpackethome.jpg" alt="Red Packet Home" style={{width: 80, height: 'auto', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.12)', cursor: 'pointer'}} onClick={() => setModalImg('/redpackethome.jpg')} />
            <img src="/redpacketreward.jpg" alt="Red Packet Reward" style={{width: 80, height: 'auto', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.12)', cursor: 'pointer'}} onClick={() => setModalImg('/redpacketreward.jpg')} />
          </div>
        </div>
        {modalImg && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }} onClick={() => setModalImg(null)}>
            <img src={modalImg} alt="Red Packet" style={{maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.25)'}} />
          </div>
        )}
      </footer>
    </>
  );
}

export default App;

