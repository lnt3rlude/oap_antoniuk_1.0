import { all, get, run } from "../db/dbClient";

type Order = {
    id: string;
    userId: string;
    totalPrice: number;
    status: "pending" | "paid" | "shipped" | "cancelled";
    createdAt: string;
}

export class OrderOdsyRepository {
    // 1. ЗАХИЩЕНО (INSERT)
    async create(order: Order): Promise<Order> {
        await run(
            `INSERT INTO "Orders" ("id", "userId", "totalPrice", "status", "createdAt")
             VALUES (?, ?, ?, ?, ?)`,
            [
                order.id.trim(),
                order.userId.trim(),
                order.totalPrice,
                order.status,
                order.createdAt
            ] // Дані передаються окремо від SQL-структури
        );
        return order;
    }

    // 2. БЕЗПЕЧНО (Немає зовнішніх параметрів)
    async findAll(): Promise<Order[]> {
        return all<Order>(`SELECT "id", "userId", "totalPrice", "status", "createdAt" FROM "Orders"`);
    }

    // 3. ЗАХИЩЕНО (SELECT BY ID)
    async findById(id: string): Promise<Order | undefined> {
        return get<Order>(
            `SELECT "id", "userId", "totalPrice", "status", "createdAt" FROM "Orders"
             WHERE TRIM("id") = ?`,
            [id.trim()] // Передаємо значення безпечно
        );
    }

    // 4. ЗАХИЩЕНО (UPDATE)
    async update(id: string, data: Partial<Order>): Promise<Order | undefined> {
        const fields: string[] = [];
        const params: any[] = [];

        if (data.userId !== undefined) {
            fields.push(`"userId" = ?`);
            params.push(data.userId.trim());
        }
        if (data.totalPrice !== undefined) {
            fields.push(`"totalPrice" = ?`);
            params.push(data.totalPrice);
        }
        if (data.status !== undefined) {
            fields.push(`"status" = ?`);
            params.push(data.status);
        }

        if (fields.length === 0) return undefined;
        
        const order = await this.findById(id);
        if (!order) return undefined;

        // Додаємо id в самий кінець масиву для умови WHERE TRIM("id") = ?
        params.push(id.trim());

        await run(
            `UPDATE "Orders" SET ${fields.join(", ")} WHERE TRIM("id") = ?`,
            params
        );
        
        return this.findById(id);
    }

    // 5. ЗАХИЩЕНО (DELETE)
    async delete(id: string): Promise<boolean> {
        const order = await this.findById(id);
        if (!order) return false;
        
        await run(
            `DELETE FROM "Orders" WHERE TRIM("id") = ?`,
            [id.trim()]
        );
        return true;
    }
}