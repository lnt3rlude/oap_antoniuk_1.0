import crypto from "crypto";

const JWT_SECRET = "super-secret-key-for-lab-work-2026";

/**
 * 1. Хешує пароль за допомогою алгоритму PBKDF2 (хеш + сіль в одному рядку)
 */
export function hashPassword(password: string): string {
    // Генеруємо випадкову сіль (salt)
    const salt = crypto.randomBytes(16).toString("hex");
    
    // Створюємо хеш (1000 iteration, 64 bytes length, sha512)
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    
    // Зберігаємо сіль та хеш разом через двокрапку
    return `${salt}:${hash}`;
}

/**
 * 2. Перевіряє, чи введений пароль відповідає збереженому хешу
 */
export function verifyPassword(password: string, storedValue: string): boolean {
    const [salt, originalHash] = storedValue.split(":");
    if (!salt || !originalHash) return false;

    const currentHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return currentHash === originalHash;
}

/**
 * 3. Генерує JWT токен для користувача
 */
export function generateToken(payload: { id: string; role: string }): string {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const fullPayload = { ...payload, exp };
    const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
    
    const signature = crypto
        .createHmac("sha256", JWT_SECRET)
        .update(`${header}.${encodedPayload}`)
        .digest("base64url");
        
    return `${header}.${encodedPayload}.${signature}`;
}

/**
 * 🔎 4. Перевіряє JWT токен та повертає його вміст
 */
export function verifyToken(token: string): { id: string; role: string } | null {
    try {
        const [header, payload, signature] = token.split(".");
        if (!header || !payload || !signature) return null;
        
        const expectedSignature = crypto
            .createHmac("sha256", JWT_SECRET)
            .update(`${header}.${payload}`)
            .digest("base64url");
            
        if (signature !== expectedSignature) return null;
        
        const decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString());
        if (decodedPayload.exp && Date.now() / 1000 > decodedPayload.exp) {
            return null;
        }
        
        return { id: decodedPayload.id, role: decodedPayload.role };
    } catch {
        return null;
    }
}
