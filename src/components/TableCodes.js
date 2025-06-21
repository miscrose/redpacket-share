import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { supabase } from '../supabaseClient';

const PAGE_SIZE = 10;

const TableCodes = forwardRef((props, ref) => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useImperativeHandle(ref, () => ({
    fetchCodes
  }));

  useEffect(() => {
    fetchCodes();
    // eslint-disable-next-line
  }, [sortDesc, page]);

  async function fetchCodes() {
    setLoading(true);
    // Get total count
    const { count } = await supabase
      .from('codes')
      .select('*', { count: 'exact', head: true });
    setTotal(count || 0);
    // Get paginated data
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from('codes')
      .select('*')
      .order('date_ajoute', { ascending: !sortDesc })
      .range(from, to);
    setCodes(data || []);
    setLoading(false);
  }

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSort = () => {
    setSortDesc(s => !s);
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (loading) return <div>Chargement...</div>;
  if (!codes.length) return <div>No codes shared yet.</div>;

  return (
    <div style={{marginTop: 32}}>
      <h3 style={{marginBottom: 16, color: '#F0B90B'}}>Shared Codes Table</h3>
      <table style={{width: '100%', borderCollapse: 'collapse', background: '#222531', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(240,185,11,0.07)'}}>
        <thead style={{background: '#181A20'}}>
          <tr>
            <th style={{padding: '12px 8px', textAlign: 'left', fontWeight: 700, fontSize: 16, color: '#F0B90B', background: '#181A20'}}>Code</th>
            <th style={{padding: '12px 8px', textAlign: 'left', fontWeight: 700, fontSize: 16, cursor: 'pointer', color: '#F0B90B', background: '#181A20'}} onClick={handleSort}>
              Date added {sortDesc ? '▼' : '▲'}
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
                {new Date(code.date_ajoute).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </td>
              <td style={{padding: '10px 8px', textAlign: 'center'}}>
                <button
                  onClick={() => handleCopy(code.code, code.id)}
                  className="copy-btn"
                  style={{minWidth: 90}}
                >
                  {copiedId === code.id ? 'Copied!' : 'Copy'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 18}}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{padding: '6px 18px'}}>Previous</button>
        <span style={{color: '#F0B90B', fontWeight: 600}}>Page {page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{padding: '6px 18px'}}>Next</button>
      </div>
    </div>
  );
});

export default TableCodes; 