CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  totalPrice REAL NOT NULL DEFAULT 0, -- ДОДАЛИ ЦЕЙ СТОВПЕЦЬ
  status TEXT NOT NULL,
  createdAt TEXT NOT NULL,

  FOREIGN KEY (userId)
    REFERENCES users(id)
    ON DELETE CASCADE
);