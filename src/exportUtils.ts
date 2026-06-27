import ExcelJS from 'exceljs';

/* ------------------------------------------------------------------ *
 *  Date helpers
 * ------------------------------------------------------------------ */
/** "27 Jun 2026" */
export const fmtDate = (v?: string | null): string => {
  if (!v) return '';
  const d = new Date(v);
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** "27 Jun 2026, 02:59 PM" */
export const fmtDateTime = (v?: string | null): string => {
  if (!v) return '';
  const d = new Date(v);
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
};

/* ------------------------------------------------------------------ *
 *  Styled .xlsx export
 * ------------------------------------------------------------------ */
export type CellTone = { font: string; fill: string };

/** Colour presets that mirror the app's chips (ARGB). */
export const tone: Record<string, CellTone> = {
  success: { font: 'FF0F8A4F', fill: 'FFD6F5E9' }, // green  — Safe / high score
  danger: { font: 'FFC2334A', fill: 'FFFFE0E5' }, // red    — Risk / low score
  warning: { font: 'FFB7791F', fill: 'FFFDEFCF' }, // amber  — medium
  info: { font: 'FF2563EB', fill: 'FFDBEAFE' }, // blue   — feature
  brand: { font: 'FF4B45C6', fill: 'FFEAE8FF' }, // indigo — admin / news
};

type Align = 'left' | 'center' | 'right';
type Column = {
  header: string;
  width?: number;
  align?: Align;
  /** Optional per-cell colour based on the value (e.g. Risk → red). */
  tone?: (value: any) => CellTone | undefined;
};

const BRAND = 'FF5B5FE9'; // header fill (brand indigo)
const BRAND_DARK = 'FF4B45C6';
const TITLE_INK = 'FF2B2D5B';
const BAND = 'FFF4F5FC'; // alternating row tint
const GRID = 'FFE6E7F2';

/**
 * Build a polished, branded Excel workbook and download it as .xlsx.
 * Header row is coloured + bold + frozen with an auto-filter; data rows are
 * zebra-striped with thin borders. Values are written as strings so Excel never
 * mis-reads things like "4/5" as a date.
 */
export async function downloadSheet(opts: {
  filename: string;
  sheetName: string;
  title: string;
  columns: Column[];
  rows: (string | number | null | undefined)[][];
}) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'DriveGuardian Admin';
  wb.created = new Date();

  const ws = wb.addWorksheet(opts.sheetName, {
    views: [{ state: 'frozen', ySplit: 3 }],
    properties: { defaultRowHeight: 18 },
  });

  const nCols = opts.columns.length;

  // --- Row 1: brand title ---
  ws.mergeCells(1, 1, 1, nCols);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = opts.title;
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: TITLE_INK } };
  titleCell.alignment = { vertical: 'middle' };
  ws.getRow(1).height = 30;

  // --- Row 2: generated-on subtitle ---
  ws.mergeCells(2, 1, 2, nCols);
  const subCell = ws.getCell(2, 1);
  subCell.value = `DriveGuardian Admin · Exported ${fmtDateTime(new Date().toISOString())} · ${opts.rows.length} record(s)`;
  subCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF8A8DA6' } };
  ws.getRow(2).height = 16;

  // --- Row 3: column headers ---
  const headerRow = ws.getRow(3);
  opts.columns.forEach((c, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = c.header;
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND } };
    cell.alignment = { vertical: 'middle', horizontal: c.align ?? 'left' };
    // White separators between header cells so each column stands apart.
    cell.border = {
      bottom: { style: 'medium', color: { argb: BRAND_DARK } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
    };
  });
  headerRow.height = 24;

  // --- Data rows (zebra striped + per-cell tone colours) ---
  opts.rows.forEach((r, idx) => {
    const row = ws.getRow(idx + 4);
    r.forEach((val, i) => {
      const col = opts.columns[i];
      const cell = row.getCell(i + 1);
      cell.value = val === null || val === undefined ? '' : (val as string | number);
      cell.alignment = { vertical: 'middle', horizontal: col?.align ?? 'left', wrapText: false };

      const t = col?.tone?.(val);
      if (t) {
        // Coloured "badge" cell — stands out from the rest.
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: t.font } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: t.fill } };
      } else {
        cell.font = { name: 'Calibri', size: 11, color: { argb: 'FF22243F' } };
        if (idx % 2 === 1) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BAND } };
        }
      }
      // Full grid: horizontal + vertical lines so every column is separated.
      cell.border = {
        bottom: { style: 'thin', color: { argb: GRID } },
        right: { style: 'thin', color: { argb: GRID } },
        left: { style: 'thin', color: { argb: GRID } },
      };
    });
    row.height = 20;
  });

  // --- Column widths + auto-filter ---
  opts.columns.forEach((c, i) => {
    ws.getColumn(i + 1).width = c.width ?? 20;
  });
  ws.autoFilter = {
    from: { row: 3, column: 1 },
    to: { row: 3, column: nCols },
  };

  // --- Download ---
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${opts.filename}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
