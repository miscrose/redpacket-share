import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { supabase } from '../supabaseClient';

const TableCodes = forwardRef((props, ref) => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [sortDesc, setSortDesc] = useState(true);

  useImperativeHandle(ref, () => ({
    fetchCodes
  }));

  useEffect(() => {
    fetchCodes();
    // eslint-disable-next-line
  }, [sortDesc]);

  async function fetchCodes() {
    setLoading(true);
    const { data, error } = await supabase
      .from('codes')
      .select('*')
      .order('date_ajoute', { ascending: !sortDesc });
    setCodes(data || []);
    setLoading(false);
  }

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSort = () => setSortDesc(s => !s);

  if (loading) return <div>Chargement...</div>;
  if (!codes.length) return <div>Aucun code partagé pour l'instant.</div>;

  return (
    <div style={{marginTop: 32}}>
      <h3 style={{marginBottom: 16, color: '#F0B90B'}}>Tableau des codes partagés</h3>
      <table style={{width: '100%', borderCollapse: 'collapse', background: '#222531', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(240,185,11,0.07)'}}>
        <thead style={{background: '#181A20'}}>
          <tr>
            <th style={{padding: '12px 8px', textAlign: 'left', fontWeight: 700, fontSize: 16, color: '#F0B90B', background: '#181A20'}}>Code</th>
            <th style={{padding: '12px 8px', textAlign: 'left', fontWeight: 700, fontSize: 16, cursor: 'pointer', color: '#F0B90B', background: '#181A20'}} onClick={handleSort}>
              Date d'ajout {sortDesc ? '▼' : '▲'}
            </th>
            <th style={{padding: '12px 8px', textAlign: 'center', fontWeight: 700, fontSize: 16, color: '#F0B90B', background: '#181A20'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {codes.map(code => (
            <tr key={code.id} style={{borderBottom: '1px solid #393C49'}}>
              <td style={{padding: '10px 8px'}}>
                <span style={{background: '#F0B90B', color: '#181A20', fontWeight: 700, fontSize: 17, borderRadius: 5, padding: '4px 12px', letterSpacing: 1}}>{code.code}</span>
              </td>
              <td style={{padding: '10px 8px', color: '#F0B90B', fontSize: 15}}>
                {new Date(code.date_ajoute).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </td>
              <td style={{padding: '10px 8px', textAlign: 'center'}}>
                <button
                  onClick={() => handleCopy(code.code, code.id)}
                  className="copy-btn"
                  style={{minWidth: 90}}
                >
                  {copiedId === code.id ? 'Copié !' : 'Copier'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default TableCodes; 