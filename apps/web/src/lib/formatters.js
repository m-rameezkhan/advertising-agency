export const currency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value || 0);

export const number = (value) =>
  new Intl.NumberFormat("en-US", {
    notation: value > 999999 ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(value || 0);

export const percentage = (value) => `${Number(value || 0).toFixed(2)}%`;
