// ================= DATA PRODUK =================
const produk = [
  {
    id: 1,
    nama: "Facial Wash",
    harga: 35000,
    promo: 12,
    kategori: "Facial Wash",
    gambarList: [
      "images/facial-wash-1.jpg",
      "images/facial-wash-2.jpg",
      "images/facial-wash-3.jpg"
    ],
    deskripsi: "Membersihkan kotoran dan minyak berlebih dari wajah.",
    spesifikasi: [
      "Isi: 100ml",
      "Cocok untuk semua jenis kulit",
      "Mengandung aloe vera"
    ]
  },
  {
    id: 2,
    nama: "Toner",
    harga: 45000,
    promo: 15,
    kategori: "Toner",
    gambarList: [
      "images/toner-1.jpg",
      "images/toner-2.jpg",
      "images/toner-3.jpg"
    ],
    deskripsi: "Membersihkan kotoran dan minyak berlebih dari wajah.",
    spesifikasi: [
      "Isi: 100ml",
      "Cocok untuk semua jenis kulit",
      "Mengandung aloe vera"
    ]
  },
  {
    id: 3,
    nama: "Sunscreen",
    harga: 30000,
    promo: 8,
    kategori: "Sunscreen",
    gambarList: [
      "images/sunscreen-1.jpg",
      "images/sunscreen-2.jpg"
    ],
    deskripsi: "Melindungi kulit dari paparan sinar matahari.",
    spesifikasi: [
      "SPF 30",
      "Ringan & tidak lengket",
      "Cocok untuk semua jenis kulit"
    ]
  },
  {
    id: 4,
    nama: "Moisturizer",
    harga: 60000,
    promo: 20,
    kategori: "Moisturizer",
    gambarList: [
      "images/moisturizer-1.png",
      "images/moisturizer-2.png"
    ],
    deskripsi: "Melembapkan kulit sepanjang hari.",
    spesifikasi: [
      "Isi: 50ml",
      "Tekstur ringan",
      "Cepat meresap"
    ]
  },
  {
    id: 5,
    nama: "Serum",
    harga: 150000,
    promo: 20,
    kategori: "Serum",
    gambarList: [
      "images/serum-1.jpg",
      "images/serum-2.jpg"
    ],
    deskripsi: "Membantu menutrisi kulit secara mendalam.",
    spesifikasi: [
      "Isi: 30ml",
      "Mengandung vitamin C",
      "Mencerahkan kulit"
    ]
  }
];

// ================= ONGKIR =================
const ongkirKota = {
  Jakarta: 10000,
  Bandung: 12000,
  Bekasi: 11000,
  Surabaya: 18000,
  Yogyakarta: 15000
};

let kotaTerpilih = "";

// ================= HARGA =================
function hitungHarga(item) {
  if(item.promo && item.promo>0){
    return Math.round(item.harga*(100-item.promo)/100);
  }
  return item.harga;
}

// ================= KERANJANG =================
let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
function simpanKeranjang(){ localStorage.setItem("keranjang", JSON.stringify(keranjang)); }

// ================= ELEMENT =================
const produkList = document.getElementById("produk-list");
const cartPopup = document.getElementById("cartPopup");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const searchInput = document.getElementById("search");

// ================= KATEGORI =================
let kategoriAktif = "Semua";
function filterKategori(kategori){
  kategoriAktif = kategori;
  produkList.innerHTML="";
  const filtered = kategori==="Semua"? produk : produk.filter(p=>p.kategori===kategori);
  filtered.forEach(p=>tampilkanProduk(p));
}

// ================= PRODUK LIST =================
let produkQty={};
produk.forEach(p=>produkQty[p.id]=1);

function tampilkanProduk(item){
  const div = document.createElement("div");
  div.className="produk";
  const hargaAkhir=hitungHarga(item);
  div.innerHTML=`
    ${item.promo>0?`<span class="badge-promo">-${item.promo}%</span>`:""}
    <img src="${item.gambarList[0]}">
    <h3>${item.nama}</h3>
    ${item.promo>0?`<p><span class="harga-awal">Rp ${item.harga.toLocaleString("id-ID")}</span><br><span class="harga-promo">Rp ${hargaAkhir.toLocaleString("id-ID")}</span></p>`:
    `<p class="harga-promo">Rp ${item.harga.toLocaleString("id-ID")}</p>`}
    <div class="qty-control">
      <button onclick="event.stopPropagation(); ubahQtyProduk(${item.id},-1)">-</button>
      <span id="qty-${item.id}">1</span>
      <button onclick="event.stopPropagation(); ubahQtyProduk(${item.id},1)">+</button>
    </div>
    <button onclick="event.stopPropagation(); tambahKeKeranjang(${item.id})">Tambah ke Keranjang</button>
  `;
  div.onclick=()=>showDetail(item.id);
  produkList.appendChild(div);
}
produk.forEach(p=>tampilkanProduk(p));

// ================= QTY PRODUK =================
function ubahQtyProduk(id,delta){
  produkQty[id]=Math.max(1,produkQty[id]+delta);
  document.getElementById(`qty-${id}`).textContent=produkQty[id];
}

// ================= DETAIL PRODUK =================
let selectedProduct=null;
let qtyDetail=1;
let slideInterval=null;

