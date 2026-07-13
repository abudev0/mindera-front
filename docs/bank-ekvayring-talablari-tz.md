# Bank Internet-ekvayring talablarini bajarish bo‘yicha texnik topshiriq

**Loyiha:** mindera.uz

**Tuzilgan sana:** 2026-yil 13-iyul

**Holat:** bosqichma-bosqich bajariladi

## Maqsad

Saytdagi oferta, maxfiylik siyosati va kurs xarid qilish interfeysini Bankning Internet-ekvayring bo‘yicha bildirilgan talablariga moslashtirish, mijozga pulni qaytarish hamda to‘lov jarayonini bir ma’noli va tushunarli ko‘rsatish.

## Aniqlangan joriy holat

- Ommaviy ofertaning 10-bo‘limida faqat kursdan voz kechishdagi qayta hisob-kitob yoritilgan; takroriy to‘lov va texnik xato alohida tartibga solinmagan.
- Alohida Maxfiylik siyosati sahifasi mavjud emas.
- Saytda to‘lov tizimlari logotiplari va 3D Secure haqida ma’lumot yo‘q.
- Kurs va muddat tanlangach, foydalanuvchi saytda to‘lamaydi; `@mindera_admin` Telegram akkauntiga yo‘naltiriladi.
- Repozitoriyda ishlaydigan Internet-ekvayring checkout integratsiyasi va Bank shartnomasi rekvizitlari mavjud emas.

## Ish qismlari

### 1-qism. Pulni qaytarish tartibi

Oferta 10-bo‘limi quyidagi holatlar bilan kengaytiriladi:

- mijozning kursdan ixtiyoriy voz kechishi;
- ayni buyurtma uchun ikki yoki undan ortiq marta pul yechilishi;
- texnik xato sababli pul yechilib, buyurtma/to‘lov tasdiqlanmasligi;
- ortiqcha yoki noto‘g‘ri summa yechilishi;
- murojaat kanallari va taqdim etiladigan xavfsiz ma’lumotlar;
- tekshirish, qaytarish muddati va qaytarish usuli;
- Ijrochi hisobiga kelib tushmagan mablag‘ bo‘yicha Bank/to‘lov tizimi bilan ishlash tartibi.

**Qabul mezoni:** 10-bo‘limdan pulni qaytarish faqat ma’lum muddat o‘qigan mijozlarga tegishli emasligi aniq anglashiladi va har bir to‘lov xatosi uchun amaliy yo‘l ko‘rsatiladi.

### 2-qism. Maxfiylik siyosati va antifraud

- Alohida `/maxfiylik` sahifasi va uning hujjat manbasi yaratiladi.
- Yig‘iladigan ma’lumotlar, maqsad, saqlash, uchinchi tomonlarga uzatish, cookie va foydalanuvchi huquqlari yoritiladi.
- Bankning antifraud imkoniyatlari, tranzaksiyani risk asosida tekshirish, 3D Secure, limitlash, monitoring, shubhali operatsiyani vaqtincha rad etish/to‘xtatish va Bank bilan ma’lumot almashish bayon qilinadi.
- CVV/CVC va to‘liq karta rekvizitlari Mindera serverida saqlanmasligi haqidagi bayonot faqat tanlangan integratsiya amalda shuni ta’minlasa yakuniy matnda qoldiriladi.

**Qabul mezoni:** footer orqali ochiladigan, mobil va desktopda o‘qiladigan Maxfiylik siyosati mavjud bo‘ladi; antifraud bo‘limi bank shartnomasi bilan yakuniy solishtirish uchun ajratiladi.

### 3-qism. To‘lov tizimlari va 3D Secure axborot bloki

- Footer va/yoki xarid oynasida amalda qo‘llab-quvvatlanadigan to‘lov tizimlarining logotiplari joylashtiriladi.
- Uzum Bank logotipi va Uzum Bank checkoutida qo‘llanadigan 3D Secure himoyasi haqida qisqa tushuntirish beriladi.
- Saytdagi onlayn to‘lov faqat Uzum Bank orqali amalga oshirilishi aniq ko‘rsatiladi.
- Logotiplar rasmiy brand qoidalariga mos lokal asset yoki Bank taqdim etgan fayllardan olinadi.

**Qabul mezoni:** logotiplar sifatli, accessibility nomlariga ega va mavjud bo‘lmagan to‘lov usulini va’da qilmaydi.

### 4-qism. To‘lov oqimini aniqlashtirish

Maqsadli oqim:

1. Foydalanuvchi saytda ro‘yxatdan o‘tadi yoki tizimga kiradi.
2. `/courses` sahifasida kurs va to‘lov muddatini tanlaydi.
3. Yakuniy summa, chegirma, oferta va maxfiylik shartlarini ko‘radi hamda roziligini bildiradi.
4. “Saytda to‘lash” tugmasini bosadi.
5. Sayt serveri buyurtma yaratib, Bank checkout sahifasi yoki xavfsiz karta formasini ochadi.
6. Mijoz karta ma’lumotlarini xavfsiz Bank/to‘lov provayderi muhitida kiritadi va zarur bo‘lsa 3D Secure tasdiqlashdan o‘tadi.
7. Bank callback/webhook orqali yakuniy holatni serverga bildiradi.
8. Sayt muvaffaqiyatli, kutilayotgan yoki muvaffaqiyatsiz to‘lov holatini va chek/buyurtma raqamini ko‘rsatadi.
9. Telegram faqat qo‘llab-quvvatlash kanali bo‘lib qoladi; to‘lov bosqichi sifatida ko‘rsatilmaydi.

**Qabul mezoni:** mijoz xizmat uchun aynan 4–7-qadamlar oralig‘ida sayt boshlagan Bank checkout oqimida to‘laydi; faqat frontend tugmasini almashtirish to‘liq integratsiya deb hisoblanmaydi.

## Texnik va tashkiliy bog‘liqliklar

4-qismni to‘liq ishga tushirishdan oldin quyidagilar olinishi kerak:

- Bank/ekvayer nomi va Internet-ekvayring shartnomasining texnik ilovasi;
- test va production merchant identifikatorlari hamda xavfsiz kalitlar;
- checkout/API, callback/webhook, refund va reconciliation hujjatlari;
- qabul qilinadigan kartalar/to‘lov tizimlarining aniq ro‘yxati;
- Bank tasdiqlagan logotiplar va 3D Secure matni;
- chek/fiskalizatsiya oqimi bo‘yicha talablar.

Maxfiy kalitlar repozitoriyga yozilmaydi; environment variables orqali saqlanadi. To‘lov muvaffaqiyati faqat brauzer redirectiga qarab emas, Bankning serverdan-serverga tasdig‘i asosida belgilanadi. Callbacklar imzosi tekshiriladi va takroriy so‘rovlar idempotent qayta ishlanadi.

## Bosqichlarni qabul qilish tartibi

Har bir qism yakunida bajarilgan o‘zgarishlar va tekshiruv natijasi taqdim etiladi. Keyingi qismga faqat buyurtmachining alohida roziligidan so‘ng o‘tiladi.
