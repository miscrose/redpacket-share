import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else onAuth(data.user);
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) setResetMessage(error.message);
    else setResetMessage('A password reset email has been sent if this account exists.');
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8, marginBottom: 20 }}>
      <h2 style={{ color: '#F0B90B' }}>Sign in / Sign up</h2>
      {!showReset ? (
        <>
          <form>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ marginBottom: 8, width: '100%' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ marginBottom: 8, width: '100%' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSignIn} disabled={loading} type="submit">Sign in</button>
              <button onClick={handleSignUp} disabled={loading} type="button">Sign up</button>
            </div>
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          </form>
          <div style={{ marginTop: 8 }}>
            <button type="button" style={{ background: 'none', color: '#F0B90B', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }} onClick={() => setShowReset(true)}>
              Forgot password?
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Your email"
            value={resetEmail}
            onChange={e => setResetEmail(e.target.value)}
            required
            style={{ marginBottom: 8, width: '100%' }}
          />
          <button type="submit" style={{ marginRight: 8 }}>Reset</button>
          <button type="button" onClick={() => setShowReset(false)}>Cancel</button>
          {resetMessage && <div style={{ color: '#F0B90B', marginTop: 8 }}>{resetMessage}</div>}
        </form>
      )}
    </div>
  );
} 