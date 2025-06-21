import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AllCodes() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchCodes = async () => {
      const { data, error } = await supabase.from('codes').select('*').order('date_ajout', { ascending: false });
      setCodes(data || []);
      setLoading(false);
    };
    fetchCodes();
  }, []);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (loading) return <div>Chargement...</div>;
  if (!codes.length) return <div>Aucun code partagé pour l'instant.</div>;

  return (
    <div style={{
      background: '#f9f9f9',
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      marginTop: 32
    }}>
      <h3 style={{marginBottom: 20, color: '#333'}}>Liste des codes partagés</h3>
      <ul style={{listStyle: 'none', padding: 0}}>
        {codes.map(code => (
          <li key={code.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fff',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <div>
              <span style={{fontWeight: 'bold', fontSize: 18, letterSpacing: 1}}>{code.code}</span>
              <span style={{marginLeft: 16, color: '#888', fontSize: 14}}>
                Ajouté le {new Date(code.date_ajout).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <button
              onClick={() => handleCopy(code.code, code.id)}
              style={{
                background: copiedId === code.id ? '#4caf50' : '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px 16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background 0.2s'
              }}
            >
              {copiedId === code.id ? 'Copié !' : 'Copier'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 