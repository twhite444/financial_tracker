export function formatCurrency(amount: number, currencySymbol: string = '$'): string {
    return `${currencySymbol}${amount.toFixed(2)}`;
}

export function formatNumber(value: number, decimalPlaces: number = 2): string {
    return value.toLocaleString(undefined, { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces });
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }): string {
    return date.toLocaleDateString(undefined, options);
}

export function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
}