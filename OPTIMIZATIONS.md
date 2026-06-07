# OPTIMIZATIONS.md — Kintarowwwards Full Audit

---

## 1) Optimizasyon Özeti

**Genel Sağlık:** Orta-İyi. Kod temiz ve modüler, ancak performans açısından kritik sorunlar var.

**En Yüksek Etkili 3 İyileştirme:**
1. `requestAnimationFrame` memory leak — SmoothScroll provider'da RAF iptal edilmiyor
2. Hero bölümündeki `<img>` tagları Next.js `<Image>` yerine kullanılıyor (24 görsel optimize edilmemiş)
3. `CustomCursor` her `mouseover` event'inde `getComputedStyle` çağırıyor — layout thrashing

**Değişiklik yapılmazsa en büyük risk:** Mobilde ciddi performans düşüşü ve bellek sızıntısı (özellikle SmoothScroll + particles + custom cursor birlikte çalışırken).

---

## 2) Bulgular (Öncelik Sırasına Göre)

### F1: SmoothScroll Provider — requestAnimationFrame Sızıntısı
- **Kategori:** Memory / Reliability
- **Ciddiyet:** Critical
- **Etki:** Bellek sızıntısı, CPU tüketimi
- **Kanıt:** `smooth-scroll-provider.tsx:27-31` — `raf()` fonksiyonu kendini çağırıyor ama dönen `requestAnimationFrame` ID'si cleanup'ta iptal edilmiyor. `cancelAnimationFrame` sadece Lenis destroy ile dolaylı çalışıyor ama RAF döngüsü devam ediyor.
- **Neden verimsiz:** RAF zinciri, component unmount olduktan sonra da çalışmaya devam edebilir.
- **Önerilen düzeltme:**
```typescript
useEffect(() => {
    const lenisInstance = new Lenis({...});
    setLenis(lenisInstance);
    let rafId: number;
    function raf(time: number) {
        lenisInstance.raf(time);
        rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
        cancelAnimationFrame(rafId);
        lenisInstance.destroy();
    };
}, []);
```
- **Tradeoffs:** Yok — pure bugfix.
- **Tahmini etki:** Bellek sızıntısı tamamen çözülür.
- **Kaldırma Güvenliği:** Safe
- **Yeniden Kullanım Kapsamı:** Modül

---

### F2: Hero Görselleri — `<img>` yerine Next.js `<Image>` Kullanılmalı
- **Kategori:** Frontend / I/O
- **Ciddiyet:** High
- **Etki:** LCP, bandwidth, CLS
- **Kanıt:** `hero.tsx:73-78, 96-101` — 24 adet `<img>` tag'ı (12 track × 2 duplicate). Hiçbirinde lazy loading, responsive srcset, veya format optimizasyonu yok.
- **Neden verimsiz:** Full resolution görsel yükleniyor; WebP/AVIF dönüşümü yapılmıyor.
- **Önerilen düzeltme:** `next/image` kullanın, `sizes` ve `loading="lazy"` ekleyin. Görseller `public/` altında olduğundan doğrudan çalışır.
- **Tradeoffs:** CSS animasyonlarıyla uyumluluk test edilmeli.
- **Tahmini etki:** %40-60 daha az bandwidth, LCP iyileşmesi.
- **Kaldırma Güvenliği:** Likely Safe
- **Yeniden Kullanım Kapsamı:** Lokal dosya

---

### F3: CustomCursor — `getComputedStyle` Layout Thrashing
- **Kategori:** CPU / Frontend
- **Ciddiyet:** High
- **Etki:** Frame rate düşüşü, jank
- **Kanıt:** `custom-cursor.tsx:36` — Her `mouseover` event'inde `window.getComputedStyle(target).cursor` çağrısı yapılıyor. Bu, tarayıcıyı forced reflow yapmaya zorlar.
- **Neden verimsiz:** `mouseover` yüksek frekanslı bir event; her tetiklemede layout hesaplaması zorlayıcı.
- **Önerilen düzeltme:** `getComputedStyle` kontrolünü kaldırın, yerine `data-cursor="pointer"` attribute'u veya CSS sınıfı tabanlı kontrol kullanın. Alternatif: throttle/debounce ekleyin.
- **Tradeoffs:** Bazı hover durumları kaçırılabilir.
- **Tahmini etki:** Frame rate %15-25 iyileşme (özellikle hareket yoğun sayfalarda).
- **Kaldırma Güvenliği:** Likely Safe
- **Yeniden Kullanım Kapsamı:** Lokal dosya

---

