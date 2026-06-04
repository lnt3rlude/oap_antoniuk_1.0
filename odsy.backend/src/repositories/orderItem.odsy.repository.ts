import { all, get, run } from "../db/dbClient";

type OrderItem = {
    id: string;
    orderId: string; 
    productId: string;
    quantity: number;
};

export class OrderItemOdsyRepository {

    // 1. ЗАХИЩЕНО (INSERT)
    async create(orderitem: OrderItem): Promise<OrderItem> {
        await run(
            `INSERT INTO orderitems (id, orderId, productId, quantity)
             VALUES (?, ?, ?, ?)`,
            [
                orderitem.id.trim(),
                orderitem.orderId.trim(),
                orderitem.productId.trim(),
                orderitem.quantity
            ] // Дані йдуть окремо
        );
        return orderitem;
    }

    // 2. БЕЗПЕЧНО (Немає параметрів від користувача)
    findAll(): Promise<OrderItem[]> {
        return all<OrderItem>(`SELECT * FROM orderitems`);
    }

    // 3. ЗАХИЩЕНО (SELECT BY ID)
    async findById(id: string): Promise<OrderItem | undefined> {
        return get<OrderItem>(
            `SELECT * FROM orderitems WHERE TRIM(id) = ?`,
            [id.trim()]
        );
    }

    // 4. ЗАХИЩЕНО (UPDATE)
    async update(id: string, data: Partial<OrderItem>): Promise<OrderItem | undefined> {
        const fields: string[] = [];
        const params: any[] = [];

        if (data.orderId !== undefined) {
            fields.push(`orderId = ?`);
            params.push(data.orderId.trim());
        }

        if (data.productId !== undefined) {
            fields.push(`productId = ?`);
            params.push(data.productId.trim());
        }

        if (data.quantity !== undefined) {
            fields.push(`quantity = ?`);
            params.push(data.quantity);
        }

        if (fields.length === 0) return undefined;

        const item = await this.findById(id);
        if (!item) return undefined;

        // Пушимо id в кінець масиву параметрів для умови WHERE TRIM(id) = ?
        params.push(id.trim());

        await run(
            `UPDATE orderitems SET ${fields.join(", ")} WHERE TRIM(id) = ?`,
            params
        );

        return this.findById(id);
    }

    // 5. ЗАХИЩЕНО (DELETE)
    async delete(id: string): Promise<boolean> {
        const cleanId = id.trim();

        const item = await this.findById(cleanId);
        if (!item) {
            return false;
        }

        await run(
            `DELETE FROM orderitems WHERE TRIM(id) = ?`,
            [cleanId]
        );

        return true;
    }
}