function showDetail(id){
  selectedProduct=produk.find(p=>p.id===id);
  qtyDetail=1;
  const imgEl=document.getElementById("detail-img");
  imgEl.src=selectedProduct.gambarList[0];
  document.getElementById("detail-nama").textContent=selectedProduct.nama;
  const hargaAkhir=hitungHarga(selectedProduct);
  document.getElementById("detail-harga").innerHTML=
    selectedProduct.promo>0?`<span class="harga-awal">Rp ${selectedProduct.harga.toLocaleString("id-ID")}</span><br>
    <span class="harga-promo">Rp ${hargaAkhir.toLocaleString("id-ID")}</span>`:
    `Rp ${selectedProduct.harga.toLocaleString("id-ID")}`;
  document.getElementById("detail-deskripsi").textContent=selectedProduct.deskripsi;
  const spec=document.getElementById("detail-spesifikasi");
  spec.innerHTML="";
  selectedProduct.spesifikasi.forEach(s=>{const li=document.createElement("li");li.textContent=s;spec.appendChild(li);});
  document.getElementById("qty-detail").textContent=qtyDetail;
  document.getElementById("productDetailModal").style.display="block";

  // AUTO SLIDE GAMBAR DETAIL
  let index=0;
  clearInterval(slideInterval);
  slideInterval=setInterval(()=>{
    index=(index+1)%selectedProduct.gambarList.length;
    imgEl.src=selectedProduct.gambarList[index];
  },3000);
}

function closeDetail(){
  document.getElementById("productDetailModal").style.display="none";
  clearInterval(slideInterval);
}

function ubahQtyProdukDetail(delta){
  qtyDetail=Math.max(1,qtyDetail+delta);
  document.getElementById("qty-detail").textContent=qtyDetail;
}

// ================= TAMBAH KE KERANJANG =================
function tambahKeKeranjang(id){
  const p=produk.find(x=>x.id===id);
  const qty=produkQty[id];
  const exist=keranjang.find(x=>x.id===id);
  if(exist) exist.quantity+=qty;
  else keranjang.push({id,quantity:qty});
  simpanKeranjang();
  renderCart();
  showToast(`✅ ${p.nama} ditambahkan (x${qty})`);
}

function tambahKeKeranjangDetail(){
  if(!selectedProduct) return;
  const exist=keranjang.find(x=>x.id===selectedProduct.id);
  if(exist) exist.quantity+=qtyDetail;
  else keranjang.push({id:selectedProduct.id,quantity:qtyDetail});
  simpanKeranjang();
  renderCart();
  closeDetail();
  showToast(`✅ ${selectedProduct.nama} ditambahkan (x${qtyDetail})`);
}

// ================= CART RENDER =================
function renderCart(){
  cartItems.innerHTML="";
  let total=0;
  keranjang.forEach((item,i)=>{
    const p=produk.find(x=>x.id===item.id);
    if(!p) return;
    const harga=hitungHarga(p);
    const subtotal=harga*item.quantity;
    total+=subtotal;
    cartItems.innerHTML+=`
      <div class="cart-item">
        <img src="${p.gambarList[0]}">
        <div class="cart-info">
          <p>${p.nama}</p>
          <p>Rp ${harga.toLocaleString("id-ID")} x ${item.quantity} = <strong>Rp ${subtotal.toLocaleString("id-ID")}</strong></p>
          <button onclick="ubahQtyCart(${i},-1)">-</button>
          <button onclick="ubahQtyCart(${i},1)">+</button>
          <button onclick="hapusItem(${i})">Hapus</button>
        </div>
      </div>
    `;
  });
  const ongkir=kotaTerpilih?ongkirKota[kotaTerpilih]:0;
  cartTotal.textContent="Total: Rp "+(total+ongkir).toLocaleString("id-ID");
  cartCount.textContent=keranjang.length;
}

function ubahQtyCart(i,d){
  keranjang[i].quantity=Math.max(1,keranjang[i].quantity+d);
  simpanKeranjang();
  renderCart();
}

function hapusItem(i){
  keranjang.splice(i,1);
  simpanKeranjang();
  renderCart();
}

// ================= CART POPUP =================
function toggleCart(){
  cartPopup.classList.toggle("active");
  renderCart();
}

// ================= ONGKIR UI =================
const ongkirUI=document.createElement("div");
ongkirUI.className="ongkir-section";
ongkirUI.innerHTML=`
  <label>Pilih Kota:</label>
  <select onchange="pilihKota(this.value)">
    <option value="">-- Pilih Kota --</option>
    ${Object.keys(ongkirKota).map(k=>`<option value="${k}">${k}</option>`).join("")}
  </select>
  <p id="ongkir-info"></p>
`;
cartPopup.insertBefore(ongkirUI, cartTotal);

function pilihKota(kota){
  kotaTerpilih=kota;
  document.getElementById("ongkir-info").textContent=kota?`Ongkir: Rp ${ongkirKota[kota].toLocaleString("id-ID")}`:"";
  renderCart();
}

// ================= SEARCH =================
searchInput.addEventListener("input",()=>{
  const keyword=searchInput.value.toLowerCase();
  produkList.innerHTML="";
  produk.filter(p=>p.nama.toLowerCase().includes(keyword)).forEach(p=>tampilkanProduk(p));
});

// ================= TOAST =================
function showToast(msg){
  const t=document.getElementById("toast");
  t.textContent=msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2000);
}

// ================= CHECKOUT =================
function checkout(){
  if(keranjang.length===0){ showToast("⚠️ Keranjang masih kosong"); return; }
  showToast("🎉 Checkout berhasil!");
  keranjang=[]; kotaTerpilih=""; simpanKeranjang(); renderCart();
}

// ================= INIT =================
renderCart();
