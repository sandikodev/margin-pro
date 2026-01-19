# Laporan Perbandingan Build: Bun vs. tsdown

Laporan ini membandingkan dua teknologi bundler modern yang digunakan dalam project Margin Pro untuk menangani sisi server (backend).

## Statistik Hasil Uji Coba

| Metrik | Bun Build (`target: node`) | tsdown (+ Rolldown/Oxc) |
| :--- | :--- | :--- |
| **Waktu Build** | ~27ms | ~29ms |
| **Ukuran Output** | 1.38 MB (Self-contained) | 45.39 KB (Externalized) |
| **Modul Terproses** | 336 Modul | Fokus pada Entry Point |
| **Engine** | Zig (Bun Integrated) | Rust (Rolldown + Oxc) |

## Analisis Perbedaan Utama

### 1. Filosofi Bundling
- **Bun Build**: Secara default mencoba membungkus (bundle) *semua* dependency ke dalam satu file besar (`index.js`). Ini bagus untuk portabilitas (satu file bisa langsung jalan), tapi ukurannya menjadi sangat besar karena menyertakan seluruh isi `node_modules`.
- **tsdown**: Mengikuti filosofi "Library/Server Bundling" yang lebih modern. Ia hanya mem-bundle logika aplikasi Anda dan membiarkan dependency besar (seperti `hono`, `drizzle`, dll) tetap berada di `node_modules`. Hasilnya, file `.mjs` sangat kecil dan bersih.

### 2. Teknologi Mesin (Engine)
- **Bun**: Menggunakan Zig. Sangat cepat karena terintegrasi langsung dengan runtime Bun.
- **tsdown**: Menggunakan **Rolldown** (Rollup versi Rust) dan **Oxc** (parser tercepat saat ini). Presisinya dalam menangani *tree-shaking* dan standar ESM (ECMAScript Modules) saat ini dianggap lebih "matang" untuk workflow profesional.

### 3. Kompatibilitas Deployment (Vercel)
- **tsdown** lebih unggul untuk Vercel karena menghasilkan output ESM murni yang ringan. Vercel akan menangani sisa dependency melalui `package.json`, sehingga proses "Cold Start" Serverless Function menjadi jauh lebih cepat karena server tidak perlu membaca file JS sebesar 1.3MB setiap kali dijalankan.

### 4. Integrasi Ecosystem
- **tsdown** dirancang untuk kompatibel dengan plugin-plugin Rollup dan Vite. Karena project kita sudah menggunakan Vite untuk frontend, menggunakan tool berbasis Rolldown (tsdown) untuk backend memberikan konsistensi arsitektur yang lebih baik.

## Kesimpulan
Keputusan menggunakan **tsdown** adalah langkah yang tepat karena:
1. Memberikan kecepatan build yang setara dengan Bun (~20-30ms).
2. Menghasilkan output yang jauh lebih efisien untuk arsitektur Serverless (Vercel).
3. Memberikan kontrol yang lebih baik terhadap standar modul (ESM).
