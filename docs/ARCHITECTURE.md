# 📘 Margins Pro Architecture v2.0 (2026 Edition)

Dokumen ini adalah "Single Source of Truth" untuk standar teknis, pola desain, dan aturan pengembangan dalam project Margins Pro. Tujuannya adalah memastikan konsistensi, performa, dan kemudahan pemeliharaan jangka panjang.

---

## 1. Filosofi & Prinsip Utama

**Margins Pro** adalah SaaS *Pricing Intelligence* untuk UMKM Kuliner. User kita adalah pemilik bisnis yang butuh kecepatan dan akurasi.

### Prinsip Utama (The Core Principles)
1.  **Unified Speed**: Development harus secepat kilat. Kita menggunakan struktur **Monorepo-ish** dimana Backend (Hono) dan Frontend (Vite) berjalan dalam satu port yang sama saat dev, dan dibundle menjadi satu unit efisien saat production.
2.  **Performance First**: Aplikasi harus load < 1 detik. Backend dibundle menggunakan `tsdown` (Rust) untuk startup time hampir nol ("Cold start" < 50ms).
3.  **Offline-Capable (Hybrid Strategy)**: User harus bisa melihat data proyek tanpa internet. Sinkronisasi terjadi di background saat koneksi kembali.
4.  **End-to-End Type Safety**: Backend dan Frontend berbagi tipe data secara otomatis via **Hono RPC**. Jika merah di VS Code, jangan di-commit.
5.  **User-Centric Design**: Aplikasi bukan hanya alat hitung, tapi "partner" yang menyenangkan. UI harus **Playful**, **Intuitif**, dan **Premium**.

---

## 2. Tech Stack Standard (Evolusi 2.0)

| Layer | Technology | Decision Rationale |
| :--- | :--- | :--- |
| **Runtime** | **Bun** | Ultra-fast startup, compatible dengan Node.js, built-in TypeScript support. |
| **Backend** | **Hono** | Framework standar web modern. Ringan, support Edge, dan memiliki RPC bawaan. |
| **Frontend** | **React 19 + Vite** | Standar industri dengan performa build tercepat. |
| **Bundler** | **tsdown** | Bundler berbasis Rust (swc) untuk backend. Menghasilkan satu file `dist/server` yang super ringan. |
| **Database** | **Turso (LibSQL)** | Edge-ready SQLite. Murah, cepat, dan bisa di-replicate ke lokasi user. |
| **ORM** | **Drizzle ORM** | SQL-like syntax, zero-runtime overhead, excellent type inference. |
| **AI Engine** | **Pinecone + Ollama** | (Soon) Vector database untuk pencarian semantik dan LLM lokal/cloud untuk analisis. |
| **Design** | **CSS Variables + Motion** | Custom Design System dengan Glassmorphism dan Framer Motion (tanpa Tailwind bloat berlebih). |

---

## 3. Struktur Direktori (Modular)

Kita menggunakan struktur "Hybrid Feature-based" yang memisahkan Client dan Server dengan tegas namun tetap satu repo.

```bash
/
├── api/                  # Vercel Serverless Entry Point
├── dist/                 # Hasil Build Produksi (Created by CI/CD)
│   ├── client/           # Static Assets
│   └── server/           # Backend Bundle (index.js)
├── docs/                 # 📘 Dokumentasi & Mental Model
├── src/
│   ├── client/           # 🎨 Frontend Source
│   │   ├── components/   # Atomic & Widget Components (BentoCard, HeroWidget)
│   │   ├── hooks/        # Business Logic (useProjects, useAuth)
│   │   ├── routes/       # Pages (File-based routing manual)
│   │   └── index.css     # Global Design Tokens
│   ├── server/           # ⚙️ Backend Source
│   │   ├── db/           # Database Schema & Connection
│   │   ├── routes/       # API Routes (Modular per feature)
│   │   └── index.ts      # Main Server Entry Point
│   └── shared/           # Types shared between Client & Server
└── vercel.json           # Deployment Configuration
```

---

## 4. Arsitektur Visual (Design System)

Margins Pro tidak menggunakan template standar. Kita membangun identitas visual sendiri yang disebut **"Playful Premium"**.

### Komponen Inti
1.  **Bento Grid**: Layout utama dashboard. Menggunakan grid responsif yang menyusun "kartu" informasi (Widget) secara adaptif.
2.  **Glassmorphism**: Penggunaan efek `backdrop-filter: blur()` pada kartu dan navigasi untuk memberikan kesan kedalaman (depth) dan modernitas.
3.  **Micro-Interactions**: Tombol, kartu, dan list memiliki animasi halus (framer-motion) saat di-hover atau diklik untuk memberikan feedback positif ("Juicy Interface").
4.  **Responsive**: Strategi *Mobile First*. Semua layout dirancang agar nyaman di jempol (HP) sebelum diperlebar ke mouse (Desktop).

---

## 5. Arsitektur Data & AI (The Brain)

### Standard Data Flow (RPC)
1.  **Client**: `useQuery` memanggil `client.api.resource.$get()`.
2.  **RPC Layer**: Hono RPC meneruskan request, menjamin tipe data aman.
3.  **Server**: Handler memvalidasi input dengan **Zod**.
4.  **Database**: Drizzle ORM mengeksekusi query SQL yang efisien.
5.  **Response**: Data dikembalikan ke UI untuk dirender.

### Intelligence Layer (Planned)
Untuk fitur "Cerdas", kita menggunakan pola **RAG (Retrieval-Augmented Generation)**:
1.  **Ingestion**: Data produk/transaksi user diubah menjadi vector (angka) dan disimpan di **Pinecone**.
2.  **Query**: Saat user bertanya "Berapa margin ideal rendang?", sistem mencari konteks serupa di Pinecone.
3.  **Synthesis**: Konteks + Pertanyaan dikirim ke LLM (Ollama/OpenAI) untuk dijawab dengan bahasa manusia.

---

## 6. Deployment Pipeline (Vercel + tsdown)

Strategi deployment kita unik karena menggabungkan kecepatan statis dengan kecerdasan dinamis.

### Build Process
1.  **Build Client**: `vite build` mengkompilasi React menjadi HTML/CSS/JS statis di `dist/client`.
2.  **Build Server**: `tsdown` mem-bundle seluruh kode backend Hono menjadi **satu file** executable di `dist/server/index.js`.
3.  **Deployment**: Vercel menjalankan file server tunggal ini. Server ini pintar:
    *   Jika request API -> Proses logika.
    *   Jika request Halaman -> Sajikan file statis dari `dist/client`.

### Keuntungan
*   **Zero Config**: Tidak perlu setup ribet Nginx/Apache.
*   **Cold Start Cepat**: Bundle backend sangat kecil (<1MB) karena tree-shaking agresif.

---

## 7. Keamanan & Kontribusi

### Security Rules
1.  **Zero Trust**: Jangan percaya input user. Selalu validasi dengan Zod.
2.  **Secrets Management**: API Key (Midtrans, Pinecone) **HARAM** masuk ke Git. Gunakan `.env` lokal dan Environment Variables di Vercel.
3.  **Payment Webhooks**: Selalu verifikasi signature dari Midtrans untuk mencegah request palsu.

### Git Workflow
1.  **Branching**: `main` adalah production. Fitur dikerjakan di branch terpisah.
2.  **Commit Message**: Gunakan Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`).
3.  **Documentation**: Setiap fitur baru wajib disertai update di `docs/DEEP_DIVE_MENTAL_MODEL.md` jika memperkenalkan istilah baru.

---
*Dokumen ini diperbarui terakhir pada: 19 Jan 2026*
