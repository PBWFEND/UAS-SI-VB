import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#ffffff', 
      fontFamily: "'Poppins', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Desain Latar Belakang */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
        zIndex: 0
      }}></div>

      {/* Navbar */}
      <nav style={{ padding: '30px 80px', display: 'flex', alignItems: 'center', zIndex: 1 }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', display: 'flex', alignItems: 'center', gap: '10px' }}>
           💰 <span style={{ color: '#333' }}>SAKU</span>
        </div>
      </nav>

      {/* Styling Margin Top */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        padding: '0 80px', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        zIndex: 1,
        marginTop: '-80px' // Mengurangi space kosong
      }}>
        {/* Konten Kiri */}
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '50px', lineHeight: '1.1', color: '#333', marginBottom: '15px' }}>
            Selamat Datang di <span style={{ color: '#28a745' }}>SAKU</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px', maxWidth: '590px', lineHeight: '1.8' }}>
            Kelola catatan keuangan harianmu dengan lebih mudah, rapi, dan terukur dalam satu aplikasi sederhana. <br />
            <span style={{ color: '#28a745' }}>Saku - "Solusi Atur Keuanganmu"</span>
          </p>
          
          {/* Tombol Mulai Sekarang */}
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              padding: '16px 40px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(40, 167, 69, 0.2)'
            }}
          >
            Mulai Sekarang
          </button>
        </div>

        {/* Visual Kanan */}
        <div style={{ position: 'relative' }}>
            <div style={{ 
                width: '420px', 
                height: '420px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '30px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                border: '1px solid rgba(40, 167, 69, 0.1)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '100px', marginBottom: '20px' }}>📱</div>
                    <div style={{ background: 'white', padding: '15px 25px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                        <div style={{ color: '#28a745', fontWeight: 'bold' }}>Saldo</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Rp 700.000</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;