### F4: InteractiveParticles — `mousemove` + `getBoundingClientRect` Her Frame
- **Kategori:** CPU / Frontend
- **Ciddiyet:** High
- **Etki:** Layout thrashing, CPU
- **Kanıt:** `interactive-particles.tsx:134-138` — Her `mousemove` event'inde `canvas.getBoundingClientRect()` çağrılıyor.
- **Neden verimsiz:** `getBoundingClientRect` forced reflow tetikler. `mousemove` saniyede 60+ kez ateşlenir.
- **Önerilen düzeltme:** `rect` değerini cache'leyin, sadece `resize` event'inde güncelleyin.
```typescript
let cachedRect = canvas.getBoundingClientRect();
const handleMouseMove = (e: MouseEvent) => {
    const dpr = window.devicePixelRatio || 1;
    mouseRef.current.x = (e.clientX - cachedRect.left) * dpr;
    mouseRef.current.y = (e.clientY - cachedRect.top) * dpr;
};
const resizeCanvas = () => {
    cachedRect = canvas.getBoundingClientRect();
    // ... rest
};
```
- **Tahmini etki:** %20-30 CPU azaltma (mousemove sırasında).
- **Kaldırma Güvenliği:** Safe
- **Yeniden Kullanım Kapsamı:** Lokal dosya

---

### F5: InteractiveParticles — `document.documentElement.classList.contains('dark')` Her Frame
- **Kategori:** CPU / Frontend
- **Ciddiyet:** Medium
- **Etki:** Gereksiz DOM erişimi her animasyon frame'inde
- **Kanıt:** `interactive-particles.tsx:121` — `animate()` fonksiyonu her frame'de (60fps) DOM'a erişiyor.
- **Önerilen düzeltme:** `MutationObserver` veya `useTheme` hook'u ile theme değişikliğini dinleyin, ref'e kaydedin.
- **Tahmini etki:** Küçük ama ölçülebilir CPU tasarrufu.
- **Kaldırma Güvenliği:** Safe
- **Yeniden Kullanım Kapsamı:** Lokal dosya

---

### F6: InteractiveParticles — `devicePixelRatio` Her Frame Okunuyor
- **Kategori:** CPU
- **Ciddiyet:** Low
- **Etki:** Mikro-optimizasyon
- **Kanıt:** `interactive-particles.tsx:122` — `animate()` her frame `window.devicePixelRatio` okuyor.
- **Önerilen düzeltme:** `resize` event'inde cache'leyin.
- **Kaldırma Güvenliği:** Safe

---

### F7: Preloader — Theme Değişikliğinde Yeniden Tetikleniyor
- **Kategori:** Reliability / UX
- **Ciddiyet:** Medium
- **Etki:** Kullanıcı deneyimi bozukluğu
- **Kanıt:** `preloader.tsx:25` — `useEffect` dependency array'inde `[theme]` var. Tema her değiştiğinde 1.2 saniyelik preloader tekrar gösteriliyor.
- **Neden verimsiz:** Tema değiştirmek sayfa yenilemesi değil; preloader gereksiz.
- **Önerilen düzeltme:** Dependency'den `theme`'i kaldırın, sadece `[]` kullanın.
- **Tahmini etki:** UX iyileşmesi — tema geçişi anında olur.
- **Kaldırma Güvenliği:** Safe
- **Yeniden Kullanım Kapsamı:** Lokal dosya

---

### F8: Navbar — `navLinks` Dizisi Her Render'da Yeniden Oluşturuluyor
- **Kategori:** Memory / Frontend
- **Ciddiyet:** Low
- **Etki:** Gereksiz obje oluşturma
- **Kanıt:** `navbar.tsx:38-45` — `navLinks` array'i component body içinde her render'da oluşturuluyor.
- **Önerilen düzeltme:** `useMemo` ile sarın.
- **Kaldırma Güvenliği:** Safe

---

### F9: CustomCursor — `isVisible` Dependency Closure Sorunu
- **Kategori:** Reliability
- **Ciddiyet:** Medium
- **Etki:** Gereksiz event listener re-registration
- **Kanıt:** `custom-cursor.tsx:58` — `[cursorX, cursorY, isVisible]` dependency. `isVisible` her değiştiğinde tüm event listener'lar kaldırılıp yeniden ekleniyor. Motion value'lar stabil olduğundan `cursorX`, `cursorY` sorun değil ama `isVisible` sorun.
- **Önerilen düzeltme:** `isVisible` için `useRef` kullanın, dependency'den çıkarın.
- **Kaldırma Güvenliği:** Safe

---

