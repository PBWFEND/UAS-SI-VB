import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import Alert from '../components/Alert';

const KaryawanDashboard = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [resiMap, setResiMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: 'info', text: '' });

  const fetchTransaksi = async () => {
    setLoading(true);
    try {
      // Backend sudah filter untuk KARYAWAN:
      // - status_pembayaran = Terverifikasi
      // - status_arsip = AKTIF
      // - id_karyawan = req.user.id
      const res = await api.get('/transaksi');
      const data = res.data?.data || res.data || [];
      setTransaksi(data);

      const map = {};
      data.forEach((t) => {
        map[t.id_tmc] = t.nomor_resi || '';
      });
      setResiMap(map);
    } catch (err) {
      console.error(err);
      setMsg({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Gagal memuat transaksi untuk karyawan.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const siapDikirim = useMemo(
    () => transaksi.filter((t) => t.status_pengiriman === 'Belum Dikirim').length,
    [transaksi]
  );

  const sedangDikirim = useMemo(
    () => transaksi.filter((t) => t.status_pengiriman === 'Dikirim').length,
    [transaksi]
  );

  const handleChangeResi = (id_tmc, value) => {
    setResiMap((prev) => ({
      ...prev,
      [id_tmc]: value,
    }));
  };

  const updatePengiriman = async (id_tmc, status) => {
    const nomor_resi = resiMap[id_tmc] || '';

    if (status === 'Dikirim' && !nomor_resi) {
      setMsg({
        type: 'error',
        text: 'Isi nomor resi terlebih dahulu sebelum set "Dikirim".',
      });
      return;
    }

    try {
      const payload =
        status === 'Dikirim'
          ? { status_pengiriman: status, nomor_resi }
          : { status_pengiriman: status };

      const res = await api.put(`/transaksi/${id_tmc}`, payload);
      setMsg({
        type: 'success',
        text: res.data?.message || 'Status pengiriman diperbarui.',
      });
      fetchTransaksi();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        const errors = err.response.data?.errors || [];
        const text = errors.map((e) => `- ${e.msg}`).join('\n');
        setMsg({ type: 'error', text: `Validasi gagal:\n${text}` });
      } else {
        setMsg({
          type: 'error',
          text:
            err.response?.data?.message ||
            'Gagal memperbarui status pengiriman.',
        });
      }
    }
  };

  const handleBulkKirim = async () => {
    const target = transaksi.filter((t) => t.status_pengiriman === 'Belum Dikirim');
    if (!target.length) {
      setMsg({
        type: 'info',
        text: 'Tidak ada pesanan dengan status "Belum Dikirim".',
      });
      return;
    }
    if (
      !window.confirm(
        `Konfirmasi semua (${target.length}) pesanan "Belum Dikirim" menjadi "Dikirim"? Pastikan nomor resi sudah terisi.`
      )
    ) {
      return;
    }

    for (const t of target) {
      if (!resiMap[t.id_tmc]) continue;
      try {
        await api.put(`/transaksi/${t.id_tmc}`, {
          status_pengiriman: 'Dikirim',
          nomor_resi: resiMap[t.id_tmc],
        });
      } catch (err) {
        console.error('bulk kirim error', err);
      }
    }

    fetchTransaksi();
  };

  const statusBadgePengiriman = (status) => {
    if (status === 'Selesai')
      return 'bg-emerald-900/70 text-emerald-100 border-emerald-500';
    if (status === 'Dikirim')
      return 'bg-blue-900/70 text-blue-100 border-blue-500';
    return 'bg-slate-800/80 text-slate-100 border-slate-500';
  };

  return (
    <div className="space-y-6">
      <Alert
        type={msg.type}
        message={msg.text}
        onClose={() => setMsg({ type: 'info', text: '' })}
      />

      <div className="bg-bsm-card border border-bsm-border rounded-xl p-4 text-xs">
        <h2 className="font-semibold text-sm mb-2">Notifikasi & Aksi Cepat Pengiriman</h2>
        <p className="text-[11px] text-bsm-muted">
          Pesanan yang tampil di sini sudah <b>Terverifikasi</b> oleh admin dan <b>ditugaskan</b> ke Anda.
        </p>

        <div className="flex flex-wrap gap-4 mt-3 text-[11px]">
          <div>
            <div className="text-bsm-muted">Belum Dikirim</div>
            <div className="text-lg font-semibold">{siapDikirim}</div>
          </div>
          <div>
            <div className="text-bsm-muted">Sedang Dikirim</div>
            <div className="text-lg font-semibold">{sedangDikirim}</div>
          </div>
          <div className="ml-auto">
            <button
              onClick={handleBulkKirim}
              disabled={!siapDikirim}
              className="px-3 py-1.5 rounded-lg bg-bsm-accent hover:bg-bsm-accent2 text-[11px] disabled:opacity-50"
            >
              Konfirmasi Semua "Belum Dikirim"
            </button>
          </div>
        </div>
      </div>

      <div className="bg-bsm-card border border-bsm-border rounded-xl p-4 text-xs">
        <h2 className="font-semibold text-sm mb-3">Kelola Resi & Status Pengiriman</h2>

        {loading ? (
          <div className="text-bsm-muted text-[11px]">Memuat transaksi...</div>
        ) : !transaksi.length ? (
          <div className="text-bsm-muted text-[11px]">Belum ada transaksi yang ditugaskan ke Anda.</div>
        ) : (
          <div className="overflow-auto max-h-[480px]">
            <table className="w-full text-[11px] border-collapse">
              <thead className="bg-bsm-panel sticky top-0 z-10">
                <tr className="border-b border-bsm-border">
                  <th className="px-2 py-2 text-left">Invoice</th>
                  <th className="px-2 py-2 text-left">Tanggal</th>
                  <th className="px-2 py-2 text-left">Konsumen</th>
                  <th className="px-2 py-2 text-left">Status Kirim</th>
                  <th className="px-2 py-2 text-left">Nomor Resi</th>
                  <th className="px-2 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transaksi.map((t) => (
                  <tr
                    key={t.id_tmc}
                    className="border-b border-bsm-border/60 hover:bg-bsm-panel/70"
                  >
                    <td className="px-2 py-1 font-mono">{t.nomor_invoice || `#${t.id_tmc}`}</td>
                    <td className="px-2 py-1">{(t.tanggal || '').slice(0, 10)}</td>
                    <td className="px-2 py-1">{t.konsumen?.nama || `User #${t.id_konsumen}`}</td>
                    <td className="px-2 py-1">
                      <span
                        className={`inline-block px-2 py-[2px] rounded-full border ${statusBadgePengiriman(
                          t.status_pengiriman
                        )}`}
                      >
                        {t.status_pengiriman}
                      </span>
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="text"
                        value={resiMap[t.id_tmc] || ''}
                        onChange={(e) => handleChangeResi(t.id_tmc, e.target.value)}
                        className="w-full px-2 py-1 rounded bg-bsm-panel border border-bsm-border text-[11px]"
                        placeholder="Masukkan nomor resi"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => updatePengiriman(t.id_tmc, 'Dikirim')}
                          disabled={t.status_pengiriman !== 'Belum Dikirim'}
                          className="px-2 py-[3px] rounded border border-bsm-border hover:border-bsm-accent text-[10px] disabled:opacity-50"
                        >
                          Set Dikirim
                        </button>
                        <button
                          onClick={() => updatePengiriman(t.id_tmc, 'Selesai')}
                          disabled={t.status_pengiriman !== 'Dikirim'}
                          className="px-2 py-[3px] rounded bg-bsm-accent hover:bg-bsm-accent2 text-[10px] disabled:opacity-50"
                        >
                          Set Selesai
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default KaryawanDashboard;
