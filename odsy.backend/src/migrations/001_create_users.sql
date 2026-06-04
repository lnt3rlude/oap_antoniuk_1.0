CREATE TABLE IF NOT EXISTS Users ( 
  id TEXT PRIMARY KEY,
  userName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,                  
  role TEXT NOT NULL DEFAULT 'user',        
  createdAt TEXT NOT NULL
);
