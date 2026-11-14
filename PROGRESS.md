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

Kekurangan saat Tahap 1 selesai (sebagian sudah beres di bawah):
- Halaman detail produk sudah dibuat di Tahap 2 potongan 1 (di bawah).
- Belum ada keranjang belanja dan belum ada pemesanan via WhatsApp — itu Tahap 2 dan 3.
- Belum ada kolom pencarian — itu Tahap 4.
- Belum ter-deploy.
- Catatan: repo GitHub sudah dibuat Rid 2026-11-14 dan Tahap 1 sudah ter-push (commit 9540c264).

## Tahap 2 (potongan 1 — selesai): Halaman detail produk

Yang dibuat kali ini:
- Halaman detail di `public/detail.html` + `public/js/detail.js`: membaca `?id=` dari alamat, meminta `GET /api/produk/:id`, lalu menampilkan nama, harga rupiah, stok, dan label kategori. Judul tab ikut berubah jadi nama produk.
- Kartu produk di katalog sekarang bisa diketuk — mengetuk kartu atau tautan "Lihat detail →" membuka halaman detail produk itu (`public/js/app.js`).
- Gaya tambahan di `public/css/style.css`: kartu berubah warna tepi saat disorot, tautan detail hijau tebal, dan tampilan harga besar di halaman detail.
- Endpoint detailnya sendiri (`GET /api/produk/:id`) sudah ada sejak Tahap 1, jadi tidak ada perubahan di server — potongan ini murni halaman dan interaksi.
- README diperbarui: langkah membuat pengguna basis data (`CREATE USER` + `GRANT`) ditambahkan di "Cara menjalankan", karena di mesin baru pengguna `kasir` dari `.env` belum tentu sudah ada.

Cara kerja singkat:
- Pelanggan mengetuk kartu produk di katalog, peramban pindah ke `/detail.html?id=1`, lalu `detail.js` mengambil data produk itu dari server dan mengisinya ke halaman.

Yang sudah diuji (basis data MariaDB/MySQL lokal, server di port 3001):
- Data uji: Kopi Sachet Rp5.000 (stok 20), Gula 1kg Rp17.000 (stok 10), Teh Melati Rp4.000 (stok 0)
- `GET /api/produk/1` dan `/2` mengembalikan detail yang benar; `/3` (stok habis), `/999`, dan `/abc` menghasilkan 404
- Halaman `/`, `/detail.html`, `/js/detail.js`, `/js/app.js`, dan `/css/style.css` dimuat HTTP 200; `detail.html` berisi elemen detail dan tautan kembali ke katalog
- Daftar `GET /api/produk` tetap jalan seperti sebelumnya (2 produk + 2 kategori)
- Catatan soal pengujian: MariaDB di mesin ini masih baru — pengguna `kasir` yang tertulis di `.env` belum ada, jadi server sempat gagal konek (`Access denied for user 'kasir'`). Pengujian akhirnya memakai pengguna sementara `katalog_uji` lewat variabel environment, tanpa mengubah `.env`. Setelah pengujian, data uji dihapus (tabel kembali kosong) dan pengguna sementara ikut dihapus. Jadi kalau Farid menjalankan dari mesin baru, buat dulu pengguna basis datanya seperti langkah baru di README.
- Data uji dibersihkan, tabel kembali kosong

Kekurangan saat Tahap 2 potongan 1 selesai (sebagian sudah beres di bawah):
- Keranjang belanja sudah dibuat di potongan 2 (di bawah).
- Belum ada pemesanan via WhatsApp — itu Tahap 3.
- Belum ada kolom pencarian — itu Tahap 4.
- Belum ter-deploy.

## Tahap 2 (potongan 2 — selesai): Keranjang belanja

Yang dibuat kali ini:
- Logika keranjang di `public/js/keranjang.js`: tambah produk, ubah jumlah, hapus per barang, kosongkan semua, total harga dan total barang. Isinya disimpan di Local Storage (`keranjang_katalog`), jadi tetap ada walau pelanggan pindah halaman. Jumlah beli dibatasi setinggi stok — tidak bisa beli lebih dari yang ada.
- Halaman keranjang di `public/keranjang.html`: daftar barang yang dibeli, tombol kurang/tambah jumlah, hapus per barang, total harga, dan tombol kosongkan keranjang. Kalau masih kosong, muncul pesan yang mengarahkan balik ke katalog.
- Halaman detail (`public/detail.html` + `public/js/detail.js`): ada kolom jumlah dan tombol "+ Keranjang" di bawah harga. Jumlah maksimal ikut stok produk itu, dan setelah diketuk muncul baris info "Masuk keranjang".
- Tautan "Keranjang" di kepala halaman katalog dan detail, lengkap dengan lencana jumlah barang — angkanya ikut berubah tiap keranjang berubah.
- Gaya tambahan di `public/css/style.css`: tombol keranjang hijau, baris barang di keranjang, tombol kurang/tambah 44px supaya gampang diketuk di HP.
- Tidak ada perubahan di server — keranjang murni di peramban, jadi endpointnya tetap sama seperti Tahap 1.

