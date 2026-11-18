// JavaScript halaman kelola: menampilkan semua produk (termasuk yang
// stoknya habis), lalu menangani tambah, ubah, dan hapus produk lewat
// formulir di halaman yang sama.
const daftarEl = document.getElementById('daftar-kelola');
const kosongEl = document.getElementById('kelola-kosong');
const pesanDaftarEl = document.getElementById('pesan-daftar');
const formulirEl = document.getElementById('formulir-produk');
const judulFormulirEl = document.getElementById('judul-formulir');
const pesanFormulirEl = document.getElementById('pesan-formulir');
const infoFormulirEl = document.getElementById('info-formulir');
const tombolBatalEl = document.getElementById('tombol-batal');
const kolomId = document.getElementById('produk-id');
const kolomNama = document.getElementById('produk-nama');
const kolomHarga = document.getElementById('produk-harga');
const kolomStok = document.getElementById('produk-stok');
const kolomKategori = document.getElementById('produk-kategori');

// Mengubah angka menjadi format rupiah, misalnya 5000 menjadi Rp5.000.
function formatRupiah(angka) {
  return 'Rp' + Number(angka).toLocaleString('id-ID');
}

// Mengosongkan formulir dan mengembalikannya ke mode tambah produk.
function aturUlangFormulir() {
  formulirEl.reset();
  kolomId.value = '';
  judulFormulirEl.textContent = 'Tambah produk';
  tombolBatalEl.hidden = true;
}

// Membuat satu baris produk di daftar kelola: nama, harga, stok, kategori,
// dan tombol Ubah serta Hapus. Semua teks diisi lewat textContent,
// jadi nama produk tidak bisa menyisipkan HTML.
function buatBarisProduk(produk) {
  const baris = document.createElement('div');
  baris.className = 'baris-kelola';

  const ringkasan = document.createElement('div');
  const nama = document.createElement('strong');
  nama.textContent = produk.nama;
  const rincian = document.createElement('p');
  rincian.className = 'harga-satuan';
  rincian.textContent =
    formatRupiah(produk.harga) + ' · Stok: ' + produk.stok +
    (produk.kategori ? ' · ' + produk.kategori : '') +
    (produk.stok <= 0 ? ' · Stok habis (tidak tampil di katalog)' : '');
  ringkasan.append(nama, rincian);

  const aksi = document.createElement('div');
  aksi.className = 'aksi-kelola';
  const tombolUbah = document.createElement('button');
  tombolUbah.type = 'button';
  tombolUbah.className = 'tombol-kosongkan';
  tombolUbah.textContent = 'Ubah';
  tombolUbah.addEventListener('click', () => isiFormulir(produk));
  const tombolHapus = document.createElement('button');
  tombolHapus.type = 'button';
  tombolHapus.className = 'tombol-hapus';
  tombolHapus.textContent = 'Hapus';
  tombolHapus.addEventListener('click', () => hapusProduk(produk));
  aksi.append(tombolUbah, tombolHapus);

  baris.append(ringkasan, aksi);
  return baris;
}

// Meminta semua produk ke server, lalu menampilkannya.
async function muatProduk() {
  pesanDaftarEl.textContent = '';
  try {
    const respon = await fetch('/api/produk/semua');
    if (!respon.ok) throw new Error('gagal');
    const data = await respon.json();
    daftarEl.innerHTML = '';
    kosongEl.hidden = data.produk.length > 0;
    data.produk.forEach((produk) => daftarEl.append(buatBarisProduk(produk)));
  } catch (err) {
    pesanDaftarEl.textContent = 'Daftar produk gagal dimuat. Coba muat ulang halaman ini.';
  }
}

// Mengisi formulir dengan produk yang dipilih, beralih ke mode ubah.
function isiFormulir(produk) {
  kolomId.value = produk.id;
  kolomNama.value = produk.nama;
  kolomHarga.value = produk.harga;
  kolomStok.value = produk.stok;
  kolomKategori.value = produk.kategori || '';
  judulFormulirEl.textContent = 'Ubah produk: ' + produk.nama;
  tombolBatalEl.hidden = false;
  pesanFormulirEl.textContent = '';
  infoFormulirEl.textContent = '';
  kolomNama.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Menyimpan produk: POST untuk produk baru, PUT untuk yang diubah.
formulirEl.addEventListener('submit', async (kejadian) => {
  kejadian.preventDefault();
  pesanFormulirEl.textContent = '';
  infoFormulirEl.textContent = '';
  const isi = {
    nama: kolomNama.value,
    harga: kolomHarga.value,
    stok: kolomStok.value,
    kategori: kolomKategori.value,
  };
  const id = kolomId.value;
  try {
    const respon = await fetch(id ? '/api/produk/' + id : '/api/produk', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isi),
    });
    const data = await respon.json();
    if (!respon.ok) {
      pesanFormulirEl.textContent = data.pesan || 'Produk gagal disimpan.';
      return;
    }
    infoFormulirEl.textContent = id
      ? 'Produk berhasil diubah.'
      : 'Produk berhasil ditambahkan.';
    aturUlangFormulir();
    await muatProduk();
  } catch (err) {
    pesanFormulirEl.textContent = 'Produk gagal disimpan. Periksa koneksi lalu coba lagi.';
  }
});

tombolBatalEl.addEventListener('click', () => {
  pesanFormulirEl.textContent = '';
  infoFormulirEl.textContent = '';
  aturUlangFormulir();
});

// Menghapus produk setelah pemilik mengonfirmasi.
async function hapusProduk(produk) {
  if (!window.confirm('Hapus produk "' + produk.nama + '"? Tindakan ini tidak bisa dibatalkan.')) {
    return;
  }
  try {
    const respon = await fetch('/api/produk/' + produk.id, { method: 'DELETE' });
    const data = await respon.json();
    if (!respon.ok) {
      pesanDaftarEl.textContent = data.pesan || 'Produk gagal dihapus.';
      return;
    }
    if (String(kolomId.value) === String(produk.id)) {
      aturUlangFormulir();
    }
    await muatProduk();
  } catch (err) {
    pesanDaftarEl.textContent = 'Produk gagal dihapus. Periksa koneksi lalu coba lagi.';
  }
}

muatProduk();
