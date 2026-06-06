import * as XLSX from "xlsx";

export function extractTextFromExcel(buffer: Buffer): string {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const lines: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    lines.push(`=== Sheet: ${sheetName} ===`);

    const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(
      sheet,
      { header: 1, defval: "" },
    );

    for (const row of rows) {
      const cells = row
        .map((cell) => String(cell ?? "").trim())
        .filter(Boolean);
      if (cells.length > 0) {
        lines.push(cells.join(" | "));
      }
    }
  }

  return lines.join("\n").slice(0, MAX_EXTRACTED_TEXT_LENGTH);
}

export function isAllowedExcelFile(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".xlsx") || lower.endsWith(".xls");
}

export const ALLOWED_EXCEL_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/octet-stream",
]);

export function isAllowedExcelMimeType(mimeType: string): boolean {
  return ALLOWED_EXCEL_MIME_TYPES.has(mimeType);
}

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
export const MAX_EXTRACTED_TEXT_LENGTH = 12000;
