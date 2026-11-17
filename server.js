// Titik masuk aplikasi: menjalankan server Express dan melayani halaman katalog.
// Tahap 1-5 sudah selesai: kerangka, detail produk, keranjang, pesan via WhatsApp,
// pencarian, dan tampilan HP. Persiapan deploy: tabel produk dibuat otomatis
// pas server nyala (src/config/siapkanTabel.js), jadi schema.sql nggak wajib
// dijalankan manual di basis data tujuan.
require('dotenv').config();
const express = require('express');
const path = require('path');
const siapkanTabel = require('./src/config/siapkanTabel');

const app = express();
const PORT = process.env.PORT || 3000;

// Membaca data JSON dari permintaan (dipakai saat keranjang dan pesanan nanti)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Melayani file statis dari folder public (HTML, CSS, dan JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Rute pemeriksaan: memastikan server dan basis data masih bisa dihubungi
app.get('/api/sehat', async (req, res) => {
  res.json({ status: 'ok', pesan: 'Server katalog warung berjalan' });
});

// Nomor WhatsApp warung, dipakai tombol pesan di halaman keranjang.
app.get('/api/wa-nomor', require('./src/controllers/katalogController').waNomor);

// Rute katalog produk.
app.use('/api/produk', require('./src/routes/produk'));

// Tabel dibuat dulu sebelum server menerima permintaan, supaya
// endpoint langsung bisa dipakai tanpa jalanin schema.sql manual.
siapkanTabel().then(() => {
  app.listen(PORT, () => {
    console.log(`Server katalog warung berjalan di http://localhost:${PORT}`);
  });
});