### F10: `useMediaQuery` — Deprecated `addListener`/`removeListener` Fallback
- **Kategori:** Code Quality
- **Ciddiyet:** Low
- **Etki:** Dead code
- **Kanıt:** `use-media-query.ts:25-36` — `addListener`/`removeListener` artık tüm modern tarayıcılarda destekleniyor. Fallback gereksiz.
- **Önerilen düzeltme:** Sadece `addEventListener`/`removeEventListener` bırakın.
- **Kaldırma Güvenliği:** Safe (IE11 desteği gerekli değilse)
- **Sınıflandırma:** Dead Code

---

### F11: `useMediaQuery` — SSR Hydration Mismatch Riski
- **Kategori:** Reliability
- **Ciddiyet:** Medium
- **Etki:** React hydration uyumsuzluğu
- **Kanıt:** `use-media-query.ts:12` — `useState(false)` ile başlıyor. Server'da `false`, client'ta `true` olabilir. `projects.tsx` bu hook'u kullanarak layout'u belirliyor.
- **Önerilen düzeltme:** İlk render'da `undefined` döndürün veya `useEffect` sonrası state güncelleyin (mevcut yapı kısmen bunu yapıyor ama ilk render mismatch riski var).
- **Kaldırma Güvenliği:** Needs Verification

---

### F12: Stack — Her Tek Öğe İçin Ayrı `BlurReveal` Wrapper
- **Kategori:** Frontend / Memory
- **Ciddiyet:** Medium
- **Etki:** Gereksiz Intersection Observer ve framer-motion instance'ları
- **Kanıt:** `stack.tsx:57` — Her stack item için ayrı `BlurReveal` (framer-motion `whileInView`). 25+ teknoloji × her biri ayrı IntersectionObserver.
- **Önerilen düzeltme:** Stagger animation kullanın: tek bir container `BlurReveal` ile sarın, çocuklara `delay` verin.
- **Tahmini etki:** %50+ daha az IntersectionObserver instance.
- **Kaldırma Güvenliği:** Likely Safe

---

### F13: ManifestoFlow — `Separator` Fonksiyonu Her Render'da Yeniden Oluşturuluyor
- **Kategori:** Frontend
- **Ciddiyet:** Low
- **Etki:** Gereksiz component yeniden tanımlama
- **Kanıt:** `manifesto-flow.tsx:10-12` — `Separator` component fonksiyonu, render fonksiyonu içinde tanımlanmış.
- **Önerilen düzeltme:** Component'i dosya seviyesine taşıyın.
- **Kaldırma Güvenliği:** Safe

---

### F14: Tekrarlanan Lenis Stop/Start Mantığı (Kod Tekrarı)
- **Kategori:** Code Reuse
- **Ciddiyet:** Medium
- **Etki:** Bakım maliyeti
- **Kanıt:** Aynı pattern 3 modal dosyasında tekrarlanıyor: `about-modal.tsx:21-27`, `contact-modal.tsx:23-29`, `project-modal.tsx:37-43`.
- **Önerilen düzeltme:** Custom hook oluşturun:
```typescript
function useLenisModal(open: boolean) {
    const lenis = useLenis();
    useEffect(() => {
        open ? lenis?.stop() : lenis?.start();
    }, [open, lenis]);
}
```
- **Sınıflandırma:** Reuse Opportunity
- **Kaldırma Güvenliği:** Safe

---

### F15: `ProjectItem` Tipi Tekrarlanıyor
- **Kategori:** Code Reuse
- **Ciddiyet:** Low
- **Etki:** Type drift riski
- **Kanıt:** `projects.tsx:11-21` ve `project-modal.tsx:15-25` — aynı tip iki kez tanımlanmış.
- **Önerilen düzeltme:** Tek bir `types.ts` dosyasına taşıyın.
- **Sınıflandırma:** Reuse Opportunity

---

### F16: Shadcn UI Kullanılmayan Exportlar
- **Kategori:** Dead Code / Build
- **Ciddiyet:** Low
- **Etki:** Bundle size (tree-shake edilemezse)
- **Kanıt:** `dropdown-menu.tsx` — `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuShortcut`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuGroup`, `DropdownMenuPortal` hiç kullanılmıyor. `dialog.tsx` — `DialogFooter`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay` dışarıdan kullanılmıyor. `button.tsx` — `Button` sadece `dialog.tsx` içinde import ediliyor, hiçbir sayfa/modal'da direkt kullanılmıyor.
- **Önerilen düzeltme:** Shadcn UI bileşenleri olduğundan genellikle olduğu gibi bırakılır. Ancak `Button` hiç kullanılmıyorsa kaldırılabilir.
- **Sınıflandırma:** Dead Code (Needs Verification)

