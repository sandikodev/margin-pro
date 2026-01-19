# Strategi Scaling & Multiple Entry Points: Margin Pro

Dokumen ini berfungsi sebagai panduan masa depan mengenai kapan dan bagaimana project Margin Pro harus beralih ke arsitektur dengan **Multiple Entry Points** untuk menjaga performa dan skalabilitas.

## Apa itu Multiple Entry Points?

Dalam arsitektur saat ini, kita memiliki satu entry point utama (`src/server/index.ts`) yang menangani segalanya (API, routing, dan static serving). Seiring berkembangnya bisnis, beban kerja ini perlu dipisah agar tidak saling membebani.

## Skenario & Kebutuhan Optimasi

Berikut adalah kondisi yang mengharuskan project ini diekspansi menjadi beberapa entry point:

### 1. Background Workers (Pemrosesan Berat)
**Kapan dibutuhkan:**
- Ketika project mulai menangani ekspor data PDF/Excel ribuan baris.
- Ketika ada integrasi AI yang memakan waktu lama (lebih dari 10 detik).
- Pengiriman email blast atau notifikasi ke banyak merchant secara massal.

**Solusi:**
Membuat entry point baru `src/worker/index.ts` yang khusus menangani antrian (Queue) menggunakan Redis/BullMQ. Dengan begini, server utama tetap responsif sementara Worker bekerja di latar belakang.

### 2. Cron Jobs (Tugas Terjadwal)
**Kapan dibutuhkan:**
- Kalkulasi profit bulanan otomatis untuk semua merchant.
- Sinkronisasi harga bahan baku dari marketplace setiap jam 12 malam.
- Pembersihan (cleanup) log transaksi lama secara rutin.

**Solusi:**
Membuat entry point `src/cron/index.ts` yang dijalankan oleh sistem operasi atau platform cloud (seperti Vercel Cron) untuk eksekusi perintah spesifik tanpa mengganggu traffic user.

### 3. Edge vs Node Runtime (Micro-Optimization)
**Kapan dibutuhkan:**
- Perlu otentikasi super cepat di seluruh dunia (Edge Runtime).
- Butuh library Node.js berat yang tidak didukung Edge (misal: PDF generator).

**Solusi:**
Memisahkan bagian otentikasi ke `src/edge/auth.ts` dan fungsionalitas berat lainnya ke `src/server/heavy.ts`.

## Implementasi dengan tsdown

Project ini sudah siap untuk transisi tersebut. Jika saatnya tiba, Anda cukup memperbarui file `tsdown.config.ts` (atau argumen CLI) sebagai berikut:

```ts
// Contoh konfigurasi tsdown masa depan
export default {
  entry: {
    server: 'src/server/index.ts',
    worker: 'src/worker/index.ts',
    cron: 'src/cron/index.ts',
  },
  format: 'esm',
  outDir: 'dist',
  clean: true,
  bundle: true,
}
```

## Keuntungan Bagi Margin Pro
1. **Isolasi Kegagalan**: Jika worker PDF mati karena kehabisan RAM, website utama tetap bisa diakses.
2. **Resource Efficiency**: Anda bisa memberikan RAM kecil untuk Server API, tapi memberikan RAM besar khusus untuk Worker AI.
3. **DX (Developer Experience)**: Kode tetap rapi dalam satu repository (Monorepo-lite) namun dideploy secara independen.

---
*Dokumen ini disusun sebagai peta jalan teknis untuk tim Engineering Margin Pro.*
