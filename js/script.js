// ===== Data produk (simulasi, belum dari database) =====
const PRODUCTS = [
  {id:1,name:'Tumbler',cat:'Perlengkapan',price:50000,stock:25,icon:'🥤',bg:'#cfe8e4',desc:'Botol minum stainless 500 ml, tahan panas dan dingin.'},
  {id:2,name:'Totebag',cat:'Pakaian & Aksesori',price:75000,stock:30,icon:'👜',bg:'#f6e3b4',desc:'Tas kanvas tebal dengan sablon logo kampus.'},
  {id:3,name:'Kaos',cat:'Pakaian & Aksesori',price:90000,stock:20,icon:'👕',bg:'#d9e2f3',desc:'Kaos katun nyaman, tersedia ukuran S–XL.'},
  {id:4,name:'Topi',cat:'Pakaian & Aksesori',price:45000,stock:15,icon:'🧢',bg:'#f3d6d2',desc:'Topi baseball bordir logo, ukuran bisa diatur.'},
  {id:5,name:'Buku Catatan',cat:'Perlengkapan',price:25000,stock:40,icon:'📓',bg:'#e4ddf3',desc:'Buku catatan 100 halaman bersampul keras.'},
  {id:6,name:'Lanyard',cat:'Perlengkapan',price:15000,stock:0,icon:'🎫',bg:'#dfe6e8',desc:'Tali ID card dengan tulisan nama kampus.'}
];

// ===== Helper =====
const $ = (s, r = document) => r.querySelector(s);
const rp = n => 'Rp' + n.toLocaleString('id-ID');
const find = id => PRODUCTS.find(p => p.id == id);
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};
const getStock = id => { const s = store.get('stock', {}); return s[id] ?? find(id).stock; };
const cart = () => store.get('cart', []);
const cartTotal = () => cart().reduce((t, i) => t + find(i.id).price * i.qty, 0);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toast(msg, isErr) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
  t.textContent = msg; t.className = isErr ? 'show err' : 'show';
  clearTimeout(t._t); t._t = setTimeout(() => t.className = '', 2500);
}
function updateBadge() {
  $('#cart-count').textContent = cart().reduce((t, i) => t + i.qty, 0);
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => { if (a.getAttribute('href') === here) a.classList.add('active'); });
}
function addToCart(id, qty = 1) {
  const c = cart(), it = c.find(i => i.id == id), n = (it ? it.qty : 0) + qty;
  if (n > getStock(id)) return toast('Jumlah melebihi stok yang tersedia.', true);
  if (it) it.qty = n; else c.push({id: +id, qty});
  store.set('cart', c); updateBadge(); toast('Produk ditambahkan ke keranjang.');
}
function showErrors(form, errs) {
  [...form.elements].forEach(el => {
    if (!el.name) return;
    const e = $('#e-' + el.name); if (!e) return;
    e.textContent = errs[el.name] || ''; el.setAttribute('aria-invalid', !!errs[el.name]);
  });
  return !Object.keys(errs).length;
}

// ===== Halaman: Home =====
function card(p) {
  const out = getStock(p.id) < 1;
  return `<article class="card">
    <a class="thumb" href="product.html?id=${p.id}" style="background:${p.bg}" aria-label="Lihat ${p.name}"><span aria-hidden="true">${p.icon}</span></a>
    <div class="card-body"><h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p class="muted">${p.desc}</p><p class="price">${rp(p.price)}</p>
      <div class="actions"><a class="btn ghost" href="product.html?id=${p.id}">Lihat Detail</a>
      <button class="btn" data-add="${p.id}" ${out ? 'disabled' : ''}>${out ? 'Stok habis' : 'Tambah ke Keranjang'}</button></div></div></article>`;
}
function initHome() {
  const sel = $('#filter'), list = $('#product-list');
  [...new Set(PRODUCTS.map(p => p.cat))].forEach(c => sel.add(new Option(c, c)));
  const draw = () => list.innerHTML = PRODUCTS.filter(p => !sel.value || p.cat === sel.value).map(card).join('');
  sel.onchange = draw; draw();
  list.onclick = e => { const b = e.target.closest('[data-add]'); if (b) addToCart(b.dataset.add); };
}

