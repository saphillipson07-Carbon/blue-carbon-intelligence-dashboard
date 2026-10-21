export function fmtHa(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M ha`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k ha`;
  return `${n} ha`;
}
