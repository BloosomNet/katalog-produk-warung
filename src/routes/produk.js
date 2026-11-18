// Rute katalog produk. Daftar dan detail dibaca pelanggan; tambah, ubah,
// dan hapus produk dipakai halaman kelola oleh pemilik warung.
const express = require('express');
const router = express.Router();
const katalogController = require('../controllers/katalogController');

router.get('/', katalogController.daftarProduk);
// '/semua' harus di atas '/:id' — kalau tidak, kata "semua" akan
// dianggap sebagai id produk.
router.get('/semua', katalogController.daftarKelola);
router.get('/:id', katalogController.detailProduk);
router.post('/', katalogController.tambahProduk);
router.put('/:id', katalogController.ubahProduk);
router.delete('/:id', katalogController.hapusProduk);

module.exports = router;
