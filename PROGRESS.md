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
- Pemesanan via WhatsApp sudah beres di Tahap 3 (di bawah).
- Harga dan stok di keranjang memakai salinan saat produk dimasukkan — tapi sebelum pesan via WhatsApp dibuat, stok dicek ulang ke server (sudah beres di Tahap 3).
- Belum ada kolom pencarian — itu Tahap 4.
- Belum ter-deploy.

## Rencana gabung dengan project lain

Project ini dirancang supaya nanti bisa digabung dengan aplikasi kasir warung dan inventaris menjadi satu sistem manajemen UMKM:
- Inti bersama yang sama di semua project: stack sama (Node + Express + MySQL), struktur MVC sama (`src/config`, `src/models`, `src/controllers`, `src/routes`, `public`, `database`), penamaan tabel dan kolom sama, format `.env` sama.
- Tabel yang dipakai bersama: `produk` (id, nama, harga, stok, kategori), serta nanti tabel `pengguna` untuk login dan tabel `transaksi` dan `detail_transaksi`.
- Pembagian peran: kasir mengurangi stok saat transaksi, inventaris menambah dan mengelola stok, katalog menampilkan produk yang sama ke pelanggan. Ketiganya memakai tabel `produk` yang sama, supaya nanti tinggal digabung jadi satu sistem: satu login, satu basis data, satu dashboard dengan modul kasir + inventaris + katalog.
- Project yang berjalan paralel: aplikasi-kasir-warung (kasir, riwayat, laporan) dan inventaris-barang-warung (stok, barang masuk/keluar, stok menipis, supplier).
- Arah jangka panjang: kesulitan naik bertahap — setelah gabung jadi sistem UMKM, tambah modul yang lebih dalam (keuangan warung, laporan dan grafik, export data, pencarian/filter/pagination, multi-pengguna dan peran), menuju aplikasi nyata yang dipakai orang sungguhan. Tiap project tetap maksimal satu konsep baru dan tetap bisa dijelaskan ulang saat interview. Konsep baru project ini: pemesanan via WhatsApp (Tahap 3).

## Tahap 3 — Selesai: Pesan via WhatsApp

Yang dibuat kali ini:
- Endpoint baru `GET /api/wa-nomor` di `src/controllers/katalogController.js` (didaftarkan di `server.js`): membaca `WA_NOMOR` dari `.env`, dibersihkan dulu (spasi, `+`, dan strip dibuang) supaya langsung bisa dipakai di `wa.me`. Kalau belum diatur, dijawab 404 dengan pesan yang jelas.
- Tombol "Pesan via WhatsApp" di halaman keranjang (`public/keranjang.html` + `public/js/keranjang.js`): sebelum pesan dibuat, stok dicek ulang ke server — barang yang sudah habis dikeluarkan dari keranjang, jumlah yang melebihi stok dipotong, harga ikut harga terbaru, dan perubahannya ditampilkan sebagai catatan. Lalu nomor warung diambil dari server, isi pesanan disusun otomatis (sapaan, daftar barang + jumlah + subtotal, total harga), dan `wa.me/<nomor>?text=...` dibuka di tab baru — pelanggan tinggal ketuk kirim di WhatsApp.
- Kunci baru `WA_NOMOR` di `.env.example` (format internasional tanpa +, contoh `6281234567890`), plus penjelasan singkat di README.
- Gaya tombol WhatsApp di `public/css/style.css`: hijau, selebar kartu, tinggi 48px.

Cara kerja singkat:
- Pelanggan mengetuk tombol pesan di `/keranjang.html`. Peramban meminta `GET /api/produk` untuk stok terbaru, menyesuaikan isi keranjang di Local Storage, lalu meminta `GET /api/wa-nomor`. Pesan disusun dari keranjang yang sudah disesuaikan, di-encode, dan dibuka sebagai tautan `wa.me` — tidak ada data pesanan yang disimpan di server, semuanya lewat WhatsApp.

