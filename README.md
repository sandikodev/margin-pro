# 🚀 Margins Pro
### Intelligence Pricing System untuk UMKM Kuliner

<div align="center">
  <img src="https://placehold.co/1200x400/4f46e5/white?text=MARGINS+PRO+Codebase" alt="Margins Pro Banner" width="100%" />
</div>

<br/>

**Margins Pro** adalah platform open-source yang membantu pengusaha kuliner (UMKM) menghitung HPP (Harga Pokok Penjualan), mensimulasikan profit margin di aplikasi pesan antar (GoFood, GrabFood, ShopeeFood), dan mencegah kerugian ("boncos") akibat salah penetapan harga.

Built with performance and developer experience in mind.

---

## 🛠️ Tech Stack Modern

Project ini dibangun ulang dari *Single Page Application* menjadi **Fullstack Application** dengan teknologi bleeding-edge untuk kecepatan dan efisiensi biaya (Serverless-ready).

- **Runtime**: [Bun](https://bun.sh) (Ultra-fast JavaScript Runtime) v1.x
- **Frontend**: [React 19](https://react.dev) + [Vite](https://vitejs.dev)
- **Backend**: [Hono](https://hono.dev) (Standard Web Framework)
- **Database**: [Turso](https://turso.tech) (LibSQL - Edge SQLite)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Styling**: TailwindCSS + Lucide Icons (Premium Design System)
- **Bundler**: [tsdown](https://github.com/honojs/tsdown) (Rust-powered Backend Bundler)
- **AI**: Google Gemini Flash 2.0 (via Vercel AI SDK compatible logic)

## ✨ Fitur Unggulan Codebase

1.  **Hybrid Architecture**: Aplikasi berjalan sebagai SPA super-cepat, namun memiliki backend Hono yang menangani SEO Injection (SSR-lite) dan API logic.
2.  **Type-Safe RPC**: Frontend memanggil backend **tanpa fetch manual**. Kita menggunakan `Hono RPC` sehingga tipe data antara Client dan Server terhubung otomatis (Intellisense di VS Code jalan 100%).
3.  **Local & Cloud Sync**: Data disimpan di `LocalStorage` untuk pengalaman instant (Optimistic UI) dan disinkronkan ke Database Turso di background.
4.  **Server-Side SEO**: Meta tags di-inject di sisi server sebelum dikirim ke browser, memastikan link preview muncul di WhatsApp/Twitter.

---

## 🚀 Cara Menjalankan (Local Development)

### 1. Prerequisites
Pastikan Anda sudah menginstall **Bun**. Jika belum:
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Clone & Install
```bash
git clone https://github.com/username/margins-pro.git
cd margins-pro
bun install
```

### 3. Setup Environment Variables
Copy file `.env.example` menjadi `.env` dan isi kredensial yang dibutuhkan.
```bash
cp .env.example .env
```
Isi kredensial:
- `TURSO_DATABASE_URL` & `TURSO_AUTH_TOKEN`: Buat database baru di [Turso.tech](https://turso.tech).
- `GEMINI_API_KEY`: Dapatkan dari Google AI Studio.

### 4. Setup Database
Push schema Drizzle ke Turso DB Anda.
```bash
bun drizzle-kit push
```

### 5. Jalankan Server
Perintah ini akan menjalankan **Vite** (Frontend port 5173) dan **Hono** (Backend port 8000) secara bersamaan.
```bash
bun run dev
```
Buka browser di `http://localhost:5173`.

### 6. Verifikasi & Testing
Sebelum melakukan commit, pastikan kode aman dari error:
```bash
# Validasi Code Style (Lint), Type Check, dan Build Test
bun run validate

# Jalankan End-to-End Testing (Playwright)
bun run test
```

---

## 📂 Struktur Project
```
margins-pro/
├── api/                # Vercel Serverless Entry point
├── dist/               # Production Build Artifacts (Client & Server)
├── docs/               # 📘 Documentation (Mental Model, Architecture)
├── drizzle/            # Drizzle Migration Files
├── src/
│   ├── client/         # 🎨 Frontend Source
│   │   ├── components/ # UI Components
│   │   ├── hooks/      # Business Logic (useProjects)
│   │   └── routes/     # App Pages
│   ├── server/         # ⚙️ Backend Source
│   │   ├── db/         # Schema & Logic
│   │   └── routes/     # API Endpoints
│   └── shared/         # Shared Types
├── tests/              # End-to-End Tests & Reports
├── App.tsx             # Main Frontend Entry
├── index.html          # Entry HTML
└── vercel.json         # Deployment Config
```

## 🤝 Kontribusi

Kami mengundang developer Indonesia dan komunitas open-source untuk berkontribusi!

- **[Architecture Guide](docs/ARCHITECTURE.md)**: Blueprint teknis dan struktur folder.
- **[Mental Model & Glossary](docs/DEEP_DIVE_MENTAL_MODEL.md)**: Kamus istilah dan konsep fundamental.

---

## 📄 Lisensi

MIT License - Bebas digunakan dan dimodifikasi untuk memajukan UMKM Indonesia.
