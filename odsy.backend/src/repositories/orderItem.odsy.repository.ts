import { all, get, run } from "../db/dbClient";

type OrderItem = {
    id: string;
    orderId: string; 
    productId: string;
    quantity: number;
};

export class OrderItemOdsyRepository {

    async create(orderitem: OrderItem): Promise<OrderItem> {
        await run(`
            INSERT INTO orderitems (id, orderId, productId, quantity)
            VALUES (
                '${orderitem.id.trim()}',
                '${orderitem.orderId.trim()}',
                '${orderitem.productId.trim()}',
                ${orderitem.quantity}
            )
        `);
        return orderitem;
    }

    findAll(): Promise<OrderItem[]> {
        return all<OrderItem>(`SELECT * FROM orderitems`);
    }

    async findById(id: string): Promise<OrderItem | undefined> {
        return get<OrderItem>(`
            SELECT * FROM orderitems
            WHERE TRIM(id) = '${id.trim()}'
        `);
    }

    async update(id: string, data: Partial<OrderItem>): Promise<OrderItem | undefined> {
        const fields: string[] = [];

        if (data.orderId !== undefined) {
            fields.push(`orderId = '${data.orderId.trim()}'`);
        }

        if (data.productId !== undefined) {
            fields.push(`productId = '${data.productId.trim()}'`);
        }

        if (data.quantity !== undefined) {
            fields.push(`quantity = ${data.quantity}`);
        }

        if (fields.length === 0) return undefined;

        const item = await this.findById(id);
        if (!item) return undefined;

        await run(`
            UPDATE orderitems
            SET ${fields.join(", ")}
            WHERE TRIM(id) = '${id.trim()}'
        `);

        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const cleanId = id.trim();

        const item = await this.findById(cleanId);
        if (!item) {
            return false;
        }

        await run(`
            DELETE FROM orderitems
            WHERE TRIM(id) = '${cleanId}'
        `);

        return true;
    }
}