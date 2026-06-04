import { all, get, run } from "../db/dbClient";

type Category = {
  id: string;
  name: string;
};

export class CategoryOdsyRepository {

  async create(category: Category): Promise<Category> {
    await run(
      `INSERT INTO categories (id, name) VALUES (?, ?)`,
      [category.id, category.name]
    );

    return category;
  }

  findAll(): Promise<Category[]> {
    return all<Category>(`SELECT * FROM categories`);
  }

  async findById(id: string): Promise<Category | undefined> {
    return get<Category>(
      `SELECT * FROM categories WHERE id = ?`, 
      [id] 
    ); 
  }

  async update( id: string, data: Partial<Category> ): Promise<Category | undefined> {
    const fields: string[] = [];
    const params: any[] = [];
    if (data.name !== undefined) {
      fields.push(`name = ?`); // Замість значення ставимо плейсхолдер
      params.push(data.name);  // Значення пушимо в масив параметрів
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    params.push(id); 

    const result = await run(
      `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`,
      params
    );

    if (result.changes === 0) return undefined;

    return this.findById(id);
  }

  // 5. ЗАХИЩЕНО (DELETE)
  async delete(id: string): Promise<boolean> {
    const result = await run(
      `DELETE FROM categories WHERE id = ?`,
      [id] // Передаємо окремо
    );

    return result.changes > 0;
  }
}