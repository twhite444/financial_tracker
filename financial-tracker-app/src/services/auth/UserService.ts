export class UserService {
    private users: Map<string, any>;

    constructor() {
        this.users = new Map();
    }

    public getUserProfile(userId: string): any {
        return this.users.get(userId);
    }

    public updateUserProfile(userId: string, userData: any): void {
        this.users.set(userId, { ...this.users.get(userId), ...userData });
    }

    public addUser(userId: string, userData: any): void {
        this.users.set(userId, userData);
    }

    public deleteUser(userId: string): void {
        this.users.delete(userId);
    }
}