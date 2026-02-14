---
slug: security
title: Standar Keamanan
lastUpdated: 2025-01-18
icon: Server
summary: Arsitektur keamanan, enkripsi, dan protokol kepatuhan kami.
---

# Standar Keamanan & Kepatuhan

Di Margin Pro, keamanan bukan sekadar fitur tambahan, melainkan pondasi dari seluruh arsitektur kami. Kami memahami bahwa data harga dan margin adalah rahasia dagang paling vital bagi bisnis Anda.

## 1. Arsitektur Infrastruktur
Platform kami di-hosting di infrastruktur cloud kelas dunia dengan standar keamanan Tier-4:
- **Cloud Provider:** Google Cloud Platform (GCP) region Singapura (asia-southeast2) untuk latensi rendah dan kepatuhan kedaulatan data regional.
- **Isolasi Logika:** Kami menggunakan arsitektur *multi-tenant* dengan *Row-Level Security* (RLS) di tingkat database, memastikan data satu penyewa tidak pernah bisa bocor ke penyewa lain.
- **DDoS Protection:** Dilindungi oleh Cloudflare Enterprise layer untuk mitigasi serangan Distributed Denial of Service.

## 2. Enkripsi Data
Kami menerapkan pendekatan *Defense in Depth*:
- **Encryption in Transit:** Semua komunikasi antara browser Anda dan server kami dienkripsi menggunakan TLS 1.3 dengan algoritma pertukaran kunci yang kuat. Kami mendapat nilai "A+" pada pengujian SSL Labs.
- **Encryption at Rest:** Database disimpan di disk yang terenkripsi (AES-256). Kunci enkripsi dikelola menggunakan Key Management Service (KMS) yang dirotasi secara berkala.
- **Application Level Encryption:** Token autentikasi dan API Key sensitif dienkripsi ulang di level aplikasi sebelum masuk ke database.

## 3. Kontrol Akses & Autentikasi
- **Zero Trust Network:** Akses SSH/Database ke server produksi tidak diperbolehkan dari jaringan publik. Engineer kami hanya dapat mengakses melalui VPN terenkripsi dengan autentikasi perangkat keras (Hardware Key).
- **Password Safety:** Kami tidak pernah menyimpan password dalam teks biasa. Kami menggunakan *Argon2id*, algoritma hashing pemenang kompetisi password cracking modern yang tahan terhadap serangan GPU/ASIC.
- **2-Factor Authentication (2FA):** Mendukung TOTP (Google Authenticator) untuk lapisan keamanan tambahan bagi pengguna.

## 4. Penanganan Insiden & Backup
- **Backup Harian:** Database di-backup secara otomatis setiap 24 jam dan log transaksi (WAL) setiap 5 menit untuk *Point-in-Time Recovery*.
- **Disaster Recovery:** Kami melakukan simulasi pemulihan bencana setiap kuartal untuk memastikan waktu pemulihan (RTO) di bawah 4 jam.
- **Pelaporan Kerentanan:** Jika Anda menemukan celah keamanan, laporkan ke [security@margin.pro](mailto:security@margin.pro). Kami memiliki program Bug Bounty untuk peneliti keamanan etis.

## 5. Kepatuhan Karyawan
Seluruh karyawan Margin Pro wajib menandatangani NDA (Non-Disclosure Agreement) ketat dan mengikuti pelatihan keamanan siber tahunan. Akses ke data pelanggan dibatasi hanya untuk staf support senior dengan izin eksplisit dari pelanggan untuk tujuan debugging.
