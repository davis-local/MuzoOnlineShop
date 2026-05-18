const zarFormatter = new Intl.NumberFormat("en-ZA", {
  currency: "ZAR",
  style: "currency",
});

export function formatCurrency(value: number) {
  return zarFormatter.format(value);
}
