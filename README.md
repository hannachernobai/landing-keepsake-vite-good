# Landing Keepsake (Vite + Pug + SCSS)

Адаптивний односторінковий лендінг дизайн-агенції **Keepsake**. Той самий макет, що й у `landing-keepsake` (lab-07), але зібраний професійним фронтенд-процесом: Pug-шаблони, модульний SCSS, PostCSS, оптимізовані зображення та автоматичний контроль якості коду.

- **Демо:** https://chernobaihanna.github.io/landing-keepsake-vite/
- **Макет:** [Keepsake — Responsive (Figma)](https://www.figma.com/design/ZMpmNEBMsLPHJF7GyoHu2f/Keepsake-%E2%80%94-Responsive)

## Вимоги до середовища

- Node.js LTS **20 або новіший** (`node -v`)
- npm (`npm -v`)

## Команди

| Команда               | Що робить                                                          |
| --------------------- | ------------------------------------------------------------------ |
| `npm install`         | встановлює залежності та підключає git hooks (скрипт `prepare`)    |
| `npm run dev`         | dev-сервер Vite (http://localhost:5173/landing-keepsake-vite/)     |
| `npm run build`       | продакшн-збірка у `dist/`                                          |
| `npm run preview`     | локальний перегляд збірки                                          |
| `npm run images`      | генерує AVIF/WebP/JPEG у кількох ширинах з `images-src/` (`sharp`) |
| `npm run format`      | форматує код Prettier                                              |
| `npm run lint`        | Stylelint для `.scss` + `prettier --check`                         |
| `npm run lint:styles` | лише Stylelint                                                     |
| `npm run lint:format` | лише перевірка форматування                                        |

## Структура проєкту

```text
landing-keepsake-vite/
├── .github/workflows/deploy.yml   # збірка й публікація на GitHub Pages
├── .husky/                        # pre-commit (lint-staged), commit-msg (commitlint)
├── .vscode/extensions.json        # рекомендовані розширення редактора
├── images-src/                    # вихідні зображення (WebP)
├── scripts/images.js              # npm run images
├── src/
│   ├── assets/images/             # AVIF, WebP, JPEG у двох ширинах
│   ├── components/                # header, footer, newsletter
│   │   └── sections/              # hero, works, cta, services, stats, clients, journal
│   ├── data/                      # дані секцій (масиви об'єктів)
│   ├── includes/                  # fonts, meta, SVG-спрайт
│   ├── layouts/main.pug           # базовий макет
│   ├── mixins/                    # Pug-міксини
│   ├── pages/index.pug
│   └── styles/
│       ├── abstracts/             # токени, mq(), rem(), міксини (_index.scss з @forward)
│       ├── base/                  # :root, reset, типографіка, утиліти
│       ├── layout/                # контейнер, секція, header, footer
│       ├── components/            # один БЕМ-блок — один файл
│       ├── sections/              # блоки секцій сторінки
│       └── main.scss              # єдина точка входу
├── .browserslistrc
├── postcss.config.js
├── vite.config.js
└── package.json
```

### Pug

- `layouts/main.pug` має блоки `meta`, `title`, `fonts`, `styles`, `header`, `content`, `footer`, `scripts`. Міксини й дані підключаються саме в макеті.
- `pages/index.pug` успадковує макет через `extends`, перевизначає блоки, а через `append`/`prepend` додає в `meta` опис і Open Graph, у `styles` — preload і підключення шрифтів.
- Шапка, футер і кожна секція — окремі файли, підключені через `include`. SVG-спрайт підключається через `include` як сирий файл.
- Усі повторювані блоки (навігація, категорії, роботи, послуги, статистика, клієнти, журнал, колонки футера, соцмережі) описані масивами в `src/data/` і виводяться через `each`.
- Міксини: `+btn` (`block`, `&attributes`, `case`), `+icon` (`case`), `+picture`, `+work-card`, `+section-title` (`block`), `+nav-list`, `+socials`.

### SCSS

- Лише `@use` і `@forward`, без `@import`. Кожна папка має `_index.scss`, що реекспортує partials.
- Кольори, шрифти, відступи й адаптивні токени оголошені як map-и в `abstracts/_tokens.scss` та генеруються в CSS custom properties у `:root` через `@each`.
- `mq($bp)` бере значення з map-а брейкпоінтів і використовує лише `min-width` (mobile first).
- `rem($px)` на `sass:math`, міксини `visually-hidden`, `focus-ring`, `flex-center($display: flex)`, `uppercase($spacing: 1px)`, `text(...)`, `transition(...)`.
- БЕМ через `&__element` і `&--modifier`, вкладеність не глибше 3, без `id` і `!important`.
- Фільтр портфоліо на `:checked ~` генерується циклом `@each` за списком `$work-filters`.

## Інструменти

| Інструмент                                     | Навіщо                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| Vite + vituum + `@vituum/vite-plugin-pug`      | dev-сервер, збірка, компіляція Pug у HTML                         |
| Sass                                           | препроцесор: `@use`/`@forward`, map-и, функції, міксини           |
| PostCSS + Autoprefixer                         | постпроцесор: вендорні префікси під Browserslist                  |
| Browserslist                                   | список цільових браузерів (`.browserslistrc`)                     |
| sharp                                          | AVIF/WebP/JPEG у кількох розмірах (`npm run images`)              |
| Prettier + `@prettier/plugin-pug`              | єдине форматування `.pug`, `.scss`, `.js`, `.json`, `.md`, `.yml` |
| Stylelint + `stylelint-config-standard-scss`   | якість SCSS, БЕМ-шаблон класів, ліміт вкладеності                 |
| husky + lint-staged                            | pre-commit: перевірка лише змінених файлів                        |
| commitlint + `@commitlint/config-conventional` | повідомлення комітів за Conventional Commits                      |
| `.editorconfig`, `.vscode/extensions.json`     | однакові налаштування редактора для всієї команди                 |
| GitHub Actions                                 | `npm ci` → `lint` → `build` → публікація на GitHub Pages          |

CSS мініфікується самим Vite під час `npm run build` (esbuild), окремий мініфікатор не потрібен. Autoprefixer Vite не містить, тому він підключений через `postcss.config.js`.

## Цільові браузери

Останні 2 версії Chrome, Firefox, Edge, Safari та iOS Safari (`.browserslistrc`). Перевірити список: `npx browserslist`, перевірити префікси: `npx autoprefixer --info`.

## Оптимізація

Зображення (найбільша ширина кожного, сума по 13 файлах):

| Формат                  | Розмір, байт |
| ----------------------- | ------------ |
| Вихідний WebP           | 32 730       |
| AVIF                    | 24 701       |
| WebP (перекодований)    | 30 454       |
| JPEG (запасний варіант) | 91 042       |

Браузер вибирає AVIF, якщо підтримує, інакше WebP, інакше JPEG, а з `srcset`/`sizes` — ще й потрібну ширину. Вихідні файли — прості ілюстрації, тож на реальних фото різниця між форматами буде значно більшою.

CSS:

| Етап                                      | Розмір, байт                    |
| ----------------------------------------- | ------------------------------- |
| lab-07 (`reset.css` + `style.css`)        | 24 291                          |
| `dist/assets/*.css` після `npm run build` | _заповнити після першої збірки_ |

## Публікація

Збірка й деплой виконуються workflow `.github/workflows/deploy.yml` при push у `main`. У `vite.config.js` задано `base: '/landing-keepsake-vite/'`, інакше стилі й зображення не завантажаться на GitHub Pages. У репозиторії: **Settings → Pages → Source: GitHub Actions**.
