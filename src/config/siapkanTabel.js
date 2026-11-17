// Bikin tabel sendiri pas server nyala, biar pas deploy ke Railway
// nggak perlu jalanin schema.sql manual. Kalau tabel udah ada, dilewatin.
// Isinya sama persis kayak database/schema.sql dan tabel produk di kasir
// dan inventaris, supaya nanti gampang digabung.
const pool = require('./database');

const buatTabel = [
  `CREATE TABLE IF NOT EXISTS produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    harga INT NOT NULL,
    stok INT NOT NULL DEFAULT 0,
    kategori VARCHAR(50),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
];

// Coba bikin tabel, kalau basis data belum siap (misal MySQL Railway
// masih nyala), tunggu bentar terus coba lagi. Maksimal 12 kali.
async function siapkanTabel() {
  for (let percobaan = 1; percobaan <= 12; percobaan++) {
    try {
      for (const sql of buatTabel) {
        await pool.query(sql);
      }
      console.log('Tabel sudah siap.');
      return;
    } catch (err) {
      console.log(`Basis data belum siap (percobaan ${percobaan}/12), coba lagi 5 detik lagi...`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  console.log('Tabel belum kebikin setelah 12 kali coba, cek pengaturan basis data.');
}

module.exports = siapkanTabel;
