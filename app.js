// =======================
// СТАН
// =======================
const state = { // Об'єкт стану якому ми присвоюємо
  records: [], // Масив записів
  nextId: 1, // Лічильник Унікальних ID
  editingId: null, //Id запису що редагується
  filters: { // Об'єкт фільтрів
    search: "", // Текст для пошуку по UserName або Comments
    status: "" // Обраний статус для фільтрації таблиця
  }
};

// =======================
// DOM
// =======================
function $(id) { // $("id") = document.getElementById("id")
  return document.getElementById(id) || null; // Повертає елемент за id або null
}

// DOM
const form = $("myform"); // Створює змінну, і присвоює елемент html за id
const tableBody = $("tableBody");
const resetBtn = $("resetBtn");

const userNameInput = $("userNameInput");
const dateInput = $("dateInput");
const accessTypeSelect = $("accessTypeSelect");
const commentsText = $("commentsText");
const statusSelect = $("statusSelect");

const userNameError = $("userNameError");
const dateError = $("dateError");
const accessTypeError = $("accessTypeError");

const searchInput = $("searchInput");
const statusFilter = $("statusFilter");

// =======================
// LOCAL STORAGE
// =======================
function saveToLocalStorage() {
  try {
    const recordsString = JSON.stringify(state.records); // Перетворюємо наш масив в Json рядок та робимо з нього змвнну

    // Приблизна перевірка розміру (5MB = ~5 000 000 символів)
    if (recordsString.length > 4_500_000) {
      showMessage("Занадто багато даних. Видаліть частину записів.", "error");
      return;
    }

    localStorage.setItem("records", recordsString); // Зберігаємо наш перетворений масив в локальній пам'яті за ключем "records"
    localStorage.setItem("nextId", String(state.nextId)); // Зберігаємо наш id в локальній пам'яті за ключем з перетворенням в текст

  } catch (e) {
    console.error("Save error:", e); 
    showMessage("Помилка збереження. Можливо, сховище переповнене.", "error");
  }
}

function loadFromLocalStorage() {
  let saved = []; // Масив збережених

  try {
    const raw = localStorage.getItem("records"); // Беремо масив з локальної пам'яті та присвоюємо змінну

    if (!raw) { // Захист, Ствоюємо порожній масив якщо в локальній пам'яті пусто
      state.records = [];
      return;
    }

    saved = JSON.parse(raw); // Перетворюємо JSON-рядок назад у Java Script Object

  } catch (error) {
    alert("Дані сховища пошкоджені. Система буде скинута.");
    console.error("Storage corrupted:", error); // Попередження про пошкоджені дані

    localStorage.removeItem("records"); // Видалення зламаних данних
    localStorage.removeItem("nextId");

    state.records = []; // Створюємо все знову
    state.nextId = 1;
    return;
  }

  // Валідація (Перевірка на масив, оскільки Json це не перевіряє)
  if (Array.isArray(saved)) {
    state.records = saved;
  } else {
    alert("Невірний формат даних. Система буде скинута.");
    state.records = [];
  }

  const id = Number(localStorage.getItem("nextId"));// Перетворюємо айдішнік в число з локальної пам'яті
  if (!isNaN(id) && id > 0) {
    state.nextId = id;
  } else {
    state.nextId = 1;
  }
}

  function repairIds() {
  const used = new Set(); // Створюється зміна яка зберігає унікальні значення через Set

  state.records = state.records.filter(r => { // Функція перевірки елементів
    if (!r || typeof r.id !== "number" || r.id <= 0 || used.has(r.id)) return false; // Якщо запис порожній АБО Id не число АБО id менше 0, АБО id вже зустрічався 
    used.add(r.id); // Якщо все ок - додаєм в set
    return true;
  });

  const maxId = state.records.reduce((m, r) => Math.max(m, r.id), 0); // Функція знаходження найбільшого id
  state.nextId = maxId + 1; // Наступні числа будуть мати id на 1 більше ніж максимальний
}

// =======================
// READ FORM (SAFE)
// =======================

