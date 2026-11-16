import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pageCount, onChange }) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav className="u-pager" aria-label="Halaman">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={14} /> Sebelumnya
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={p === page ? 'on' : ''}
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button type="button" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
        Selanjutnya <ChevronRight size={14} />
      </button>
    </nav>
  );
}
