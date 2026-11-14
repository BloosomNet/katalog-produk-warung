// JavaScript halaman katalog: mengambil daftar produk dari server,
// lalu menampilkannya sebagai kartu dan tombol saringan kategori.
const daftarEl = document.getElementById('daftar-produk');
const saringanEl = document.getElementById('saringan');
const pesanEl = document.getElementById('pesan');
const kosongEl = document.getElementById('kosong');

// Mengubah angka menjadi format rupiah, misalnya 5000 menjadi Rp5.000.
function formatRupiah(angka) {
  return 'Rp' + Number(angka).toLocaleString('id-ID');
}

// Membuat satu kartu produk: nama, harga, stok, dan kategori.
function buatKartuProduk(produk) {
  const kartu = document.createElement('div');
  kartu.className = 'kartu-produk';

  const nama = document.createElement('h2');
  nama.textContent = produk.nama;

  const harga = document.createElement('p');
  harga.className = 'harga';
  harga.textContent = formatRupiah(produk.harga);

  const stok = document.createElement('p');
  stok.className = 'stok';
  stok.textContent = 'Stok: ' + produk.stok;

  kartu.append(nama, harga, stok);

  if (produk.kategori) {
    const label = document.createElement('span');
    label.className = 'kategori';
    label.textContent = produk.kategori;
    kartu.append(label);
  }

  // Mengetuk kartu membuka halaman detail produk itu.
  const tautan = document.createElement('a');
  tautan.className = 'tautan-detail';
  tautan.href = '/detail.html?id=' + produk.id;
  tautan.textContent = 'Lihat detail →';
  kartu.append(tautan);

  kartu.addEventListener('click', () => {
    window.location.href = '/detail.html?id=' + produk.id;
  });

  return kartu;
}

// Mengisi tombol saringan dari daftar kategori yang dikirim server.
function tampilkanSaringan(kategoriList, kategoriAktif) {
  saringanEl.innerHTML = '';
  const semua = [''].concat(kategoriList);
  semua.forEach((kategori) => {
    const tombol = document.createElement('button');
    tombol.className = 'tombol-saring' + (kategori === kategoriAktif ? ' aktif' : '');
    tombol.dataset.kategori = kategori;
    tombol.textContent = kategori || 'Semua';
    tombol.addEventListener('click', () => muatProduk(kategori));
    saringanEl.append(tombol);
  });
}

// Meminta daftar produk ke server, lalu menampilkannya.
// Kalau diberi kategori, hanya produk dalam kategori itu yang diminta.
async function muatProduk(kategori) {
  const aktif = kategori || '';
  pesanEl.textContent = '';
  try {
    const alamat = '/api/produk' + (aktif ? '?kategori=' + encodeURIComponent(aktif) : '');
    const tanggapan = await fetch(alamat);
    if (!tanggapan.ok) throw new Error('Server menjawab ' + tanggapan.status);
    const data = await tanggapan.json();

    tampilkanSaringan(data.kategori, aktif);

    daftarEl.innerHTML = '';
    data.produk.forEach((produk) => daftarEl.append(buatKartuProduk(produk)));
    kosongEl.hidden = data.produk.length > 0;
  } catch (err) {
    pesanEl.textContent = 'Gagal memuat katalog. Periksa server lalu muat ulang halaman.';
  }
}

muatProduk('');
