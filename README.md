# KADIRFIT - Online Fitness & Beslenme Koçluğu ve Sporcu E-Ticaret Platformu

> **"Güç • Disiplin • Dönüşüm"**

Kadirfit, kişiye özel online antrenman ve beslenme koçluğu ile birlikte birinci sınıf fitness giyim (heavyweight oversize tişörtler, kompresyon şortlar, stringer atletler) ve sporcu takviyeleri (CFM Whey Isolate, Creapure® Kreatin, Pre-Workout Storm, paslanmaz çelik shaker ve 10mm lever kemerler) satan modern, yüksek performanslı ve tamamen responsive bir web uygulamasıdır.

Sitedeki tüm içerikler, ürünler, siparişler, öğrenci check-in takipleri ve ana sayfa bölümleri **/admin** adresindeki dinamik yönetim panelinden yönetilebilir.

---

## 🚀 Öne Çıkan Özellikler

### 1. Marka ve Tasarım Dili
- **Renk Paleti**: Derin siyah arka plan (`#0A0A0A` / `#080808`), beyaz ve gri tipografi (`#EDEDED` / `#9A9A9A`), canlı elektrik turuncusu (`#FF5A1F`) vurgu rengi. **Renkler admin panelindeki canlı renk seçici (Color Picker) üzerinden anında değiştirilebilir.**
- **Tipografi**: Başlıklarda atletik ve güçlü **Bebas Neue / Oswald**, gövde metinlerinde okunabilirliği yüksek **Inter**.
- **Mobil Uyum & Performans**: Tüm ekranlarda akıcı deneyim (mobile-first), zero-pill typographic discipline, WCAG erişilebilirlik ve `prefers-reduced-motion` uyumu.
- **Çoklu Dil Mimarisi**: Varsayılan dil Türkçe, İngilizce (EN) ve Arapça (AR - RTL) dil değiştirici ve yön desteği mevcuttur.

### 2. Genel Site (Ön Yüz) & Dinamik CMS
- **Sticky Navbar**: KADIRFIT logosu, Hakkımda, Koçluk, Mağaza, Sonuçlar, Blog, SSS, İletişim, Cmd+K canlı arama modalı, rozetli dinamik sepet çekmecesi, kullanıcı profil menüsü ve "Hemen Başla" butonu.
- **Dinamik Bölümler (CMS)**: Her bölüm admin panelinden açılıp kapatılabilir ve sırası değiştirilebilir:
  1. *Hero Alanı*: Büyük başlık, çift CTA ("Koçluk Paketleri", "Mağazaya Git"), 3 canlı sayaç (1450+ Başarılı Öğrenci, 8+ Yıl Deneyim, %100 Kişiye Özel).
  2. *Hakkımda*: Kadir Arslan portresi, antrenörlük felsefesi ve IFBB Pro / ISSA sertifika rozetleri.
  3. *Nasıl Çalışır*: 4 adımlı yatay süreç (Ön Değerlendirme → Kişiye Özel Plan → Haftalık Check-in → Dinamik Güncelleme).
  4. *Koçluk Paketleri*: Başlangıç, Dönüşüm ("En Popüler"), Elite/Yarışmacı kartları ve 1 / 3 / 6 ay süre seçici (%15 ve %25 indirimli).
  5. *Öne Çıkan Ürünler*: Giyim, takviye ve ekipmanlar vitrini, anında sepete ekleme.
  6. *Kategoriler*: Kıyafetler, Protein & Takviyeler, Aksesuar & Kemer.
  7. *Dönüşüm Galerisi*: İnteraktif Before/After sürgülü slider ve doğrulanmış öğrenci hikayeleri.
  8. *Öğrenci Yorumları*: Yıldızlı müşteri değerlendirmeleri.
  9. *Sıkça Sorulan Sorular*: Kategorilere ayrılmış akordeon FAQ.
  10. *Son Çağrı & VIP Bülten*: E-posta bülten aboneliği.
- **WhatsApp Butonu**: Sağ altta sabit, özel mesaj şablonlu hızlı iletişim butonu.

### 3. Mağaza & Ödeme (E-Ticaret)
> **Durum:** Siparişler ve kuponlar sunucuda (PostgreSQL) tutulur. Fiyat, kargo, indirim ve stok **sunucuda** hesaplanır; tarayıcıdan gelen tutarlara güvenilmez. **Kredi kartı ödemesi şu an kapalıdır** (iyzico/PayTR hesabı ve API anahtarları gerekir); aktif yöntemler Kapıda Ödeme ve (banka bilgisi tanımlıysa) Havale/EFT'tir.

