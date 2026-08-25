# Промт для воссоздания hero-секции CozyPaws

**Собери одностраничную hero-секцию зоомагазина «CozyPaws» на React, Tailwind CSS и иконках Lucide React. Раскладка занимает высоту вьюпорта (`h-screen`), без прокрутки, с тремя адаптивными брейкпоинтами (мобильный, планшет `md`, десктоп `lg+`). Стек: Vite + TypeScript.**

---

### Шрифты (Google Fonts)

- **Inter** (начертания: 400, 500, 600) — текст интерфейса и контента
- **DM Serif Display** (начертание: 400) — только заголовок обложки

Подключить через `<link>` в `index.html`:

```
https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap
```

Применить через CSS-утилиту `.font-serif-display { font-family: 'DM Serif Display', serif; }` и `body { font-family: 'Inter', sans-serif; }`

---

### Палитра

- Фон: `#EFFDF0` (светлый мятно-зелёный)
- Основной тёмно-зелёный: `#1a3d1a`
- Зелёный при наведении: `#2a5a2a`
- Оранжевый акцент: `#E86A10`
- Оранжевый при наведении: `#d45e0d`

---

### Ссылки на ассеты (все внешние, не скачивать)

| Ассет | URL |
|-------|-----|
| Логотип SVG | `https://polo-pecan-73837341.figma.site/_assets/v11/0ae29d6d9628bede667f90d57bebe81b8f1ec2bf.svg` |
| Аватар | `https://polo-pecan-73837341.figma.site/_assets/v11/e62173d41f91350a59628e8a9a55ae078a886fb9.png?w=128` |
| Карточка товара (Cat House) | `https://polo-pecan-73837341.figma.site/_assets/v11/3e5158dad63d392ade022e81890edc9f54d750bc.png` |
| Видеокарточка (TikTok/YouTube) | `https://polo-pecan-73837341.figma.site/_assets/v11/76be6ec3a93a703b15e9cc01e764a4e3f9d7d2c0.png` |
| Нижнее изображение слева | `https://polo-pecan-73837341.figma.site/_assets/v11/8d44b25186ef45a5789c74668fb781cea4e1ff49.png` |
| Нижнее изображение по центру (самое высокое) | `https://polo-pecan-73837341.figma.site/_assets/v11/96745c4e72ad5c5208e53a885df797fd82cd854a.png?h=1024` |
| Нижнее изображение справа | `https://polo-pecan-73837341.figma.site/_assets/v11/81bd2e7a66b58f3d8f3ad78fd1ebf01af8dfdee1.png` |

---

### Шапка

- Во всю ширину, `px-12` на десктопе, `py-4`, `relative z-30`
- **Слева:** изображение логотипа (205×52 px на десктопе, 130×33 px на мобильном)
- **Навигация по центру (скрыта ниже `md`):** ссылки «Home» (`text-gray-900`), «Shop», «Delivery and payment», «Brands», «Blog» (`text-gray-600`), `text-sm font-medium`, `gap-8`
- **Справа:** кнопка поиска (круг, граница, скрыта ниже `sm`), кнопка избранного (оранжевый круг, белая иконка звезды, бейдж «4»), кнопка корзины (круг, граница, иконка корзины, бейдж «1»), аватар (круг, 40×40)
- Бейджи: `absolute -top-1 -right-1`, 20×20, `bg-orange`, `border-2 border-background`, белый текст 10px bold

---

### Раскладка hero на десктопе (lg+)

**Текстовый слой (z-5):** по центру, `px-12 pt-[5.4rem]`

- Заголовок: `font-serif-display`, цвет `#1a3d1a`, `text-[clamp(60px,7.5vw,110px)]`, `leading-[0.95]`, `tracking-tight`
- Текст: «Everything» (строка 1), «Your Pets Love» (строка 2)
- Каждое слово — `inline-block` со ступенчатой анимацией `animate-word-pop`

**Карточка товара слева:** абсолютное позиционирование `top-[50px] left-12`

- Ширина: `clamp(160px,14vw,260px)`
- Изображение: `aspect-ratio` 260/257, `rounded-2xl`, `overflow-hidden`
- Кнопка-стрелка в правом нижнем углу (тёмно-зелёный круг, иконка `ArrowUpRight`)
- Текст под ней: «Cozy Cat House» цветом `gray-700`, «$49.99» тёмно-зелёным жирным
- Адаптивные размеры шрифта через `clamp`

