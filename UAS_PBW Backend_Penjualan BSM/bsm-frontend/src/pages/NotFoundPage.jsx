import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="text-3xl mb-2">404</div>
      <div className="text-sm font-semibold mb-1">Halaman Tidak Ditemukan</div>
      <p className="text-xs text-bsm-muted mb-3 max-w-sm">
        URL yang Anda akses tidak tersedia.
      </p>
      <Link
        to="/"
        className="text-xs px-3 py-1.5 rounded-lg border border-bsm-border hover:border-bsm-accent"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFoundPage;
