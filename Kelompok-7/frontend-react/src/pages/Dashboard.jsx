import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL || '';

const Dashboard = () => {
  const [summary, setSummary] = useState({ totalPemasukan: 0, totalPengeluaran: 0, saldo: 0 });
  const [transaksi, setTransaksi] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({ id: '', tipe: 'pengeluaran', kategori: '', jumlah: '', catatan: '' });
  const [formData, setFormData] = useState({ tipe: 'pengeluaran', kategori: '', jumlah: '', catatan: '' });
  const navigate = useNavigate();
  const namaUser = localStorage.getItem('userNama') || 'Pengguna';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      try {
        const resSum = await axios.get(`${apiUrl}/api/transaksi/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSummary(resSum.data);
        const resList = await axios.get(`${apiUrl}/api/transaksi`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTransaksi(resList.data);
      } catch (err) { console.error(err); }
    };

    fetchData();
    }, [navigate]);
    const handleSimpan = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      try {
        await axios.post(`${apiUrl}/api/transaksi`, { ...formData, jumlah: parseInt(formData.jumlah) }, { headers: { Authorization: `Bearer ${token}` } });
        window.location.reload();
      } catch (err) { console.error(err); }
    };

  const handleEditClick = (t) => {
    setEditData({ id: t.id, tipe: t.tipe, kategori: t.kategori, jumlah: t.jumlah, catatan: t.catatan || '' });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
    await axios.put(`${apiUrl}/api/transaksi/${editData.id}`,
        { tipe: editData.tipe, kategori: editData.kategori, jumlah: parseInt(editData.jumlah), catatan: editData.catatan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      window.location.reload();
    } catch (err) { console.error(err); }
    
  };

  const handleHapus = async (id) => {
    if (!window.confirm("Hapus transaksi ini?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${apiUrl}/api/transaksi/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      window.location.reload();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: 'white', padding: '20px 30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '24px' }}>💰</div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Halo, <span style={{ color: '#28a745' }}>{namaUser}</span>! 👋</h2>
          </div>

          <button
            onClick={() => { localStorage.clear(); navigate('/'); }}
            style={{ background: '#fff', color: '#ff4d4f', border: '1.5px solid #ff4d4f', padding: '10px 25px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
          >
            Keluar
          </button>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ padding: '30px', background: 'white', flex: 1, borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', border: '1px solid rgba(40, 167, 69, 0.1)' }}>
            <p style={{ margin: 0, color: '#888', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Pemasukan</p>
            <h2 style={{ margin: '10px 0 0 0', color: '#28a745', fontSize: '28px' }}>Rp {summary.totalPemasukan.toLocaleString()}</h2>
          </div>

          <div style={{ padding: '30px', background: 'white', flex: 1, borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', border: '1px solid rgba(229, 62, 62, 0.1)' }}>
            <p style={{ margin: 0, color: '#888', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Pengeluaran</p>
            <h2 style={{ margin: '10px 0 0 0', color: '#e53e3e', fontSize: '28px' }}>Rp {summary.totalPengeluaran.toLocaleString()}</h2>
          </div>

          <div style={{ padding: '30px', background: 'linear-gradient(135deg, #28a745 0%, #218838 100%)', flex: 1, borderRadius: '24px', boxShadow: '0 10px 25px rgba(40, 167, 69, 0.2)', color: 'white' }}>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Total Saldo</p>
            <h2 style={{ margin: '10px 0 0 0', fontSize: '28px' }}>Rp {summary.saldo.toLocaleString()}</h2>
          </div>
        </div>

        {/* Form Tambah Transaksi */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '18px', color: '#333' }}>Tambah Transaksi Baru</h3>
          <form onSubmit={handleSimpan} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <select value={formData.tipe} onChange={(e) => setFormData({...formData, tipe: e.target.value})} style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #eee', outlineColor: '#28a745', minWidth: '150px' }}>
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>

            <input type="text" placeholder="Kategori" value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})} required style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #eee', outlineColor: '#28a745', flex: 1 }} />
            <input type="number" placeholder="Jumlah (Rp)" value={formData.jumlah} onChange={(e) => setFormData({...formData, jumlah: e.target.value})} required style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #eee', outlineColor: '#28a745', width: '200px' }} />
            <input type="text" placeholder="Catatan" value={formData.catatan} onChange={(e) => setFormData({...formData, catatan: e.target.value})} style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #eee', outlineColor: '#28a745', flex: 1 }} />
            <button type="submit" style={{ padding: '14px 40px', background: '#28a745', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 8px 15px rgba(40, 167, 69, 0.1)' }}>Simpan</button>
          </form>
        </div>

        {/* Tabel */}
        <div style={{ backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#fcfcfc', borderBottom: '1px solid #f1f1f1' }}>
              <tr>
                <th style={{ padding: '20px', textAlign: 'left', color: '#888', fontSize: '14px' }}>TIPE</th>
                <th style={{ padding: '20px', textAlign: 'left', color: '#888', fontSize: '14px' }}>KATEGORI</th>
                <th style={{ padding: '20px', textAlign: 'left', color: '#888', fontSize: '14px' }}>JUMLAH</th>
                <th style={{ padding: '20px', textAlign: 'left', color: '#888', fontSize: '14px' }}>CATATAN</th>
                <th style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: '14px' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>

              {transaksi.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '20px' }}>
                    <span style={{
                      backgroundColor: t.tipe === 'pemasukan' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(229, 62, 62, 0.1)',
                      color: t.tipe === 'pemasukan' ? '#28a745' : '#e53e3e',
                      padding: '6px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold'
                    }}>
                      {t.tipe.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '20px', fontWeight: '500', color: '#333' }}>{t.kategori}</td>
                  <td style={{ padding: '20px', fontWeight: 'bold', color: t.tipe === 'pemasukan' ? '#28a745' : '#333' }}>
                    {t.tipe === 'pemasukan' ? '+' : '-'} Rp {t.jumlah.toLocaleString()}
                  </td>
                  <td style={{ padding: '20px', color: '#999', fontSize: '14px' }}>{t.catatan || '-'}</td>
                  <td style={{ padding: '20px', textAlign: 'center' }}>
                    <button onClick={() => handleEditClick(t)} style={{ background: 'none', border: '1px solid #eee', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', marginRight: '8px', fontSize: '13px' }}>Edit</button>
                    <button onClick={() => handleHapus(t.id)} style={{ background: 'none', border: '1px solid #ffebeb', color: '#ff4d4f', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px' }}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '25px', textAlign: 'center' }}>📝 Edit Transaksi</h3>
            <form onSubmit={handleUpdate}>
              <select style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', border: '1.5px solid #eee' }} value={editData.tipe} onChange={(e) => setEditData({...editData, tipe: e.target.value})}>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>
              <input style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', border: '1.5px solid #eee', boxSizing: 'border-box' }} type="text" placeholder="Kategori" value={editData.kategori} onChange={(e) => setEditData({...editData, kategori: e.target.value})} required />
              <input style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', border: '1.5px solid #eee', boxSizing: 'border-box' }} type="text" placeholder="Catatan" value={editData.catatan} onChange={(e) => setEditData({...editData, catatan: e.target.value})} />
              <input style={{ width: '100%', padding: '14px', marginBottom: '25px', borderRadius: '12px', border: '1.5px solid #eee', boxSizing: 'border-box' }} type="number" placeholder="Jumlah" value={editData.jumlah} onChange={(e) => setEditData({...editData, jumlah: e.target.value})} required />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ flex: 1, background: '#28a745', color: 'white', padding: '14px', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Update</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: '#f8f9fa', padding: '14px', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color: '#666' }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;