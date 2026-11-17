// Simple PDF export utility using jsPDF and jspdf-autotable
// Install dependencies: npm install jspdf jspdf-autotable

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Export rows to a PDF table.
 * @param {string} filename - Name of the generated PDF file.
 * @param {Array<Array<string|number>>} columns - Header row as array of strings.
 * @param {Array<Array<string|number>>} data - Table data rows.
 */
export function exportPdf(filename, columns, data) {
  const doc = new jsPDF();
  doc.autoTable({
    head: [columns],
    body: data,
    startY: 20,
    styles: { fontSize: 8 },
  });
  doc.save(filename);
}