Yang sudah diuji:
- Logika diuji lewat Node dengan tiruan Local Storage (12 pemeriksaan, semua lolos): isi pesan benar (sapaan, tiap barang dengan jumlah dan subtotal, total Rp27.000 untuk 2 Kopi + 1 Gula), pesan kosong tetap ada total Rp0, `encodeURIComponent` menghasilkan `%0A` untuk baris baru; penyesuaian stok benar (jumlah dipotong kalau stok tinggal sedikit, harga ikut harga terbaru, barang habis dikeluarkan dengan catatan, tanpa perubahan daftar tetap sama).
- Uji server (MariaDB 10.11 lokal, port 3001, 6 produk contoh sama seperti preview pagi): `GET /api/produk` mengembalikan 5 produk (Teh Melati stok 0 tidak muncul) + 3 kategori; `GET /api/produk/1` benar (Kopi Sachet); `GET /api/produk/3` 404; `GET /api/wa-nomor` mengembalikan `{"nomor":"6281234567890"}` (nomor dummy di `.env` lokal); tanpa `WA_NOMOR` dijawab 404 "Nomor WhatsApp warung belum diatur" (diuji di port 3002); semua halaman 200 (`/`, `/detail.html`, `/keranjang.html`, CSS + semua JS); tidak ada error di log server. Catatan: MariaDB di VM ini ternyata tidak ada lagi saat run ini jalan (VM sempat di-reset sejak run pagi) — `mariadb-server` 10.11 diinstal ulang lewat apt (mirror cogent sempat macet, ganti ke azure saja), lalu pengguna `kasir` + db `katalog_warung` + 6 produk contoh dibuat ulang. Klik tombol pesan di peramban sungguhan belum diuji (tautan `wa.me` disusun dari fungsi yang sama dengan yang lolos uji Node di atas).
- Data uji (6 produk contoh) TIDAK dibersihkan kali ini — sama seperti preview pagi, biar bisa dipakai lagi buat cek tampilan.

Kekurangan saat ini (jujur):
- Belum ada kolom pencarian — itu Tahap 4.
- Belum ter-deploy.

## Tahap 4 — Selesai: Pencarian produk

