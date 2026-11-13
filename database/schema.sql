-- Skema basis data katalog produk warung.
-- Jalankan berkas ini di MySQL untuk membuat semua tabel yang dibutuhkan.
-- Tabel produk di sini SAMA PERSIS dengan tabel produk di aplikasi-kasir-warung
-- (id, nama, harga, stok, kategori), supaya nanti kedua project bisa digabung
-- menjadi satu sistem manajemen UMKM dengan satu basis data.
CREATE DATABASE IF NOT EXISTS katalog_warung;
USE katalog_warung;

CREATE TABLE IF NOT EXISTS produk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  harga INT NOT NULL,
  stok INT NOT NULL DEFAULT 0,
  kategori VARCHAR(50),
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
