import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function MyCode({ user, refresh }) {
  const [myCode, setMyCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMyCode = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('codes')
        .select('*')
        .eq('utilisateur_id', user.id)
        .single();
      if (isMounted) {
        setMyCode(data || null);
        setLoading(false);
      }
    };
    fetchMyCode();
    return () => { isMounted = false; };
  }, [user, refresh]);

  if (loading) return <div>Chargement...</div>;
  if (!myCode) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <strong style={{ color: '#F0B90B', fontSize: 18 }}>Votre code Red Packet :</strong>
      <div style={{ fontSize: 22, marginTop: 8, background: '#F0B90B', color: '#181A20', padding: 12, borderRadius: 6, fontWeight: 'bold', letterSpacing: 1.5, textAlign: 'center', boxShadow: '0 2px 8px rgba(240,185,11,0.13)' }}>{myCode.code}</div>
    </div>
  );
} 