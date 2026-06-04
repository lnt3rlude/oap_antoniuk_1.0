import { all, get, run } from "../db/dbClient";

type User = {
    id: string;
    userName: string;
    email: string;
    password?: string; 
    role?: string;
};

export class UserOdsyRepository {

    // --- СТВОРЕННЯ КОРИСТУВАЧА (ЗАХИЩЕНО) ---
    async create(user: User): Promise<User> {
        await run(
            `INSERT INTO users (id, userName, email, password, role) VALUES (?, ?, ?, ?, ?)`,
            [
                user.id.trim(),
                user.userName.trim(),
                user.email.trim(),
                user.password ? user.password.trim() : "", // Записуємо хеш
                user.role ? user.role.trim() : "user"      // Ставимо роль (дефолт 'user')
            ]
        );
        return user;
    }

    //  NEW: МЕТОД ДЛЯ МАЙБУТНЬОГО ЛОГІНУ (Пошук по Email)
    // Він потрібен, щоб під час входу дістати користувача разом із його хешем пароля
    async findByEmail(email: string): Promise<User | undefined> {
        return get<User>(
            `SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(?)`,
            [email.trim()]
        );
    }

    // --- ПОШУК УСІХ (БЕЗПЕЧНО) ---
    findAll(): Promise<User[]> {
        return all<User>(`SELECT id, userName, email, role FROM users`); // Пароль не витягуємо з міркувань безпеки
    }

    // --- ПОШУК ПО ID (ЗАХИЩЕНО) ---
    async findById(id: string): Promise<User | undefined> {
        return get<User>(
            `SELECT id, userName, email, role FROM users WHERE TRIM(id) = ?`,
            [id.trim()]
        );
    }

    // --- ОНОВЛЕННЯ КОРИСТУВАЧА (ЗАХИЩЕНО) ---
    async update(id: string, data: Partial<User>): Promise<User | undefined> {
        const fields: string[] = [];
        const params: any[] = [];

        if (data.userName !== undefined) {
            fields.push(`userName = ?`);
            params.push(data.userName.trim());
        }

        if (data.email !== undefined) {
            fields.push(`email = ?`);
            params.push(data.email.trim());
        }
        
        // Якщо в майбутньому захочемо міняти пароль
        if (data.password !== undefined) {
            fields.push(`password = ?`);
            params.push(data.password.trim());
        }

        if (fields.length === 0) return undefined;

        const user = await this.findById(id);
        if (!user) return undefined;

        params.push(id.trim());

        await run(
            `UPDATE users SET ${fields.join(", ")} WHERE TRIM(id) = ?`,
            params
        );

        return this.findById(id);
    }

    // --- НАДІЙНЕ ВИДАЛЕННЯ (ЗАХИЩЕНО) ---
    async delete(id: string): Promise<boolean> {
        const cleanId = id.trim();

        const user = await this.findById(cleanId);
        if (!user) {
            return false; 
        }

        await run(
            `DELETE FROM users WHERE TRIM(id) = ?`,
            [cleanId]
        );

        return true;
    }
}
