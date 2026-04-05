export function formatMoney(value: number, currency: string = 'USD'): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  })
}

