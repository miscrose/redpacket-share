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
        <svg className="app-header-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="12" fill="#fff"/>
          <circle cx="24" cy="24" r="18" fill="#F0B90B"/>
          <path d="M24 14L32 34H16L24 14Z" fill="#181A20"/>
        </svg>
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
              <button onClick={handleRefreshTable} style={{ background: '#393C49', color: '#F0B90B', border: '1px solid #F0B90B', width: 180, alignSelf: 'center', marginBottom: 8 }}>Actualiser la table</button>
              <TableCodes ref={tableRef} />
            </div>
            <button onClick={handleLogout} style={{marginTop: 32, display: 'block', marginLeft: 'auto', marginRight: 'auto', background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer'}}>Se déconnecter</button>
          </>
        )}
      </main>
      <footer className="app-footer">
        &copy; {new Date().getFullYear()} Red Packet Share. Propulsé par Supabase & React.
      </footer>
    </>
  );
}

export default App;
