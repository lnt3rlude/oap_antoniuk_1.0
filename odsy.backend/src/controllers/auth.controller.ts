import { Request, Response } from "express";
import { CreateUserOdsyDto, LoginOdsyDto } from "../dtos/odsy.user.dto";
import { generateToken } from "../utils/crypto.utils";
import { get, run } from "../db/dbClient";

export class AuthController {
    
    // 1. РЕЄСТРАЦІЯ (Створення нового користувача)
    register = async (req: Request, res: Response) => {
        try {
            const { userName, email, password, role } = req.body as any;

            if (!userName || !email || !password) {
                return res.status(400).json({ message: "Усі поля (Ім'я, Email, Пароль) обов'язкові!" });
            }

            const cleanEmail = email.trim().toLowerCase();

            // Перевіряємо, чи такий email вже є в базі
            const existingUser = await get(`SELECT id FROM users WHERE LOWER(email) = LOWER(?)`, [cleanEmail]);
            if (existingUser) {
                return res.status(400).json({ message: "Користувач з таким Email вже зареєстрований!" });
            }

            const userId = "user_" + Math.random().toString(36).substring(2, 11);
            const now = new Date().toISOString();

            // 🆕 Перевіряємо роль: якщо передали 'admin' — ставимо її, інакше за замовчуванням 'user'
            const userRole = role === 'admin' ? 'admin' : 'user';

            // Записуємо в базу даних (замінили жорстко прописаний 'user' на змінну userRole)
            await run(`
                INSERT INTO users (id, userName, email, password, role, createdAt)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [userId, userName.trim(), cleanEmail, password, userRole, now]);

            return res.status(201).json({ 
                message: "Реєстрація успішна! Тепер ви можете увійти у свій акаунт." 
            });

        } catch (error: any) {
            console.error("Помилка реєстрації:", error);
            return res.status(500).json({ message: "Помилка сервера при реєстрації", error: error.message });
        }
    };

    // 2. ВХІД (Перевірка даних та видача токена)
    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body as LoginOdsyDto;

            if (!email || !password) {
                return res.status(400).json({ message: "Email та пароль обов'язкові!" });
            }

            const cleanEmail = email.trim().toLowerCase();

            // Шукаємо користувача в базі
            const user = await get<{ id: string; password: string; role: string; userName: string }>(
                `SELECT id, userName, password, role FROM users WHERE LOWER(email) = LOWER(?)`,
                [cleanEmail]
            );

            // Якщо не знайшли або пароль не збігається
            if (!user || user.password !== password) {
                return res.status(401).json({ message: "Невірний email або пароль!" });
            }

            // Генеруємо токен з реальною роллю користувача з бази даних
            const token = generateToken({ id: user.id, role: user.role });

            return res.status(200).json({
                message: "Вхід успішний!",
                token: token,
                user: { id: user.id, userName: user.userName, role: user.role }
            });

        } catch (error: any) {
            console.error("Помилка логіну:", error);
            return res.status(500).json({ message: "Помилка сервера при вході", error: error.message });
        }
    };
}
