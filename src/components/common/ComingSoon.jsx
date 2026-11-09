import { Construction } from 'lucide-react';

export default function ComingSoon({ title }) {
  return (
    <div className="page-head">
      <h1>{title}</h1>
      <div className="card coming-soon">
        <Construction size={32} />
        <p>Halaman ini akan dibuat pada tahap berikutnya.</p>
      </div>
    </div>
  );
}