Yang dibuat kali ini:
- Model `src/models/Produk.js`: `semuaProduk` sekarang menerima kata kunci kedua — kalau ada, produk disaring dengan `LIKE` pada nama atau kategori. Tanda `%`, `_`, dan `\` di kata kunci diamankan dulu supaya dianggap huruf biasa, bukan pola. Sengaja tanpa klausa `ESCAPE` tambahan, karena MariaDB pernah menolaknya di kasir (bikin 500); karakter pelindung bawaan LIKE sudah cukup.
- Pengatur `src/controllers/katalogController.js`: `daftarProduk` membaca kata kunci dari `?cari=`, dipangkas dan dibatasi 100 huruf, lalu diteruskan ke model. Pencarian dan saringan kategori boleh dipakai bareng — cari di dalam kategori itu saja.
- Halaman katalog (`public/index.html` + `public/js/app.js`): kolom pencarian di atas tombol saringan, tipe `search` dengan placeholder "Cari produk, misal kopi...". Permintaan baru dikirim 300 ms setelah berhenti mengetik (debounce), sama seperti di kasir. Kategori dan kata kunci yang aktif disimpan di variabel, jadi pindah kategori tidak menghapus yang diketik, begitu juga sebaliknya. Kalau tidak ada yang cocok, muncul pesan "Tidak ada produk yang cocok dengan ...".
- Gaya baru di `public/css/style.css`: kelas `.pencarian` — selebar kartu, tinggi 44px, huruf 16px supaya peramban HP tidak memperbesar layar saat kolom disentuh.

Cara kerja singkat:
- Peramban mengirim kata kunci ke `GET /api/produk?cari=...`, boleh bareng `?kategori=...`. Server menyaring di basis data dengan `LIKE`, lalu peramban menampilkan hasilnya sebagai kartu seperti biasa.

Yang sudah diuji (basis data MariaDB 10.11 lokal, server di port 3001):
- Data uji: Kopi Sachet Rp5.000 (Minuman, stok 20), Gula 1kg Rp17.000 (Bahan Dapur, stok 10), Teh Melati Rp4.000 (Minuman, stok 0), Kopi Tubruk Rp8.000 (Minuman, stok 15), Mie Instan Rp3.500 (Bahan Dapur, stok 50)
- `?cari=kopi` mengembalikan 2 hasil: Kopi Sachet dan Kopi Tubruk; `?cari=KOPI` juga 2 hasil (tidak peduli huruf besar-kecil)
- `?cari=minuman` mengembalikan 2 hasil (cocok lewat kategori); `?cari=kopi&kategori=Minuman` 2 hasil; `?cari=kopi&kategori=Bahan Dapur` 0 hasil — gabungan keduanya jalan
- `?cari=%` dan `?cari=_` mengembalikan 0 hasil (tanda pola tidak lagi dianggap pola); `?cari=tidakada` 0 hasil
- Tanpa `?cari=` tetap mengembalikan semua 4 produk yang stoknya ada (Teh Melati stok 0 tidak muncul)
- Halaman `/`, `/detail.html`, `/keranjang.html`, `/css/style.css`, `/js/app.js`, `/js/keranjang.js`, `/js/detail.js`, `/api/sehat`, dan `/api/wa-nomor` dimuat HTTP 200; kolom cari ada di halaman; tidak ada error di log server
- Catatan: MariaDB lokal mati lagi sebelum uji — dinyalakan dulu, db `katalog_warung` + pengguna `kasir` dibuat ulang dari `.env` lokal karena ikut hilang. Bukan masalah kode.
- Data uji dibersihkan, tabel kembali kosong

Kekurangan saat ini (jujur):
- Pencarian hanya mencocokkan nama dan kategori, belum harga atau stok.
- Belum ada tampilan rapi di HP — itu Tahap 5.
- Belum ter-deploy.

## Tahap 5 (potongan 1 — selesai): Tampilan katalog dan detail di HP

Yang dibuat kali ini (baru halaman katalog sama detail, keranjang nyusul potongan 2):
- Saringan kategori di layar kecil sekarang bisa digeser ke samping (overflow-x), jadi tombolnya nggak numpuk ke bawah makan tempat. Tombolnya juga nggak menyusut.
- Kartu produk dikasih bayangan halus, biar kepisah jelas dari latar.
- Tautan keranjang di kepala halaman dibikin pil hijau muda — lebih gampang diketuk di HP, nggak cuma teks polos.
- Beli di halaman detail: di layar kecil, kolom jumlah sama tombol "+ Keranjang" jadi selebar kartu dan numpuk ke bawah, jadi nggak sempit-sempitan.
- Catatan usang di bawah katalog sama detail ("Pemesanan via WhatsApp menyusul di tahap berikutnya") dibenerin — WhatsApp-nya udah jadi dari Tahap 3, jadi tulisannya sekarang ngasih tahu yang bener.

Cara kerja singkat:
- Semua perubahan cuma CSS (`public/css/style.css`, media query max-width 600px) plus dua baris teks di `public/index.html` dan `public/detail.html`. Server sama sekali nggak disentuh.

Yang sudah diuji (basis data MariaDB 10.11 lokal, server di port 3001):
- Data uji: Kopi Sachet Rp5.000 (stok 20), Gula 1kg Rp17.000 (stok 10), Kopi Tubruk Rp8.000 (stok 15), Mie Instan Rp3.500 (stok 50), Teh Melati Rp4.000 (stok 0)
- `GET /api/produk` mengembalikan 4 produk (Teh Melati stok 0 tidak muncul); `?cari=kopi` 2 hasil; regresi `/api/wa-nomor` 200
- Halaman `/`, `/detail.html`, `/keranjang.html`, `/css/style.css`, semua JS 200; CSS yang disajikan server sudah berisi aturan baru (geser saringan, kolom beli, bayangan kartu, pil keranjang); kurung kurawal 54/54 seimbang
- Catatan usang "menyusul di tahap berikutnya" sudah 0 di kedua halaman; teks pengganti muncul di katalog
- Tangkapan layar langsung dari VM belum bisa — Chrome di VM menolak jalan headless, sama kayak waktu kasir. Jadi tampilan akhirnya dicek lewat demo Railway di peramban setelah deploy, bukan dari tangkapan layar lokal.
- Data uji dibersihkan, tabel kembali kosong, server dimatikan sesudah uji.

Kekurangan saat ini (jujur):
- Halaman keranjang belum dirapikan buat HP — itu potongan 2 Tahap 5 (baris keranjang masih bisa sempit di layar kecil).
- Belum ter-deploy.

## Tahap 5 (potongan 2 — selesai): Tampilan halaman keranjang di HP

Yang dibuat kali ini (cuma `public/css/style.css`, di dalam aturan layar kecil max-width 600px yang sudah ada — server dan JavaScript tidak disentuh):
- Baris barang di keranjang sekarang ditumpuk ke bawah, bukan dijejalkan sebaris: nama barang dan harga satuan selebar kartu di atas, di bawahnya pengatur jumlah (tombol kurang/tambah tetap 44px) dan subtotal sebaris, lalu tombol Hapus selebar kartu paling bawah.
- Total harga dibuat lebih besar (1.35em) biar langsung kelihatan sebelum pesan.
- Tombol "Kosongkan keranjang" jadi selebar kartu, sejajar dengan tombol WhatsApp yang memang sudah selebar kartu.
- Sekalian dibetulkan: komentar satu baris `// Kolom pencarian` di CSS diganti komentar CSS yang benar (`/* ... */`) — yang lama bukan komentar yang sah di CSS.

Cara kerja singkat:
- Sama seperti potongan 1: peramban HP membaca lebar layarnya, lalu memakai aturan `@media` yang cocok. Yang berubah hanya susunan tampilannya, bukan data atau alur keranjangnya.