// ===== Halaman: Detail produk =====
function initProduct() {
  const p = find(new URLSearchParams(location.search).get('id')), box = $('#product-detail');
  if (!p) { box.innerHTML = '<p class="empty">Produk tidak ditemukan. <a href="index.html#katalog">Lihat katalog</a></p>'; return; }
  const st = getStock(p.id);
  box.innerHTML = `<div class="thumb" style="background:${p.bg}" aria-hidden="true">${p.icon}</div>
    <div><h1>${p.name}</h1><p class="muted">${p.cat}</p><p class="price">${rp(p.price)}</p><p>${p.desc}</p>
    <p>${st ? 'Stok: ' + st : 'Stok habis'}</p>
    <label for="qty">Jumlah</label> <input class="qty" type="number" id="qty" min="1" max="${st}" value="1" ${st ? '' : 'disabled'}>
    <div class="actions" style="margin-top:1rem"><button class="btn" id="add" ${st ? '' : 'disabled'}>Tambah ke Keranjang</button>
    <a class="btn ghost" href="cart.html">Lihat Keranjang</a></div></div>`;
  $('#add')?.addEventListener('click', () => {
    const q = parseInt($('#qty').value, 10);
    if (!q || q < 1) return toast('Jumlah minimal 1.', true);
    addToCart(p.id, q);
  });
}

// ===== Halaman: Keranjang =====
function initCart() {
  const box = $('#cart-box');
  const draw = () => {
    const c = cart();
    if (!c.length) { box.innerHTML = '<div class="empty"><p>Keranjang masih kosong.</p><a class="btn" href="index.html#katalog">Pilih produk</a></div>'; return; }
    box.innerHTML = `<table><thead><tr><th>Produk</th><th>Harga</th><th>Jumlah</th><th>Subtotal</th><th></th></tr></thead><tbody>` +
      c.map(i => { const p = find(i.id); return `<tr><td>${p.name}</td><td>${rp(p.price)}</td>
        <td><input type="number" min="1" max="${getStock(p.id)}" value="${i.qty}" data-qty="${p.id}" aria-label="Jumlah ${p.name}"></td>
        <td>${rp(p.price * i.qty)}</td><td><button class="btn danger" data-del="${p.id}">Hapus</button></td></tr>`; }).join('') +
      `</tbody></table><div class="cart-foot"><p class="total">Total: ${rp(cartTotal())}</p><a class="btn" href="checkout.html">Lanjut Checkout</a></div>`;
  };
  box.onchange = e => {
    const id = e.target.dataset.qty; if (!id) return;
    const c = cart(), it = c.find(i => i.id == id), q = parseInt(e.target.value, 10);
    if (!q || q < 1) toast('Jumlah minimal 1.', true);
    else if (q > getStock(id)) toast('Jumlah melebihi stok yang tersedia.', true);
    else it.qty = q;
    store.set('cart', c); updateBadge(); draw();
  };
  box.onclick = e => {
    const id = e.target.dataset.del; if (!id) return;
    store.set('cart', cart().filter(i => i.id != id)); updateBadge(); draw(); toast('Produk dihapus dari keranjang.');
  };
  draw();
}

