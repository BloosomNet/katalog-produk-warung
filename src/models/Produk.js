// Model Produk: semua perintah baca ke tabel produk dikumpulkan di sini.
// Katalog hanya MEMBACA produk — tambah, ubah, dan hapus produk tetap
// dilakukan di aplikasi kasir dan inventaris, karena ketiganya memakai
// tabel produk yang sama saat nanti digabung.
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

module.exports = { semuaProduk, semuaKategori, cariBerdasarkanId };
