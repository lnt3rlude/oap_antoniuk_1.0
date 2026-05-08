import { all, get, run } from "../db/dbClient";

type OrderItem = {
        id: string;
        orderId: string; 
        productId: string;
        quantity: number;
    }

export class OrderItemOdsyRepository {

    async create(orderitem: OrderItem): Promise<OrderItem> {
    await run(`
        INSERT INTO orderitems (id, orderId, productId, quantity)
        VALUES (
        '${orderitem.id}',
        '${orderitem.orderId}',
        '${orderitem.productId}',
        ${orderitem.quantity}
        )
    `);

    return orderitem;
    }

    findAll(): Promise<OrderItem[]> {
    return all<OrderItem>(`SELECT * FROM orderitems`);
    }

    findById(id: string): Promise<OrderItem | undefined> {
    return get<OrderItem>(`
        SELECT * FROM orderitems
        WHERE id = '${id}'
    `);
    }

    async update(
    id: string,
    data: Partial<OrderItem>
    ): Promise<OrderItem | undefined> {

    const fields: string[] = [];

    if (data.orderId !== undefined) {
        fields.push(`orderId = '${data.orderId}'`);
    }

    if (data.productId !== undefined) {
        fields.push(`productId = '${data.productId}'`);
    }

    if (data.quantity !== undefined) {
        fields.push(`quantity = ${data.quantity}`);
    }

    if (fields.length === 0) return undefined;

    const result = await run(`
        UPDATE orderitems
        SET ${fields.join(", ")}
        WHERE id = '${id}'
    `);

    if (result.changes === 0) return undefined;

    return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
    const result = await run(`
        DELETE FROM orderitems
        WHERE id = '${id}'
    `);

    return result.changes > 0;
    }
}