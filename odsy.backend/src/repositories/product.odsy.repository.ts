import { all, get, run } from "../db/dbClient";

export type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    sales: number;
}

export class ProductOdsyRepository {

    // 1. ЗАХИЩЕНО (INSERT)
    async create(product: Product): Promise<Product> {
        await run(`
            INSERT INTO products
            (id, title, description, price, stock, categoryId, sales)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            product.id,
            product.title,
            product.description,
            product.price,
            product.stock,
            product.categoryId,
            product.sales
        ]);

        return product;
    }

    // 2. БЕЗПЕЧНО (Немає вхідних параметрів)
    findAll(): Promise<Product[]> {
        return all<Product>(`SELECT * FROM products`);
    }

    // 3. ЗАХИЩЕНО (SELECT BY ID)
    findById(id: string): Promise<Product | undefined> {
        return get<Product>(
            `SELECT * FROM products WHERE id = ?`,
            [id]
        );
    }

    // 4. ЗАХИЩЕНО (UPDATE)
    async update(
        id: string,
        data: Partial<Product>
    ): Promise<Product | undefined> {

        const fields: string[] = [];
        const params: any[] = [];

        if (data.title !== undefined) {
            fields.push(`title = ?`);
            params.push(data.title);
        }

        if (data.description !== undefined) {
            fields.push(`description = ?`);
            params.push(data.description);
        }

        if (data.price !== undefined) {
            fields.push(`price = ?`);
            params.push(data.price);
        }

        if (data.stock !== undefined) {
            fields.push(`stock = ?`);
            params.push(data.stock);
        }

        if (data.categoryId !== undefined) {
            fields.push(`categoryId = ?`);
            params.push(data.categoryId);
        }

        if (data.sales !== undefined) {
            fields.push(`sales = ?`);
            params.push(data.sales);
        }

        if (fields.length === 0) return undefined;

        // Додаємо id в самий кінець масиву параметрів для умови WHERE id = ?
        params.push(id);

        const result = await run(`
            UPDATE products
            SET ${fields.join(", ")}
            WHERE id = ?
        `, params);

        if (result.changes === 0) return undefined;

        return this.findById(id);
    }

    // 5. ЗАХИЩЕНО (DELETE)
    async delete(id: string): Promise<boolean> {
        const result = await run(
            `DELETE FROM products WHERE id = ?`,
            [id]
        );

        return result.changes > 0;
    }

    // 6. ЗАХИЩЕНО (LIKE SEARCH)
    findByTitle(title: string) {
        // Формуємо рядок пошуку з відсотками всередині масиву параметрів
        return all<Product>(`
            SELECT * FROM products
            WHERE LOWER(title) LIKE LOWER(?)
        `, [`%${title}%`]);
    }

    // 7. ЗАХИЩЕНО (SELECT BY CATEGORY)
    findByCategory(categoryId: string) {
        return all<Product>(`
            SELECT * FROM products
            WHERE categoryId = ?
        `, [categoryId]);
    }

    // 8. ЗАХИЩЕНО (BETWEEN RANGE)
    findByPriceRange(min: number, max: number) {
        return all<Product>(`
            SELECT * FROM products
            WHERE price BETWEEN ? AND ?
        `, [min, max]);
    }
}