function readForm() { // Функція, що створює об'єкти і повертає їх
  return {
    userName: (userNameInput?.value?.trim() || "").slice(0, 100), //Взяти Input елемент; ?. - Перевірка, якщо UserName існує беремо його значення, якщо ні повертаєм undefined ?.trim() - Видаляє пробіли; || - Якщо у нас значення null, undefined, то підставляємо порожній рядок; .slice - Максимум 100 символів
    date: dateInput?.value || "", // Беремо значення елемента з перевіркою, значення є - беремо його, немає - повертаємо undefined, якщо зліва null, undefined і тд використовуємо порожній рядок
    accessType: accessTypeSelect?.value || "", // Беремо значення елемента з перевіркою, значення є - беремо його, немає - повертаємо undefined, якщо зліва null, undefined і тд використовуємо порожній рядок
    comments: (commentsText?.value?.trim() || "").slice(0, 500), // Беремо значення елемента з перевіркою, значення є - беремо його, немає - повертаємо undefined, якщо зліва null, undefined і тд використовуємо порожній рядок, ?.trim() - Видаляє пробіли;
    status: statusSelect?.value || "" // Беремо значення елемента з перевіркою, значення є - беремо його, немає - повертаємо undefined, якщо зліва null, undefined і тд використовуємо порожній рядок
  };
}

// =======================
// VALIDATE
// =======================

function validate(data) { // Дата
  let ok = true; 

  const fields = [ // Масив, з 3 елементами та 4 властивостями, Input, error - елемент для показу помилки, value - значення, яке потрібно перевірити, msg - текст повідомлення
    { input: userNameInput, error: userNameError, value: data.userName, msg: "UserName обов'язкове" },
    { input: dateInput, error: dateError, value: data.date, msg: "Дата обов'язкова" },
    { input: accessTypeSelect, error: accessTypeError, value: data.accessType, msg: "Оберіть тип доступу" }
  ];

  if (data.comments.length > 500) { // Перевірка коментарів
  showMessage("Коментар занадто довгий (максимум 500 символів).");
  ok = false;
  }

  fields.forEach(f => { // Масив Fields з Методом .ForEach - Проходить по кожному елементу цього масива (f - параметр функції)
    if (f.input) f.input.classList.remove("input-error"); // if (f.input) - Перевірка на null та undefined, після цього ми прибираємо клас "input-error" з елемента (Якщо поле існує - прибери з нього стилі помилки)
    if (f.error) f.error.textContent = ""; // Перед новою перевіркою прибираємо повідомлення про помилку, якщо вона є, якщо її немає - нічого не робити

    if (!f.value) { // Якщо значення порожнє
      if (f.input) f.input.classList.add("input-error"); // if (f.input) - Перевірка елемента на існування; Якщо так - підсвчуємо його яерез CSS
      if (f.error) f.error.textContent = f.msg; // Якщо елемент для повідомлення існує — покажи йому текст помилки.
      ok = false; // Перевірка не пройшла
      return;
    }
  }
);

  return ok;
}

// =======================
// ADD AND UPDATE
// =======================

function addItem(data) { 
  if (state.editingId !== null) { // Перевірка id запису, Якщо він не null → ми зараз редагуємо існуючий запис 
    const editingIndex = state.records.findIndex(r => r.id === state.editingId); // Ми шукаємо, який саме запис редагуємо в масиві records і запам’ятовуємо його позицію як editingIndex
    if (editingIndex !== -1) state.records[editingIndex] = { id: state.editingId, ...data };
    state.editingId = null; // Перевіряємо чи справді існує запис, кий ми хочемо редагувати
  } else { // Якщо null → створюємо новий запис
    state.records.push({ id: state.nextId++, ...data }); // Додаємо його в кінець масиву, і збільшуємо next id +1
  }

  saveToLocalStorage(); // Зберігаємо в пам'яті
}

// =======================
// DELETE
// =======================

function deleteItem(id) {
  if (!id) return; // Якщо id відсутнє - нічого не робимо
  state.records = state.records.filter(r => r.id !== id); // Створюємо новий масив, що задовольняє умову (видаляє запис з масиву state.records, який має конкретний id)
  saveToLocalStorage(); // Зберігаємо в пам'яті
}

// =======================
// SAFE CELL CREATOR (XSS PROTECTION)
// =======================
function td(text) {
  const cell = document.createElement("td"); // Створюємо порожню комірку в таблиці
  cell.textContent = String(text || ""); // Заповнюємо комірку текстом. Якщо тексту немає - залишаємо порожню комірку.
  return cell;
}

// =======================
// RENDER
// =======================

