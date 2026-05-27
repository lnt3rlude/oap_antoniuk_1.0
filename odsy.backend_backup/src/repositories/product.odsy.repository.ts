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

    async create(product: Product): Promise<Product> {
    await run(`
        INSERT INTO products
        (id, title, description, price, stock, categoryId, sales)
        VALUES (
        '${product.id}',
        '${product.title}',
        '${product.description}',
        ${product.price},
        ${product.stock},
        '${product.categoryId}',
        ${product.sales}
        )
    `);

    return product;
    }

    findAll(): Promise<Product[]> {
    return all<Product>(`SELECT * FROM products`);
    }

    findById(id: string): Promise<Product | undefined> {
    return get<Product>(`
        SELECT * FROM products
        WHERE id = '${id}'
    `);
    }

    async update(
    id: string,
    data: Partial<Product>
    ): Promise<Product | undefined> {

    const fields: string[] = [];

    if (data.title !== undefined) {
        fields.push(`title = '${data.title}'`);
    }

    if (data.description !== undefined) {
        fields.push(`description = '${data.description}'`);
    }

    if (data.price !== undefined) {
        fields.push(`price = ${data.price}`);
    }

    if (data.stock !== undefined) {
        fields.push(`stock = ${data.stock}`);
    }

    if (data.categoryId !== undefined) {
        fields.push(`categoryId = '${data.categoryId}'`);
    }

    if (data.sales !== undefined) {
        fields.push(`sales = ${data.sales}`);
    }

    if (fields.length === 0) return undefined;

    const result = await run(`
        UPDATE products
        SET ${fields.join(", ")}
        WHERE id = '${id}'
    `);

    if (result.changes === 0) return undefined;

    return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
    const result = await run(`
        DELETE FROM products
        WHERE id = '${id}'
    `);

    return result.changes > 0;
    }

    findByTitle(title: string) {
    return all<Product>(`
        SELECT * FROM products
        WHERE LOWER(title) LIKE LOWER('%${title}%')
    `);
    }

    findByCategory(categoryId: string) {
    return all<Product>(`
        SELECT * FROM products
        WHERE categoryId = '${categoryId}'
    `);
    }

    findByPriceRange(min: number, max: number) {
    return all<Product>(`
        SELECT * FROM products
        WHERE price BETWEEN ${min} AND ${max}
    `);
    }
}

// === - рівно
// !== - не рівно
// > - більше
// < - менше
// >= - більше або рівно
// <= менше або дорівнює