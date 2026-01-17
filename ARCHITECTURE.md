# 📘 Margins Pro Architecture & Contribution Guide

Dokumen ini adalah "Single Source of Truth" untuk standar teknis, pola desain, dan aturan pengembangan dalam project Margins Pro. Tujuannya adalah memastikan konsistensi, performa, dan kemudahan pemeliharaan jangka panjang.

---

## 1. Konteks Bisnis & Prinsip Utama

**Margins Pro** adalah SaaS *Pricing Intelligence* untuk UMKM Kuliner. User kita adalah pemilik bisnis yang mungkin mengakses aplikasi dari dapur yang sibuk, menggunakan HP dengan koneksi internet yang tidak stabil.

### Prinsip Utama (The Core Principles)
1.  **Performance First**: Aplikasi harus load < 1 detik. "Cold start" server harus minimal.
2.  **Offline-Capable (Hybrid Strategy)**: User harus bisa melihat/edit data proyek tanpa internet. Sinkronisasi terjadi di background.
    -   **Sync Strategy**: The `useProjects` hook abstracts this complexity. The UI components don't know if data comes from LocalStorage or API; they just consume the `projects` array.
3.  **End-to-End Type Safety**: Kita tidak menebak tipe data. Backend dan Frontend berbagi tipe secara otomatis (Hono RPC). Jika merah di VS Code, jangan di-commit.
4.  **Simple yet Scalable**: Hindari over-engineering. Gunakan solusi sederhana (e.g., LocalStorage, SQLite) sampai terbukti butuh yang lebih kompleks.

---

## 2. Tech Stack Standard

| Layer | Technology | Decision Rationale |
| :--- | :--- | :--- |
| **Runtime** | **Bun** | Ultra-fast startup, compatible dengan Node.js, built-in TypeScript support. |
| **Backend** | **Hono** | Lightweight, Web Standards based, Hono RPC untuk type-safety tanpa code generation. |
| **Frontend** | **React 19 + Vite** | Standard industri, ekosistem luas. |
| **Database** | **Turso (LibSQL)** | Edge-ready SQLite. Murah, cepat, dan bisa di-replicate ke lokasi user. |
| **ORM** | **Drizzle ORM** | SQL-like syntax, zero-runtime overhead, excellent type inference. |
| **Validation** | **Zod** | Single source of validation logic untuk Client & Server. |
| **State** | **TanStack Query** | Manajemen server-state, caching, dan deduplikasi request. |

---

## 3. Struktur Direktori (Convention)

Kita menggunakan struktur "Hybrid Feature-based":

```bash
/
├── api/                  # Vercel Serverless Entry Point
├── components/           # Reusable UI Components
│   ├── ui/               # Atomic Design (Button, Input, Card) - Generic
│   ├── layout/           # Structure (Sidebar, Header)
│   ├── modals/           # Complex interactions
│   └── business/         # Domain-specific components (e.g., ProfitChart)
├── db/                   # Database Layer
│   ├── schema.ts         # Drizzle Schema (Single source of DB truth)
│   └── index.ts          # Connection logic
├── hooks/                # Business Logic Isolation
│   ├── useProjects.ts    # 🔥 Complex logic goes here, NOT in components
│   └── useCurrency.ts    # Shared global logic
├── lib/                  # Utilities & Configurations
│   ├── client.ts         # Hono RPC Client Configuration
│   └── utils.ts          # Helper functions logic
├── routes/               # Page Components (Views)
├── server/               # Hono Backend Source
│   └── index.ts          # API Routes & Middleware
└── types/                # Shared TypeScript Interfaces
```

### Aturan Direktori:
*   **Logic di Hooks**: Jangan tulis logic bisnis berat di dalam Component `.tsx`. Pindahkan ke custom hooks di `hooks/`. Component hanya untuk render UI.
*   **Schema Database**: Semua definisi tabel wajib ada di `db/schema.ts`. Jangan buat tabel manual via SQL command.

---

## 4. Standar Coding (Best Practices)

### A. Backend (Hono)
1.  **Wajib Pakai RPC**: Jangan buat endpoint REST manual `/projects` jika bisa diakses via RPC client.
2.  **Validasi Zod**: Setiap input dari user (Body, Query, Params) **WAJIB** divalidasi dengan `zValidator`.
    ```typescript
    // ✅ GOOD
    .post('/', zValidator('json', z.object({ name: z.string() })), ...)
    
    // ❌ BAD
    .post('/', (c) => { const body = c.req.json(); ... })
    ```
3.  **Error Handling**: Gunakan `c.json({ error: "message" }, status)`. Jangan biarkan server crash.

### B. Frontend (React)
1.  **TanStack Query**: Gunakan `useQuery` untuk fetch data. Jangan pakai `useEffect` + `fetch` manual untuk data server.
2.  **Optimistic UI**: Untuk aksi user (Create, Update, Delete), update UI **sebelum** server merespons agar terasa instant.
3.  **Tailwind Classes**: Gunakan utility classes. Jika terlalu panjang, ekstrak menjadi komponen kecil, bukan menggunakan `@apply`.

### C. Database (Drizzle)
1.  **Migration**: Setelah ubah `schema.ts`, jalankan `bun drizzle-kit push` (atau gunakan migration file untuk prod).
2.  **Text vs Varchar**: Di SQLite/Turso, prefer `text`.

---

## 5. Pola Data Flow (Data Architecture)

### Read Flow (Menampilkan Data)
1.  **Client**: `useQuery` memanggil `client.api.resource.$get()`.
2.  **RPC**: Hono RPC meneruskan request ke Server Handler yang sesuai.
3.  **Server**: Handler query ke DB pakai Drizzle: `db.select()...`.
4.  **Response**: Data dikembalikan. RPC menjamin tipe data response cocok dengan ekspektasi Client.

### Write Flow (Mengubah Data)
1.  **Client**: User klik tombol -> `useMutation` dipanggil.
2.  **Optimistic Update**: `queryClient.setQueryData` dijalankan untuk update UI instant (Data di LocalStorage/Cache diupdate).
3.  **RPC Call**: Request dikirim ke server.
4.  **Server**: `zValidator` memvalidasi input. Jika OK, tulis ke DB.
5.  **Revalidation**: Server response OK. React Query memvalidasi ulang data (opsional) atau membiarkan data optimistik jika sukses.

---

## 6. Deployment & Environment

*   **Platform**: Vercel.
*   **Adapter**: `@hono/vercel` adapter.
*   **Config**: `vercel.json` mengatur rewrite semua traffic ke Hono function.
*   **Environment Variables**:
    *   Development: `.env` (Tidak dicommit).
    *   Production: Set di Vercel Dashboard.

---

## 7. Git Workflow

1.  **Branching**: Gunakan `git flow` sederhana. Main branch adalah production-ready. Fitur baru di branch terpisah.
2.  **Commit Message**: Gunakan Conventional Commits.
    *   `feat: ...` untuk fitur baru.
    *   `fix: ...` untuk perbaikan bug.
    *   `chore: ...` untuk maintenance (config, readme).
    *   `refactor: ...` untuk perbaikan kode tanpa ubah fitur.

---
*Dokumen ini diperbarui terakhir pada: 18 Jan 2026*
