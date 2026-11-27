import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Ekspor laporan ke PDF (tabel sederhana). `head` = array judul kolom, `body` = array baris.
export function exportReportPdf({ filename, title, subtitle, head, body, landscape = true }) {
  const doc = new jsPDF({ orientation: landscape ? 'landscape' : 'portrait', unit: 'pt', format: 'a4' });
  doc.setFontSize(14);
  doc.setTextColor(22, 26, 119);
  doc.text(title, 40, 40);
  if (subtitle) {
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, 40, 56);
  }
  autoTable(doc, {
    head: [head],
    body,
    startY: subtitle ? 70 : 58,
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [22, 26, 119] },
    alternateRowStyles: { fillColor: [244, 246, 253] },
  });
  doc.save(filename);
}
