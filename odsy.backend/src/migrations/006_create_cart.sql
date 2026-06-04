CREATE TABLE IF NOT EXISTS cart ( 
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  productId TEXT NOT NULL,
  quantity NUMBER NOT NULL,
  createdAt TEXT NOT NULL,

  UNIQUE(userId, productId)
  );