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

---

## 7. Evolusi RPC: Dari gRPC ke Hono RPC

Mungkin Anda pernah mendengar **gRPC** (milik Google). Secara esensial, terminologinya sama: **Remote Procedure Call**. Artinya: "Saya memanggil fungsi di tempat jauh (server), tapi rasanya seperti memanggil fungsi lokal di komputer saya."

### Apa Perbedaannya?
-   **gRPC**: Menggunakan protokol biner (Protobuf) dan biasanya digunakan untuk komunikasi antar bahasa yang berbeda (misal: Golang ke C++). Ia sangat cepat tapi cukup "berat" untuk dipasang di browser secara langsung.
-   **Hono RPC / tRPC**: Dirancang khusus untuk ekosistem TypeScript (End-to-End Type Safety). Ia menggunakan JSON standar tapi "membocorkan" tipe datanya ke frontend.

### Mengapa Dunia JS/TS Sangat "Perfeksionis"?
Anda mungkin bertanya: *"Kenapa di JS/TS kita seolah-olah gila akan tipe data, sedangkan di PHP kita lebih santai?"*

1.  **Shift Left Errors**: Di PHP (terutama gaya lama), kesalahan seringkali baru terlihat saat aplikasi dijalankan (Runtime). Anda tahu ada error setelah user melihat halaman putih atau error log. Di TS, kita ingin kesalahan itu terlihat **saat Anda mengetik** (Compile-time).
2.  **Kontrak Otomatis**: PHP seringkali bersifat monolitik (Server dan UI di satu tempat). Di aplikasi SaaS modern, Frontend dan Backend seringkali terpisah. **RPC adalah "Kontrak Otomatis"** yang menjamin bahwa jika Backend mengubah satu baris kode, Frontend akan langsung tahu tanpa perlu cek manual atau plugin IDE tambahan.
3.  **Skalabilitas Mental**: Dengan tipe data yang ketat, otak kita tidak perlu mengingat ribuan struktur data. Biarkan **IDE dan Compiler** yang melakukan tugas administratif itu, sehingga kita (manusia) bisa fokus pada logika bisnis.

---

## 8. Glosarium Istilah Teknis

Untuk membantu pengembang yang baru memulai, berikut adalah penjelasan sederhana untuk istilah-istilah "keren" yang kita gunakan:

| Istilah | Penjelasan Sederhana |
| :--- | :--- |
| **End-to-End (E2E)** | Sistem yang terhubung dari ujung (Database/Backend) sampai ke ujung lainnya (Browser/User) secara utuh tanpa terputus. |
| **Type Safety** | Jaminan bahwa data yang mengalir dalam aplikasi selalu sesuai dengan tipe yang ditentukan, mencegah error "data tidak dikenal" saat aplikasi jalan. |
| **DX (Developer Experience)** | Seberapa nyaman dan cepat seorang pengembang saat bekerja dengan sebuah codebase (seperti UX tapi untuk programmer). |
| **Compiling** | Proses mengubah kode dari bahasa yang dipahami manusia ke bahasa yang dipahami mesin (biasanya biner atau bahasa yang lebih rendah). |
| **Transpiling** | Mirip kompilasi, tapi mengubah satu bahasa pemrograman ke bahasa lain yang levelnya setara (misal: TypeScript ke JavaScript). |
| **Linting** | Proses pengecekan kode secara otomatis untuk mencari potensi kesalahan penulisan atau gaya bahasa yang buruk (seperti asisten editor buku). |
| **Formatting** | Proses merapikan susunan teks kode (spasi, baris baru, tanda kurung) agar enak dibaca manusia tanpa mengubah fungsi kodenya. |
| **Type Checking** | Proses memvalidasi apakah "tipe" data yang digunakan sudah benar (misal: memastikan kita tidak mencoba menjumlahkan Nama dengan Angka). |
| **CI/CD** | Sistem otomatis yang melakukan tes, build, dan deployment setiap kali pengembang menyimpan kode baru. |
| **Runtime** | Lingkungan tempat kode dijalankan (seperti sistem operasi mini khusus untuk JavaScript). |
| **Bundler** | Alat yang mengumpulkan ratusan file kode Anda menjadi satu atau beberapa file kecil yang siap dikirim ke user. |
| **Tree-shaking** | Proses otomatis membuang kode yang tidak pernah dipanggil/dipakai (seperti menggoyangkan pohon untuk menjatuhkan daun kering). |
| **Dead Code** | Bagian kode yang ada di project tapi tidak pernah dipanggil atau dijalankan (hanya menambah beban). |
| **Cold Start** | Waktu yang dibutuhkan server "tidur" (serverless) untuk bangun dan merespons saat ada tamu (user) berkunjung. |
| **Monorepo** | Strategi menyimpan kode backend dan frontend dalam satu folder besar agar mudah dikelola bersama. |
| **ESM (ES Modules)** | Standar modern cara file JavaScript saling berbagi kode menggunakan `import` dan `export`. |
| **HMR** | Fitur yang membuat layar browser Anda update secara instan saat Anda mengubah kode, tanpa perlu refresh manual. |
| **Agnostik** | Sifat aplikasi yang tidak "pilih-pilih" tempat tinggal; bisa jalan di server mana pun tanpa banyak ubahan. |
| **RPC** | Cara frontend memanggil fungsi di backend seolah-olah fungsi itu ada di komputernya sendiri (sangat aman dan cepat). |
| **Hydration** | Proses "menghidupkan" HTML mati dari server menjadi aplikasi React yang interaktif di browser. |
| **Idempotent** | Operasi yang jika dilakukan satu kali atau berkali-kali memberikan hasil yang tetap sama (misal: tombol save yang tidak membuat data ganda). |
| **Yak Shaving** | Aktivitas teknis kecil yang tampaknya tidak relevan tapi harus dilakukan sebelum Anda bisa menyelesaikan tugas utama yang sebenarnya. |
| **Bikeshedding** | Kecenderungan tim untuk menghabiskan terlalu banyak waktu mendiskusikan hal-hal sepele (seperti warna tombol) daripada arsitektur yang berat. |
| **Over-engineering** | Membuat solusi yang terlalu rumit untuk masalah yang sebenarnya sangat sederhana. |
| **Syntactic Sugar** | Fitur bahasa pemrograman yang dibuat agar kode lebih mudah/indah ditulis manusia, padahal fungsinya tetap sama saja. |
| **Race Condition** | Bug yang terjadi ketika hasil akhir tergantung pada urutan atau waktu eksekusi yang tidak terduga dari dua proses yang berjalan bersamaan. |
| **Side Effect** | Ketika sebuah fungsi mengubah sesuatu di luar dirinya (seperti mengubah database atau variabel global) selain hanya mengembalikan data. |
| **Deterministic** | Sifat sistem yang jika diberi input yang sama, pasti akan selalu menghasilkan output yang sama persis tanpa kejutan. |
| **Single Source of Truth** | Prinsip di mana sebuah data hanya disimpan di satu tempat, sehingga semua orang merujuk ke data yang pasti valid dan tidak ada duplikasi. |

---
*Dokumen ini diperbarui terakhir pada: 19 Jan 2026*