---

### F17: `ThemeSwitcher` — `system` Seçeneği `enableSystem={false}` ile Çelişiyor
- **Kategori:** Reliability
- **Ciddiyet:** Medium
- **Etki:** System tema seçimi çalışmaz
- **Kanıt:** `theme-provider.tsx` → `enableSystem={false}` ama `theme-switcher.tsx:39` → "System" seçeneği sunuluyor.
- **Önerilen düzeltme:** Ya `enableSystem={true}` yapın ya da "System" seçeneğini kaldırın.
- **Kaldırma Güvenliği:** Safe

---

### F18: Stack Görselleri — `<img>` ile Harici CDN'den Yükleniyor
- **Kategori:** I/O / Network
- **Ciddiyet:** Medium
- **Etki:** CORS, yavaş yükleme, cache kontrolü yok
- **Kanıt:** `stack.tsx:62,78` — `cdn.simpleicons.org` ve `svgrepo.com`'dan 25+ ikon `<img>` tag'ı ile yükleniyor. `next.config.ts` bu domainleri `remotePatterns`'a eklemiş ama `next/image` kullanılmıyor.
- **Önerilen düzeltme:** `next/image` kullanın veya ikonları lokal SVG olarak bundleye dahil edin. Harici CDN bağımlılığı riski var (CDN kesintisi = bozuk ikonlar).
- **Tahmini etki:** Daha güvenilir yükleme, cache kontrolü.
- **Kaldırma Güvenliği:** Likely Safe

---

### F19: `globals.css` — Kullanılmayan Sidebar CSS Değişkenleri
- **Kategori:** Dead Code
- **Ciddiyet:** Low
- **Etki:** ~500 byte gereksiz CSS
- **Kanıt:** `globals.css:89-96, 125-132, 160-167` — `--sidebar-*` değişkenleri tanımlanmış ama projede sidebar yok.
- **Sınıflandırma:** Dead Code — Safe removal

---

### F20: `globals.css` — Kullanılmayan Chart CSS Değişkenleri
- **Kategori:** Dead Code
- **Ciddiyet:** Low
- **Kanıt:** `globals.css:84-88, 155-159` — `--chart-*` değişkenleri tanımlanmış ama projede chart yok.
- **Sınıflandırma:** Dead Code — Safe removal

---

## 3) GÜVENLİK DENETİMİ

### SECURITY AUDIT: Portfolio Web Application

**Risk Değerlendirmesi:** Low (statik portföy sitesi, backend/API yok)

#### Bulgular:

* **Kişisel Bilgi İfşası** (Ciddiyet: Medium)
  * **Konum:** `contents/en.json:143`, `contents/tr.json` (muhtemelen aynı)
  * **Açık:** E-posta adresi (`mustafw42@gmail.com`) ve telefon numarası JSON içinde açık metin olarak saklanıyor. Bu dosyalar client bundle'a dahil ediliyor ve tarayıcıda okunabilir.
  * **Düzeltme:** Bu bir portföy sitesi olduğundan kasıtlı olabilir. Ancak spam botlarından korunmak için e-postayı obfuscate edin veya contact form kullanın.

* **`dangerouslyAllowSVG` Açık** (Ciddiyet: Medium)
  * **Konum:** `next.config.ts:5`
  * **Açık:** `dangerouslyAllowSVG: true` ayarı, uzak sunuculardan SVG yüklenmesine izin veriyor. SVG dosyaları JavaScript içerebilir ve XSS saldırı vektörü olabilir.
  * **Düzeltme:** `contentDispositionType: 'attachment'` ve `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"` ekleyin.

* **Harici CDN Bağımlılığı — Supply Chain Risk** (Ciddiyet: Low)
  * **Konum:** `contents/en.json:26-67` — `cdn.simpleicons.org`, `svgrepo.com`, `cdn.jsdelivr.net`
  * **Açık:** Harici CDN'ler kompromize edilirse zararlı SVG/görsel sunulabilir.
  * **Düzeltme:** İkonları lokal olarak barındırın.

#### Gözlemler:
- `rel="noopener noreferrer"` tüm harici linklerde doğru kullanılıyor ✅
- Form input yok, SQL injection / XSS riski minimal ✅
- `server-only` paketi doğru kullanılıyor ✅
- CSP header'ları `next.config.ts`'de tanımlanmamış — eklenmesi önerilir.

---

## 4) Hızlı Kazanımlar (Önce Yap)

