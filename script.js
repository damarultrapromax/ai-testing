/* ============ KONFIGURASI ============ */
const WA_NUMBER = "6285852510445"; // Ganti nomor WhatsApp UMKM kamu (format 62...)

const PRODUCTS = [
  { id: 1,  name: "Nasi Rendang Sapi",      cat: "nasi",   price: 35000, emoji: "🍛", tag: "Best Seller", desc: "Rendang empuk 4 jam, nasi puluk, sambal ijo." },
  { id: 2,  name: "Nasi Ayam Penyet",       cat: "nasi",   price: 25000, emoji: "🍗", tag: "",             desc: "Ayam goreng krispi, penyet sambal bawang, lalapan." },
  { id: 3,  name: "Nasi Goreng Kampung",    cat: "nasi",   price: 22000, emoji: "🍚", tag: "",             desc: "Nasi goreng telur, ayam suwir, acar, kerupuk." },
  { id: 4,  name: "Soto Betawi",            cat: "kuah",   price: 28000, emoji: "🍲", tag: "Favorit",      desc: "Kuah santan gurih, daging sapi, kentang, bawang goreng." },
  { id: 5,  name: "Mie Ayam Jamur",         cat: "kuah",   price: 20000, emoji: "🍜", tag: "",             desc: "Mie kenyal, kuah kaldu ayam, topping jamur & bakso." },
  { id: 6,  name: "Soto Ayam Lamongan",     cat: "kuah",   price: 22000, emoji: "🥘", tag: "",             desc: "Kuah bening kuning, suwiran ayam, koya gurih." },
  { id: 7,  name: "Batagor Kuah",           cat: "snack",  price: 18000, emoji: "🥟", tag: "",             desc: "Batagor ikan tenggiri, bumbu kacang, kuah cuko." },
  { id: 8,  name: "Pisang Goreng Crispy",   cat: "snack",  price: 15000, emoji: "🍌", tag: "Baru",         desc: "Pisang kepok manis, balutan tepung renyah." },
  { id: 9,  name: "Cireng Bumbu Rujak",     cat: "snack",  price: 14000, emoji: "🍡", tag: "",             desc: "Cireng kenyal luar renyah, cocolan bumbu rujak pedas." },
  { id: 10, name: "Es Teh Manis Jumbo",     cat: "minum",  price: 8000,  emoji: "🧋", tag: "",             desc: "Teh melati diseduh segar, ukuran jumbo 500ml." },
  { id: 11, name: "Es Jeruk Peras",         cat: "minum",  price: 12000, emoji: "🍊", tag: "",             desc: "Jeruk peras asli, tanpa pemanis buatan." },
  { id: 12, name: "Es Kopi Susu Gula Aren", cat: "minum",  price: 16000, emoji: "☕", tag: "Best Seller", desc: "Kopi robusta lokal, susu segar, gula aren asli." },
];

const GALLERY = [
  { emoji: "👨‍🍳", cap: "Proses masak" },
  { emoji: "🍲", cap: "Soto Betawi" },
  { emoji: "🍛", cap: "Rendang sapi" },
  { emoji: "🍗", cap: "Ayam penyet" },
  { emoji: "📦", cap: "Pesanan siap kirim" },
  { emoji: "🍜", cap: "Mie ayam jamur" },
  { emoji: "🧋", cap: "Es kopisusu" },
  { emoji: "❤️", cap: "Pelanggan puas" },
];

const TESTIMONIALS = [
  { name: "Rina Marlina", role: "Pelanggan tetap", stars: 5, text: "Rendangnya beneran empuk dan bumbunya meresap. Sudah langganan tiap akhir pekan, selalu datang hangat dan tepat waktu." },
  { name: "Budi Santoso", role: "Pesanan kantor", stars: 5, text: "Pesan 20 porsi buat rapat kantor, semua rapi dikemas dan pelayanannya cepat. Admin ramah banget di WhatsApp." },
  { name: "Dewi Anggraini", role: "Pelanggan baru", stars: 4, text: "Soto Betawinya gurih pas, porsinya besar. Recommended buat yang cari makanan rumahan higienis di sekitar Sukamaju." },
];

const rupiah = n => "Rp " + n.toLocaleString("id-ID");

/* ============ STATE ============ */
let cart = [];
let activeFilter = "all";

/* ============ RENDER PRODUK ============ */
const grid = document.getElementById("productGrid");

