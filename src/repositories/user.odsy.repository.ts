import { all, get, run } from "../db/dbClient";

type User = {
        id: string;
        userName: string
        email: string;
    }

export class UserOdsyRepository {

    async create(user: User): Promise<User> {
    await run(`
        INSERT INTO users (id, userName, email)
        VALUES (
        '${user.id}',
        '${user.userName}',
        '${user.email}'
        )
    `);

    return user;
    }

    findAll(): Promise<User[]> {
    return all<User>(`SELECT * FROM users`);
    }

    findById(id: string): Promise<User | undefined> {
    return get<User>(`
        SELECT * FROM users
        WHERE id = '${id}'
    `);
    }

    async update(
    id: string,
    data: Partial<User>
    ): Promise<User | undefined> {

    const fields: string[] = [];

    if (data.userName !== undefined) {
        fields.push(`userName = '${data.userName}'`);
    }

    if (data.email !== undefined) {
        fields.push(`email = '${data.email}'`);
    }

    if (fields.length === 0) return undefined;

    const result = await run(`
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = '${id}'
    `);

    if (result.changes === 0) return undefined;

    return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
    const result = await run(`
        DELETE FROM users
        WHERE id = '${id}'
    `);

    return result.changes > 0;
    }
}