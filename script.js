const kategoributonlar = document.querySelector("#kategoributonlar")
const lds_roller = document.querySelector(".lds-roller")
const hamburger = document.querySelector(".hamburger")
const hamburger_menu = document.querySelector(".hamburgermenu")
const ilanlarcontainer = document.querySelector(".ilanlarcontainer")
const tumubtn = document.querySelector("#tumubtn")
let gorevlistesicontainer = document.querySelector(".gorevlistesicontainer")
let internetDurumu = document.querySelector(".internetDurumu")
let online_offline=document.querySelector(".internet h3")
let modebtn = document.querySelector(".mode button")  
let mod="light"
let gorevlistesi = []

let filtrelenmiş_ilanlar = []
let data = []
let tamamlamabutonlari=[]

const kategorilertr = {
  tumu: "TÜMÜ",
  gida: "GIDA",
  barinma: "BARINMA",
  saglik: "SAĞLIK",
  hayvanlar: "HAYVANLAR",
  egitim: "EĞİTİM",
  esya: "EŞYA",
  psikoloji: "PSİKOLOJİ",
  lojistik: "LOJİSTİK",
  cocuk: "ÇOCUK",
  is: "İŞ",
}

let btnliste = [tumubtn]
let kategorilerlistesi = ["tumu"]
let isloading = true
let kategori = ""

tumubtn.dataset.key = "tumu"

//veriler yüklenen kadar yükleniyor animasyonu göster
function toggleloading() {
  if (isloading) {
    lds_roller.style.display = "none"
    isloading = false
  }
}

// Aynı kategoriden buton oluşturulmasını engelle
function btntekrarettimi(btn) {
  for (const buton of btnliste) {
    if (buton.dataset.key === btn.dataset.key) {
      return true
    }
  }
  return false
}

// Kategoriye göre ilanları filtrele ve göster
async function kategoriyegorefiltrele(kategoriKey) {
  data = JSON.parse(localStorage.getItem("data")) || []
  gorevlistesi = JSON.parse(localStorage.getItem("gorevlistesi") || "[]")
  ilanlarcontainer.innerHTML = ""
  ilanlarcontainer.style.display = "flex"
  
  mod = localStorage.getItem("mod") || "light"
  if(mod === "dark"){
  document.body.classList.add("dark-mode")
  modebtn.classList.add("dark-mode")
  modebtn.textContent="☀️"
  }else{
    document.body.classList.remove("dark-mode")
    modebtn.classList.remove("dark-mode")
    modebtn.textContent="🌙"
  }

  if (kategoriKey === "tumu") {
    tumubtn.classList.add("active")
    tumilanlargoster()
    return
  }else{
    tumubtn.classList.remove("active")
  }
  
  // Veriyi filtrele
  filtrelenmiş_ilanlar = data.filter(
    ilan => ilan?.kategori?.toLowerCase() === kategoriKey
  )


   // Filtrelenmiş veriyi DOM'a bas
  for (let index = 0; index < filtrelenmiş_ilanlar.length; index++) {
    const currentIlan = filtrelenmiş_ilanlar[index];

    const ilan = document.createElement("div")
    const ilan_header = document.createElement("div")
    ilan_header.classList.add("ilan_header")
    ilan.classList.add("ilan")

    const ilan_kategori = document.createElement("div")
    ilan_kategori.classList.add("ilan_kategori")
    ilan_kategori.textContent =
      kategorilertr[currentIlan.kategori?.toLowerCase()] || ""

    const ilan_konum = document.createElement("div")
    ilan_konum.classList.add("ilan_konum")
    ilan_konum.innerHTML = `
      <img src="konum_16.png" alt="konum">
      <span>${currentIlan.konum}</span>
    `

    ilan_header.appendChild(ilan_kategori)
    ilan_header.appendChild(ilan_konum)
    ilan.appendChild(ilan_header)

    const ilan_body = document.createElement("div")
    ilan_body.classList.add("ilan_body")
    ilan_body.innerHTML = `
      <h3>${currentIlan.baslik}</h3>
      <p>${currentIlan.detay}</p>
    `
    ilan.appendChild(ilan_body)

    const ilan_footer = document.createElement("button")
    ilan_footer.textContent = "GÖREV OLARAK ÜSTLEN"
    ilan_footer.classList.add("ilan_footer")

    if (currentIlan.acil === true) {
      ilan.classList.add("acil")
      ilan.style.border = "3px solid #e41414"
    }

    ilan.appendChild(ilan_footer)
    ilanlarcontainer.appendChild(ilan)

    if(gorevlistesi.includes(currentIlan.baslik)){
      ilan_footer.classList.add("disabled")
      ilan_footer.style.boxShadow = "none"
    }
    
    // Görev olarak üstlen butonuna tıklandığında görev listesine ekle
    ilan_footer.addEventListener("click", () => {
     
      gorevlistesicontainer.style.display = "flex"
  
     if(navigator.onLine === false){
      alert("İnternet bağlantısı yok.")
      return
     }else{
       const eklencek_gorev = document.createElement("div")
      eklencek_gorev.classList.add("gorevlistesi_ilan")

      const gorev_baslik = document.createElement("h4")
      gorev_baslik.textContent = currentIlan.baslik
      eklencek_gorev.appendChild(gorev_baslik)

      const gorev_yeri = document.createElement("div")
      gorev_yeri.innerHTML = `
        <img src="konum_16.png" alt="konum">
        <span>${currentIlan.konum}</span>
      `
      eklencek_gorev.appendChild(gorev_yeri)

      const tamamla_btn = document.createElement("button")
      tamamla_btn.textContent = "TAMAMLA"
      tamamla_btn.classList.add("tamamlabtn")
      eklencek_gorev.appendChild(tamamla_btn)

     tamamlamabutonlari.push(tamamla_btn)

      if (currentIlan.acil === true) {
        eklencek_gorev.classList.add("acil")
      }
      
      // Tamamla butonuna tıklandığında görev listesinden kaldır
      tamamla_btn.addEventListener("click", () => {
        if(navigator.onLine === false){
          alert("İnternet bağlantısı yok.")
          return
        }else{
          gorevlistesicontainer.removeChild(eklencek_gorev)
        gorevlistesi = gorevlistesi.filter(item => item !== currentIlan.baslik)
        localStorage.setItem("gorevlistesi", JSON.stringify(gorevlistesi))
        }
        
      })
      gorevlistesicontainer.appendChild(eklencek_gorev)
      gorevlistesi.push(currentIlan.baslik)
      ilan_footer.classList.add("disabled")
      ilan_footer.style.boxShadow = "none"

      localStorage.setItem("gorevlistesi", JSON.stringify(gorevlistesi))
     }
     
    })
  }
}


