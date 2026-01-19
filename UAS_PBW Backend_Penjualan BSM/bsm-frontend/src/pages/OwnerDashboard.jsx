import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import Alert from '../components/Alert';

const money = (n) =>
  new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n || 0);

const OwnerDashboard = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: 'info', text: '' });

  const fetchTransaksi = async () => {
    setLoading(true);
    try {
      // Owner: backend mengizinkan melihat semua transaksi (read-only)
      const res = await api.get('/transaksi');
      const data = res.data?.data || res.data || [];
      setTransaksi(data);
    } catch (err) {
      console.error(err);
      setMsg({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Gagal memuat data transaksi untuk owner.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const metrics = useMemo(() => {
    const verified = transaksi.filter(
      (t) => t.status_pembayaran === 'Terverifikasi'
    );

    const totalTransaksi = verified.length;
    const totalPendapatan = verified.reduce(
      (sum, t) => sum + (t.total_harga || 0),
      0
    );

    // hitung total qty dari detail_penjualan di transaksi terverifikasi
    let totalQty = 0;
    verified.forEach((t) => {
      const details = t.detail_penjualan || [];
      details.forEach((d) => {
        totalQty += d.qty || 0;
      });
    });

    return { totalTransaksi, totalPendapatan, totalQty };
  }, [transaksi]);

  const chartData = useMemo(() => {
    const { totalTransaksi, totalPendapatan, totalQty } = metrics;
    const values = [totalTransaksi, totalPendapatan, totalQty];
    const labels = ['Transaksi', 'Pendapatan', 'Terjual (kg)'];
    const max = Math.max(...values) || 1;

    return values.map((v, idx) => ({
      label: labels[idx],
      value: v,
      width: `${Math.round((v / max) * 100)}%`,
    }));
  }, [metrics]);

  return (
    <div className="space-y-6">
      <Alert
        type={msg.type}
        message={msg.text}
        onClose={() => setMsg({ type: 'info', text: '' })}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-bsm-card border border-bsm-border rounded-xl p-4 text-xs">
          <h2 className="font-semibold text-sm mb-3">
            Ringkasan Penjualan (Terverifikasi)
          </h2>
          {loading ? (
            <div className="text-bsm-muted text-[11px]">
              Memuat ringkasan...
            </div>
          ) : (
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Total Transaksi</span>
                <b>{metrics.totalTransaksi}</b>
              </li>
              <li className="flex justify-between">
                <span>Total Pendapatan</span>
                <b>Rp {money(metrics.totalPendapatan)}</b>
              </li>
              <li className="flex justify-between">
                <span>Jumlah Produk Terjual</span>
                <b>{metrics.totalQty} kg</b>
              </li>
            </ul>
          )}
          <p className="text-[11px] text-bsm-muted mt-3">
            Angka di atas hanya menghitung transaksi dengan status{' '}
            <b>Terverifikasi</b>. Nominal pendapatan termasuk ongkir.
          </p>
        </div>

        <div className="bg-bsm-card border border-bsm-border rounded-xl p-4 text-xs">
          <h2 className="font-semibold text-sm mb-3">Grafik Penjualan</h2>
          {loading ? (
            <div className="text-bsm-muted text-[11px]">Memuat grafik...</div>
          ) : (
            <div className="space-y-3">
              {chartData.map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>{m.label}</span>
                    <span className="font-mono">
                      {m.label === 'Pendapatan'
                        ? `Rp ${money(m.value)}`
                        : m.value}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-bsm-panel border border-bsm-border overflow-hidden">
                    <div
                      style={{ width: m.width }}
                      className="h-full bg-gradient-to-r from-bsm-accent to-bsm-accent2"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-bsm-card border border-bsm-border rounded-xl p-4 text-xs">
        <h3 className="font-semibold text-sm mb-2">Informasi Tambahan</h3>
        <p className="text-[11px] text-bsm-muted">
          Dashboard ini bersifat <b>read-only</b>. Owner tidak dapat mengubah
          transaksi, hanya memantau performa penjualan berdasarkan transaksi
          yang telah diverifikasi oleh Admin.
        </p>
      </div>
    </div>
  );
};

export default OwnerDashboard;
