import { initDb } from "./initDb";
import { run } from "./dbClient";

async function seed() {
  await initDb();

  const now = new Date().toISOString();

  // USERS
  await run(`
    INSERT INTO Users (id, userName, email, createdAt)
    VALUES 
    ('u1', 'Alice', 'alice@mail.com', '${now}'),
    ('u2', 'Bob', 'bob@mail.com', '${now}');
  `);

  // CATEGORIES
  await run(`
    INSERT INTO Categories (id, name)
    VALUES 
    ('c1', 'Phones'),
    ('c2', 'Laptops');
  `);

  // PRODUCTS
  await run(`
    INSERT INTO Products (id, title, description, price, stock, sales, categoryId)
    VALUES 
    ('p1', 'iPhone 15', 'Apple smartphone', 999, 10, 5, 'c1'),
    ('p2', 'Samsung S24', 'Android flagship', 899, 15, 2, 'c1'),
    ('p3', 'MacBook Air', 'Apple laptop', 1299, 7, 8, 'c2');
  `);

  // ORDERS
  await run(`
    INSERT INTO Orders (id, userId, totalPrice, status, createdAt)
    VALUES 
    ('o1', 'u1', 999, 'pending', '${now}'),
    ('o2', 'u2', 2198, 'completed', '${now}');
  `);

  // ORDER ITEMS
  await run(`
    INSERT INTO orderitems (id, orderId, productId, quantity)
    VALUES 
    ('oi1', 'o1', 'p1', 1),
    ('oi2', 'o2', 'p2', 1),
    ('oi3', 'o2', 'p3', 1);
  `);

  console.log("🌱 Seed completed successfully");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});