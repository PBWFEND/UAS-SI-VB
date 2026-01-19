import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import Alert from '../components/Alert';

const money = (n) =>
  new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n || 0);

const calcOngkir = (items, jarakKm, metode) => {
  const totalQty = items.reduce((s, it) => s + (it.qty || 0), 0);
  if (!totalQty) return 0;
  if (metode === 'Ambil Sendiri') return 0;
  const rate = metode === 'Cepat' ? 3500 : 2000;
  return Math.round(rate * (jarakKm || 0) * totalQty);
};

// ✅ helper base64
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

// ✅ helper URL gambar (ambil base dari VITE_API_URL)
const API = import.meta.env.VITE_API_URL; // contoh "http://localhost:3000/api"
const BASE = API ? API.replace(/\/api\/?$/, '') : 'http://localhost:3000';

const toImgUrl = (imgPath) => {
  if (!imgPath) return null;
  // kalau sudah full url, biarkan
  if (/^https?:\/\//i.test(imgPath)) return imgPath;
  // kalau path "/uploads/produk/xxx.png"
  return `${BASE}${imgPath}`;
};

const ConsumerDashboard = () => {
  const [produk, setProduk] = useState([]);
  const [cart, setCart] = useState([]); // [{id_produk, nama, harga, qty}]
  const [transaksi, setTransaksi] = useState([]);
  const [alamat, setAlamat] = useState('');
  const [jarakKm, setJarakKm] = useState(5);
  const [metode, setMetode] = useState('Standar');
  const [bukti, setBukti] = useState(null);
  const [loadingProduk, setLoadingProduk] = useState(false);
  const [loadingTransaksi, setLoadingTransaksi] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [msg, setMsg] = useState({ type: 'info', text: '' });

  const subtotal = useMemo(
    () =>
      cart.reduce((s, it) => {
        return s + (it.harga || 0) * (it.qty || 0);
      }, 0),
    [cart]
  );

  const ongkir = useMemo(
    () => calcOngkir(cart, jarakKm, metode),
    [cart, jarakKm, metode]
  );

  const total = subtotal + ongkir;

  const fetchProduk = async () => {
    setLoadingProduk(true);
    try {
      const res = await api.get('/produk');
      setProduk(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      setMsg({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Gagal memuat daftar produk dari backend.',
      });
    } finally {
      setLoadingProduk(false);
    }
  };

  const fetchTransaksi = async () => {
    setLoadingTransaksi(true);
    try {
      const res = await api.get('/transaksi');
      setTransaksi(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      setMsg({
        type: 'error',
        text:
          err.response?.data?.message || 'Gagal memuat riwayat transaksi Anda.',
      });
    } finally {
      setLoadingTransaksi(false);
    }
  };
  const isPending = (t) => {
    const s = String(t.status_pembayaran || '').toLowerCase();
    return s === 'menunggu verifikasi' || s === 'pending';
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Batalkan pesanan ini?')) return;
    await api.delete(`/transaksi/${id}`);
    // refresh list transaksi
    fetchTransaksi();
  };

  useEffect(() => {
    fetchProduk();
    fetchTransaksi();
  }, []);

  const addToCart = (p) => {
    const qty = 1;
    setCart((prev) => {
      const existing = prev.find((x) => x.id_produk === p.id_produk);
      if (existing) {
        return prev.map((x) =>
          x.id_produk === p.id_produk ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [
        ...prev,
        {
          id_produk: p.id_produk,
          nama_produk: p.nama_produk,
          harga: p.harga,
          qty,
        },
      ];
    });
  };

  const updateQty = (id_produk, qty) => {
    if (qty <= 0) return;
    setCart((prev) =>
      prev.map((x) => (x.id_produk === id_produk ? { ...x, qty } : x))
    );
  };

  const removeFromCart = (id_produk) => {
    setCart((prev) => prev.filter((x) => x.id_produk !== id_produk));
  };

  const handleCheckout = async () => {
    setMsg({ type: 'info', text: '' });

    if (!cart.length) {
      setMsg({ type: 'error', text: 'Keranjang masih kosong.' });
      return;
    }

    if (!alamat.trim()) {
      setMsg({ type: 'error', text: 'Alamat pengiriman harus diisi.' });
      return;
    }

    // ✅ penting: batasi ukuran file agar base64 tidak membunuh request
    if (bukti && bukti.size > 2 * 1024 * 1024) {
      setMsg({
        type: 'error',
        text: 'Ukuran bukti pembayaran terlalu besar (maks 2MB). Silakan kompres gambar atau pilih file yang lebih kecil.',
      });
      return;
    }

    setCheckoutLoading(true);
    try {
      const buktiBase64 = await fileToBase64(bukti);

      const payload = {
        tanggal: new Date().toISOString().slice(0, 10),
        total_harga: total,
        biaya_ongkir: ongkir,
        metode_pengiriman: metode,
        bukti_pembayaran: buktiBase64,
        alamat_pengiriman: alamat,
        jarak_km: jarakKm,
        items: cart.map((c) => ({
          id_produk: c.id_produk,
          qty: c.qty,
        })),
      };

      const res = await api.post('/transaksi', payload);

      setMsg({
        type: 'success',
        text: res.data?.message || 'Transaksi berhasil dibuat.',
      });

      setCart([]);
      setBukti(null);
      await fetchProduk(); // ✅ stok berubah
      await fetchTransaksi();
    } catch (err) {
      console.error(err);

      // ✅ kalau request ditolak karena payload terlalu besar
      if (err.response?.status === 413) {
        setMsg({
          type: 'error',
          text: 'Bukti pembayaran terlalu besar untuk dikirim. Kecilkan ukuran gambar atau naikkan limit express.json di backend.',
        });
      } else if (err.response?.status === 422) {
        const errors = err.response.data?.errors || [];
        const text = errors.map((e) => `- ${e.msg}`).join('\n');
        setMsg({ type: 'error', text: `Validasi gagal:\n${text}` });
      } else {
        setMsg({
          type: 'error',
          text:
            err.response?.data?.message || 'Checkout gagal. Silakan coba lagi.',
        });
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  const statusBadge = (status) => {
    if (status === 'Terverifikasi')
      return 'bg-emerald-900/70 text-emerald-100 border-emerald-500';
    if (status === 'Ditolak')
      return 'bg-amber-900/70 text-amber-100 border-amber-500';
    return 'bg-slate-800/80 text-slate-100 border-slate-500';
  };

  return (
    <div className="space-y-6">
      <Alert
        type={msg.type}
        message={msg.text}
        onClose={() => setMsg({ type: 'info', text: '' })}
      />

      <div className="grid md:grid-cols-[1.4fr,0.9fr] gap-4">
        {/* daftar produk */}
        <div>
          <h2 className="text-sm font-semibold mb-2">Daftar Produk</h2>
          {loadingProduk ? (
            <div className="text-xs text-bsm-muted">Memuat produk...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {produk.map((p) => (
                <div
                  key={p.id_produk}
                  className="bg-bsm-card border border-bsm-border rounded-xl p-3 text-xs flex flex-col gap-2"
                >
                  {toImgUrl(p.img) ? (
                    <img
                      src={toImgUrl(p.img)}
                      alt={p.nama_produk}
                      className="w-full h-32 object-cover rounded-lg mb-1"
                    />
                  ) : (
                    <div className="w-full h-32 bg-bsm-panel rounded-lg grid place-items-center text-bsm-muted text-[11px]">
                      No Image
                    </div>
                  )}

                  <div className="font-semibold">{p.nama_produk}</div>
                  <div className="text-bsm-muted text-[11px]">
                    {p.jenis} • Stok: {p.stok} {p.satuan}
                  </div>
                  <div className="font-mono text-[11px]">
                    Rp {money(p.harga)}/{p.satuan}
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="mt-1 text-[11px] px-3 py-1.5 rounded-lg bg-bsm-accent hover:bg-bsm-accent2"
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              ))}
              {!produk.length && !loadingProduk && (
                <div className="text-xs text-bsm-muted">
                  Belum ada produk terdaftar.
                </div>
              )}
            </div>
          )}
        </div>

        {/* keranjang + ongkir */}
        <div className="space-y-4">
          <div className="bg-bsm-card border border-bsm-border rounded-xl p-3 text-xs">
            <h2 className="font-semibold mb-2">Keranjang</h2>
            {cart.length === 0 ? (
              <div className="text-bsm-muted text-[11px]">
                Keranjang masih kosong.
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.id_produk}
                    className="grid grid-cols-[1fr,70px,90px,30px] gap-2 items-center"
                  >
                    <div>{item.nama_produk}</div>
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) =>
                        updateQty(item.id_produk, Number(e.target.value))
                      }
                      className="w-full px-2 py-1 rounded bg-bsm-panel border border-bsm-border text-center text-[11px]"
                    />
                    <div className="font-mono text-[11px] text-right">
                      Rp {money(item.harga * item.qty)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id_produk)}
                      className="text-[12px] text-bsm-muted hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-bsm-card border border-bsm-border rounded-xl p-3 text-xs space-y-3">
            <h3 className="font-semibold mb-1">Pengiriman & Ongkir</h3>
            <div>
              <label className="block mb-1">Alamat Pengiriman</label>
              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-bsm-panel border border-bsm-border text-xs resize-y outline-none focus:ring-1 focus:ring-bsm-accent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Jarak (km)</label>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={jarakKm}
                  onChange={(e) => setJarakKm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-bsm-panel border border-bsm-border text-xs outline-none focus:ring-1 focus:ring-bsm-accent"
                />
              </div>
              <div>
                <label className="block mb-1">Metode Kirim</label>
                <select
                  value={metode}
                  onChange={(e) => setMetode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bsm-panel border border-bsm-border text-xs outline-none focus:ring-1 focus:ring-bsm-accent"
                >
                  <option value="Standar">Standar</option>
                  <option value="Cepat">Cepat</option>
                  <option value="Ambil Sendiri">Ambil Sendiri</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block mb-1">
                Upload Bukti Pembayaran (opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBukti(e.target.files?.[0] || null)}
                className="w-full text-[11px]"
              />
              {bukti && (
                <div className="text-[11px] text-bsm-muted mt-1">
                  File: {bukti.name} ({Math.round(bukti.size / 1024)} KB)
                </div>
              )}
            </div>

            <div className="border-t border-bsm-border pt-2 mt-2 font-mono text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {money(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkir ({metode})</span>
                <span>Rp {money(ongkir)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rp {money(total)}</span>
              </div>
            </div>

            <button
              disabled={!cart.length || checkoutLoading}
              onClick={handleCheckout}
              className="mt-2 w-full py-2 text-xs rounded-lg bg-gradient-to-br from-bsm-accent to-bsm-accent2 hover:brightness-110 disabled:opacity-50"
            >
              {checkoutLoading ? 'Memproses...' : 'Checkout'}
            </button>
          </div>

          <div className="bg-bsm-card border border-bsm-border rounded-xl p-3 text-xs">
            <h3 className="font-semibold mb-2">Riwayat Transaksi Anda</h3>
            {loadingTransaksi ? (
              <div className="text-bsm-muted text-[11px]">
                Memuat riwayat...
              </div>
            ) : !transaksi.length ? (
              <div className="text-bsm-muted text-[11px]">
                Belum ada transaksi.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-auto">
                {transaksi
                  .slice()
                  .sort((a, b) => b.id_tmc - a.id_tmc)
                  .map((t) => (
                    <div
                      key={t.id_tmc}
                      className="border border-bsm-border rounded-lg px-3 py-2 flex justify-between gap-3"
                    >
                      <div>
                        <div className="font-mono text-[11px] font-semibold">
                          {t.nomor_invoice || `#${t.id_tmc}`}
                        </div>
                        <div className="text-bsm-muted text-[11px]">
                          {t.tanggal} • Metode: {t.metode_pengiriman}
                        </div>
                        <div className="mt-1 text-[11px]">
                          <span
                            className={`inline-block px-2 py-[2px] mr-2 rounded-full border text-[10px] ${statusBadge(
                              t.status_pembayaran
                            )}`}
                          >
                            Pembayaran: {t.status_pembayaran}
                          </span>
                          <span className="inline-block px-2 py-[2px] rounded-full border border-slate-600 bg-slate-800/50 text-[10px]">
                            Pengiriman: {t.status_pengiriman}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-[11px] font-mono">
                        <div>Total</div>
                        <div className="font-semibold">
                          Rp {money(t.total_harga)}
                        </div>
                        {isPending(t) && (
                          <button
                            onClick={() => handleCancel(t.id_tmc)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-sm"
                          >
                            Batalkan
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
