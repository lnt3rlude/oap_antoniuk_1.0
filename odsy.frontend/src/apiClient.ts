const API_BASE_URL = 'http://localhost:3000/api/v1'; // Додано префікс /v1 відповідно до критеріїв контракту

export const apiClient = {
    /**
     * Уніфікований метод відправки HTTP-запитів
     * @param endpoint Відносний шлях ендпоінту (наприклад, '/products')
     * @param options Налаштування запиту (method, body, headers, signal тощо)
     */
    async sendRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
        const url = `${API_BASE_URL}${endpoint}`;
        
        // Збираємо заголовки без ризику перезаписати Content-Type
        const headers = new Headers({
            'Content-Type': 'application/json',
            ...(options.headers || {})
        });

        // Формуємо фінальну конфігурацію запиту, гарантуючи наявність signal на найвищому рівні
        const finalOptions: RequestInit = {
            ...options,
            headers: headers
        };

        try {
            const response = await fetch(url, finalOptions);
            
            // ОБРОБКА СТАНІВ ПОМИЛОК (4xx / 5xx) — Узгоджений формат ProblemDetails
            if (!response.ok) {
                let errorDetails: any = null;
                let errorMessage = 'Сталася помилка на сервері';

                try {
                    // Намагаємось розпарсити відповідь як JSON (RFC 7807 Problem Details або custom)
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.title || errorMessage;
                    // Зберігаємо розширені помилки валідації по полях
                    errorDetails = errorData.errors || errorData.detail || null;
                } catch {
                    // Якщо сервер повернув помилку не в форматі JSON (наприклад, збій проксі-сервера)
                }

                throw {
                    status: response.status,
                    message: errorMessage,
                    details: errorDetails
                };
            }

            // РЯТІВНИЙ БЛОК ДЛЯ DELETE-ЗАПИТІВ ТА СТАТУСУ 204 No Content
            if (response.status === 204) {
                return true; 
            }

            // Безпечний парсинг тіла відповіді
            const text = await response.text();
            return text ? JSON.parse(text) : {};
            
        } catch (error: any) {
            // Якщо запит скасовано авто-таймаутом (10с) або кнопкою з main.ts
            if (error.name === 'AbortError') {
                console.warn(`Запит до ${endpoint} перервано через таймаут клієнта.`);
            } else {
                console.error('API Error:', error);
            }
            throw error;
        }
    },

    // ============================================================================
    // МЕТОДИ СУТНОСТЕЙ (Тепер усі методи приймають options для прокидання signal)
    // ============================================================================

    // --- CATEGORIES ---
    async getCategories(options?: RequestInit) { return this.sendRequest('/categories', { method: 'GET', ...options }); },
    async getCategoriesById(id: string, options?: RequestInit) { return this.sendRequest(`/categories/${id}`, { method: 'GET', ...options }); },
    async createCategories(data: any, options?: RequestInit) { return this.sendRequest('/categories', { method: 'POST', body: JSON.stringify(data), ...options }); },
    async updateCategories(id: string, data: any, options?: RequestInit) { return this.sendRequest(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data), ...options }); },
    async deleteCategories(id: string, options?: RequestInit) { return this.sendRequest(`/categories/${id}`, { method: 'DELETE', ...options }); },

    // --- PRODUCTS ---
    async getProducts(options?: RequestInit) { return this.sendRequest('/products', { method: 'GET', ...options }); },
    async getProductsById(id: string, options?: RequestInit) { return this.sendRequest(`/products/${id}`, { method: 'GET', ...options }); },
    async createProducts(data: any, options?: RequestInit) { return this.sendRequest('/products', { method: 'POST', body: JSON.stringify(data), ...options }); },
    async updateProducts(id: string, data: any, options?: RequestInit) { return this.sendRequest(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data), ...options }); },
    async deleteProducts(id: string, options?: RequestInit) { return this.sendRequest(`/products/${id}`, { method: 'DELETE', ...options }); },

    // --- ORDERS ---
    async getOrders(options?: RequestInit) { return this.sendRequest('/orders', { method: 'GET', ...options }); },
    async getOrdersById(id: string, options?: RequestInit) { return this.sendRequest(`/orders/${id}`, { method: 'GET', ...options }); },
    async createOrders(data: any, options?: RequestInit) { return this.sendRequest('/orders', { method: 'POST', body: JSON.stringify(data), ...options }); },
    async updateOrders(id: string, data: any, options?: RequestInit) { return this.sendRequest(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify(data), ...options }); },
    async deleteOrders(id: string, options?: RequestInit) { return this.sendRequest(`/orders/${id}`, { method: 'DELETE', ...options }); },

    // --- ORDER ITEMS ---
    async getOrderItems(options?: RequestInit) { return this.sendRequest('/order-items', { method: 'GET', ...options }); },
    async getOrderItemsById(id: string, options?: RequestInit) { return this.sendRequest(`/order-items/${id}`, { method: 'GET', ...options }); },
    async createOrderItems(data: any, options?: RequestInit) { return this.sendRequest('/order-items', { method: 'POST', body: JSON.stringify(data), ...options }); },
    async updateOrderItems(id: string, data: any, options?: RequestInit) { return this.sendRequest(`/order-items/${id}`, { method: 'PATCH', body: JSON.stringify(data), ...options }); },
    async deleteOrderItems(id: string, options?: RequestInit) { return this.sendRequest(`/order-items/${id}`, { method: 'DELETE', ...options }); },

    // --- USERS ---
    async getUsers(options?: RequestInit) { return this.sendRequest('/users', { method: 'GET', ...options }); },
    async getUsersById(id: string, options?: RequestInit) { return this.sendRequest(`/users/${id}`, { method: 'GET', ...options }); },
    async createUsers(data: any, options?: RequestInit) { return this.sendRequest('/users', { method: 'POST', body: JSON.stringify(data), ...options }); },
    async updateUsers(id: string, data: any, options?: RequestInit) { return this.sendRequest(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data), ...options }); },
    async deleteUsers(id: string, options?: RequestInit) { return this.sendRequest(`/users/${id}`, { method: 'DELETE', ...options }); }
};