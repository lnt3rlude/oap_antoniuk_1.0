import sqlite3 from "sqlite3";
import path from "path";

sqlite3.verbose();

export const db = new sqlite3.Database(
    path.join(__dirname, "../data/app.db"),
    (err) => {
        if (err) {
            console.error("DB connection error:", err);
        } else {
            console.log("SQLite connected");
        }
    }
);