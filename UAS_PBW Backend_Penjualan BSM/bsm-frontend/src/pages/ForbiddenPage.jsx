import { Link } from 'react-router-dom';

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="text-3xl mb-2">403</div>
      <div className="text-sm font-semibold mb-1">Akses Ditolak</div>
      <p className="text-xs text-bsm-muted mb-3 max-w-sm">
        Anda tidak memiliki hak akses untuk halaman ini. Silakan masuk dengan
        akun yang memiliki peran yang sesuai.
      </p>
      <Link
        to="/login"
        className="text-xs px-3 py-1.5 rounded-lg border border-bsm-border hover:border-bsm-accent"
      >
        Kembali ke Login
      </Link>
    </div>
  );
};

export default ForbiddenPage;
