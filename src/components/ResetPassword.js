import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage(error.message);
    else setMessage('Password changed! You can now sign in.');
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: '#222531', borderRadius: 12, boxShadow: '0 2px 8px rgba(240,185,11,0.07)', padding: 32 }}>
      <h2 style={{ color: '#F0B90B', textAlign: 'center', marginBottom: 24 }}>New password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ marginBottom: 12, width: '100%' }}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          style={{ marginBottom: 16, width: '100%' }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%' }}>Change password</button>
        {message && <div style={{ color: '#F0B90B', marginTop: 16, textAlign: 'center' }}>{message}</div>}
      </form>
      <button
        type="button"
        onClick={() => window.location.href = '/'}
        style={{
          marginTop: 18,
          width: '100%',
          background: '#F0B90B',
          color: '#181A20',
          border: 'none',
          borderRadius: 8,
          padding: '10px 0',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          cursor: 'pointer'
        }}
      >
        Back to main page
      </button>
    </div>
  );
} 