// ===== Halaman: Checkout (alur: Checkout → pilih metode → proses bayar → berhasil?) =====
function summaryHTML(items, total) {
  return `<ul>${items.map(i => `<li><span>${i.name} × ${i.qty}</span><span>${rp(i.price * i.qty)}</span></li>`).join('')}</ul>
    <p class="total"><span>Total</span><span>${rp(total)}</span></p>`;
}
function initCheckout() {
  const box = $('#checkout-box');
  const draw = () => {
    const o = store.get('order', null);
    if (o) return drawPayment(o);
    const c = cart();
    if (!c.length) { box.innerHTML = '<div class="empty"><p>Belum ada produk untuk di-checkout.</p><a class="btn" href="index.html#katalog">Pilih produk</a></div>'; return; }
    const items = c.map(i => ({id: i.id, name: find(i.id).name, price: find(i.id).price, qty: i.qty}));
    box.innerHTML = `<div class="checkout"><form id="co-form" class="form" novalidate><h2>Data pelanggan dan pengiriman</h2>
      <label for="nama">Nama</label><input id="nama" name="nama" autocomplete="name"><small class="error" id="e-nama"></small>
      <label for="email">Email</label><input type="email" id="email" name="email" autocomplete="email"><small class="error" id="e-email"></small>
      <label for="alamat">Alamat</label><input id="alamat" name="alamat" autocomplete="street-address"><small class="error" id="e-alamat"></small>
      <label for="kota">Kota</label><input id="kota" name="kota" autocomplete="address-level2"><small class="error" id="e-kota"></small>
      <button class="btn" type="submit">Buat Pesanan</button></form>
      <aside class="summary"><h2>Ringkasan pesanan</h2>${summaryHTML(items, cartTotal())}</aside></div>`;
    $('#co-form').onsubmit = e => {
      e.preventDefault();
      const f = e.target, v = n => f[n].value.trim(), errs = {};
      if (!v('nama')) errs.nama = 'Nama wajib diisi.';
      if (!EMAIL_RE.test(v('email'))) errs.email = 'Isi email dengan format nama@contoh.com.';
      if (!v('alamat')) errs.alamat = 'Alamat wajib diisi.';
      if (!v('kota')) errs.kota = 'Kota wajib diisi.';
      if (!showErrors(f, errs)) return toast('Periksa kembali data yang ditandai.', true);
      const habis = items.find(i => i.qty > getStock(i.id));
      if (habis) return toast('Stok ' + habis.name + ' kurang. Kurangi jumlah di keranjang.', true);
      // Simpan ORDERS (PENDING) + ORDER_DETAIL, lalu kosongkan CART
      store.set('order', {no: 'ORD-' + String(Date.now()).slice(-6), items, total: cartTotal(), status: 'PENDING', payment: null,
        ship: {nama: v('nama'), email: v('email'), alamat: v('alamat'), kota: v('kota')}});
      store.set('cart', []); updateBadge(); draw();
    };
  };
  function drawPayment(o) {
    const open = o.status === 'PENDING' || o.status === 'PAYMENT_FAILED';
    box.innerHTML = `<div class="checkout"><section class="form"><h2>Pembayaran</h2>
      <p class="note">Pembayaran ini <strong>simulasi sistem</strong>. Tidak ada uang yang ditransfer.</p>
      <p>No. pesanan: <strong>${o.no}</strong><br>Status pesanan: <span class="badge ${o.status}">${o.status}</span>
      ${o.payment ? `<br>Status pembayaran: <span class="badge ${o.payment.status}">${o.payment.status}</span>` : ''}</p>
      ${o.status === 'PAYMENT_FAILED' ? '<p class="msg bad">Pembayaran gagal. Coba bayar lagi atau batalkan pesanan.</p>' : ''}
      ${o.status === 'PAID' ? `<p class="msg ok">Pembayaran berhasil. Pesanan akan diproses dan dikirim ke ${o.ship.kota}.</p>
        <a class="btn" href="index.html" data-reset>Belanja lagi</a>` : ''}
      ${open ? `<label for="method">Metode pembayaran</label>
        <select id="method"><option>Transfer Bank</option><option>E-Wallet</option></select>
        <label for="hasil">Hasil simulasi</label>
        <select id="hasil"><option value="ok">Pembayaran berhasil</option><option value="fail">Pembayaran gagal</option></select>
        <button class="btn" id="pay">Proses Pembayaran (simulasi)</button>
        ${o.status === 'PAYMENT_FAILED' ? '<button class="btn danger" id="cancel">Batalkan Pesanan</button>' : ''}` : ''}
      </section><aside class="summary"><h2>Ringkasan pesanan</h2>${summaryHTML(o.items, o.total)}
      <p class="muted">Dikirim ke: ${o.ship.nama}, ${o.ship.alamat}, ${o.ship.kota}</p></aside></div>`;
    if (o.payment && $('#method')) $('#method').value = o.payment.method;
    $('#pay')?.addEventListener('click', e => {
      e.target.disabled = true; e.target.textContent = 'Memproses...';
      const method = $('#method').value, ok = $('#hasil').value === 'ok';
      setTimeout(() => {
        // Relasi ORDERS–PAYMENT 1:1: record PAYMENT yang sama diperbarui saat coba bayar lagi
        o.payment = Object.assign(o.payment || {}, {method, amount: o.total, status: ok ? 'SUCCESS' : 'FAILED'});
        o.status = ok ? 'PAID' : 'PAYMENT_FAILED';
        if (ok) { const s = store.get('stock', {}); o.items.forEach(i => s[i.id] = getStock(i.id) - i.qty); store.set('stock', s); }
        store.set('order', o); draw();
      }, 800);
    });
    $('#cancel')?.addEventListener('click', () => { store.set('order', null); draw(); toast('Pesanan dibatalkan (CANCELLED).'); });
    $('[data-reset]')?.addEventListener('click', () => store.set('order', null));
  }
  draw();
}

// ===== Mulai =====
document.addEventListener('DOMContentLoaded', () => {
  updateBadge();
  ({home: initHome, product: initProduct, cart: initCart, checkout: initCheckout})[document.body.dataset.page]?.();
});