function renderProducts() {
  const list = activeFilter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeFilter);
  if (!list.length) {
    grid.innerHTML = `<p class="empty">Belum ada menu di kategori ini.</p>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <article class="card">
      <div class="card-media">${p.emoji}${p.tag ? `<span class="tag">${p.tag}</span>` : ""}</div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="card-foot">
          <span class="price">${rupiah(p.price)}</span>
          <button class="add-btn" data-add="${p.id}">+ Keranjang</button>
        </div>
      </div>
    </article>`).join("");
}

document.getElementById("filters").addEventListener("click", e => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === btn));
  renderProducts();
});

grid.addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  addToCart(Number(btn.dataset.add));
  btn.textContent = "Ditambahkan ✓";
  btn.classList.add("added");
  setTimeout(() => { btn.textContent = "+ Keranjang"; btn.classList.remove("added"); }, 1200);
});

/* ============ KERANJANG ============ */
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl  = document.getElementById("cartCount");
const cartTotalEl  = document.getElementById("cartTotal");

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ ...PRODUCTS.find(p => p.id === id), qty: 1 });
  updateCart();
  toast("Ditambahkan ke keranjang");
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateCart();
}

function updateCart() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  cartCountEl.textContent = totalQty;
  cartTotalEl.textContent = rupiah(total);

  cartItemsEl.innerHTML = cart.length
    ? cart.map(i => `
      <div class="cart-item">
        <div class="emo">${i.emoji}</div>
        <div>
          <div class="nm">${i.name}</div>
          <div class="pr">${rupiah(i.price)}</div>
        </div>
        <div class="qty">
          <button data-qty="${i.id}" data-delta="-1">−</button>
          <span>${i.qty}</span>
          <button data-qty="${i.id}" data-delta="1">+</button>
        </div>
      </div>`).join("")
    : `<div class="cart-empty"><span class="big">🛒</span>Keranjangmu masih kosong.<br />Yuk pilih menu favoritmu!</div>`;
}

cartItemsEl.addEventListener("click", e => {
  const btn = e.target.closest("[data-qty]");
  if (btn) changeQty(Number(btn.dataset.qty), Number(btn.dataset.delta));
});

document.getElementById("clearCart").addEventListener("click", () => {
  cart = []; updateCart(); toast("Keranjang dikosongkan");
});

/* ============ CHECKOUT WHATSAPP ============ */
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return toast("Keranjang masih kosong");

  const note = document.getElementById("cartNote").value.trim();
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);

  let msg = "Halo Dapur Nusa, saya mau pesan:%0A%0A";
  cart.forEach(i => { msg += `${i.qty}x ${i.name} — ${rupiah(i.qty * i.price)}%0A`; });
  msg += `%0ATotal: ${rupiah(total)}`;
  if (note) msg += `%0A%0ACatatan: ${encodeURIComponent(note)}`;
  msg += "%0A%0ATerima kasih!";

  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
});

/* ============ DRAWER ============ */
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const openDrawer  = () => { drawer.classList.add("open"); overlay.classList.add("open"); };
const closeDrawer = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); };

document.getElementById("cartBtn").addEventListener("click", openDrawer);
document.getElementById("closeCart").addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

/* ============ GALERI & TESTIMONI ============ */
document.getElementById("gallery").innerHTML = GALLERY.map(g => `
  <figure class="gal-item">${g.emoji}<figcaption>${g.cap}</figcaption></figure>`).join("");

document.getElementById("testiGrid").innerHTML = TESTIMONIALS.map(t => `
  <div class="testi">
    <div class="stars">${"★".repeat(t.stars)}${"☆".repeat(5 - t.stars)}</div>
    <p>“${t.text}”</p>
    <div class="testi-user">
      <div class="avatar">${t.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>
      <div><b>${t.name}</b><span>${t.role}</span></div>
    </div>
  </div>`).join("");

/* ============ LINK WA ============ */
document.querySelectorAll(".wa-link").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(a.dataset.pesan || "Halo!")}`, "_blank");
  });
});

/* ============ FORM KONTAK ============ */
document.getElementById("kontakForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  const msg = `Halo Dapur Nusa!%0A%0ANama: ${encodeURIComponent(f.nama.value)}%0AWA: ${encodeURIComponent(f.wa.value)}%0APesan: ${encodeURIComponent(f.pesan.value)}`;
  document.getElementById("formNote").hidden = false;
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  f.reset();
});

/* ============ NAV / TOAST / MISC ============ */
const navLinks = document.getElementById("navLinks");
document.getElementById("navToggle").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.addEventListener("click", e => { if (e.target.tagName === "A") navLinks.classList.remove("open"); });

window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 8);
});

let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2000);
}

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
updateCart();