**Видеокарточка справа:** абсолютное позиционирование `top-[50px] right-12`

- Ширина: `clamp(120px,10vw,177px)`
- Изображение: `aspect-ratio` 177/287, `rounded-2xl`
- Кнопка Play (тёмно-зелёный круг) по центру ближе к низу
- Текст под кнопкой Play: «Watch Product Reviews on TikTok and YouTube»

**Три нижних изображения:** абсолютное позиционирование `bottom-0 left-0 right-0`, `z-10`, `flex items-end`, без зазоров

- Левое изображение: `flex-1`, максимальная высота `min(70vh, 55vw)`
- Центральное изображение: `flex-[1.265]` (шире), максимальная высота `min(85vh, 70vw)`
- Правое изображение: `flex-1`, максимальная высота `min(70vh, 55vw)`
- Все изображения: `w-full h-auto block`

**Оверлеи поверх нижних изображений:**

- Слева: показатель «98K+» со стеком аватаров (аватар + зелёный круг с иконкой `Plus`)
- По центру: белый заголовок «Best Products for Your Pet» + оранжевая кнопка-пилюля «Explore Products» с иконкой `ArrowRight`
- Справа: рейтинг «4.6» с оранжевой залитой иконкой `Star`
- Все позиционируются через `bottom: clamp(20px, 4vh, 50px)`

---

### Раскладка на планшете (md → lg) — как на десктопе, но мельче

- Заголовок: `text-7xl`
- Боковые карточки на `top-[80px]`, `left-4`/`right-4`, меньшие фиксированные ширины (160px/120px)
- Нижние изображения: та же трёхпанельная сетка на flex, `maxHeight` 60vh/75vh/60vh

---

### Раскладка на мобильном (ниже md)

- Верхняя секция: заголовок по центру (36px), подзаголовок, кнопка «Explore Products»
- Две карточки бок о бок (`flex`, `gap-3`): карточка товара (`aspect-square`) + видеокарточка (`aspect-3/4`)
- Строка показателей: «98K+» с аватарами слева, разделитель, «4.6» со звездой справа
- Нижние изображения: та же трёхпанельная сетка на flex, без ограничения по высоте

---

### Анимации (CSS-кейфреймы, собственные классы)

| Класс | Кейфрейм | Длительность | Кривая |
|-------|----------|--------------|--------|
| `.animate-fade-up` | `translateY` 0→30px, `opacity` 0→1 | 0.8s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `.animate-fade-in` | `opacity` 0→1 | 0.6s | `ease-out` |
| `.animate-slide-up` | `translateY` 0→60px | 0.9s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `.animate-slide-in-left` | `translateX` −40px→0 | 0.8s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `.animate-slide-in-right` | `translateX` 40px→0 | 0.8s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `.animate-text-reveal` | `translateY(40px) skewY(3deg) blur(4px)` → none | 1s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `.animate-word-pop` | `translateY(60px) scale(0.7) rotate(-4deg) blur(8px)` → перелёт с отскоком → покой | 0.9s | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `.animate-scale-in` | `scale(0.85)` → 1 | 0.7s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `.animate-photo-reveal` | `translateY(80px) scale(1.02)` → норма | 1.1s | `cubic-bezier(0.16, 1, 0.3, 1)` |

Все используют `animation-fill-mode: both`. `.animate-word-pop` стартует с `opacity: 0`.

**Классы задержек:** от `.delay-100` до `.delay-1200` с шагом 100 мс.

---

### Порядок каскада

1. Шапка проявляется (100–300 мс)
2. Слова заголовка выскакивают (ступенчато 200–600 мс)
3. Боковые карточки въезжают (600–700 мс)
4. Нижние фотографии проявляются снизу вверх (ступенчато 600–900 мс, центральная первой)
5. Оверлеи с показателями и кнопками появляются (1000–1200 мс)

---

### Ключевые технические детали

- Контейнер: `h-screen flex flex-col overflow-hidden` (без прокрутки)
- Шапка: `shrink-0`
- Секция hero: `flex-1 flex flex-col overflow-hidden`
- Все адаптивные раскладки переключаются показом/скрытием (`hidden lg:flex` и т. п.), а не только CSS-медиазапросами
- Активное использование `clamp()` для плавной типографики и отступов
- Используемые иконки Lucide: `Search`, `ShoppingCart`, `Star`, `ArrowUpRight`, `Play`, `ArrowRight`, `Plus`
