import { apiClient } from './apiClient'

// ============================================================================
// 1. ІНТЕРФЕЙСИ КОНТРАКТІВ (Приведені у 100% відповідність до серверних DTO)
// ============================================================================
interface CategoryDto { 
  id: string; 
  name: string; 
}

interface OrderDto { 
  id: string; 
  userId: string; 
  totalPrice: number; 
  status: "pending" | "paid" | "shipped" | "cancelled"; 
  createdAt: string; 
}

interface OrderItemDto { 
  id: string; 
  orderId: string; 
  productId: string; 
  quantity: number; 
}

interface ProductDto { 
  id: string; 
  title: string; 
  description: string; 
  price: number; 
  stock: number; 
  categoryId: string; 
  sales: number; 
}

interface UserDto { 
  id: string; 
  userName: string; 
  email: string; 
}

type EntityDto = CategoryDto | OrderDto | OrderItemDto | ProductDto | UserDto;

interface AppState {
  activeTab: string;
  editingId: string | null;
  categories: CategoryDto[];
  orders: OrderDto[];
  orderItems: OrderItemDto[];
  products: ProductDto[];
  users: UserDto[];
  filters: {
    categories: string;
    orders: string;
    orderItems: string;
    products: string;
    users: string;
    orderStatus: string;
  };
}

interface EntitySetting {
  stateKey: keyof Omit<AppState, 'activeTab' | 'editingId' | 'filters'>;
  apiSuffix: string;
  tableBody: HTMLElement | null;
  form: HTMLFormElement | null;
  submitBtnText: string;
  
  loader?: HTMLElement | null;
  errorBlock?: HTMLElement | null;
  errorDetails?: HTMLElement | null;
  emptyBlock?: HTMLElement | null;
}

// ============================================================================
// 2. ГЛОБАЛЬНИЙ СТАН
// ============================================================================
const state: AppState = {
  activeTab: "categories-page", 
  editingId: null,             

  categories: [],
  orders: [],
  orderItems: [], 
  products: [],
  users: [],

  filters: {
    categories: "",
    orders: "",
    orderItems: "",
    products: "",
    users: "",
    orderStatus: "" 
  }
};

const $ = (id: string): HTMLElement | null => document.getElementById(id);

// ============================================================================
// 3. ТИПІЗОВАНА МАПА КОНФІГУРАЦІЇ
// ============================================================================
const entityConfig: Record<string, EntitySetting> = {
  "categories-page": {
    stateKey: "categories",       
    apiSuffix: "Categories",      
    tableBody: $("categoryTableBody"),
    form: $("categoryForm") as HTMLFormElement,
    loader: $("catLoader"),
    errorBlock: $("catErrorBlock"),
    errorDetails: $("catErrorDetails"),
    emptyBlock: $("catEmptyBlock"),
    submitBtnText: "Додати"
  },
  "orders-page": {
    stateKey: "orders",
    apiSuffix: "Orders",
    tableBody: $("orderTableBody"),
    form: $("orderForm") as HTMLFormElement,
    loader: $("ordLoader"),
    errorBlock: null, 
    errorDetails: null,
    emptyBlock: null,
    submitBtnText: "Додати"
  },
  "items-page": {
    stateKey: "orderItems",
    apiSuffix: "OrderItems",     
    tableBody: $("orderItemTableBody"),
    form: $("orderItemForm") as HTMLFormElement,
    loader: null,
    errorBlock: null,
    emptyBlock: null,
    submitBtnText: "Додати в замовлення"
  },
  "products-page": {
    stateKey: "products",
    apiSuffix: "Products",
    tableBody: $("productTableBody"),
    form: $("productForm") as HTMLFormElement,
    loader: null,
    errorBlock: null,
    emptyBlock: null,
    submitBtnText: "Зберегти оголошення"
  },
  "users-page": {
    stateKey: "users",
    apiSuffix: "Users",
    tableBody: $("userTableBody"),
    form: $("userForm") as HTMLFormElement,
    loader: null,
    errorBlock: null,
    emptyBlock: null,
    submitBtnText: "Створити користувача"
  }
};

