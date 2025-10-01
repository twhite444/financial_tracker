export class ValidationService {
    validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password: string): boolean {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*]/.test(password);
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
    }

    validateAccountName(accountName: string): boolean {
        return accountName.length > 0 && accountName.length <= 50;
    }

    validateTransactionAmount(amount: number): boolean {
        return amount > 0;
    }

    validatePaymentReminderDate(date: Date): boolean {
        return date > new Date();
    }
}