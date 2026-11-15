# Katalog Produk Warung

Katalog produk online untuk pemilik warung atau toko kecil. Pelanggan bisa melihat barang yang tersedia dan harganya dari HP, lalu memesan lewat WhatsApp — tanpa harus tanya-tanya dulu.

## Siapa penggunanya

Pemilik warung atau toko kecil dan pelanggannya. Pemilik tidak perlu lagi menjawab pertanyaan "ada apa saja?" dan "harganya berapa?" satu per satu; pelanggan bisa langsung memilih dari katalog, lalu pesanan masuk rapi lewat WhatsApp.

## Fitur

- [x] Tahap 1: Kerangka aplikasi dan katalog produk (daftar barang yang masih tersedia, saringan kategori)
- [x] Tahap 2: Detail produk dan keranjang belanja (halaman detail, keranjang tersimpan di Local Storage)
- [x] Tahap 3: Pesan via WhatsApp (tombol di keranjang, link wa.me isi pesanan otomatis, nomor warung dari `.env`)
- [ ] Tahap 4: Pencarian dan filter kategori
- [ ] Tahap 5: Tampilan rapi di HP
- [ ] Tahap 6: Deploy online

## Teknologi yang dipakai

- Node.js dan Express.js — server dan REST API
- MySQL — basis data produk (tabel yang sama dengan aplikasi kasir warung)
- HTML5, CSS3, dan JavaScript — tampilan dan interaksi di peramban
- Fetch API — mengambil data dari server

## Cara menjalankan

1. Salin berkas `.env.example` menjadi `.env`, lalu isi pengaturannya — termasuk `WA_NOMOR` (nomor WhatsApp warung, format internasional tanpa +, contoh `6281234567890`), supaya tombol pesan di keranjang bisa dipakai:

   ```bash
   cp .env.example .env
   ```

2. Buat basis data dari berkas `database/schema.sql` di MySQL.
3. Buat pengguna basis data yang sama dengan isi `.env` (misalnya pengguna `kasir` dengan kata sandi yang kamu tulis di `.env`):

   ```sql
   CREATE USER 'kasir'@'localhost' IDENTIFIED BY 'kata-sandi-di-.env';
   GRANT ALL PRIVILEGES ON katalog_warung.* TO 'kasir'@'localhost';
   ```

4. Pasang paket yang dibutuhkan:

   ```bash
   npm install
   ```

5. Jalankan server:

   ```bash
   npm start
   ```

6. Buka di peramban: http://localhost:3000

## Demo

Belum ter-deploy. Tautan demo akan ditulis di sini setelah tahap deploy selesai.

## Kemajuan

Lihat `PROGRESS.md` untuk catatan tiap tahap: apa yang sudah selesai, apa yang belum, dan apa tahap berikutnya.
