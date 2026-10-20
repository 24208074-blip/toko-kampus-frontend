# Toko Kampus – Front-End E-Commerce Sederhana

Tugas Pertemuan 7 – E-Business System  
Nama: Aurelia Relsi Patintingan | NIM: 24208074  
Studi kasus: **Sistem Toko Online Kampus** (desain Pertemuan 4–6)

> Pembayaran pada proyek ini adalah **simulasi sistem**, bukan pembayaran nyata. Data disimpan sementara di `localStorage` browser dan belum terhubung ke database (back-end PHP/MySQL dibahas pada tahap berikutnya).

## Teknologi
HTML (struktur), CSS (tampilan, Flexbox, Grid, media query), JavaScript (interaksi dan validasi).

## Cara menjalankan
1. Unduh repository ini (**Code → Download ZIP**) lalu ekstrak.
2. Buka file `index.html` di browser (Chrome atau Edge).

## Struktur folder
```
├── index.html      (Home + katalog produk)
├── product.html    (detail produk)
├── cart.html       (keranjang)
├── checkout.html   (checkout + simulasi pembayaran)
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

## Alur transaksi (sesuai desain Pertemuan 6)
Customer Checkout → pilih metode pembayaran → proses pembayaran → "Pembayaran berhasil?"
- **Berhasil:** PAYMENT.status = SUCCESS, ORDERS.status = PAID, stok produk berkurang.
- **Gagal:** PAYMENT.status = FAILED, ORDERS.status = PAYMENT_FAILED. Jika dicoba lagi, data PAYMENT yang sama diperbarui (relasi ORDERS–PAYMENT 1:1).

Contoh uji: Tumbler ×2 (Rp50.000) + Totebag ×1 (Rp75.000) = **Rp175.000**.

## Fungsi yang dapat didemokan
- Navigasi antarhalaman, filter kategori, product card dengan pola konsisten
- Keranjang: tambah, ubah jumlah, hapus, hitung total, cek stok
- Form checkout dengan validasi (nama, email, alamat, kota wajib diisi; format email dicek)
- Simulasi pembayaran berhasil dan gagal
- Layout responsif (3 kolom desktop → 2 kolom tablet → 1 kolom mobile)