// Tüm ilanları göster
async function render(data) {
  for (const element of data) {
    const li = document.createElement("li")
    const btn = document.createElement("button")

    const key = element?.kategori?.toLowerCase() || ""

    btn.textContent = kategorilertr[key] || ""
    btn.dataset.key = key

    if (!btntekrarettimi(btn)) {
      btnliste.push(btn)
      li.appendChild(btn)
      kategoributonlar.appendChild(li)
    }
    

  }


  kategoriyegorefiltrele("tumu")
}

// Tüm ilanları gösterme fonksiyonu (kategori filtresi olmadan)
async function tumilanlargoster() {
  data = JSON.parse(localStorage.getItem("data")) || []
  gorevlistesi = JSON.parse(localStorage.getItem("gorevlistesi") || "[]")

  ilanlarcontainer.innerHTML = ""
  ilanlarcontainer.style.display = "flex"

  mod = localStorage.getItem("mod") || "light"
  if(mod === "dark"){
  document.body.classList.add("dark-mode")
  modebtn.classList.add("dark-mode")
  modebtn.textContent="☀️"
  }else{
    document.body.classList.remove("dark-mode")
    modebtn.classList.remove("dark-mode")
    modebtn.textContent="🌙"
  }



  for (let index = 0; index < data.length; index++) {
    const currentIlan = data[index];

    const ilan = document.createElement("div")
    const ilan_header = document.createElement("div")
    ilan_header.classList.add("ilan_header")
    ilan.classList.add("ilan")

    const ilan_kategori = document.createElement("div")
    ilan_kategori.classList.add("ilan_kategori")
    ilan_kategori.textContent =
      kategorilertr[currentIlan.kategori?.toLowerCase()] || ""

    const ilan_konum = document.createElement("div")
    ilan_konum.classList.add("ilan_konum")
    ilan_konum.innerHTML = `
      <img src="konum_16.png" alt="konum">
      <span>${currentIlan.konum}</span>
    `

    ilan_header.appendChild(ilan_kategori)
    ilan_header.appendChild(ilan_konum)
    ilan.appendChild(ilan_header)

    const ilan_body = document.createElement("div")
    ilan_body.classList.add("ilan_body")
    ilan_body.innerHTML = `
      <h3>${currentIlan.baslik}</h3>
      <p>${currentIlan.detay}</p>
    `
    ilan.appendChild(ilan_body)

    const ilan_footer = document.createElement("button")
    ilan_footer.textContent = "GÖREV OLARAK ÜSTLEN"
    ilan_footer.classList.add("ilan_footer")

     // Acil ilanları kırmızıyla vurgula
    if (currentIlan.acil === true) {
      ilan.classList.add("acil")
      ilan.style.border = "3px solid #e41414"
    }

    ilan.appendChild(ilan_footer)
    ilanlarcontainer.appendChild(ilan)
   // Eğer ilan zaten görev listesinde ise butonu devre dışı bırak
    if(gorevlistesi.includes(currentIlan.baslik)){
      ilan_footer.classList.add("disabled")
      ilan_footer.style.boxShadow = "none"
    }

      // Görev olarak üstlen butonuna tıklandığında görev listesine ekle
    ilan_footer.addEventListener("click", () => {
   
  gorevlistesicontainer.style.display = "flex"
  // İnternet bağlantısı yoksa görev listesine ekleme ve uyarı göster
  if(navigator.onLine === false){
    alert("İnternet bağlantısı yok.")
    return 
   }else{
    const eklencek_gorev = document.createElement("div")
      eklencek_gorev.classList.add("gorevlistesi_ilan")

      const gorev_baslik = document.createElement("h4")
      gorev_baslik.textContent = currentIlan.baslik
      eklencek_gorev.appendChild(gorev_baslik)

      const gorev_yeri = document.createElement("div")
      gorev_yeri.innerHTML = `
        <img src="konum_16.png" alt="konum">
        <span>${currentIlan.konum}</span>
      `
      eklencek_gorev.appendChild(gorev_yeri)

      const tamamla_btn = document.createElement("button")
      tamamla_btn.textContent = "TAMAMLA"
      tamamla_btn.classList.add("tamamlabtn")
      eklencek_gorev.appendChild(tamamla_btn)

     tamamlamabutonlari.push(tamamla_btn)

      if (currentIlan.acil === true) {
        eklencek_gorev.classList.add("acil")
      }

      tamamla_btn.addEventListener("click", () => {
        if(navigator.onLine === false){
          alert("İnternet bağlantısı yok.")
          return
        }else{
           gorevlistesicontainer.removeChild(eklencek_gorev)
        gorevlistesi = gorevlistesi.filter(item => item !== currentIlan.baslik)
        localStorage.setItem("gorevlistesi", JSON.stringify(gorevlistesi))
        }
       
      })
      gorevlistesicontainer.appendChild(eklencek_gorev)

        gorevlistesi.push(currentIlan.baslik)
      
        ilan_footer.classList.add("disabled")

     localStorage.setItem("gorevlistesi", JSON.stringify(gorevlistesi))
  }
     
      
    })
  }
}


