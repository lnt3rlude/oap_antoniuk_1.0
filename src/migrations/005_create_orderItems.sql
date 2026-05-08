CREATE TABLE IF NOT EXISTS orderitems (
  id TEXT PRIMARY KEY,
  orderId TEXT NOT NULL,
  productId TEXT NOT NULL,
  quantity INTEGER NOT NULL,

  FOREIGN KEY (orderId)
    REFERENCES orders(id)
    ON DELETE CASCADE,

  FOREIGN KEY (productId)
    REFERENCES products(id)
    ON DELETE CASCADE
);