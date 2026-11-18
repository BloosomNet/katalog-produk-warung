// Model Produk: semua perintah ke tabel produk dikumpulkan di sini.
// Halaman katalog dan detail hanya MEMBACA produk. Tambah, ubah, dan hapus
// produk ada di halaman kelola (kelola.html) supaya pemilik warung bisa
// mengisi katalognya sendiri dari aplikasi ini. Saat nanti digabung dengan
// kasir dan inventaris, ketiganya tetap memakai tabel produk yang sama.
const pool = require('../config/database');

// Mengambil produk yang masih ada stoknya, diurutkan berdasarkan nama.
// Kalau diberi kategori, hanya produk dalam kategori itu yang dikembalikan.
// Kalau diberi kata kunci, hanya produk yang nama atau kategorinya cocok.
// Produk yang stoknya habis tidak ditampilkan, supaya pelanggan tidak
// memesan barang yang tidak tersedia.
async function semuaProduk(kategori, kataKunci) {
  const kat = typeof kategori === 'string' ? kategori.trim() : '';
  const cari = typeof kataKunci === 'string' ? kataKunci.trim() : '';
  let sql = 'SELECT * FROM produk WHERE stok > 0';
  const param = [];
  if (kat) {
    sql += ' AND kategori = ?';
    param.push(kat);
  }
  if (cari) {
    // Tanda %, _ dan \ di kata kunci diamankan dulu, supaya dianggap
    // huruf biasa dan bukan pola LIKE. Tanpa klausa ESCAPE tambahan —
    // MariaDB menolaknya (pernah bikin 500 di kasir), karakter pelindung
    // bawaan LIKE sudah cukup.
    const aman = cari.replace(/([%_\\])/g, '\\$1');
    sql += ' AND (nama LIKE ? OR kategori LIKE ?)';
    param.push('%' + aman + '%', '%' + aman + '%');
  }
  sql += ' ORDER BY nama ASC';
  const [baris] = await pool.query(sql, param);
  return baris;
}

// Mengambil semua kategori yang masih punya produk tersedia,
// supaya halaman katalog bisa membuat tombol saringannya sendiri.
async function semuaKategori() {
  const [baris] = await pool.query(
    'SELECT DISTINCT kategori FROM produk WHERE stok > 0 AND kategori IS NOT NULL AND kategori <> "" ORDER BY kategori ASC'
  );
  return baris.map((b) => b.kategori);
}

// Mengambil satu produk berdasarkan id. Hasilnya null kalau tidak ditemukan
// atau stoknya habis (barang habis tidak bisa dibuka detailnya).
async function cariBerdasarkanId(id) {
  const [baris] = await pool.query(
    'SELECT * FROM produk WHERE id = ? AND stok > 0',
    [id]
  );
  return baris[0] || null;
}

// Mengambil SEMUA produk untuk halaman kelola, termasuk yang stoknya
// habis — pemilik warung tetap perlu melihat dan mengubahnya.
async function semuaUntukKelola() {
  const [baris] = await pool.query('SELECT * FROM produk ORDER BY nama ASC');
  return baris;
}

// Menambah satu produk baru. Mengembalikan id produk yang baru dibuat.
async function tambahProduk(produk) {
  const [hasil] = await pool.query(
    'INSERT INTO produk (nama, harga, stok, kategori) VALUES (?, ?, ?, ?)',
    [produk.nama, produk.harga, produk.stok, produk.kategori || null]
  );
  return hasil.insertId;
}

// Mengubah produk berdasarkan id. Mengembalikan jumlah baris yang berubah
// (0 kalau id-nya tidak ditemukan).
async function ubahProduk(id, produk) {
  const [hasil] = await pool.query(
    'UPDATE produk SET nama = ?, harga = ?, stok = ?, kategori = ? WHERE id = ?',
    [produk.nama, produk.harga, produk.stok, produk.kategori || null, id]
  );
  return hasil.affectedRows;
}

// Menghapus produk berdasarkan id. Mengembalikan jumlah baris yang terhapus
// (0 kalau id-nya tidak ditemukan).
async function hapusProduk(id) {
  const [hasil] = await pool.query('DELETE FROM produk WHERE id = ?', [id]);
  return hasil.affectedRows;
}

module.exports = {
  semuaProduk,
  semuaKategori,
  cariBerdasarkanId,
  semuaUntukKelola,
  tambahProduk,
  ubahProduk,
  hapusProduk,
};
