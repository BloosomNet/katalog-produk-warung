// Rute katalog produk (hanya baca — katalog tidak mengubah data produk).
const express = require('express');
const router = express.Router();
const katalogController = require('../controllers/katalogController');

router.get('/', katalogController.daftarProduk);
router.get('/:id', katalogController.detailProduk);

module.exports = router;
