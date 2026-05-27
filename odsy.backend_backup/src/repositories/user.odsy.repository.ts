import { all, get, run } from "../db/dbClient";

type User = {
    id: string;
    userName: string;
    email: string;
};

export class UserOdsyRepository {

    // --- СТВОРЕННЯ КОРИСТУВАЧА ---
    async create(user: User): Promise<User> {
        await run(`
            INSERT INTO users (id, userName, email)
            VALUES (
                '${user.id.trim()}',
                '${user.userName.trim()}',
                '${user.email.trim()}'
            )
        `);
        return user;
    }

    // --- ПОШУК УСІХ ---
    findAll(): Promise<User[]> {
        return all<User>(`SELECT * FROM users`);
    }

    // --- ПОШУК ПО ID ---
    async findById(id: string): Promise<User | undefined> {
        // Використовуємо TRIM, щоб убезпечити пошук від випадкових пробілів у базі
        return get<User>(`
            SELECT * FROM users
            WHERE TRIM(id) = '${id.trim()}'
        `);
    }

    // --- ОНОВЛЕННЯ КОРИСТУВАЧА ---
    async update(id: string, data: Partial<User>): Promise<User | undefined> {
        const fields: string[] = [];

        if (data.userName !== undefined) {
            fields.push(`userName = '${data.userName.trim()}'`);
        }

        if (data.email !== undefined) {
            fields.push(`email = '${data.email.trim()}'`);
        }

        if (fields.length === 0) return undefined;

        // Крок 1: Перевіряємо, чи існує користувач перед оновленням
        const user = await this.findById(id);
        if (!user) return undefined;

        // Крок 2: Оновлюємо дані
        await run(`
            UPDATE users
            SET ${fields.join(", ")}
            WHERE TRIM(id) = '${id.trim()}'
        `);

        // Крок 3: Повертаємо вже оновлений об'єкт з бази
        return this.findById(id);
    }

    // --- НАДІЙНЕ ВИДАЛЕННЯ ---
    async delete(id: string): Promise<boolean> {
        const cleanId = id.trim();

        // Крок 1: Перевіряємо, чи взагалі є такий користувач у базі
        const user = await this.findById(cleanId);
        if (!user) {
            return false; // Якщо немає — сервіс віддасть чесну 404 помилку
        }

        // Крок 2: Якщо він є — видаляємо його
        await run(`
            DELETE FROM users
            WHERE TRIM(id) = '${cleanId}'
        `);

        // Крок 3: Повертаємо true, бо видалення точно пройшло успішно
        return true;
    }
}