Yang sudah diuji (basis data MariaDB 10.11 lokal, server di port 3001):
- Data uji: Kopi Sachet Rp5.000 (stok 20), Gula 1kg Rp17.000 (stok 10), Teh Melati Rp4.000 (stok 0)
- `GET /api/produk` mengembalikan 2 produk (Teh Melati stok 0 tidak muncul) + 2 kategori; `GET /api/wa-nomor` mengembalikan nomor dari `.env` lokal; `/api/sehat` ok
- Halaman `/`, `/detail.html`, `/keranjang.html`, `/css/style.css`, dan semua JS dimuat HTTP 200; CSS yang disajikan server sudah berisi aturan keranjang baru (baris ditumpuk, tombol Hapus dan Kosongkan selebar kartu); kurung kurawal CSS 60/60 seimbang
- Logika keranjang diuji lewat Node: tambah 2 Kopi + 1 Gula menghasilkan totalItem 3 dan totalHarga Rp27.000, isi pesan WhatsApp benar, ubah jumlah Kopi jadi 0 menghapusnya dari keranjang
- Tangkapan layar langsung dari VM belum bisa — Chrome di VM menolak jalan headless, sama seperti potongan sebelumnya. Tampilan akhirnya dicek lewat demo setelah deploy nanti.
- Data uji dibersihkan, tabel kembali kosong, server dimatikan sesudah uji

Kekurangan saat ini (jujur):
- Belum ter-deploy — itu Tahap 6, tahap terakhir katalog.

## Persiapan deploy — Selesai: Tabel produk dibuat otomatis pas server nyala

Yang dibuat kali ini:
- Berkas baru `src/config/siapkanTabel.js`: bikin tabel `produk` sendiri pas server nyala, polanya sama persis kayak di kasir dan inventaris — isi tabelnya sama dengan `database/schema.sql` (id, nama, harga, stok, kategori, dibuat_pada). Kalau tabel udah ada, dilewatin (`CREATE TABLE IF NOT EXISTS`), jadi aman dijalankan berkali-kali.
- Kalau basis data belum siap (misalnya MySQL Railway masih nyala), dicoba lagi sampai 12 kali dengan jeda 5 detik, baru nyerah dengan pesan yang jelas di log.
- `server.js` sekarang memanggil `siapkanTabel()` dulu dan baru `listen` setelah tabel siap (pola yang sama kayak inventaris), supaya endpoint langsung bisa dipakai tanpa jalanin `schema.sql` manual.
- README diperbarui: langkah membuat basis data sekarang menjelaskan kalau `schema.sql` boleh dilewati karena tabel dibuat otomatis. Tahap 6 belum dicentang — deploy-nya sendiri baru di tahap berikutnya.

Cara kerja singkat:
- Server nyala → `siapkanTabel()` mencoba `CREATE TABLE IF NOT EXISTS produk` ke basis data dari `.env`. Kalau gagal (basis data belum siap), tunggu 5 detik dan coba lagi, maksimal 12 kali. Kalau berhasil, log "Tabel sudah siap." muncul, lalu server mulai menerima permintaan.

Yang sudah diuji (basis data MariaDB 10.11 lokal, server di port 3001):
- Basis data `katalog_warung` dikosongkan dulu (tabel `produk` dihapus) — pas server dinyalakan, log "Tabel sudah siap." muncul dan tabel `produk` kebikin otomatis dengan kolom yang sama persis kayak `schema.sql`
- Data uji: Kopi Sachet Rp5.000 (stok 20), Gula 1kg Rp17.000 (stok 10), Teh Melati Rp4.000 (stok 0)
- `GET /api/produk` mengembalikan 2 produk (Teh Melati stok 0 tidak muncul); `GET /api/produk/1` benar; `/3` (stok habis) 404; `GET /api/wa-nomor` 200
- Halaman `/`, `/detail.html`, `/keranjang.html`, `/css/style.css`, dan semua JS dimuat HTTP 200; tidak ada error di log server
- Server dimatikan lalu dinyalakan lagi dengan tabel yang sudah ada — log "Tabel sudah siap." muncul lagi dan `GET /api/produk` tetap jalan (tidak bikin tabel dobel, data lama tetap ada)
- Catatan: MariaDB lokal sempat mati sebelum uji — dinyalakan dulu, lalu db `katalog_warung` + pengguna `kasir` dibuat ulang dari `.env` lokal (kata sandi acak dibuat di tempat, `.env` tetap lokal dan ter-ignore). Bukan masalah kode.
- Data uji dibersihkan, tabel kembali kosong, server dimatikan sesudah uji

Kekurangan saat ini (jujur):
- Belum ter-deploy — itu Tahap 6, tahap terakhir katalog.

## Tahap berikutnya

Tahap 6: Deploy online — pola yang sama seperti aplikasi kasir (Railway). Persiapan deploy sudah beres: tabel `produk` sekarang dibuat otomatis pas server nyala, jadi di Railway tinggal isi variabel `DB_*` dari service MySQL dan `WA_NOMOR`, tanpa jalanin `schema.sql` manual.
