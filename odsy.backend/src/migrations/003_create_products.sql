CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL,
  sales INTEGER NOT NULL DEFAULT 0,
  categoryId TEXT NOT NULL,

  FOREIGN KEY (categoryId)
    REFERENCES categories(id)
    ON DELETE CASCADE
);