/**
 * Money is stored as integer paise to avoid floating point issues.
 * Example: "10.50" => 1050
 */

export function parseRupeesToPaise(value) {
  if (value === null || value === undefined) throw new Error('amount is required');

  // Allow number or string.
  const str = String(value).trim();
  if (!str) throw new Error('amount is required');

  // Validate: digits with optional 1-2 decimal places
  if (!/^\d+(\.\d{1,2})?$/.test(str)) {
    throw new Error('amount must be a non-negative number with up to 2 decimals');
  }

  const [whole, frac = ''] = str.split('.');
  const fracPadded = (frac + '00').slice(0, 2);
  const paise = Number(whole) * 100 + Number(fracPadded);

  if (!Number.isSafeInteger(paise)) throw new Error('amount out of range');
  return paise;
}

export function formatPaiseToRupees(paise) {
  const n = Number(paise);
  if (!Number.isFinite(n)) return '0.00';
  const rupees = (n / 100).toFixed(2);
  return rupees;
}
