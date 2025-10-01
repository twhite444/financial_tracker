export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US');
}

export function calculateDueDate(startDate: Date, daysUntilDue: number): Date {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + daysUntilDue);
    return dueDate;
}

export function isPastDue(date: Date): boolean {
    return new Date() > date;
}

export function daysUntilDue(date: Date): number {
    const today = new Date();
    const timeDiff = date.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}