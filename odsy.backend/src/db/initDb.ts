import { run, all } from "./dbClient"; // Додали імпорт all сюди

export async function initDb() {
  // 1. Увімкнути foreign keys (КРИТИЧНО для SQLite)
  await run("PRAGMA foreign_keys = ON;");

  // USERS (батьківська таблиця)
  await run(`
    CREATE TABLE IF NOT EXISTS Users (
      id TEXT PRIMARY KEY,
      userName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL
    );
  `);

  // CATEGORIES (довідник)
  await run(`
    CREATE TABLE IF NOT EXISTS Categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `);

  // PRODUCTS (залежить від Categories)
  await run(`
    CREATE TABLE IF NOT EXISTS Products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      sales INTEGER NOT NULL DEFAULT 0,
      categoryId TEXT NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE RESTRICT
    );
  `);

  // ORDERS (залежить від Users)
  await run(`
    CREATE TABLE IF NOT EXISTS Orders (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      totalPrice REAL NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
    );
  `);

  // ORDER ITEMS (зв’язуюча таблиця)
  await run(`
    CREATE TABLE IF NOT EXISTS orderitems (
      id TEXT PRIMARY KEY,
      orderId TEXT NOT NULL,
      productId TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE RESTRICT
    );
  `);

  // === ОСЬ СЮДИ ВСТАВЛЯЄМО ПЕРЕВІРКУ (Коли таблиці вже точно створені) ===
  try {
    const columns = await all(`PRAGMA table_info(Orders);`);
    console.log("--------------------------------------------------");
    console.log("РЕАЛЬНІ СЛОВПЦІ В ТАБЛИЦІ ORDERS З БАЗИ ДАНИХ:");
    console.dir(columns);
    console.log("--------------------------------------------------");
  } catch (e) {
    console.log("Не вдалося прочитати структуру таблиці Orders:", e);
  }

  console.log("DB schema initialized");
}