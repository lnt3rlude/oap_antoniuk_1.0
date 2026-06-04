import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { verifyToken } from "../utils/crypto.utils";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Беремо заголовок Authorization
        const authHeader = req.headers["authorization"];

        // 2. Перевіряємо, чи він є і чи починається з "Bearer "
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Доступ заборонено: Токен відсутній." });
        }

        // 3. Витягуємо сам токен (відрізаємо слово "Bearer ")
        const token = authHeader.split(" ")[1];
        
        // 4. Валідуємо токен через нашу утиліту crypto (безпечно в try/catch)
        let decoded: any = null;
        try {
            decoded = verifyToken(token);
        } catch (jwtError) {
            return res.status(401).json({ message: "Доступ заборонено: Невалідний або прострочений токен." });
        }

        if (!decoded) {
            return res.status(401).json({ message: "Доступ заборонено: Не вдалося розшифрувати токен." });
        }

        // 5. Записуємо дані юзера в об'єкт запиту
        (req as any).user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error: any) {
        // Рятувальний круг, щоб сервер ніколи не падав у 500 через авторизацію
        return res.status(401).json({ 
            message: "Помилка автентифікації", 
            details: error.message 
        });
    }
};