// API'den veri çekme fonksiyonu
async function fetchapi() {
  try {
    const response = await fetch("https://api.npoint.io/433d2b54b3c3bb324e23")
    data = await response.json()
    toggleloading()
    localStorage.setItem("data", JSON.stringify(data))
    return data
  } catch (error) {
    console.log("Hata oluştu:", error)
    return []
  }
}

// Uygulama başlangıcında çalışacak fonksiyon, verileri localStorage'dan alır, internet durumunu kontrol eder ve gerekli event listener'ları ekler
async function baslat() {

   // LocalStorage'dan veriyi al
  data = JSON.parse(localStorage.getItem("data") || "[]")
  kategori = localStorage.getItem("kategori") || ""
  gorevlistesi = JSON.parse(localStorage.getItem("gorevlistesi") || "[]")
  mod = localStorage.getItem("mod") || "light"
  if(mod === "dark"){
  document.body.classList.add("dark-mode")
  modebtn.classList.add("dark-mode")
  modebtn.textContent="☀️"
  }else{
    document.body.classList.remove("dark-mode")
    modebtn.classList.remove("dark-mode")
    modebtn.textContent="🌙"
  }

  internetdurumunukontrolet()

  if(navigator.onLine === false){
       if(data.length > 0){
         // Butonları ve ilanları render et
  render(data)
  toggleloading()

  // Eğer önceki kategori varsa aktif yap
  if (kategori) {
    kategoriyegorefiltrele(kategori)
    btnliste.forEach(btn => {
      if (btn.dataset.key === kategori)
         btn.classList.add("active")
    })
  }

  // Görev listesi DOM'a geri bas
  if (gorevlistesi.length > 0) {
    gorevlistesicontainer.style.display = "flex"
    gorevlistesi.forEach(baslik => {
      const ilanData = data.find(i => i.baslik === baslik)
      if (!ilanData) return
      const eklencek_gorev = document.createElement("div")
      eklencek_gorev.classList.add("gorevlistesi_ilan")
      if (ilanData.acil) eklencek_gorev.classList.add("acil")
      eklencek_gorev.innerHTML = `
        <h4>${ilanData.baslik}</h4>
        <div>
          <img src="konum_16.png" alt="konum">
          <span>${ilanData.konum}</span>
        </div>
      `
      const tamamla_btn = document.createElement("button")
      tamamla_btn.textContent = "TAMAMLA"
      tamamla_btn.classList.add("tamamlabtn")
      eklencek_gorev.appendChild(tamamla_btn)

     tamamlamabutonlari.push(tamamla_btn)

      tamamla_btn.addEventListener("click", () => {
        gorevlistesicontainer.removeChild(eklencek_gorev)
        gorevlistesi = gorevlistesi.filter(item => item !== baslik)
        localStorage.setItem("gorevlistesi", JSON.stringify(gorevlistesi))
      })

      gorevlistesicontainer.appendChild(eklencek_gorev)
    })
  }

  

  // kategori butonları click
  btnliste.forEach(buton => {
   buton.addEventListener("click", () => {
      btnliste.forEach(btn => btn.classList.remove("active"))
      buton.classList.add("active")
      hamburger_menu.classList.remove("active")
      kategoributonlar.style.display = "none"
      const kategoriKey = buton.dataset.key
      localStorage.setItem("kategori", kategoriKey)
      kategoriyegorefiltrele(kategoriKey)
    })
  })
       }else{
        alert("İnternet bağlantısı yok ve önceden veri çekilmemiş.")
       }
  }else{
     
  // Eğer data yoksa API'den çek
  if (data.length === 0) {
    await fetchapi()
    data = JSON.parse(localStorage.getItem("data")) || []
  }

  // Butonları ve ilanları render et
  render(data)
  toggleloading()

  // Eğer önceki kategori varsa aktif yap
  if (kategori) {
    kategoriyegorefiltrele(kategori)
    btnliste.forEach(btn => {
      if (btn.dataset.key === kategori) btn.classList.add("active")
    })
  }

  // Görev listesi DOM'a geri bas
  if (gorevlistesi.length > 0) {
    gorevlistesicontainer.style.display = "flex"
    gorevlistesi.forEach(baslik => {
      const ilanData = data.find(i => i.baslik === baslik)
      if (!ilanData) return
      const eklencek_gorev = document.createElement("div")
      eklencek_gorev.classList.add("gorevlistesi_ilan")
      if (ilanData.acil) eklencek_gorev.classList.add("acil")
      eklencek_gorev.innerHTML = `
        <h4>${ilanData.baslik}</h4>
        <div>
          <img src="konum_16.png" alt="konum">
          <span>${ilanData.konum}</span>
        </div>
      `
       const tamamla_btn = document.createElement("button")
      tamamla_btn.textContent = "TAMAMLA"
      tamamla_btn.classList.add("tamamlabtn")
      eklencek_gorev.appendChild(tamamla_btn)

     tamamlamabutonlari.push(tamamla_btn)

      tamamla_btn.addEventListener("click", () => {
        gorevlistesicontainer.removeChild(eklencek_gorev)
        gorevlistesi = gorevlistesi.filter(item => item !== baslik)
        localStorage.setItem("gorevlistesi", JSON.stringify(gorevlistesi))
      })

      gorevlistesicontainer.appendChild(eklencek_gorev)
    })
  }

 

  // kategori butonları click
  btnliste.forEach(buton => {
    buton.addEventListener("click", () => {
      btnliste.forEach(btn => btn.classList.remove("active"))
      buton.classList.add("active")
      hamburger_menu.classList.remove("active")
      kategoributonlar.style.display = "none"
      const kategoriKey = buton.dataset.key
      localStorage.setItem("kategori", kategoriKey)
      kategoriyegorefiltrele(kategoriKey)
    })
  })
  }

  
}

baslat()

// Hamburger menü tıklama eventi
hamburger.addEventListener("click", () => {
  hamburger_menu.classList.toggle("active")
  kategoributonlar.style.display =
    hamburger_menu.classList.contains("active") ? "flex" : "none"
})

// İnternet durumunu kontrol etme fonksiyonu
function internetdurumunukontrolet(){
  if(navigator.onLine){
    internetDurumu.style.backgroundColor = "green"
    online_offline.textContent="online"
  }else{
    internetDurumu.style.backgroundColor = "red"
    online_offline.textContent="offline"
  }
}

// İnternet durumunu kontrol etme event listener'ları
window.addEventListener("online",internetdurumunukontrolet)
window.addEventListener("offline",internetdurumunukontrolet)

// Karanlık mod butonu tıklama eventi
modebtn.addEventListener("click",()=>{
document.body.classList.toggle("dark-mode")
  if(document.body.classList.contains("dark-mode")){
    modebtn.textContent="☀️"
     mod="dark"
  }else{
    modebtn.textContent="🌙"
    mod="light"
  }
  localStorage.setItem("mod", mod)
})