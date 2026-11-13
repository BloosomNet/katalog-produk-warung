// Model Produk: semua perintah baca ke tabel produk dikumpulkan di sini.
// Katalog hanya MEMBACA produk — tambah, ubah, dan hapus produk tetap
// dilakukan di aplikasi kasir dan inventaris, karena ketiganya memakai
// tabel produk yang sama saat nanti digabung.
const pool = require('../config/database');

// Mengambil produk yang masih ada stoknya, diurutkan berdasarkan nama.
// Kalau diberi kategori, hanya produk dalam kategori itu yang dikembalikan.
// Produk yang stoknya habis tidak ditampilkan, supaya pelanggan tidak
// memesan barang yang tidak tersedia.
async function semuaProduk(kategori) {
  const kat = typeof kategori === 'string' ? kategori.trim() : '';
  if (!kat) {
    const [baris] = await pool.query(
      'SELECT * FROM produk WHERE stok > 0 ORDER BY nama ASC'
    );
    return baris;
  }
  const [baris] = await pool.query(
    'SELECT * FROM produk WHERE stok > 0 AND kategori = ? ORDER BY nama ASC',
    [kat]
  );
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
