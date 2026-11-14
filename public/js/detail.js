// JavaScript halaman detail: membaca id dari alamat (?id=...),
// lalu meminta detail produk itu ke server dan menampilkannya.
const pesanEl = document.getElementById('pesan');
const detailEl = document.getElementById('detail-produk');

// Mengubah angka menjadi format rupiah, misalnya 5000 menjadi Rp5.000.
function formatRupiah(angka) {
  return 'Rp' + Number(angka).toLocaleString('id-ID');
}

async function muatDetail() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    pesanEl.textContent = 'Tidak ada produk yang dipilih. Balik ke katalog dulu, lalu ketuk salah satu produk.';
    return;
  }

  try {
    const tanggapan = await fetch('/api/produk/' + encodeURIComponent(id));
    if (tanggapan.status === 404) {
      pesanEl.textContent = 'Produk tidak ditemukan, atau stoknya sudah habis.';
      return;
    }
    if (!tanggapan.ok) throw new Error('Server menjawab ' + tanggapan.status);
    const produk = await tanggapan.json();

    document.getElementById('detail-nama').textContent = produk.nama;
    document.getElementById('detail-harga').textContent = formatRupiah(produk.harga);
    document.getElementById('detail-stok').textContent = 'Stok tersedia: ' + produk.stok;

    const kategoriEl = document.getElementById('detail-kategori');
    if (produk.kategori) {
      kategoriEl.textContent = produk.kategori;
      kategoriEl.hidden = false;
    }

    document.title = produk.nama + ' — Katalog Produk Warung';
    detailEl.hidden = false;
  } catch (err) {
    pesanEl.textContent = 'Gagal memuat detail produk. Periksa server lalu muat ulang halaman.';
  }
}

muatDetail();