- **Filtreler**: Kategori, alt kategori, maksimum fiyat kaydırıcısı, beden (S, M, L, XL, XXL), aroma, marka ve arama.
- **Ürün Detay**: Zoom'lu görsel galerisi, varyant seçimi, anlık stok durumu, Beden Ölçü Tablosu, takviyelerde Besin Değerleri Tablosu ve kullanım önerisi, onaylı müşteri değerlendirmeleri.
- **Yasal Uyarı**: Takviyelerde zorunlu olan *"Takviye edici gıdalar ilaç değildir, hastalıkların önlenmesi veya tedavi edilmesi amacıyla kullanılmaz."* uyarısı.
- **Sepet ve Ödeme**:
  - Sepet Drawer: Ücretsiz kargo baremi ("750 TL üzeri ücretsiz kargo"), kupon kodu uygulama alanı.
  - Ödeme Yöntemleri: Kredi Kartı (iyzico / PayTR simülatörü ve 3D Secure), Havale / EFT (Garanti BBVA ve Ziraat Bankası IBAN'ları), Kapıda Nakit/Kredi Kartı.
  - Yasal Onaylar: Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi zorunlu onay kutuları.
  - Koçluk paketleri de mağaza sepetine eklenerek aynı güvenli akışla satın alınabilir.

### 4. Üyelik Sistemi (Kullanıcı Hesabı)
Üyelik sistemi gerçek bir Express sunucusu üzerinde çalışır (`server/`): şifreler `scrypt` ile hashlenir, oturum httpOnly + imzalı çerezdedir.
- **Kayıt Ol**: Ad, soyad, e-posta, telefon, şifre güç göstergesi, KVKK ve sözleşme onayları. Kayıttan sonra **e-posta doğrulama bağlantısı** (24 saat geçerli) gönderilir; doğrulanmayan hesap giriş yapamaz, doğrulama maili tekrar istenebilir.
- **Giriş Yap**: E-posta ve şifre, "Beni Hatırla" (30 gün), sunucu taraflı güvenlik kilidi (5 hatalı denemede 15 dk kilit).
- **Şifremi Unuttum**: E-postaya 1 saat geçerli, tek kullanımlık sıfırlama bağlantısı gönderilir. Hesap var/yok bilgisi sızdırılmaz. Şifre değişince açık tüm oturumlar sonlandırılır.
- **Hesabım Paneli**:
  - *Genel Bakış*: Hoş geldin kartı, aktif koçluk süresi sayacı, son sipariş özeti.
  - *Siparişlerim*: Sipariş listesi, Yurtiçi Kargo takip linki, E-Fatura indirme, 14 gün ücretsiz iade/değişim formu.
  - *Koçluk Alanım*: Antrenman ve beslenme programı PDF indirmeleri, Haftalık Check-in Formu (kilo, bel, göğüs, kol ölçüleri, notlar), ilerleme grafiği ve Kadir Hoca'nın öğrenciye özel geri bildirim notları.
  - *Favorilerim*: Beğenilen ürünler.
  - *Adreslerim*: Teslimat ve fatura adresleri (bireysel / kurumsal vergi no desteği).
  - *Kuponlarım*: Hesaba tanımlı indirim kuponları.
  - *Hesap Ayarları*: Bilgi güncelleme ve KVKK gereği "Hesabımı Sil" talebi.

### 5. Yönetim Paneli (/admin)
- **Rol Tabanlı Güvenlik**: `SUPER_ADMIN`, `ORDER_MANAGER`, `EDITOR`, `USER`. Yetkisiz kullanıcılar erişemez.
- **Dashboard**: Toplam ciro, sipariş adedi, öğrenci sayısı, kritik stok uyarıları.
- **CMS Yönetimi**: Ana sayfa metinleri ve bölümlerini açıp kapatma, sıralama değiştirme.
- **Ürün Yönetimi**: Ürün formu ile ekle/düzenle/sil (fiyat, indirim, stok, bedenler/aromalar, **fotoğraf yükleme**), öne çıkarma. Ürünler ve fotoğraflar veritabanında saklanır, tüm ziyaretçilere gösterilir; yalnızca `SUPER_ADMIN` ve `EDITOR` değiştirebilir. İlk çalıştırmada örnek ürün kataloğu bir kez yüklenir.
- **Sipariş Yönetimi**: Durum güncelleme (Beklemede, Hazırlanıyor, Kargoda, Teslim Edildi, İptal/İade), kargo takip no girişi, iade taleplerini onaylama.
- **Koçluk Yönetimi**: Paket fiyatları, gelen ön değerlendirme formlarını inceleme ve programa geri bildirim yazma.
- **Üye Yönetimi**: Üye listesi, durumu askıya alma/aktifleştirme, haftalık check-in'lere antrenör notu ekleme.
- **Kuponlar & İçerik**: İndirim kodları, blog yazıları, SSS, yorum onayları.
- **Site Ayarları**: Canlı renk seçici, ücretsiz kargo limiti, yasal sözleşme metinleri düzenleyicisi.

---

## 🔑 Demo Giriş Bilgileri

Geliştirme modunda (`npm run dev`) aşağıdaki hesaplar otomatik oluşturulur ve giriş ekranında "Hızlı Demo Girişi" butonları görünür. Production'da demo hesaplar oluşturulmaz (`ADMIN_EMAIL` / `ADMIN_PASSWORD` ile ilk admin tanımlanır).

| Rol | E-Posta | Şifre | Yetki |
|---|---|---|---|
| **Süper Admin** | `admin@kadirfit.com` | `Admin123!` | Tam yetki, /admin paneli, ürün, sipariş ve CMS yönetimi |
| **Kayıtlı Öğrenci** | `kullanici@kadirfit.com` | `Kullanici123!` | Koçluk alanı, check-in formu, sipariş takibi, adresler |

---

## 🛠️ Kurulum ve Yerel Çalıştırma

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın (Express + Vite, tek port)
npm run dev

# Production derlemesi (dist/ + server.js) ve çalıştırma
npm run build
npm start

# TypeScript kontrolü
npm run lint
```

Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

### E-posta (doğrulama ve şifre sıfırlama)
`.env.example` dosyasını `.env` olarak kopyalayıp `SMTP_*` ve `MAIL_FROM` değerlerini kendi SMTP sağlayıcınızla (Brevo, Mailgun, Gmail uygulama şifresi, Resend SMTP vb.) doldurun.
- **SMTP tanımlı değilken (geliştirme)**: e-postalar gönderilmez; bağlantılar sunucu konsoluna yazılır ve arayüzde sarı bir kutuda gösterilir, böylece akış test edilebilir.
- **Production'da** `DATABASE_URL`, `AUTH_SECRET` (32+ karakter) ve `APP_URL` gereklidir; SMTP olmadan e-postalar **gönderilemez**.
- `DATABASE_URL` tanımlıysa hesaplar PostgreSQL'de tutulur (production'da **zorunlu**). Tanımlı değilse yerel geliştirmede `./data/auth.json` dosyası kullanılır.

---

## ☁️ Vercel + Neon / Supabase Deploy Talimatları

Ön yüz Vite ile statik olarak, API (`/api/auth/*`) ise `api/index.ts` üzerinden Vercel Serverless Function olarak çalışır (`vercel.json` hazırdır). Hesaplar, tek kullanımlık tokenlar ve hız sınırları PostgreSQL'de tutulur; tablolar ilk istekte kendiliğinden oluşturulur (elle migration gerekmez).

### 1. Veritabanı (Neon veya Supabase)
1. [Neon](https://neon.tech) veya [Supabase](https://supabase.com) üzerinde ücretsiz bir PostgreSQL projesi açın.
2. **Pooled (havuzlu)** bağlantı dizesini kopyalayın. Serverless için bu şarttır:
   - Neon: connection string'de host adı `-pooler` içerir.
   - Supabase: Project Settings → Database → *Transaction pooler* (port 6543).
3. Supabase'de "self-signed certificate" hatası alırsanız ortam değişkeni olarak `DATABASE_SSL=no-verify` ekleyin.

### 2. SMTP (e-posta)
Doğrulama ve şifre sıfırlama e-postaları için bir SMTP sağlayıcısı gerekir (Brevo, Mailgun, Resend SMTP, Gmail uygulama şifresi...). Gönderen adresin alan adını sağlayıcıda doğrulayın (SPF/DKIM), aksi halde mailler spam'e düşer.

### 3. Vercel
1. Kodu GitHub'a push edin, [Vercel](https://vercel.com) → *Add New Project* ile reponuzu seçin. Framework **Vite** otomatik algılanır.
2. *Settings → Environment Variables* bölümüne ekleyin:

| Değişken | Açıklama |
|---|---|
| `DATABASE_URL` | Neon/Supabase pooled bağlantı dizesi **(zorunlu)** |
| `AUTH_SECRET` | 32+ rastgele karakter, `openssl rand -base64 48` **(zorunlu)** |
| `APP_URL` | Sitenin gerçek adresi, örn. `https://kadirfit.com` (e-posta linkleri bununla üretilir) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | E-posta gönderimi |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | İlk Süper Admin hesabı (ilk istekte bir kez oluşturulur) |
| `BANK_TRANSFER_DETAILS` | Havale/EFT için **gerçek** banka bilgileriniz, `;` ile ayrılmış. Boşsa Havale seçeneği gizlenir. |
| `ORDER_NOTIFY_EMAIL` | Her yeni siparişte haber verilecek e-posta (isteğe bağlı) |

3. **Deploy**'a basın. İlk girişten sonra güvenlik için `ADMIN_PASSWORD` değişkenini silebilir ve şifreyi "Şifremi Unuttum" ile değiştirebilirsiniz.

> Ön izleme (preview) dağıtımlarında e-posta linkleri `APP_URL` adresine gider; test için preview'da `APP_URL`'i o dağıtımın adresine ayarlayın.

---

## ⚖️ Türkiye Yasal Uyumluluk (Mevzuat)
- **6698 Sayılı KVKK**: Aydınlatma metni, üyelikten ayrılma ve kişisel verileri silme hakkı.
- **6502 Sayılı Tüketici Kanunu**: Mesafeli Satış Sözleşmesi, Ön Bilgilendirme Formu ve 14 gün cayma/iade hakkı.
- **Gıda Takviyeleri Tebliği**: Takviye edici gıdaların ilaç olmadığına dair kanuni uyarı metinleri.