| # | Değişiklik | Dosya | Süre | Etki |
|---|-----------|-------|------|------|
| 1 | RAF sızıntısını düzelt | `smooth-scroll-provider.tsx` | 5dk | Critical |
| 2 | Preloader theme dependency kaldır | `preloader.tsx` | 2dk | Medium |
| 3 | `getBoundingClientRect` cache'le | `interactive-particles.tsx` | 10dk | High |
| 4 | `getComputedStyle` kaldır/değiştir | `custom-cursor.tsx` | 15dk | High |
| 5 | Lenis modal hook'u oluştur | Yeni: `hooks/use-lenis-modal.ts` | 10dk | Medium |
| 6 | `enableSystem` çelişkisini çöz | `theme-provider.tsx` veya `theme-switcher.tsx` | 5dk | Medium |
| 7 | Separator'ı dışarı taşı | `manifesto-flow.tsx` | 2dk | Low |
| 8 | `isVisible` ref'e çevir | `custom-cursor.tsx` | 10dk | Medium |

---

## 5) Derin Optimizasyonlar (Sonra Yap)

| # | Değişiklik | Etki |
|---|-----------|------|
| 1 | Hero görselleri `next/image`'a geçir | LCP, bandwidth |
| 2 | Stack ikonlarını lokal SVG'ye çevir | Güvenilirlik, hız |
| 3 | Stack BlurReveal'ları stagger animation'a dönüştür | Memory, observer sayısı |
| 4 | `ProjectItem` tipini merkezi dosyaya taşı | Bakım |
| 5 | Kullanılmayan CSS değişkenlerini temizle | Bundle size |
| 6 | CSP header'ları ekle (`next.config.ts`) | Güvenlik |

---

## 6) Doğrulama Planı

### Benchmarklar
- **Lighthouse:** Değişiklik öncesi/sonrası Performans skoru karşılaştırması
- **Chrome DevTools Performance tab:** Frame rate, CPU kullanımı (özellikle hero + particles)
- **Network tab:** Toplam transfer boyutu karşılaştırması

### Profiling Stratejisi
1. `smooth-scroll-provider.tsx` fix'inden sonra Memory tab ile heap snapshot alıp leak olmadığını doğrulayın
2. `interactive-particles.tsx` fix'inden sonra Performance tab ile 10 saniyelik trace alın, forced reflow olup olmadığını kontrol edin
3. `custom-cursor.tsx` fix'inden sonra mousemove sırasında frame rate'i izleyin

### Doğruluk Testleri
- Tema değiştirme sonrası particles renginin doğru değiştiğini kontrol edin
- Mobilde cursor component'in render edilmediğini doğrulayın
- Tüm modalların Lenis scroll'u doğru durdurduğunu/başlattığını kontrol edin
- Language switch sonrası tüm içeriğin güncellendiğini doğrulayın

---

## 7) AGENTS.md

```markdown
# AGENTS.md

## Must-follow constraints
- Bu proje Next.js 16 + React 19 + Tailwind CSS v4 kullanıyor. API'lar buna göre.
- `"use client"` directive'i olmadan browser API'larına erişmeyin.
- `lib/loaders.ts` server-only'dir; client component'lerde import etmeyin.
- Shadcn UI bileşenleri (`components/ui/`) otomatik üretilmiştir; manuel düzenleme yapmayın, `npx shadcn` kullanın.
- İçerik iki katmanlıdır: `dictionaries/` (UI stringleri) + `contents/` (veri). İkisi `LanguageProvider`'da birleştirilir.
- Markdown işleme (`*`, `**`, `***`) `lib/markdown.tsx` ile yapılır; `dangerouslySetInnerHTML` kullanmayın.

## Validation before finishing
- `npm run build` başarılı olmalı
- `npm run lint` hatasız geçmeli

## Repo-specific conventions
- Dosya isimlendirme: kebab-case (ör: `blur-reveal.tsx`)
- Component organizasyonu: `components/{effects,layout,modals,sections,ui,widgets}/`
- Provider'lar: `providers/` altında
- Hook'lar: `hooks/` altında
- Tip tanımları component dosyası içinde (merkezi types dosyası yok — bu bir iyileştirme adayı)
- i18n: URL tabanlı (`/[lang]/`), desteklenen diller `lib/i18n.ts`'de

## Known gotchas
- `enableSystem={false}` olmasına rağmen ThemeSwitcher'da "System" seçeneği var — çelişki.
- Preloader `[theme]` dependency'si yüzünden her tema değişiminde yeniden tetikleniyor.
- `smooth-scroll-provider.tsx`'de RAF sızıntısı var (fix bekleniyor).
- Hero bölümü `<img>` kullanıyor, `next/image` değil — kasıtlı (CSS animation uyumu) ama optimize değil.
```
