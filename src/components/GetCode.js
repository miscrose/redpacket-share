import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function GetCode({ user, onCodeAssigned, onRefreshTable }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleGetCode = async () => {
    setLoading(true);
    setMessage('');
    // Cherche un code non attribué
    const { data: codes, error } = await supabase
      .from('codes')
      .select('*')
      .is('utilisateur_id', null)
      .limit(1);
    if (error) {
      setMessage('Erreur : ' + error.message);
      setLoading(false);
      return;
    }
    if (!codes || codes.length === 0) {
      setMessage(''); // Ne rien afficher si aucun code
      setLoading(false);
      return;
    }
    const code = codes[0];
    // Attribue le code à l'utilisateur
    const { error: updateError } = await supabase
      .from('codes')
      .update({ utilisateur_id: user.id, date_attribue: new Date().toISOString() })
      .eq('id', code.id);
    if (updateError) {
      setMessage('Erreur lors de l\'attribution : ' + updateError.message);
    } else {
      setMessage('Code récupéré !');
      if (onCodeAssigned) onCodeAssigned();
      if (onRefreshTable) onRefreshTable();
    }
    setLoading(false);
  };

  return (
    <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
      <button onClick={handleGetCode} disabled={loading}>Récupérer un code</button>
      <button onClick={onRefreshTable} style={{ background: '#393C49', color: '#F0B90B', border: '1px solid #F0B90B' }}>Actualiser la table</button>
      {message && <span style={{ marginLeft: 8 }}>{message}</span>}
    </div>
  );
} 