/** Formats a number as sample currency, e.g. 1234.5 -> "$1,234.50". */
export function formatMoney(value, symbol = '$', decimals = 2) {
  const safe = Number.isFinite(value) ? value : 0;
  const text = Math.abs(safe).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${safe < 0 ? '-' : ''}${symbol}${text}`;
}

/** Whole-number money for compact labels, e.g. "$500". */
export function formatWhole(value, symbol = '$') {
  return formatMoney(Math.round(value), symbol, 0);
}

/** "2026-09-20" -> "20 Sep 2026" */
export function formatDate(iso) {
  if (!iso) return '';
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Adds whole months to today and returns e.g. "March 2027". */
export function monthFromNow(months) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
