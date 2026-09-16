export const STANDARD_KEYWORDS = ['Verra', 'Gold Standard', 'Plan Vivo', 'JCM', 'ICVCM'];

export function standardBucket(standard) {
  if (!standard) return null;
  return STANDARD_KEYWORDS.find((k) => standard.includes(k)) || null;
}
