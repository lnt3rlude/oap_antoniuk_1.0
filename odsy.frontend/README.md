# ODSYSODLOUT (oap_antoniuk_1.0)

## About the Project
**oap_antoniuk_1.0** (ODSYSODLOUT) is a modern Single Page Application (SPA) developed as part of a web development learning assignment. 

The main goal of this project is to demonstrate advanced full-stack web development skills, focusing on building a robust asynchronous client-side interface, implementing full CRUD workflows, and handling backend integration seamlessly without page reloads.

### Key Features
* **Full CRUD Integration:** Dynamic data management for Orders, Users, Categories, and Products via a centralized API client.
* **Modern REST API Communication:** Uses `GET` for reading, `POST` for creation, `PATCH` for partial updates, and `DELETE` for removing resources.
* **Advanced Error Handling & Validation:** Built-in resilience against server crashes and validation errors using the *Problem Details* approach (dynamic error blocks instead of native browser alerts).
* **Client-Side Filtering:** Fast, in-memory data filtering and search capabilities to optimize network traffic.
* **Responsive Grid Layout:** A responsive user interface utilizing CSS Grid and modern components, fully adapted for both desktop and mobile viewports (macOS/iOS Safari optimized).

---

## Project Structure

```text
oap_antoniuk_1.0/
├── index.html       # Main application layout and SPA view containers
├── style.css        # Modular application styles and responsive grid layouts
├── main.ts          # Core TypeScript/JavaScript logic, state management, and UI rendering
├── apiClient.ts     # Centralized API service with AbortController timeout configuration
├── .gitignore       # Untracked files configuration (e.g., node_modules, local envs)
└── README.md        # Project documentation