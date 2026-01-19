import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import Alert from '../components/Alert';

const money = (n) =>
  new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n || 0);

const AdminDashboard = () => {
  const [produk, setProduk] = useState([]);
  const [transaksiAktif, setTransaksiAktif] = useState([]);
  const [transaksiArsip, setTransaksiArsip] = useState([]);
  const [karyawans, setKaryawans] = useState([]);
  const [assignMap, setAssignMap] = useState({});
  const [loadingProduk, setLoadingProduk] = useState(false);
  const [loadingTransaksi, setLoadingTransaksi] = useState(false);
  const [loadingKaryawan, setLoadingKaryawan] = useState(false);
  const [msg, setMsg] = useState({ type: 'info', text: '' });
const [imgFileMap, setImgFileMap] = useState({});
const [uploadingId, setUploadingId] = useState(null);


  const today = new Date().toISOString().slice(0, 10);

  const summary = useMemo(() => {
    const totalAktif = transaksiAktif.length;
    const pendapatanHariIni = transaksiAktif
      .filter((t) => (t.tanggal || '').slice(0, 10) === today)
      .reduce((sum, t) => sum + (t.total_harga || 0), 0);

    return { totalAktif, pendapatanHariIni };
  }, [transaksiAktif, today]);

  const showError = useCallback((err, fallback) => {
    console.error(err);
    if (err.response?.status === 422) {
      const errors = err.response.data?.errors || [];
      const text = errors.map((e) => `- ${e.msg}`).join('\n');
      setMsg({ type: 'error', text: `Validasi gagal:\n${text}` });
    } else {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || fallback,
      });
    }
  }, []);

  const fetchProduk = useCallback(async () => {
    setLoadingProduk(true);
    try {
      const res = await api.get('/produk');
      setProduk(res.data?.data || res.data || []);
    } catch (err) {
      showError(err, 'Gagal memuat daftar produk.');
    } finally {
      setLoadingProduk(false);
    }
  }, [showError]);

  const fetchKaryawans = useCallback(async () => {
    setLoadingKaryawan(true);
    try {
      const res = await api.get('/admin/users');
      const all = res.data?.data || res.data || [];
      setKaryawans(all.filter((u) => u.role === 'KARYAWAN'));
    } catch (err) {
      showError(err, 'Gagal memuat daftar karyawan.');
    } finally {
      setLoadingKaryawan(false);
    }
  }, [showError]);

  const fetchTransaksi = useCallback(async () => {
    setLoadingTransaksi(true);
    try {
      const resAktif = await api.get('/transaksi', {
        params: { status_arsip: 'AKTIF' },
      });
      const aktif = resAktif.data?.data || resAktif.data || [];
      setTransaksiAktif(aktif);

      const resArsip = await api.get('/transaksi', {
        params: { status_arsip: 'ARSIP' },
      });
      const arsip = resArsip.data?.data || resArsip.data || [];
      setTransaksiArsip(arsip);

      const map = {};
      aktif.forEach((t) => {
        if (t.id_karyawan) map[t.id_tmc] = t.id_karyawan;
      });
      setAssignMap(map);
    } catch (err) {
      showError(err, 'Gagal memuat daftar transaksi.');
    } finally {
      setLoadingTransaksi(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchProduk();
    fetchKaryawans();
    fetchTransaksi();
  }, [fetchProduk, fetchKaryawans, fetchTransaksi]);

  const handleStokChange = (id_produk, value) => {
    setProduk((prev) =>
      prev.map((p) => (p.id_produk === id_produk ? { ...p, stok: value } : p))
    );
  };

  const handleStokBlur = async (id_produk, value) => {
    try {
      await api.put(`/produk/${id_produk}`, { stok: Number(value) });
      setMsg({ type: 'success', text: 'Stok berhasil diperbarui.' });
    } catch (err) {
      showError(err, 'Gagal memperbarui stok produk.');
      fetchProduk();
    }
  };

  const handleSelectKaryawan = (id_tmc, id_karyawan) => {
    setAssignMap((prev) => ({
      ...prev,
      [id_tmc]: Number(id_karyawan) || '',
    }));
  };

  const handleVerif = async (id_tmc) => {
    const id_karyawan = assignMap[id_tmc];
    if (!id_karyawan) {
      setMsg({
        type: 'error',
        text: 'Pilih karyawan terlebih dahulu sebelum verifikasi.',
      });
      return;
    }
    try {
      const res = await api.put(`/transaksi/${id_tmc}`, {
        status_pembayaran: 'Terverifikasi',
        id_karyawan,
      });
      setMsg({
        type: 'success',
        text: res.data?.message || 'Status pembayaran terverifikasi.',
      });
      fetchTransaksi();
    } catch (err) {
      showError(err, 'Gagal memverifikasi pembayaran.');
    }
  };

  const handleTolak = async (id_tmc) => {
    if (!window.confirm('Tolak pembayaran transaksi ini?')) return;
    try {
      const res = await api.put(`/transaksi/${id_tmc}`, {
        status_pembayaran: 'Ditolak',
      });
      setMsg({
        type: 'success',
        text: res.data?.message || 'Status pembayaran ditolak.',
      });
      fetchTransaksi();
    } catch (err) {
      showError(err, 'Gagal menolak pembayaran.');
    }
  };

  const handleArsip = async (id_tmc) => {
    if (!window.confirm('Arsipkan transaksi ini?')) return;
    try {
      const res = await api.put(`/transaksi/${id_tmc}`, {
        status_arsip: 'ARSIP',
      });
      setMsg({
        type: 'success',
        text: res.data?.message || 'Transaksi berhasil diarsipkan.',
      });
      fetchTransaksi();
    } catch (err) {
      showError(err, 'Gagal mengarsipkan transaksi.');
    }
  };
  const handleHardDelete = async (id) => {
    if (
      !window.confirm('Hapus permanen transaksi ini? (Tidak bisa dikembalikan)')
    )
      return;
    await api.delete(`/admin/transaksi/${id}`);
    fetchTransaksi();
  };
// ✅ helper base url backend untuk tampil gambar
const API = import.meta.env.VITE_API_URL; // contoh "http://localhost:3000/api"
const BASE = API ? API.replace(/\/api\/?$/, '') : 'http://localhost:3000';

const toImgUrl = (imgPath) => {
  if (!imgPath) return null;
  if (/^https?:\/\//i.test(imgPath)) return imgPath;
  return `${BASE}${imgPath}`;
};

const handlePickImage = (id_produk, file) => {
  setImgFileMap((prev) => ({ ...prev, [id_produk]: file || null }));
};

const handleUploadImage = async (id_produk) => {
  const file = imgFileMap[id_produk];
  if (!file) {
    setMsg({ type: 'error', text: 'Pilih gambar dulu.' });
    return;
  }

  const fd = new FormData();
  fd.append('image', file);

  setUploadingId(id_produk);
  try {
    // endpoint upload khusus (ADMIN)
    const res = await api.put(`/produk/${id_produk}/image`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setMsg({ type: 'success', text: res.data?.message || 'Upload gambar berhasil.' });

    // refresh produk supaya img terbaru tampil
    fetchProduk();

    // reset file input map
    setImgFileMap((prev) => ({ ...prev, [id_produk]: null }));
  } catch (err) {
    showError(err, 'Gagal upload gambar produk.');
  } finally {
    setUploadingId(null);
  }
};

  const statusBadgePembayaran = (status) => {
    if (status === 'Terverifikasi')
      return 'bg-emerald-900/70 text-emerald-100 border-emerald-500';
    if (status === 'Ditolak')
      return 'bg-amber-900/70 text-amber-100 border-amber-500';
    return 'bg-slate-800/80 text-slate-100 border-slate-500';
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

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-bsm-card border border-bsm-border rounded-xl p-4 text-xs">
          <h2 className="font-semibold text-sm mb-3">Ringkasan Admin</h2>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Total Pesanan (Aktif)</span>
              <b>{summary.totalAktif}</b>
            </li>
            <li className="flex justify-between">
              <span>Pendapatan Hari Ini</span>
              <b>Rp {money(summary.pendapatanHariIni)}</b>
            </li>
          </ul>
        </div>

        <div className="bg-bsm-card border border-bsm-border rounded-xl p-4 text-xs">
          <h2 className="font-semibold text-sm mb-3">Manajemen Stok</h2>
          {loadingProduk ? (
            <div className="text-bsm-muted text-[11px]">Memuat produk...</div>
          ) : !produk.length ? (
            <div className="text-bsm-muted text-[11px]">Belum ada produk.</div>
          ) : (
            <div className="max-h-60 overflow-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead className="bg-bsm-panel sticky top-0 z-10">
                  <tr className="border-b border-bsm-border">
                    <th className="px-2 py-2 text-left">Produk</th>
                    <th className="px-2 py-2 text-left">Jenis</th>
                    <th className="px-2 py-2 text-right">Harga</th>
                    <th className="px-2 py-2 text-center">Stok</th>
                    <th className="px-2 py-2 text-left">Gambar</th>
                  </tr>
                </thead>
                <tbody>
                  {produk.map((p) => (
                    <tr
                      key={p.id_produk}
                      className="border-b border-bsm-border/60"
                    >
                      <td className="px-2 py-1">{p.nama_produk}</td>
                      <td className="px-2 py-1">{p.jenis}</td>
                      <td className="px-2 py-1 text-right font-mono">
                        Rp {money(p.harga)}/{p.satuan}
                      </td>
                      <td className="px-2 py-1 text-center">
                        <input
                          type="number"
                          min={0}
                          value={p.stok}
                          onChange={(e) =>
                            handleStokChange(
                              p.id_produk,
                              Number(e.target.value)
                            )
                          }
                          onBlur={(e) =>
                            handleStokBlur(p.id_produk, Number(e.target.value))
                          }
                          className="w-20 px-2 py-1 rounded bg-bsm-panel border border-bsm-border text-center text-[11px]"
                        />
                      </td>
                      <td className="px-2 py-1">
  <div className="flex items-center gap-2">
    {toImgUrl(p.img) ? (
      <img
        src={toImgUrl(p.img)}
        alt={p.nama_produk}
        className="w-14 h-10 object-cover rounded border border-bsm-border"
      />
    ) : (
      <div className="w-14 h-10 rounded border border-bsm-border bg-bsm-panel grid place-items-center text-bsm-muted text-[10px]">
        -
      </div>
    )}

    <div className="flex flex-col gap-1">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handlePickImage(p.id_produk, e.target.files?.[0])}
        className="text-[10px]"
      />
      <button
        onClick={() => handleUploadImage(p.id_produk)}
        disabled={uploadingId === p.id_produk}
        className="px-2 py-1 rounded bg-bsm-panel border border-bsm-border hover:border-bsm-accent text-[10px] disabled:opacity-50"
      >
        {uploadingId === p.id_produk ? 'Uploading...' : 'Upload'}
      </button>
    </div>
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

      <div className="bg-bsm-card border border-bsm-border rounded-xl p-4 text-xs">
        <h2 className="font-semibold text-sm mb-3">Verifikasi Pembayaran</h2>
        {loadingTransaksi ? (
          <div className="text-bsm-muted text-[11px]">Memuat transaksi...</div>
        ) : !transaksiAktif.length ? (
          <div className="text-bsm-muted text-[11px]">
            Belum ada transaksi aktif.
          </div>
        ) : (
          <div className="overflow-auto max-h-[420px]">
            <table className="w-full text-[11px] border-collapse">
              <thead className="bg-bsm-panel sticky top-0 z-10">
                <tr className="border-b border-bsm-border">
                  <th className="px-2 py-2 text-left">Invoice</th>
                  <th className="px-2 py-2 text-left">Tanggal</th>
                  <th className="px-2 py-2 text-left">Konsumen</th>
                  <th className="px-2 py-2 text-left">Pembayaran</th>
                  <th className="px-2 py-2 text-left">Pengiriman</th>
                  <th className="px-2 py-2 text-right">Total</th>
                  <th className="px-2 py-2 text-left">Karyawan</th>
                  <th className="px-2 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transaksiAktif.map((t) => (
                  <tr
                    key={t.id_tmc}
                    className="border-b border-bsm-border/60 hover:bg-bsm-panel/70"
                  >
                    <td className="px-2 py-1 font-mono">
                      {t.nomor_invoice || `#${t.id_tmc}`}
                    </td>
                    <td className="px-2 py-1">
                      {(t.tanggal || '').slice(0, 10)}
                    </td>
                    <td className="px-2 py-1">
                      {t.konsumen?.nama || `User #${t.id_konsumen}`}
                    </td>

                    <td className="px-2 py-1">
                      <span
                        className={`inline-block px-2 py-[2px] rounded-full border ${statusBadgePembayaran(
                          t.status_pembayaran
                        )}`}
                      >
                        {t.status_pembayaran}
                      </span>
                    </td>

                    <td className="px-2 py-1">
                      <span
                        className={`inline-block px-2 py-[2px] rounded-full border ${statusBadgePengiriman(
                          t.status_pengiriman
                        )}`}
                      >
                        {t.status_pengiriman}
                      </span>
                    </td>

                    <td className="px-2 py-1 text-right font-mono">
                      Rp {money(t.total_harga)}
                    </td>

                    <td className="px-2 py-1">
                      <select
                        disabled={t.status_pembayaran === 'Terverifikasi'}
                        value={assignMap[t.id_tmc] || ''}
                        onChange={(e) =>
                          handleSelectKaryawan(t.id_tmc, e.target.value)
                        }
                        className="w-full px-2 py-1 rounded bg-bsm-panel border border-bsm-border text-[11px] outline-none focus:ring-1 focus:ring-bsm-accent"
                      >
                        <option value="">
                          {loadingKaryawan
                            ? 'Memuat...'
                            : 'Pilih karyawan pengirim'}
                        </option>
                        {karyawans.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.nama} ({k.username})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-2 py-1">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => handleVerif(t.id_tmc)}
                            disabled={t.status_pembayaran === 'Terverifikasi'}
                            className="px-2 py-[3px] rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-[10px]"
                          >
                            Set Terverifikasi
                          </button>
                          <button
                            onClick={() => handleTolak(t.id_tmc)}
                            disabled={t.status_pembayaran === 'Ditolak'}
                            className="px-2 py-[3px] rounded bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-[10px]"
                          >
                            Tolak
                          </button>
                        </div>

                        <button
                          onClick={() => handleArsip(t.id_tmc)}
                          disabled={t.status_arsip === 'ARSIP'}
                          className="mt-1 px-2 py-[3px] rounded border border-bsm-border hover:border-bsm-accent text-[10px]"
                        >
                          Arsipkan
                        </button>
                        <button
                          onClick={() => handleHardDelete(t.id_tmc)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-rose-500 text-rose-600 text-sm"
                        >
                          Hapus Permanen
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

      <div className="bg-bsm-card border border-bsm-border rounded-xl p-4 text-xs">
        <h2 className="font-semibold text-sm mb-3">Arsip Transaksi</h2>
        {!transaksiArsip.length ? (
          <div className="text-bsm-muted text-[11px]">
            Belum ada transaksi yang diarsipkan.
          </div>
        ) : (
          <div className="overflow-auto max-h-[360px]">
            <table className="w-full text-[11px] border-collapse">
              <thead className="bg-bsm-panel sticky top-0 z-10">
                <tr className="border-b border-bsm-border">
                  <th className="px-2 py-2 text-left">Invoice</th>
                  <th className="px-2 py-2 text-left">Tanggal</th>
                  <th className="px-2 py-2 text-left">Konsumen</th>
                  <th className="px-2 py-2 text-right">Total</th>
                  <th className="px-2 py-2 text-left">Pembayaran</th>
                  <th className="px-2 py-2 text-left">Pengiriman</th>
                </tr>
              </thead>
              <tbody>
                {transaksiArsip.map((t) => (
                  <tr key={t.id_tmc} className="border-b border-bsm-border/60">
                    <td className="px-2 py-1 font-mono">
                      {t.nomor_invoice || `#${t.id_tmc}`}
                    </td>
                    <td className="px-2 py-1">
                      {(t.tanggal || '').slice(0, 10)}
                    </td>
                    <td className="px-2 py-1">
                      {t.konsumen?.nama || `User #${t.id_konsumen}`}
                    </td>
                    <td className="px-2 py-1 text-right font-mono">
                      Rp {money(t.total_harga)}
                    </td>
                    <td className="px-2 py-1">{t.status_pembayaran}</td>
                    <td className="px-2 py-1">{t.status_pengiriman}</td>
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

export default AdminDashboard;
