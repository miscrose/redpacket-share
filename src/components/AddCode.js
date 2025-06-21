import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AddCode({ onCodeAdded }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!code.trim()) {
      setError('Code cannot be empty.');
      setLoading(false);
      return;
    }
    const { error } = await supabase.from('codes').insert([{ code }]);
    if (error) setError(error.message);
    else {
      setSuccess('Code added!');
      setCode('');
      if (onCodeAdded) onCodeAdded();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
      <input
        type="text"
        placeholder="Add a Red Packet code"
        value={code}
        onChange={e => setCode(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button type="submit" disabled={loading}>Add</button>
      {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
      {success && <span style={{ color: 'green', marginLeft: 8 }}>{success}</span>}
    </form>
  );
} 