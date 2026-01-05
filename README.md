# 🚀 Full-Stack TanStack Todo App

A high-performance, **type-safe**, and **server-rendered** (SSR) Todo application. This project serves as a comprehensive demonstration of the **TanStack ecosystem**, featuring advanced patterns like Optimistic UI, URL-synced state, and SSR-compliant theme management.

---

## ✨ Key Features

* **Full-Stack SSR:** Built with **TanStack Start** for lightning-fast initial loads and SEO optimization.
  
* **Type-Safe Routing:** 100% end-to-end type safety using **TanStack Router** for navigation, search parameters, and loaders.

* **Optimistic UI:** Real-time feedback for todo actions (toggle/delete) using **TanStack Query** (React Query) with automatic rollback on server errors.

* **Professional UX Enhancements:**
  
    * **Debounced Search:** URL-synced filtering that prevents unnecessary server requests.
      
    * **Soft Loading Overlays:** Professional backdrop blurs and loading states that prevent layout shifts during transitions.
      
    * **Smart Pagination:** Fully persistent pagination state synced directly to the URL.
      
* **Flicker-Free Theme System:** SSR-friendly Dark/Light mode using **TanStack Store** and a blocking injection script to prevent the "white flash" on load.

---

## 🛠️ Tech Stack

| Category | Technology |

| :--- | :--- |

| **Meta-Framework** | [TanStack Start](https://tanstack.com/start) |

| **Routing** | [TanStack Router](https://tanstack.com/router) |

| **Data Fetching** | [TanStack Query](https://tanstack.com/query) |

| **State Management** | [TanStack Store](https://tanstack.com/store) |

| **Validation** | [Zod](https://zod.dev/) |

| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |

| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
  
* npm package manager
  
* MongoDB Atlas account (or any MongoDB connection string)

### Installation

1.  **Clone the repository:**

```bash
git clone https://github.com/alhiane-pro/tanstack-todo-list-app.git

cd tanstack-todo-list-app
```

2.  **Install dependencies:**

```bash
npm install
```

3. **Environment variables**

Create a .env or .env.local in the project root for local development. Do not commit this file.

```env
# server-only (keep secret)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.ynfrets.mongodb.net/<db-name>=Cluster0
```

4.  **Start the development server:**

```bash
npm run dev
```

---

## 📖 Key Implementation Details

### Type-Safe Search Parameters

The application uses a Zod schema to validate URL search parameters, ensuring that the filter, status, and page number are always valid and type-safe across the app.

### Hydration-Safe Components

To prevent the common "Hydration Mismatch" errors in SSR, this project implements a `isMounted` guard pattern for dynamic UI elements like loading spinners and theme-specific icons.

### Optimized Data Syncing

Instead of fetching data on every keystroke, the search input uses a 500ms debounce cycle that synchronizes local component state with the global TanStack Router state.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project

2. Create your Feature Branch (git checkout -b feature/AmazingFeature)

3. Commit your Changes (git commit -m 'Add some AmazingFeature')

4. Push to the Branch (git push origin feature/AmazingFeature)

5. Open a Pull Request

---

Developed with ❤️ using the TanStack Ecosystem.
