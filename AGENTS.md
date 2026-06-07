# AGENTS.md

## Must-follow constraints
- Next.js 16 + React 19 + Tailwind CSS v4. API'lar buna göre.
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
- Tip tanımları component dosyası içinde (merkezi types dosyası yok)
- i18n: URL tabanlı (`/[lang]/`), desteklenen diller `lib/i18n.ts`'de

## Known gotchas
- `enableSystem={false}` olmasına rağmen ThemeSwitcher'da "System" seçeneği var — çelişki.
- Preloader `[theme]` dependency'si yüzünden her tema değişiminde yeniden tetikleniyor.
- `smooth-scroll-provider.tsx`'de RAF sızıntısı var (fix bekleniyor).
- Hero bölümü `<img>` kullanıyor, `next/image` değil — kasıtlı (CSS animation uyumu) ama optimize değil.
