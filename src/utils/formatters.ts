export const formatCurrency = (value: number): string => {
  const abs = Math.abs(value);
  if (abs === 0) return '₹ 0';
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);
  return value < 0 ? `- ₹ ${formatted}` : `₹ ${formatted}`;
};

export const formatNumber = (value: number, maxDecimals = 8): string => {
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs < 0.000001) return value.toExponential(4);
  if (abs < 0.01) return value.toFixed(6);
  if (abs < 1) return value.toFixed(4);
  if (abs < 1000) return value.toFixed(maxDecimals > 4 ? 4 : maxDecimals);
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);
};