// ============================================================================
// 4. КЕРУВАННЯ ВКЛАДКАМИ (SPA)
// ============================================================================
function initTabs(): void {
  const tabButtons = document.querySelectorAll<HTMLButtonElement>(".tabs-nav button");
  const pages = document.querySelectorAll<HTMLElement>(".entity-page");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      if (!targetId) return;

      state.activeTab = targetId;
      state.editingId = null; 

      tabButtons.forEach(btn => btn.classList.remove("active"));
      pages.forEach(page => page.classList.remove("active"));

      button.classList.add("active");
      $(targetId)?.classList.add("active");

      const config = entityConfig[targetId];
      if (config && config.form) {
        config.form.reset();
        // Автоматично приховуємо старі повідомлення про помилки при зміні вкладок
        config.form.querySelector(".form-error-message")?.classList.add("hidden");
        const submitBtn = config.form.querySelector<HTMLButtonElement>('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = config.submitBtnText;
      }

      loadData(targetId);
    });
  });

  if (tabButtons.length > 0) tabButtons[0].click();
}

// ============================================================================
// 5. НАДІЙНЕ ЗАВАНТАЖЕННЯ ДАНИХ
// ============================================================================
async function loadData(pageId: string = state.activeTab): Promise<void> {
  const config = entityConfig[pageId];
  if (!config) return;

  config.loader?.classList.remove("hidden");
  config.errorBlock?.classList.add("hidden");
  config.emptyBlock?.classList.add("hidden");
  if (config.tableBody) config.tableBody.innerHTML = "";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); 

  try {
    const methodName = `get${config.apiSuffix}`;
    
    if (typeof (apiClient as any)[methodName] !== "function") {
      throw new Error(`Метод apiClient.${methodName} не знайдено в модулі!`);
    }

    const data = await (apiClient as any)[methodName]({ signal: controller.signal });
    clearTimeout(timeoutId);

    (state as any)[config.stateKey] = data;

    if (!data || data.length === 0) {
      config.emptyBlock?.classList.remove("hidden");
    } else {
      render(pageId);
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    
    let errorText = err.message || "Не вдалося завантажити дані";
    if (err.name === 'AbortError') {
      errorText = "Перевищено час очікування відповіді (Таймаут сервера 10с).";
    }

    if (err.details) {
      if (typeof err.details === 'object') {
        errorText += " Деталі: " + JSON.stringify(err.details);
      } else {
        errorText += ` (${err.details})`;
      }
    }

    if (config.errorDetails && config.errorBlock) {
      config.errorDetails.textContent = errorText;
      config.errorBlock.classList.remove("hidden");
    } else {
      console.error(`Критичний збій мережі [${config.stateKey}]:`, errorText);
    }
  }
  Array.isArray((state as any)[config.stateKey]) ? null : (state as any)[config.stateKey] = [];
  config.loader?.classList.add("hidden");
}

