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
            INSERT INTO orders (id, userId, totalPrice, status, createdAt)
            VALUES (
            '${order.id}',
            '${order.userId}',
            ${order.totalPrice},
            '${order.status}',
            '${order.createdAt}'
            )
        `);

        return order;
        }

    findAll(): Promise<Order[]> {
    return all<Order>(`SELECT * FROM orders`);
    }

    findById(id: string): Promise<Order | undefined> {
    return get<Order>(`
        SELECT * FROM orders
        WHERE id = '${id}'
    `);
    }

    async update(
    id: string,
    data: Partial<Order>
    ): Promise<Order | undefined> {

    const fields: string[] = [];

    if (data.userId !== undefined) {
        fields.push(`userId = '${data.userId}'`);
    }

    if (data.totalPrice !== undefined) {
        fields.push(`totalPrice = ${data.totalPrice}`);
    }

    if (data.status !== undefined) {
        fields.push(`status = '${data.status}'`);
    }

    if (fields.length === 0) return undefined;

    const result = await run(`
        UPDATE orders
        SET ${fields.join(", ")}
        WHERE id = '${id}'
    `);

    if (result.changes === 0) return undefined;

    return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
    const result = await run(`
        DELETE FROM orders
        WHERE id = '${id}'
    `);

    return result.changes > 0;
    }
}