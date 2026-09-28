/**
 * Official RAWF Standardized Date Utilities
 * Ensures uniform date formatting across Appoint Officer, ID Cards, Dossiers, and Admin Console.
 * Standard format: DD/MM/YYYY (e.g. 20/12/1995, 11/09/2024, 11/09/2027)
 */

const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

/**
 * Converts any date string (ISO, DD/MM/YYYY, DD-MM-YYYY, DD-MMM-YYYY) into HTML5 input value YYYY-MM-DD
 */
export function toInputDate(value: string | undefined | null): string {
  if (!value) return '';
  const trimmed = value.trim();

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // If DD/MM/YYYY or DD-MM-YYYY
  const slashDashMatch = trimmed.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (slashDashMatch) {
    const day = slashDashMatch[1].padStart(2, '0');
    const month = slashDashMatch[2].padStart(2, '0');
    const year = slashDashMatch[3];
    return `${year}-${month}-${day}`;
  }

  // If DD-MMM-YYYY (e.g., 11-SEP-2024 or 01-JAN-2024)
  const mmmMatch = trimmed.match(/^(\d{1,2})[\/\-\.]([A-Za-z]{3})[\/\-\.](\d{4})$/);
  if (mmmMatch) {
    const day = mmmMatch[1].padStart(2, '0');
    const monthIdx = MONTH_NAMES.indexOf(mmmMatch[2].toUpperCase());
    if (monthIdx !== -1) {
      const month = String(monthIdx + 1).padStart(2, '0');
      const year = mmmMatch[3];
      return `${year}-${month}-${day}`;
    }
  }

  // Try standard Date parse
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return '';
}

/**
 * Converts any date or HTML5 date input YYYY-MM-DD into Standard Official RAWF format: DD/MM/YYYY
 */
export function toStandardDisplayDate(value: string | undefined | null): string {
  if (!value) return '';
  const trimmed = value.trim();

  // If YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }

  // If DD-MMM-YYYY
  const mmmMatch = trimmed.match(/^(\d{1,2})[\/\-\.]([A-Za-z]{3})[\/\-\.](\d{4})$/);
  if (mmmMatch) {
    const day = mmmMatch[1].padStart(2, '0');
    const monthIdx = MONTH_NAMES.indexOf(mmmMatch[2].toUpperCase());
    if (monthIdx !== -1) {
      const month = String(monthIdx + 1).padStart(2, '0');
      return `${day}/${month}/${mmmMatch[3]}`;
    }
  }

  // If DD-MM-YYYY or DD.MM.YYYY
  const dashMatch = trimmed.match(/^(\d{1,2})[\-\.](\d{1,2})[\-\.](\d{4})$/);
  if (dashMatch) {
    return `${dashMatch[1].padStart(2, '0')}/${dashMatch[2].padStart(2, '0')}/${dashMatch[3]}`;
  }

  // If already DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    const parts = trimmed.split('/');
    return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
  }

  return trimmed;
}

/**
 * Calculates default expiration date (+3 years tenure) from a given join date
 */
export function computeTenureExpiry(joinDateIsoOrDisplay: string): string {
  const inputDate = toInputDate(joinDateIsoOrDisplay);
  if (!inputDate) return '11/09/2027';

  const [year, month, day] = inputDate.split('-').map(Number);
  const expiryYear = year + 3;
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${expiryYear}`;
}
