import { all, get, run } from "../db/dbClient";

type Category = {
  id: string;
  name: string;
};

export class CategoryOdsyRepository {

    async create(category: Category): Promise<Category> {
      await run(`
        INSERT INTO categories (id, name)
        VALUES ('${category.id}', '${category.name}')
      `);

    return category;
    }

    findAll(): Promise<Category[]> {
      return all<Category>(`SELECT * FROM categories`);
    }

    findById(id: string): Promise<Category | undefined> {
      return get<Category>(`
        SELECT * FROM categories
        WHERE id = '${id}'
      `);
    }

  async update(
    id: string,
    data: Partial<Category>
    ): Promise<Category | undefined> {

    const fields: string[] = [];

    if (data.name !== undefined) {
      fields.push(`name = '${data.name}'`);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    const result = await run(`
      UPDATE categories
      SET ${fields.join(", ")}
      WHERE id = '${id}'
    `);

    if (result.changes === 0) return undefined;

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await run(`
      DELETE FROM categories
      WHERE id = '${id}'
    `);

    return result.changes > 0;
  }
}