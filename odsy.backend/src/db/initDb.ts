import { run, all } from "./dbClient";

export async function initDb() {
  // 1. Увімкнути foreign keys (КРИТИЧНО для SQLite)
  await run("PRAGMA foreign_keys = ON;");

  //  USERS (Оновлено: додано password та role для авторизації та захисту від IDOR)
  await run(`
    CREATE TABLE IF NOT EXISTS Users (
      id TEXT PRIMARY KEY,
      userName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
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

  // =========================================================================
  // 🛠️ СЕКЦІЯ НАПОВНЕННЯ ТЕСТОВИМИ ДАНИМИ ДЛЯ ЛАБОРАТОРНОЇ З IDOR
  // =========================================================================
  try {
    const now = new Date().toISOString();

    // 1. Створюємо користувачів з паролями (Тут паролі 'password123', захешовані через bcrypt для безпеки)
    // Якщо у тебе виникне помилка з хешем, ти зможеш зайти під паролем password123
    const hashedVictimPassword = "$2b$10$7R6W0Gz1PkW3yZg17uOqfeGomrB0oFvX6L2m0Sux8xR.m6HqWre2i"; 
    const hashedHackerPassword = "$2b$10$7R6W0Gz1PkW3yZg17uOqfeGomrB0oFvX6L2m0Sux8xR.m6HqWre2i";

    await run(`
      INSERT OR IGNORE INTO Users (id, userName, email, password, role, createdAt)
      VALUES 
      ('victim-user-id', 'John Doe', 'john@victim.com', ?, 'user', ?),
      ('hacker-user-id', 'Anonymus', 'hacker@darkweb.com', ?, 'user', ?)
    `, [hashedVictimPassword, now, hashedHackerPassword, now]);

    // 2. Тепер створюємо два замовлення, прив'язані до цих користувачів
    await run(`
      INSERT OR IGNORE INTO Orders (id, userId, totalPrice, status, createdAt) 
      VALUES 
      ('order-victim-777', 'victim-user-id', 4500, 'paid', ?),
      ('order-hacker-666', 'hacker-user-id', 150, 'pending', ?)
    `, [now, now]);

    console.log("👉 [SUCCESS] Тестові дані для IDOR успішно додано в БД!");
  } catch (error) {
    console.error(" Помилка вставки тестових даних в initDb:", error);
  }
  // =========================================================================

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

  // === ПЕРЕВІРКА СЛОВПЦІВ ===
  try {
    const columns = await all(`PRAGMA table_info(Users);`);
    console.log("--------------------------------------------------");
    console.log("РЕАЛЬНІ СЛОВПЦІ В ТАБЛИЦІ USERS З БАЗИ ДАНИХ:");
    console.dir(columns);
    console.log("--------------------------------------------------");
  } catch (e) {
    console.log("Не вдалося прочитати структуру таблиці Users:", e);
  }

  console.log("DB schema initialized");
}