function render() {
  if (!tableBody) return; // Якщо тіло таблиці відстунє - нічого не робимо

  tableBody.innerHTML = ""; // Очищуємо таблицю перед тим, як заново додати всі рядки із записами.

  let list = [...state.records]; // Дублюємо state.records масив

  if (state.filters.search) {
    const saved = state.filters.search.toLowerCase(); // Пошук елемента; Виконуємрїо пошук за значенням  з поля пошуку; .toLowerCase() - переводимо всі букви в маленькі та збергіаємо в змінній saved
    list = list.filter(r => // Cтворюємо новий масив у якому перевіряємо кожен запис у масиві list
      String(r.userName).toLowerCase().includes(saved) ||
      String(r.comments).toLowerCase().includes(saved) 
    );// Ми залишаємо ті записи, у яких userName або comments містять текст пошуку (saved).
  }

  if (state.filters.status) {
    list = list.filter(r => r.status === state.filters.status); // Створюємо новий масив, в якому перевіряємо умову статусу (Фільтр за статусом)
  }

  list.forEach(r => {
    const row = document.createElement("tr"); // Створюємо рядок та зберігаємо його у змінній row

    row.appendChild(td(r.userName)); // Беремо ім’я користувача з поточного запису, створюємо для нього комірку <td> і вставляємо її у рядок таблиці.
    row.appendChild(td(r.date)); // Беремо дату з поточного запису, створюємо для нього комірку <td> і вставляємо її у рядок таблиці.
    row.appendChild(td(r.accessType)); //Беремо тип доступу користувача з поточного запису, створюємо для нього комірку <td> і вставляємо її у рядок таблиці.
    row.appendChild(td(r.comments));
    row.appendChild(td(r.status));

    const actions = document.createElement("td"); // Створюємо комірку в таблиці

    const edit = document.createElement("button"); // Створюємо кнопку ‘Редагувати’, яку пізніше можна показати в таблиці і додати до неї обробку кліку
    edit.textContent = "Редагувати"; // заповнюємо кнопку текстом ‘Редагувати’
    edit.dataset.id = r.id; // Беремо id поточного елемента
    edit.className = "edit-btn"; // Присвоюєм класс для css

    const del = document.createElement("button"); // Створюємо кнопку 'Видалити'
    del.textContent = "Видалити"; // заповнюємо кнопку текстом Видалити
    del.dataset.id = r.id; // Беремо id поточного елемента
    del.className = "delete-btn"; // Присвоюєм класс для css

    actions.append(edit, del); // actions - <td> (Комірка таблиця); append - Метод, що додає елементи всередину іншого елемента (Додоаємо Del, Edit)
    row.appendChild(actions); // row - <tr> (Рядок таблиці)

    tableBody.appendChild(row); // Заповнюємо таблиці
  });
}

// =======================
// HANDLERS (Обробник)
// =======================
if (searchInput) { // Перевірка
  searchInput.addEventListener("input", e => { // Прив’язуємо обробник до події "input"
    state.filters.search = e.target.value; // оновлюємо стан state.filters.search коли вводиться текст
    render();
  });
}

if (statusFilter) {
  statusFilter.addEventListener("change", e => { // Прив’язуємо обробник до події "Change"
    state.filters.status = e.target.value; // оновлюємо стан state.filters.status коли обирається він 
    render();
  });
}

if (form) {
  form.addEventListener("submit", e => { // Прив’язуємо обробник до Форми
    e.preventDefault(); // Блокує стандартну поведінку браузера

    const data = readForm(); // бирає всі значення з форми в один об’єкт

    if (!validate(data)) {
      alert("Форма містить помилки");
      return;
    }

    addItem(data);
    render();
    form.reset();
  });
}

if (resetBtn && form) {
  resetBtn.addEventListener("click", () => form.reset());
}

if (tableBody) {
  tableBody.addEventListener("click", e => { 
    const id = Number(e.target.dataset.id); 
    if (!id) return;

    if (e.target.classList.contains("delete-btn")) {
      if (confirm("Видалити запис?")) {
        deleteItem(id);
        render();
      }
    }

    if (e.target.classList.contains("edit-btn")) {
      const r = state.records.find(x => x.id === id);
      if (!r) return;

      if (userNameInput) userNameInput.value = r.userName;
      if (dateInput) dateInput.value = r.date;
      if (accessTypeSelect) accessTypeSelect.value = r.accessType;
      if (commentsText) commentsText.value = r.comments;
      if (statusSelect) statusSelect.value = r.status;

      state.editingId = id;
    }
  });
}

// =======================
// INIT
// =======================

if (dateInput) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.max = today;
}

loadFromLocalStorage();
repairIds(); // ← ОЦЕ ДОДАЙ
render();
