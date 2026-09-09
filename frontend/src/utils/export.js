const escapeCsv = (value) => {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const downloadCsv = (filename, rows) => {
  if (!Array.isArray(rows) || rows.length === 0) return false;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers,
    ...rows.map((row) => headers.map((key) => escapeCsv(row[key]))),
  ]
    .map((line) => line.join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return true;
};

export const printCurrentPage = () => window.print();