// ============================================================================
// 6. RENDER КОМПОНЕНТІВ (Таблиці та Сучасні CSS Grid Картки)
// ============================================================================
function render(pageId: string = state.activeTab): void {
  const config = entityConfig[pageId];
  if (!config || !config.tableBody) return;

  config.tableBody.innerHTML = "";
  const rawList = state[config.stateKey] as any[];

  const filteredList = rawList.filter(item => {
    const search = (state.filters[config.stateKey as keyof typeof state.filters] || "").toLowerCase();
    
    if (pageId === "categories-page") {
      return !search || String(item.name).toLowerCase().includes(search);
    }
    if (pageId === "orders-page") {
      const matchesSearch = !search || String(item.userId).toLowerCase().includes(search) || String(item.id).toLowerCase().includes(search);
      const matchesStatus = !state.filters.orderStatus || item.status === state.filters.orderStatus;
      return matchesSearch && matchesStatus;
    }
    if (pageId === "items-page") {
      return !search || String(item.orderId).includes(search) || String(item.productId).includes(search) || String(item.id).includes(search);
    }
    if (pageId === "products-page") {
      return !search || String(item.title).toLowerCase().includes(search) || String(item.description).toLowerCase().includes(search);
    }
    if (pageId === "users-page") {
      return !search || String(item.id).toLowerCase().includes(search) || 
             String(item.userName).toLowerCase().includes(search) || String(item.email).toLowerCase().includes(search);
    }
    return true;
  });

  filteredList.forEach(item => {
    if (pageId === "products-page") {
      const card = document.createElement("div");
      card.className = "product-row-card";
      card.innerHTML = `
        <div class="product-main-grid">
          <div class="prod-title">${item.title}</div>
          <div class="prod-desc">${item.description || '—'}</div>
          <div class="price-cell">${Number(item.price).toFixed(2)} ₴</div>
          <div>${item.stock} шт.</div>
          <div>${item.sales || 0}</div>
          <div class="actions-cell">
            <button class="edit-btn" data-id="${item.id}">Ред.</button>
            <button class="delete-btn" data-id="${item.id}">Вид.</button>
          </div>
        </div>
        <div class="product-system-footer">
          <span class="id-tag"><strong>ID оголошення:</strong> ${item.id}</span>
          <span class="id-tag"><strong>ID категорії:</strong> ${item.categoryId}</span>
        </div>
      `;
      config.tableBody?.appendChild(card);
    } else {
      const row = document.createElement("tr");
      
      if (pageId === "categories-page") {
        row.innerHTML = `<td>${item.id}</td><td><strong>${item.name}</strong></td>`;
      } else if (pageId === "orders-page") {
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.userId}</td>
          <td>${Number(item.totalPrice).toFixed(2)} ₴</td>
          <td><span class="status-badge ${item.status}">${item.status}</span></td>
          <td>${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
        `;
      } else if (pageId === "items-page") {
        row.innerHTML = `<td>${item.id}</td><td>${item.orderId}</td><td>${item.productId}</td><td>${item.quantity} шт.</td>`;
      } else if (pageId === "users-page") {
        row.innerHTML = `<td>${item.id}</td><td><strong>${item.userName || '—'}</strong></td><td>${item.email}</td>`;
      }

      row.innerHTML += `
        <td>
          <button class="edit-btn" data-id="${item.id}">Ред.</button>
          <button class="delete-btn" data-id="${item.id}">Вид.</button>
        </td>
      `;
      config.tableBody?.appendChild(row);
    }
  });
}

// ============================================================================
// 7. ОБРОБНИКИ ПОДІЙ СТВОРЕННЯ, РЕДАГУВАННЯ ТА ВАЛІДАЦІЇ
// ============================================================================
function initEventHandlers(): void {
  
  // А) ВІДПРАВКА ФОРМ (Сучасна обробка помилок без використання alert)
  Object.keys(entityConfig).forEach(pageId => {
    const config = entityConfig[pageId];
    if (!config.form) return;

    config.form.addEventListener("submit", async (e: Event) => {
      e.preventDefault();
      if (!config.form) return;
      
      // Приховуємо попередню помилку форми перед новою спробою
      config.form.querySelector(".form-error-message")?.classList.add("hidden");
      
      const formData = new FormData(config.form);
      const data = Object.fromEntries(formData.entries()) as Record<string, any>;

      if (!state.editingId) {
        delete data.id;
      }

      // Приведення типів DTO
      if (data.price !== undefined) data.price = Number(data.price);
      if (data.stock !== undefined) data.stock = parseInt(data.stock, 10);
      if (data.quantity !== undefined) data.quantity = parseInt(data.quantity, 10);
      if (data.totalPrice !== undefined) data.totalPrice = Number(data.totalPrice);

      if (pageId === "orders-page") {
        if (data.price !== undefined && data.totalPrice === undefined) {
          data.totalPrice = data.price;
        }
        data.totalPrice = Number(data.totalPrice || 0);

        if (data.status) {
          data.status = String(data.status).toLowerCase();
        }
      }

      try {
        if (state.editingId) {
          const methodName = `update${config.apiSuffix}`;
          await (apiClient as any)[methodName](state.editingId, data);
          state.editingId = null;
          const submitBtn = config.form.querySelector<HTMLButtonElement>('button[type="submit"]');
          if (submitBtn) submitBtn.textContent = config.submitBtnText;
        } else {
          const methodName = `create${config.apiSuffix}`;
          await (apiClient as any)[methodName](data);
        }
        
        config.form.reset();
        await loadData(pageId);
      } catch (err: any) {
        // Виводимо помилку гарно в інтерфейс форми (Вимога ЛР №4)
        let errMsg = err.message || "Не вдалося виконати операцію.";
        if (err.details) {
          errMsg += ` (Деталі: ${typeof err.details === 'object' ? JSON.stringify(err.details) : err.details})`;
        }
        showFormError(pageId, errMsg);
      }
    });
  });

  // Б) ДЕЛЕГУВАННЯ ПОДІЙ (DELETE / EDIT)
  Object.keys(entityConfig).forEach(pageId => {
    const config = entityConfig[pageId];
    if (!config.tableBody) return;

    config.tableBody.addEventListener("click", async (e: Event) => {
      const target = e.target as HTMLElement;
      const id = target.dataset.id?.trim();
      if (!id) return;

      // ВИДАЛЕННЯ
      if (target.classList.contains("delete-btn")) {
        if (confirm(`Видалити цей елемент з секції [${config.stateKey}]?`)) {
          try {
            const methodName = `delete${config.apiSuffix}`;
            
            if (typeof (apiClient as any)[methodName] !== "function") {
              throw new Error(`Метод apiClient.${methodName} не знайдено!`);
            }

            await (apiClient as any)[methodName](id);
            await loadData(pageId);
          } catch (err: any) {
            alert("Не вдалося видалити: " + (err.message || err));
          }
        }
      }

      // РЕДАГУВАННЯ
      if (target.classList.contains("edit-btn")) {
        const rawList = state[config.stateKey] as any[];
        const record = rawList.find(r => String(r.id).trim() === String(id));
        
        if (record && config.form) {
          // Приховуємо стару помилку при початку редагування нового запису
          config.form.querySelector(".form-error-message")?.classList.add("hidden");

          Object.keys(record).forEach(key => {
            const input = config.form!.elements.namedItem(key) as HTMLInputElement | HTMLSelectElement | null;
            if (input) input.value = record[key];
          });
          
          state.editingId = id;
          const submitBtn = config.form.querySelector<HTMLButtonElement>('button[type="submit"]');
          if (submitBtn) submitBtn.textContent = "Зберегти зміни";
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  });

  // В) ПОШУК ТА СИНХРОНІЗАЦІЯ ФІЛЬТРІВ
  $("catSearchInput")?.addEventListener("input", (e) => { state.filters.categories = (e.target as HTMLInputElement).value; render("categories-page"); });
  $("orderSearchInput")?.addEventListener("input", (e) => { state.filters.orders = (e.target as HTMLInputElement).value; render("orders-page"); });
  $("orderStatusFilter")?.addEventListener("change", (e) => { state.filters.orderStatus = (e.target as HTMLSelectElement).value; render("orders-page"); });
  $("itemSearchInput")?.addEventListener("input", (e) => { state.filters.orderItems = (e.target as HTMLInputElement).value; render("items-page"); });
  $("productSearchInput")?.addEventListener("input", (e) => { state.filters.products = (e.target as HTMLInputElement).value; render("products-page"); });
  $("userSearchInput")?.addEventListener("input", (e) => { state.filters.users = (e.target as HTMLInputElement).value; render("users-page"); });

  // Г) КНОПКИ СКИДАННЯ ТА ОНОВЛЕННЯ ДАНИХ
  const setupFormReset = (btnId: string, pageId: string) => {
    const btn = $(btnId);
    if (!btn) return; 
    
    btn.addEventListener("click", () => {
      state.editingId = null;
      const config = entityConfig[pageId];
      if (config && config.form) {
        config.form.querySelector(".form-error-message")?.classList.add("hidden");
        const submitBtn = config.form.querySelector<HTMLButtonElement>('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = config.submitBtnText;
        config.form.reset();
      }
    });
  };

  setupFormReset("catResetBtn", "categories-page");
  setupFormReset("orderResetBtn", "orders-page");
  setupFormReset("itemResetBtn", "items-page");
  setupFormReset("productResetBtn", "products-page");
  setupFormReset("userResetBtn", "users-page");

  $("catRefreshBtn")?.addEventListener("click", () => loadData("categories-page"));
  $("orderRefreshBtn")?.addEventListener("click", () => loadData("orders-page"));
  $("itemRefreshBtn")?.addEventListener("click", () => loadData("items-page"));
  $("productRefreshBtn")?.addEventListener("click", () => loadData("products-page"));
  $("userRefreshBtn")?.addEventListener("click", () => loadData("users-page"));
  $("catRetryBtn")?.addEventListener("click", () => loadData("categories-page"));
}

// ДОПОМІЖНА ФУНКЦІЯ: Відображення помилок сервера над формами (Тема ЛР №4)
function showFormError(pageId: string, message: string) {
  const config = entityConfig[pageId];
  if (!config || !config.form) return;

  let errorEl = config.form.querySelector(".form-error-message") as HTMLElement;
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.className = "form-error-message";
    errorEl.style.color = "#ef4444";
    errorEl.style.fontSize = "13px";
    errorEl.style.marginBottom = "10px";
    errorEl.style.padding = "8px";
    errorEl.style.background = "#fef2f2";
    errorEl.style.borderRadius = "6px";
    errorEl.style.fontWeight = "500";
    config.form.insertBefore(errorEl, config.form.firstChild);
  }
  
  errorEl.textContent = `❌ ${message}`;
  errorEl.classList.remove("hidden");
}

// ============================================================================
// 8. СТАРТ ЗАСТОСУНКУ
// ============================================================================
initTabs();
initEventHandlers();