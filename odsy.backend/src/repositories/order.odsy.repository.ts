import { all, get, run } from "../db/dbClient";

type Order = {
    id: string;
    userId: string;
    totalPrice: number;
    status: "pending" | "paid" | "shipped" | "cancelled";
    createdAt: string;
}

export class OrderOdsyRepository {
    async create(order: Order): Promise<Order> {
        await run(`
            INSERT INTO "Orders" ("id", "userId", "totalPrice", "status", "createdAt")
            VALUES (
                '${order.id.trim()}',
                '${order.userId.trim()}',
                ${order.totalPrice},
                '${order.status}',
                '${order.createdAt}'
            )
        `);
        return order;
    }

    async findAll(): Promise<Order[]> {
        return all<Order>(`SELECT "id", "userId", "totalPrice", "status", "createdAt" FROM "Orders"`);
    }

    async findById(id: string): Promise<Order | undefined> {
        return get<Order>(`
            SELECT "id", "userId", "totalPrice", "status", "createdAt" FROM "Orders"
            WHERE TRIM("id") = '${id.trim()}'
        `);
    }

    async update(id: string, data: Partial<Order>): Promise<Order | undefined> {
        const fields: string[] = [];
        if (data.userId !== undefined) fields.push(`"userId" = '${data.userId.trim()}'`);
        if (data.totalPrice !== undefined) fields.push(`"totalPrice" = ${data.totalPrice}`);
        if (data.status !== undefined) fields.push(`"status" = '${data.status}'`);

        if (fields.length === 0) return undefined;
        const order = await this.findById(id);
        if (!order) return undefined;

        await run(`UPDATE "Orders" SET ${fields.join(", ")} WHERE TRIM("id") = '${id.trim()}'`);
        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const order = await this.findById(id);
        if (!order) return false;
        await run(`DELETE FROM "Orders" WHERE TRIM("id") = '${id.trim()}'`);
        return true;
    }
}