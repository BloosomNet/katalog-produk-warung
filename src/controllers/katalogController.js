// Pengatur katalog: menerima permintaan dari rute, memanggil model,
// lalu mengirim hasilnya sebagai JSON.
const Produk = require('../models/Produk');

// GET /api/produk — daftar produk yang masih tersedia.
// Boleh disaring dengan ?kategori=, misalnya /api/produk?kategori=Minuman
async function daftarProduk(req, res) {
  try {
    const produk = await Produk.semuaProduk(req.query.kategori);
    const kategori = await Produk.semuaKategori();
    res.json({ produk, kategori });
  } catch (err) {
    console.error(err);
    res.status(500).json({ pesan: 'Gagal mengambil daftar produk' });
  }
}

// GET /api/produk/:id — detail satu produk, dipakai halaman detail nanti.
async function detailProduk(req, res) {
  try {
    const produk = await Produk.cariBerdasarkanId(req.params.id);
    if (!produk) {
      return res.status(404).json({ pesan: 'Produk tidak ditemukan atau stok habis' });
    }
    res.json(produk);
  } catch (err) {
    console.error(err);
    res.status(500).json({ pesan: 'Gagal mengambil detail produk' });
  }
}

module.exports = { daftarProduk, detailProduk };
