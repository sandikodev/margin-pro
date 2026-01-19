# 🧠 Deep Dive: Mental Model Arsitektur Margin Pro

Dokumen ini menjelaskan "filosofi di balik kode" dalam project Margin Pro. Tujuannya adalah memberikan pemahaman mendalam bagi pengembang tentang **mengapa** kita memilih teknologi tertentu dan **bagaimana** semuanya bekerja bersama secara harmonis.

---

## 1. Filosofi Inti: "The Unified Speed"

Project ini dibangun di atas tiga pilar utama:
1.  **Velocity (Kecepatan)**: Bukan hanya aplikasi yang cepat bagi user, tapi juga workflow yang instan bagi developer.
2.  **Type-Safety (Keamanan Tipe)**: Mengeliminasi bug "undefined" di masa depan dengan sinkronisasi tipe otomatis dari DB ke UI.
3.  **Modern Web Standards**: Mengutamakan standar web asli (Request/Response) daripada abstraksi berat.

---

## 2. Jantung Server: Bun & Hono

### Mengapa Bun?
Bun bukan sekadar runtime, dia adalah paket lengkap:
-   **Native Engine**: Bun ditulis dalam Zig, membuatnya sangat cepat dalam memproses file JS/TS.
-   **Bundler & Test Runner**: Kita menggunakan Bun sebagai mesin penggerak utama karena kinerjanya yang jauh melampaui Node.js tradisional dalam hal *cold start*.

### Mengapa Hono?
Hono dipilih sebagai web server karena bersifat **"Agnostik"**.
-   **Cloud Native**: Hono bisa berjalan di Vercel, Cloudflare, AWS, atau bahkan di HP Anda.
-   **RPC (Remote Procedure Call)**: Inilah kunci kenyamanan kita. Frontend tidak pernah memanggil `fetch('/api/data')`. Dia memanggil `api.data.$get()`. Jika backend berubah, frontend langsung merah (error), mencegah bug saat runtime.

---

## 3. Strategi Bundling: Unifikasi Hono-Vite

Ini adalah bagian paling canggih dalam project ini. Kita memecah tradisi "dua server terpisah" menjadi satu ekosistem tunggal:

### Peran Vite (The Frontend Orchestrator)
Vite menangani aset visual (React, Tailwind, Gambar). Dalam mode development, Vite juga bertindak sebagai **proxy cerdas** yang memuat instance Hono kita, sehingga keduanya berjalan di satu port yang sama.

### Peran tsdown (The Backend Specialist - Rust Inside)
Kita beralih ke `tsdown` untuk bundling server karena:
-   **Rust Speed**: Ditenagai oleh **Rolldown** dan **Oxc** (keduanya ditulis dalam Rust). Kecepatan build-nya hanya puluhan milidetik.
-   **Isolasi Bersih**: Dia mem-bundle logika backend kita menjadi satu file `.mjs` yang ringan, membuang kode yang tidak terpakai (tree-shaking), sehingga Vercel Serverless Function Anda menjadi sangat kecil dan responsif.

---

## 4. Mental Model Aliran Data (Data Flow)

Bayangkan sebuah jembatan yang tidak pernah putus:

1.  **Database (Turso/SQLite)**: Kita mendefinisikan tabel di `schema.ts` menggunakan Drizzle.
2.  **Backend (Hono)**: Menggunakan tabel tersebut untuk mengekspos API. Karena kita menggunakan **Drizzle Zod**, validasi data di server dan client menggunakan satu logika yang sama.
3.  **Communication (Hono RPC)**: Tipe data dari server "dibocorkan" secara aman ke frontend.
4.  **Frontend (React Query)**: Mengambil data via RPC. Kita menggunakan React Query karena dia pintar menangani *caching* dan *loading state* secara otomatis.

---

## 5. Mengapa Vercel?

Vercel dipilih karena model **Serverless**-nya:
-   Aplikasi Anda hanya "hidup" saat ada request, menghemat biaya.
-   Dengan optimasi `tsdown` kita, efek samping negatif serverless (Cold Start) hampir tidak terasa karena ukuran paket yang sangat kecil.

---

## 6. Ringkasan Peran Package Utama

| Package | Peran dalam Mental Model |
| :--- | :--- |
| **`drizzle-orm`** | Penjaga gerbang database. Mengatur agar SQL terasa seperti TypeScript. |
| **`zod`** | Polisi data. Memastikan tidak ada data sampah yang masuk ke server atau UI. |
| **`framer-motion`** | Memberikan nyawa (animasi) pada UI agar terasa premium. |
| **`lucide-react`** | Bahasa visual (ikon) yang konsisten. |
| **`tanstack-query`** | Manajer memori data. Mengatur kapan data harus di-refresh. |

---

## Pesan untuk Pengembang
Project ini didesain bukan untuk menjadi yang paling kompleks, tapi yang paling **efisien**. Setiap tambahan paket harus melalui pertanyaan: *"Apakah ini membuat aplikasi lebih cepat atau developer lebih produktif?"*

Jika jawabannya tidak, kita tidak menggunakannya. Inilah rahasia di balik **Margin Pro**.
