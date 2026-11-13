# Kemajuan — Katalog Produk Warung

## Tahap 1 — Selesai: Kerangka aplikasi dan katalog produk

Yang sudah dibuat:
- Struktur folder pola MVC: `src/config`, `src/models`, `src/controllers`, `src/routes`, `public`, dan `database` — sama seperti aplikasi kasir warung, supaya nanti bisa digabung
- Server Express di `server.js` yang melayani halaman katalog dan rute pemeriksaan `/api/sehat`
- Koneksi MySQL di `src/config/database.js` memakai `mysql2` dan pengaturan dari `.env`
- Skema tabel `produk` di `database/schema.sql` — kolomnya sama persis dengan tabel produk di aplikasi kasir warung (id, nama, harga, stok, kategori), supaya nanti tinggal digabung jadi satu sistem dengan satu basis data
- Model produk di `src/models/Produk.js` (hanya baca): `semuaProduk` (hanya produk yang stoknya masih ada, boleh disaring per kategori), `semuaKategori` (daftar kategori untuk tombol saringan), dan `cariBerdasarkanId` (detail satu produk)
- Pengatur katalog di `src/controllers/katalogController.js` dan rute di `src/routes/produk.js`: `GET /api/produk` (daftar + daftar kategori) dan `GET /api/produk/:id` (detail, 404 kalau tidak ada atau stok habis)
- Halaman katalog di `public/index.html` dan `public/js/app.js`: kartu produk (nama, harga format rupiah, stok, label kategori) dan tombol saringan kategori yang dibuat otomatis dari data server
- CSS di `public/css/style.css`: kartu produk satu kolom di HP dan dua kolom di layar lebar, tombol saringan setinggi minimal 44px supaya gampang diketuk, aturan layar kecil (max-width 600px)

Cara kerja singkat:
- Peramban meminta `GET /api/produk` saat halaman dibuka. Server mengambil produk yang stoknya masih di atas nol dari tabel `produk`, lalu peramban menampilkannya sebagai kartu.
- Mengetuk tombol kategori mengirim permintaan baru dengan `?kategori=...`, dan server menyaring di basis data.
- Katalog hanya membaca produk — tambah, ubah, dan hapus produk tetap dilakukan di aplikasi kasir dan inventaris, karena ketiganya memakai tabel produk yang sama.

Yang sudah diuji (basis data MariaDB/MySQL lokal):
- Data uji: Kopi Sachet Rp5.000 (Minuman, stok 20), Gula 1kg Rp17.000 (Bahan Dapur, stok 10), Teh Melati Rp4.000 (Minuman, stok 0)
- `GET /api/produk` mengembalikan 2 produk — Teh Melati yang stoknya habis tidak muncul
- `GET /api/produk?kategori=Minuman` mengembalikan 1 produk: Kopi Sachet; daftar kategori berisi Bahan Dapur dan Minuman
- `GET /api/produk/1` mengembalikan detail Kopi Sachet; `GET /api/produk/3` (stok habis) menghasilkan 404; produk nomor 999 juga 404
- Halaman `/`, `/css/style.css`, dan `/js/app.js` dimuat HTTP 200, tombol saringan dan kartu produk tampil, tidak ada error di log server
- Data uji dibersihkan, tabel kembali kosong

Kekurangan saat ini (jujur):
- Belum ada halaman detail produk yang bisa dibuka dari kartu (endpoint sudah ada, halamannya belum) — itu Tahap 2.
- Belum ada keranjang belanja dan belum ada pemesanan via WhatsApp — itu Tahap 2 dan 3.
- Belum ada kolom pencarian — itu Tahap 4.
- Belum ter-deploy.
- Catatan: repo GitHub `BloosomNet/katalog-produk-warung` belum ada (pembuatan repo lewat API pernah gagal 403), jadi kode Tahap 1 ini baru tersimpan lokal. Repo perlu dibuat dulu lewat peramban sebelum bisa di-push.

## Rencana gabung dengan project lain

Project ini dirancang supaya nanti bisa digabung dengan aplikasi kasir warung dan inventaris menjadi satu sistem manajemen UMKM:
- Inti bersama yang sama di semua project: stack sama (Node + Express + MySQL), struktur MVC sama (`src/config`, `src/models`, `src/controllers`, `src/routes`, `public`, `database`), penamaan tabel dan kolom sama, format `.env` sama.
- Tabel yang dipakai bersama: `produk` (id, nama, harga, stok, kategori), serta nanti tabel `pengguna` untuk login dan tabel `transaksi` dan `detail_transaksi`.
- Pembagian peran: kasir mengurangi stok saat transaksi, inventaris menambah dan mengelola stok, katalog menampilkan produk yang sama ke pelanggan. Ketiganya memakai tabel `produk` yang sama, supaya nanti tinggal digabung jadi satu sistem: satu login, satu basis data, satu dashboard dengan modul kasir + inventaris + katalog.
- Project yang berjalan paralel: aplikasi-kasir-warung (kasir, riwayat, laporan) dan inventaris-barang-warung (stok, barang masuk/keluar, stok menipis, supplier).
- Arah jangka panjang: kesulitan naik bertahap — setelah gabung jadi sistem UMKM, tambah modul yang lebih dalam (keuangan warung, laporan dan grafik, export data, pencarian/filter/pagination, multi-pengguna dan peran), menuju aplikasi nyata yang dipakai orang sungguhan. Tiap project tetap maksimal satu konsep baru dan tetap bisa dijelaskan ulang saat interview. Konsep baru project ini: pemesanan via WhatsApp (Tahap 3).

## Tahap berikutnya

Tahap 2: Detail produk dan keranjang belanja.
