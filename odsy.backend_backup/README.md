About the Project

oap_antoniuk_1.0 is a backend web application developed using Node.js, TypeScript, Express, and SQLite as part of a learning assignment.

The goal of the project is to demonstrate backend development skills including REST API creation, database design, migrations, validation, and SQL analytics queries.

The system simulates a simple e-commerce backend with users, products, orders, categories, and order items.

Project Stack

Node.js
TypeScript
Express.js
SQLite
REST API architecture

How to Run the Project
1. Clone repository
git clone https://github.com/lnt3rlude/oap_antoniuk_1.0.git
cd oap_antoniuk_1.0
2. Install dependencies
npm install
3. Run database migrations
This will create all required tables automatically:
npm run migrate
4. Start the server
npm run dev
The server will run on:
http://localhost:3000

Database Initialization
The database is SQLite and is automatically initialized on server startup.
Foreign keys are enabled using:
PRAGMA foreign_keys = ON;
Database Schema

Users
id (TEXT, PRIMARY KEY)
userName (TEXT)
email (TEXT, UNIQUE)
createdAt (TEXT)

Products
id (TEXT, PRIMARY KEY)
title (TEXT)
description (TEXT)
price (REAL)
stock (INTEGER)
sales (INTEGER)
categoryId (FOREIGN KEY → Categories)

Categories
id (TEXT, PRIMARY KEY)
name (TEXT, UNIQUE)
Orders
id (TEXT, PRIMARY KEY)
userId (FOREIGN KEY → Users)
totalPrice (REAL)
status (TEXT)
createdAt (TEXT)

OrderItems
id (TEXT, PRIMARY KEY)
orderId (FOREIGN KEY → Orders)
productId (FOREIGN KEY → Products)
quantity (INTEGER)

API Endpoints

Users
GET /api/users
POST /api/users
PATCH /api/users/:id
DELETE /api/users/:id

Products
GET /api/products
POST /api/products
PATCH /api/products/:id
DELETE /api/products/:id

Orders
GET /api/orders
POST /api/orders

Categories
GET /api/categories
POST /api/categories

Features
REST API CRUD operations
SQLite relational database
Foreign key constraints
Data validation layer
Error handling system
Migration system
SQL analytics queries (top users, statistics)

Author
Antoniuk Illia
GitHub: https://github.com/lnt3rlude