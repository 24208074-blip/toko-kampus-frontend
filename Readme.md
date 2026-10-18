# Toko Kampus – Front-End E-Commerce Sederhana

Tugas Pertemuan 7 – E-Business System (HTML, CSS, JavaScript).
Studi kasus: **Sistem Toko Online Kampus** (dari desain Pertemuan 4–6).

> Pembayaran di proyek ini adalah **simulasi sistem**, bukan pembayaran nyata. Data disimpan di `localStorage` browser, belum terhubung ke database (back-end PHP/MySQL dibahas pada tahap berikutnya).

## Cara menjalankan
1. Unduh atau clone repository ini.
2. Buka `index.html` di browser (atau pakai ekstensi Live Server di VS Code).

## Struktur folder
```
ecommerce-project/
├── index.html      (Home + katalog produk)
├── product.html    (detail produk)
├── cart.html       (keranjang)
├── checkout.html   (checkout + simulasi pembayaran)
├── login.html      (login simulasi)
├── css/style.css
└── js/script.js
```

## Use Case → halaman
| Use Case | Halaman |
| --- | --- |
| View Product | index.html, product.html |
| Add to Cart | tombol "Tambah ke Keranjang", cart.html |
| Checkout | checkout.html |
| Make Payment | checkout.html (tahap pembayaran, simulasi) |
| View Order | status pesanan di checkout.html |
| Login | login.html |

## Alur transaksi (sesuai Pertemuan 6)
Customer Checkout → pilih metode pembayaran → proses pembayaran → "Pembayaran berhasil?"
- **Berhasil:** PAYMENT.status = SUCCESS, ORDERS.status = PAID, stok berkurang.
- **Gagal:** PAYMENT.status = FAILED, ORDERS.status = PAYMENT_FAILED. Jika dicoba lagi, data PAYMENT yang sama diperbarui (relasi ORDERS–PAYMENT 1:1).

Contoh uji: Tumbler Kampus ×2 (Rp50.000) + Totebag Kampus ×1 (Rp75.000) = **Rp175.000**.

## Fungsi yang bisa didemokan
- Navigasi antarhalaman, filter kategori, product card konsisten
- Keranjang: tambah, ubah jumlah, hapus, hitung total, cek stok
- Form checkout dan login dengan validasi (nama, email, alamat, kota, password)
- Simulasi pembayaran berhasil/gagal
- Layout responsif (3 kolom desktop → 2 kolom tablet → 1 kolom mobile)
