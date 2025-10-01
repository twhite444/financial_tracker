export interface Account {
    id: string;
    accountType: string;
    balance: number;
    currency: string;
    institution: string;
    createdAt: Date;
    updatedAt: Date;
}