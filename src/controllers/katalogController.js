// Pengatur katalog: menerima permintaan dari rute, memanggil model,
// lalu mengirim hasilnya sebagai JSON.
const Produk = require('../models/Produk');

// GET /api/produk — daftar produk yang masih tersedia.
// Boleh disaring dengan ?kategori=, misalnya /api/produk?kategori=Minuman,
// dan dicari dengan ?cari=, misalnya /api/produk?cari=kopi. Keduanya boleh
// dipakai bareng: cari di dalam kategori itu saja.
async function daftarProduk(req, res) {
  try {
    const kataKunci = typeof req.query.cari === 'string'
      ? req.query.cari.trim().slice(0, 100)
      : '';
    const produk = await Produk.semuaProduk(req.query.kategori, kataKunci);
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

// GET /api/wa-nomor — nomor WhatsApp warung dari .env, dibersihkan dulu
// (spasi, tanda +, dan strip dibuang) supaya bisa langsung dipakai di wa.me.
// Kalau belum diatur, dijawab 404 supaya peramban bisa menampilkan pesan yang jelas.
function waNomor(req, res) {
  const mentah = (process.env.WA_NOMOR || '').replace(/[^0-9]/g, '');
  if (!mentah) {
    return res.status(404).json({ pesan: 'Nomor WhatsApp warung belum diatur' });
  }
  res.json({ nomor: mentah });
}

// Membersihkan dan memeriksa isi formulir produk dari halaman kelola.
// Mengembalikan { produk } kalau sah, atau { galat } berisi pesan kesalahan.
function periksaProduk(isi) {
  const nama = typeof isi.nama === 'string' ? isi.nama.trim().slice(0, 100) : '';
  if (!nama) {
    return { galat: 'Nama produk wajib diisi' };
  }
  const harga = Number(isi.harga);
  if (!Number.isInteger(harga) || harga <= 0) {
    return { galat: 'Harga harus angka bulat lebih dari 0' };
  }
  const stok = Number(isi.stok);
  if (!Number.isInteger(stok) || stok < 0) {
    return { galat: 'Stok harus angka bulat 0 atau lebih' };
  }
  const kategori = typeof isi.kategori === 'string'
    ? isi.kategori.trim().slice(0, 50)
    : '';
  return { produk: { nama, harga, stok, kategori } };
}

// GET /api/produk/semua — semua produk untuk halaman kelola,
// termasuk yang stoknya habis.
async function daftarKelola(req, res) {
  try {
    const produk = await Produk.semuaUntukKelola();
    res.json({ produk });
  } catch (err) {
    console.error(err);
    res.status(500).json({ pesan: 'Gagal mengambil daftar produk' });
  }
}

// POST /api/produk — menambah produk baru dari halaman kelola.
async function tambahProduk(req, res) {
  try {
    const { produk, galat } = periksaProduk(req.body || {});
    if (galat) {
      return res.status(400).json({ pesan: galat });
    }
    const id = await Produk.tambahProduk(produk);
    res.status(201).json({ id, ...produk });
  } catch (err) {
    console.error(err);
    res.status(500).json({ pesan: 'Gagal menambah produk' });
  }
}

// PUT /api/produk/:id — mengubah produk dari halaman kelola.
async function ubahProduk(req, res) {
  try {
    const { produk, galat } = periksaProduk(req.body || {});
    if (galat) {
      return res.status(400).json({ pesan: galat });
    }
    const berubah = await Produk.ubahProduk(req.params.id, produk);
    if (!berubah) {
      return res.status(404).json({ pesan: 'Produk tidak ditemukan' });
    }
    res.json({ id: Number(req.params.id), ...produk });
  } catch (err) {
    console.error(err);
    res.status(500).json({ pesan: 'Gagal mengubah produk' });
  }
}

// DELETE /api/produk/:id — menghapus produk dari halaman kelola.
async function hapusProduk(req, res) {
  try {
    const terhapus = await Produk.hapusProduk(req.params.id);
    if (!terhapus) {
      return res.status(404).json({ pesan: 'Produk tidak ditemukan' });
    }
    res.json({ pesan: 'Produk terhapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ pesan: 'Gagal menghapus produk' });
  }
}

module.exports = {
  daftarProduk,
  detailProduk,
  waNomor,
  daftarKelola,
  tambahProduk,
  ubahProduk,
  hapusProduk,
};