Cara kerja singkat:
- Pelanggan mengetuk "+ Keranjang" di halaman detail, produk itu masuk Local Storage. Pindah ke `/keranjang.html` untuk melihat isinya, mengubah jumlah, atau menghapus barang. Total harga dihitung ulang tiap ada perubahan.

Yang sudah diuji:
- Logika keranjang diuji lewat Node dengan tiruan Local Storage (10 pemeriksaan, semua lolos): tambah barang, tambah barang yang sama (jumlahnya menumpuk), jumlah mentok di stok, ubah jumlah jadi 0 (barang hilang), hapus barang, kosongkan, isi keranjang tetap ada setelah "muat ulang", total harga benar.
- Server diuji di port 3001 dengan basis data MariaDB/MySQL lokal dan pengguna sementara (data uji sama seperti sebelumnya: Kopi Sachet Rp5.000 stok 20, Gula 1kg Rp17.000 stok 10, Teh Melati Rp4.000 stok 0): `GET /api/produk` tetap mengembalikan 2 produk, `/api/produk/1` benar, `/3` tetap 404.
- Halaman `/`, `/detail.html`, `/keranjang.html`, `/js/keranjang.js`, `/js/detail.js`, `/js/app.js`, dan `/css/style.css` dimuat HTTP 200; `keranjang.html` berisi daftar keranjang dan total, `detail.html` berisi kolom jumlah dan tombol keranjang, halaman katalog berisi tautan keranjang dengan lencana jumlah.
- Catatan soal pengujian: MariaDB di mesin ini masih baru — pengguna `kasir` yang tertulis di `.env` belum ada, jadi pengujian memakai pengguna sementara `katalog_uji` lewat variabel environment, tanpa mengubah `.env`. Setelah pengujian, basis data uji dan pengguna sementara ikut dihapus, jadi mesin kembali seperti sebelum pengujian. Kalau Farid menjalankan dari mesin baru, buat dulu pengguna basis datanya seperti langkah di README.
- Data uji dibersihkan, tabel kembali kosong

Kekurangan saat ini (jujur):
- Belum ada pemesanan via WhatsApp — itu Tahap 3, tombol pesannya belum ada di halaman keranjang.
- Harga dan stok di keranjang memakai salinan saat produk dimasukkan — kalau stok berubah di warung setelah itu, keranjang belum tahu. Nanti dicek ulang saat pesan via WhatsApp dibuat.
- Belum ada kolom pencarian — itu Tahap 4.
- Belum ter-deploy.

## Rencana gabung dengan project lain

Project ini dirancang supaya nanti bisa digabung dengan aplikasi kasir warung dan inventaris menjadi satu sistem manajemen UMKM:
- Inti bersama yang sama di semua project: stack sama (Node + Express + MySQL), struktur MVC sama (`src/config`, `src/models`, `src/controllers`, `src/routes`, `public`, `database`), penamaan tabel dan kolom sama, format `.env` sama.
- Tabel yang dipakai bersama: `produk` (id, nama, harga, stok, kategori), serta nanti tabel `pengguna` untuk login dan tabel `transaksi` dan `detail_transaksi`.
- Pembagian peran: kasir mengurangi stok saat transaksi, inventaris menambah dan mengelola stok, katalog menampilkan produk yang sama ke pelanggan. Ketiganya memakai tabel `produk` yang sama, supaya nanti tinggal digabung jadi satu sistem: satu login, satu basis data, satu dashboard dengan modul kasir + inventaris + katalog.
- Project yang berjalan paralel: aplikasi-kasir-warung (kasir, riwayat, laporan) dan inventaris-barang-warung (stok, barang masuk/keluar, stok menipis, supplier).
- Arah jangka panjang: kesulitan naik bertahap — setelah gabung jadi sistem UMKM, tambah modul yang lebih dalam (keuangan warung, laporan dan grafik, export data, pencarian/filter/pagination, multi-pengguna dan peran), menuju aplikasi nyata yang dipakai orang sungguhan. Tiap project tetap maksimal satu konsep baru dan tetap bisa dijelaskan ulang saat interview. Konsep baru project ini: pemesanan via WhatsApp (Tahap 3).

## Tahap berikutnya

Tahap 3: Pesan via WhatsApp — tombol pesan di halaman keranjang yang membuka link wa.me dengan isi pesanan (daftar barang, jumlah, dan total) terisi otomatis. Nomor WhatsApp warung dibaca dari `.env`.
