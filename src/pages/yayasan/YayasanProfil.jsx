import { Link } from 'react-router-dom';
import { User, Shield, Mail, Phone, MapPin, Award, Home } from 'lucide-react';
import { useYayasan } from '../../context/YayasanContext';
import { BASE } from '../../data/yayasanData';

export default function YayasanProfil() {
  const { yayasanInfo } = useYayasan();

  return (
    <div className="yys-page">
      <div className="yys-header-area">
        <div className="yys-breadcrumb">
          <Link to={BASE}>
            <Home size={14} style={{ verticalAlign: 'middle', marginRight: 2 }} /> Beranda
          </Link>
          <span>/</span>
          <Link to={`${BASE}/profil`}>Sistem</Link>
          <span>/</span>
          <span className="active">Profil Saya</span>
        </div>
        <h1 className="yys-title">Profil Otorisator Utama Yayasan</h1>
      </div>

      <div className="yys-table-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#450a0a',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={42} />
          </div>

          <div>
            <span className="yys-pill-badge red">{yayasanInfo.tag}</span>
            <h2 style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.35rem', color: '#0f172a' }}>
              {yayasanInfo.name}
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {yayasanInfo.position} • {yayasanInfo.role}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', fontSize: '0.82rem' }}>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Mail size={15} /> Alamat Email Resmi:
            </span>
            <strong>{yayasanInfo.email}</strong>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Phone size={15} /> Kontak Telepon / Sekretariat:
            </span>
            <strong>{yayasanInfo.phone}</strong>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <MapPin size={15} /> Ruang Kantor / Sekretariat Yayasan:
            </span>
            <strong>{yayasanInfo.office}</strong>
          </div>

          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: 8, border: '1px solid #bfdbfe', gridColumn: 'span 2' }}>
            <span style={{ color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontWeight: 700 }}>
              <Award size={16} /> Wewenang Otorisasi Anggaran:
            </span>
            <p style={{ margin: 0, color: '#1e3a8a', fontSize: '0.78rem', lineHeight: 1.45 }}>
              Berdasarkan Statuta Yayasan Pendidikan Adzkia TA 2024/2025, Ketua Pengurus Yayasan memiliki hak otorisasi tunggal atas pengeluaran anggaran di atas batas ambang operasional rektorat, investasi sarana prasarana strategis, belanja modal universitas, serta disposisi perbankan via BSI Cash Management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
