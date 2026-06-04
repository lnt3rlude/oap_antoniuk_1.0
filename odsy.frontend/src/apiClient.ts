
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Приватний базовий метод для виконання запитів з JWT-токеном
  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = new Headers(options.headers || {});

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    // Автоматично беремо токен з LocalStorage та додаємо в заголовок
    const token = localStorage.getItem('jwt_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Unknown error occurred' };
      }
      
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`) as any;
      error.status = response.status;
      error.code = errorData.code;
      error.details = errorData.details;
      throw error;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // ========================================================================
  // УНІВЕРСАЛЬНИЙ МЕТОД ДЛЯ SUBMIT-ФОРМ (Потрібен для нашого main.ts)
  // ========================================================================
  public async sendRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(endpoint, options);
  }

  // ========================================================================
  // МЕТОДИ АВТЕНТИФІКАЦІЇ
  // ========================================================================
  public async login(data: any): Promise<{ message: string; token: string; user: any }> {
    return this.fetch<{ message: string; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async register(data: any): Promise<{ message: string; user: any }> {
    return this.fetch<{ message: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============================================================================
  // МЕТОДИ СУТНОСТЕЙ (CRUD)
  // ============================================================================

  // Categories
  public async getCategories(options?: { signal?: AbortSignal }): Promise<any[]> {
    return this.fetch<any[]>('/categories', options);
  }
  public async createCategories(data: any): Promise<any> {
    return this.fetch<any>('/categories', { method: 'POST', body: JSON.stringify(data) });
  }
  public async updateCategories(id: string, data: any): Promise<any> {
    return this.fetch<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  public async deleteCategories(id: string): Promise<void> {
    return this.fetch<void>(`/categories/${id}`, { method: 'DELETE' });
  }

  // Orders
  public async getOrders(options?: { signal?: AbortSignal }): Promise<any[]> {
    return this.fetch<any[]>('/orders', options);
  }
  public async createOrders(data: any): Promise<any> {
    return this.fetch<any>('/orders', { method: 'POST', body: JSON.stringify(data) });
  }
  public async updateOrders(id: string, data: any): Promise<any> {
    return this.fetch<any>(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  public async deleteOrders(id: string): Promise<void> {
    return this.fetch<void>(`/orders/${id}`, { method: 'DELETE' });
  }

  // OrderItems
  public async getOrderItems(options?: { signal?: AbortSignal }): Promise<any[]> {
    return this.fetch<any[]>('/order-items', options);
  }
  public async createOrderItems(data: any): Promise<any> {
    return this.fetch<any>('/order-items', { method: 'POST', body: JSON.stringify(data) });
  }
  public async updateOrderItems(id: string, data: any): Promise<any> {
    return this.fetch<any>(`/order-items/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  public async deleteOrderItems(id: string): Promise<void> {
    return this.fetch<void>(`/order-items/${id}`, { method: 'DELETE' });
  }

  // Products
  public async getProducts(options?: { signal?: AbortSignal }): Promise<any[]> {
    return this.fetch<any[]>('/products', options);
  }
  public async createProducts(data: any): Promise<any> {
    return this.fetch<any>('/products', { method: 'POST', body: JSON.stringify(data) });
  }
  public async updateProducts(id: string, data: any): Promise<any> {
    return this.fetch<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  public async deleteProducts(id: string): Promise<void> {
    return this.fetch<void>(`/products/${id}`, { method: 'DELETE' });
  }

  // Users
  public async getUsers(options?: { signal?: AbortSignal }): Promise<any[]> {
    return this.fetch<any[]>('/users', options);
  }
  public async createUsers(data: any): Promise<any> {
    return this.fetch<any>('/users', { method: 'POST', body: JSON.stringify(data) });
  }
  public async updateUsers(id: string, data: any): Promise<any> {
    return this.fetch<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  public async deleteUsers(id: string, role: string, currentId: string): Promise<void> {
    // Передаємо id в самому шляху, а роль — як query-параметр
    return this.fetch<void>(`/users/${id}?role=${encodeURIComponent(role)}&&userId=${encodeURIComponent(currentId)}`, { 
      method: 'DELETE' 
    });
  }
}

// КРИТИЧНЕ ВИПРАВЛЕННЯ: Додали /v1, щоб адреса збігалася з бекендом!
export const apiClient = new ApiClient('http://localhost:3000/api/v1');
