import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Bird,
  Bone,
  Cat,
  ChevronDown,
  Dog,
  HeartPulse,
  LayoutGrid,
  MapPin,
  PawPrint,
  Pill,
  Rat,
  Stethoscope,
  Syringe,
  Thermometer,
  Turtle,
  X,
} from 'lucide-react'
import './lumora.css'

/* ------------------------------------------------------------------ */
/* Assets                                                              */
/* ------------------------------------------------------------------ */

/*
  Пути к файлам из public собираются от base, а не пишутся от корня.
  На GitHub Pages сайт лежит в подпапке с именем репозитория, и путь
  вида /band-left.webp увёл бы за её пределы — в разметке сборщик base
  подставляет сам, а в строках внутри кода нет. В разработке BASE_URL
  равен «/», поэтому локально ничего не меняется.
*/
const asset = (name: string) => import.meta.env.BASE_URL + name

const ASSET = {
  /* Логотип из logo.png с рабочего стола. Плашку «ВЕТЕРИНАРНАЯ МЕДИЦИНА
     XXI ВЕКА» убрал, а знак и надпись выровнял по центру друг друга: в
     шапке подпись пришлось бы уменьшить до 4 px, её всё равно не прочесть. */
  logo: asset('vetmir-mark.png'),
  /* Белая версия — отдельным файлом, а не фильтром: brightness(0) invert(1)
     красит и зелёный знак, и синий крест в один белый, и крест исчезает.
     Здесь он вырезан насквозь, сквозь него виден тёмный фон. */
  logoWhite: asset('vetmir-mark-white.png'),
  /* Три кадра нижней ленты. Раньше грузились с чужого CDN и несли вшитую
     плашку двух чужих зелёных; теперь лежат локально и перекрашены в цвет
     кнопки «Записаться на приём». Перекраска шла по тону, а не по заливке:
     у плашки есть градиент и тени от лап, плоская замена цвета съела бы и
     то, и другое.
     Центральный остался палитровым PNG — в нём 256 цветов и мягкая альфа,
     lossless WebP из него выходит в полтора раза тяжелее. */
  bottomLeft: asset('band-left.webp'),
  bottomCenter: asset('band-center.png'),
  bottomRight: asset('band-right.webp'),
}

/* ------------------------------------------------------------------ */
/* Copy                                                                */
/* ------------------------------------------------------------------ */

const NAV = [
  { l: 'Главная', id: 'top' },
  { l: 'Клиники', id: 'clinics' },
  { l: 'Услуги', id: 'services' },
  { l: 'О клинике', id: 'about' },
  { l: 'Цифры', id: 'stats' },
  { l: 'Контакты', id: 'contact' },
]

/* Первым на старом сайте стоит 499-й — его и делаем основным. */
const PHONE = { label: '8 (499) 579-81-81', href: 'tel:+74995798181' }
const PHONE_ALT = { label: '8 (495) 395-04-46', href: 'tel:+74953950446' }

const HEADING = ['Круглосуточно', 'рядом с вашим питомцем']

const SUB =
  'Приём, стационар, операции и выезд врача на дом. Три клиники в Москве, скорая помощь круглосуточно'
/*
  На телефоне та же строка шла подзаголовком, но серым предложением по
  центру — третий подряд блок текста после трёхстрочного заголовка. Тот же
  смысл плитками читается с одного взгляда и занимает на 13px меньше, а
  «круглосуточно» из неё убрано: оно и так стоит первой строкой заголовка.
*/
const SUB_MOBILE = ['Приём', 'Стационар', 'Выезд на дом']

/* Блок «Портфолио» из Lumora занят клиниками: у ветклиники портфолио нет,
   а три адреса ложатся в ту же сетку крупных карточек. */
const CLINICS = [
  {
    metro: 'Шипиловская · Домодедовская',
    address: 'ул. Генерала Белова, 5',
    hours: 'Круглосуточно',
    open: true,
    desc: 'Главная клиника: приём, операционная, стационар и лаборатория. Дежурная смена работает всю ночь',
    photo: asset('clinic-shipilovskaya.webp'),
    alt: 'Вход в клинику «Ветмир» на улице Генерала Белова',
    tags: ['Круглосуточно', 'Стационар', 'Хирургия'],
  },
  {
    metro: 'Крылатское',
    address: 'Осенний бульвар, 5к1',
    hours: '10:00 – 22:00',
    open: true,
    desc: 'Приём по записи, вакцинация, диагностика и груминг. Рядом аптека и зоомагазин',
    photo: asset('clinic-krylatskoe.webp'),
    alt: 'Вход в клинику «Ветмир» на Осеннем бульваре',
    tags: ['Приём', 'Вакцинация', 'Груминг'],
  },
  {
    metro: 'Зюзино · Севастопольская',
    address: 'ул. Керченская, 1Б',
    hours: 'Закрыто на ремонт',
    open: false,
    desc: 'Клиника закрыта на ремонт. Приём ведём на Генерала Белова и Осеннем бульваре',
    photo: asset('clinic-zyuzino.webp'),
    alt: 'Здание клиники «Ветмир» на Керченской улице',
    tags: ['Скоро откроется'],
  },
]

const SERVICES = [
  { n: '01', t: 'Приём и диагностика', d: 'Двадцать специальностей: от терапевта до герпетолога. Своя лаборатория и УЗИ' },
  { n: '02', t: 'Хирургия', d: 'Плановые и экстренные операции. Три кандидата ветеринарных наук в штате' },
  { n: '03', t: 'Стационар', d: 'Наблюдение круглые сутки, капельницы и выхаживание после операции' },
  { n: '04', t: 'Скорая помощь', d: 'Дежурная смена без выходных. Звоните — подскажем, что делать до приезда врача' },
  { n: '05', t: 'Вызов врача на дом', d: 'По Москве. Приём, анализы и вакцинация без поездки в клинику' },
  { n: '06', t: 'Аптека и зоомагазин', d: 'Препараты, корма и уход — в клинике, без поиска по городу' },
]

/* Счётчик набирает значение при прокрутке, поэтому цифры хранятся числом. */
const STATS = [
  { v: 10, suf: '+', l: 'лет в ветеринарии Москвы' },
  { v: 3, suf: '', l: 'кандидата наук в штате' },
  { v: 3000, suf: '+', l: 'проведённых операций' },
  { v: 24, suf: '/7', l: 'скорая помощь и стационар' },
]

/*
  Кого лечим. Рептилии здесь не для красоты: в списке специальностей клиники
  есть герпетолог, как и орнитолог с ратологом — то есть птицами, грызунами
  и рептилиями занимаются отдельные врачи.

  Снимки — вырезки с альфа-каналом, обрезанные по границам непрозрачных
  пикселей: у исходников поля были разные, от 20 до 300 px.

  h — высота вырезки в процентах от стороны квадрата. Всё сверх 100% выходит
  за верхнюю кромку плитки. У попугая на процент больше: он самый узкий
  (0.68 ширина к высоте), и лишняя высота не гонит его вбок.

  Ящерицу пришлось перекадрировать: в полный рост она 1.03 — почти квадрат,
  и на 131% вылезла бы на соседнюю плитку. Взял голову с передней лапой,
  стало 0.755, как у кошки.

  Если photo не задан, плитка покажет иконку той же величины — вёрстка
  не сдвинется.
*/
const PETS: { icon: typeof Dog; name: string; photo?: string; h?: string }[] = [
  { icon: Dog, name: 'Собаки', photo: asset('pets/dog.webp'), h: '130%' },
  { icon: Cat, name: 'Кошки', photo: asset('pets/cat.webp'), h: '131%' },
  { icon: Bird, name: 'Птицы', photo: asset('pets/bird.webp'), h: '132%' },
  { icon: Rat, name: 'Грызуны', photo: asset('pets/rodent.webp'), h: '115%' },
  { icon: Turtle, name: 'Рептилии', photo: asset('pets/reptile.webp'), h: '131%' },
]

const BAND = [
  { kind: 'light', text: 'Мы' },
  { kind: 'accent', text: 'Лечим' },
  { kind: 'dark', text: '' },
  { kind: 'bright', text: 'Всегда' },
]

/*
  Слева в блоке «О клинике», на месте водяного знака с лапой, стоит врач
  с собакой. Исходник — вырезка с прозрачным фоном и нарисованной тенью,
  1629×2036, где поля доходили до 315px: обрезал по границам непрозрачных
  пикселей (1198×1517, доля 0.790) и пересохранил в WebP — 1.77 МБ
  превратились в 97 КБ. Альфа при этом не пострадала: у libwebp она
  сжимается без потерь, и мягкая растяжка тени не распалась на ступени.

  Фигура стоит прямо на фоне секции, без подложки: вырезка наполовину
  прозрачная, и сквозь просветы видно лапу за спиной. Квадрат-подложка
  эти просветы бы залил.

  Если путь пустой, на место вернётся лапа — вёрстка не сломается.
*/
const ABOUT_PET = {
  src: asset('vet-with-dog.webp'),
  alt: 'Ветеринарный врач «Ветмира» с собакой на руках',
}

/*
  Текст раскрывается по кнопке «Почему нам доверяют». Основа — раздел
  «Преимущества нашей ветеринарной клиники» с действующего сайта, но
  переписанный: там пять абзацев сплошного канцелярита («предоставляет
  максимально удобные условия», «высококвалифицированные сотрудники»),
  который никто не дочитывает. Смысл сохранён весь, включая зоогостиницу,
  про которую в остальном макете не сказано ни слова.

  Каждый пункт отвечает на «и что мне с того»: не «есть стационар», а
  «не возить питомца на процедуры каждый день».

  Цифры — двадцать специальностей, три кандидата наук — сняты со старого
  сайта и требуют сверки с клиникой: он мог устареть.
*/
const WHY = [
  {
    t: 'Работаем ночью, а не «до последнего клиента»',
    d: 'Врач выезжает на дом в любое время суток. Клиника на Генерала Белова открыта круглосуточно: ночью там дежурная смена, операционная и стационар, а не один администратор у телефона',
  },
  {
    t: 'Стационар вместо ежедневных поездок',
    d: 'Животное остаётся под наблюдением круглые сутки — капельницы, перевязки, контроль после операции. Не нужно каждый день возить питомца через город на десятиминутную процедуру',
  },
  {
    t: 'Аптека и зоомагазин в том же здании',
    d: 'Препараты по назначению, корма и уход — сразу после приёма. Не придётся искать по городу лекарство, которого нет в обычной аптеке',
  },
  {
    t: 'Зоогостиница на время отъезда',
    d: 'Питомец живёт под присмотром врачей, а не в передержке у частника. Если что-то случится, помощь окажут на месте и в ту же минуту',
  },
  {
    t: 'Двадцать специальностей и своя лаборатория',
    d: 'От терапевта до герпетолога, три кандидата ветеринарных наук в штате. Анализы и УЗИ делают здесь же — результат в день приёма, а не через неделю',
  },
]
/* ------------------------------------------------------------------ */
/* Bottom band                                                         */
/* ------------------------------------------------------------------ */

/*
  Нижняя лента фотографий. Три вырезки стоят вплотную, поэтому высота ленты
  жёстко связана с её шириной: уменьшить высоту, не сузив ленту, можно только
  обрезав животных. Значит, регулируем ширину.

  Центральное фото занимает 38.74% ширины ленты при пропорции 977×1024, то
  есть его высота = 0.406 × ширины ленты. Обратный коэффициент 2.46 переводит
  свободную по высоте область в допустимую ширину.
*/
const bandWidth = (bandTop: number) =>
  `min(100vw, max(320px, calc((100vh - ${bandTop}px) * 2.46)))`

/*
  Цветная плашка вшита в сами PNG — это не CSS-фон. Замерено по пикселям
  файлов (распаковка IDAT, поиск первой полностью непрозрачной строки):

    левый   870×762  — плашка с ряда 382 → 49.87% высоты
    правый  870×816  — плашка с ряда 436 → 46.57% высоты
    центр   977×1024 — плашка с ряда 687 → 32.91% высоты

  Проценты у левого и правого разные, но на экране дают одну линию: при
  ширине ленты 1230px верх плашки у всех трёх приходится на y≈736.

  Цвет ниже обязан совпадать с пикселями PNG до последнего разряда —
  боковые продолжения плашки стыкуются с кадрами встык, и расхождение в
  один разряд даёт видимый шов. Поэтому кадры пересохранены без потерь.

  Центральная плашка — цвет кнопки «Записаться на приём», боковые на ступень
  светлее: это второй зелёный сайта, тот же, что у светлых тёмных панелей
  ниже. Ступенька отделяет центральный кадр от боковых, но лента остаётся
  одной полосой, а весь текст на ней — белым.
*/
const PLAQUE_CENTER = '#0a5546'
const PLAQUE_SIDE = '#0e7a63'
const LEFT_BLOCK_H = '49.87%'
const RIGHT_BLOCK_H = '46.57%'

/*
  Отступ подписей от низа экрана. Считается круче, чем линейно по высоте
  окна: сама лента сжимается быстрее, чем vh, — её ширина завязана на
  (100vh − 430), — и на широком низком окне плашка становится тоньше
  подписи, которая на ней стоит. При 900px даёт 29.7, при 600px — 13.8,
  и подписи остаются внутри плашки в обоих случаях.
*/
const STAT_BOTTOM = 'clamp(8px, calc(5.3vh - 18px), 40px)'

type Sizes = { side?: string; center?: string; row?: string }

/*
  Цифры стоят по краям ленты — на боковых плашках. Белый на #0e7a63 даёт
  5.3:1; подпись под ним держат на 90%, а не на 80%, как было на тёмной
  плашке: на 80% выходит 3.98:1, ниже нормы для 11–13px.

  Кегль — меньшее из двух: доли окна и доли колонки. По окну текст читаем,
  но на широком и низком окне лента сжимается по высоте вслед за vh, а vw
  остаётся большим — подпись переставала помещаться на плашке и вылезала
  на кремовый фон, где белого не видно. Доля колонки это ограничивает, но
  вступает в дело только когда лента и правда стала узкой: на 1440×900 и
  1366×768 работает vw и кегль прежний, на 1280×600 включается cqw.
*/
function Stat({ value, caption }: { value: string; caption: string }) {
  return (
    <div className="text-white">
      <div
        className="font-display leading-none"
        style={{ fontSize: 'clamp(min(20px, 8.5cqw), min(2vw, 12cqw), 34px)' }}
      >
        {value}
      </div>
      <div
        className="mt-1 font-medium opacity-90"
        style={{ fontSize: 'clamp(min(11px, 4.6cqw), min(0.85vw, 5cqw), 13px)' }}
      >
        {caption}
      </div>
    </div>
  )
}

/*
  Телефон стоит на тёмной плашке центрального фото, а по плашке разложены
  лапы ретривера. Прочитал их по пикселям: на высоте, где сидит блок, лапы
  занимают 80–93% ширины кадра, свободный коридор — 0–80%, то есть блок по
  центру не должен быть шире 60% ширины колонки.

  Поэтому кегль считается не от ширины окна, а от ширины самой колонки
  (cqw): колонка сужается вместе с лентой, и текст сужается вместе с ней.

  Замерено на 1440: коридор между лапами 583–828 (244px), номер занимает
  603–822. Нижние границы clamp нарочно оставлены мелкими — на узком
  десктопе кегль упирается в них, а коридор продолжает сужаться, и более
  крупный минимум завёл бы номер прямо на лапы.
*/
function EmergencyCall({ compact = false }: { compact?: boolean }) {
  return (
    <div className="text-center text-white">
      {/* Белый 70% на #0a5546 — 5.2:1, норма AA для мелкого текста. */}
      <div
        className="font-medium tracking-wide text-white/70 uppercase"
        style={{ fontSize: compact ? 13 : 'clamp(10px, 3.4cqw, 17px)' }}
      >
        Скорая помощь
      </div>
      <a
        href={PHONE.href}
        /* py-1 поднимает область нажатия выше 24px — минимум WCAG 2.5.8.
           Вверх расти нельзя: там начинаются лапы. */
        className="inline-block py-1 font-semibold whitespace-nowrap transition-opacity hover:opacity-80"
        style={{ fontSize: compact ? 24 : 'clamp(12px, 5.6cqw, 28px)' }}
      >
        {PHONE.label}
      </a>
    </div>
  )
}

function BottomBand({ sizes = {} }: { sizes?: Sizes }) {
  return (
    <div className="relative">
      <div className="mx-auto flex w-full items-end" style={{ maxWidth: sizes.row }}>
        {/*
          -mr-px здесь по той же причине, что и у продолжений плашки: колонки
          получают дробную ширину (354.125 / 447.953 / 354.109 при окне 1440),
          браузер сглаживает край каждой картинки, и на стыке между кадрами
          сквозь сглаживание просвечивал кремовый фон — тонкая светлая
          полоска. Боковые кадры заходят на центральный на пиксель, и сглаженный
          край ложится уже не на фон, а на соседнюю заливку.
        */}
        <div className="animate-photo-reveal delay-800 relative -mr-px flex-1" style={{ containerType: 'inline-size' }}>
          <img
            src={ASSET.bottomLeft}
            alt="Такса выглядывает из-за плашки"
            className="block h-auto w-full"
            style={{ maxHeight: sizes.side }}
          />
          {/* Продолжение плашки до левого края экрана. -mr-px убирает
              волосяной шов на дробных ширинах. */}
          <div
            aria-hidden="true"
            className="absolute right-full bottom-0 -mr-px w-screen"
            style={{ height: LEFT_BLOCK_H, backgroundColor: PLAQUE_SIDE }}
          />
          {/*
            Цифра стоит под таксой, а не у края экрана: у края она висела
            сама по себе, вдали от кадра, к которому относится. Внутри
            колонки она центрируется по животному и держится за него при
            любой ширине окна. Лапы у таксы приходятся на края кадра,
            середина свободна — подпись в неё помещается.
          */}
          <div
            className="animate-scale-in delay-1000 absolute inset-x-0 flex justify-center px-2 text-center"
            style={{ bottom: STAT_BOTTOM }}
          >
            <Stat value="более 10 лет" caption="лечим животных в Москве" />
          </div>
        </div>

        <div
          className="animate-photo-reveal delay-600 relative"
          style={{ flex: '1.265', containerType: 'inline-size' }}
        >
          <img
            src={ASSET.bottomCenter}
            alt="Золотистый ретривер"
            className="block h-auto w-full"
            style={{ maxHeight: sizes.center }}
          />
          <div
            className="animate-scale-in delay-1100 absolute inset-x-0 flex justify-center px-3"
            style={{ bottom: STAT_BOTTOM }}
          >
            <EmergencyCall />
          </div>
        </div>

        <div className="animate-photo-reveal delay-900 relative -ml-px flex-1" style={{ containerType: 'inline-size' }}>
          <img
            src={ASSET.bottomRight}
            alt="Рыжий кот выглядывает из-за плашки"
            className="block h-auto w-full"
            style={{ maxHeight: sizes.side }}
          />
          <div
            aria-hidden="true"
            className="absolute left-full bottom-0 -ml-px w-screen"
            style={{ height: RIGHT_BLOCK_H, backgroundColor: PLAQUE_SIDE }}
          />
          <div
            className="animate-scale-in delay-1200 absolute inset-x-0 flex justify-center px-2 text-center"
            style={{ bottom: STAT_BOTTOM }}
          >
            {/* неразрывный пробел в числе, чтобы «3 000+» не переносилось */}
            <Stat value={'3 000+'} caption="операций провели" />
          </div>
        </div>
      </div>

    </div>
  )
}
/* Hero copy                                                           */
/* ------------------------------------------------------------------ */

function Heading({ style }: { style?: React.CSSProperties }) {
  return (
    <h1 className="font-display text-ink" style={style}>
      {HEADING.map((line, i) => (
        /* pb-[0.14em] спасает подстрочные элементы кириллицы (р, у, д)
           от обрезки маской. */
        <span key={line} className="block overflow-hidden pb-[0.14em]">
          <span
            className="animate-text-reveal inline-block"
            /* «Круглосуточно» — единственное обещание, ради которого сюда
               заходят ночью, поэтому оно набрано цветом плашки, а не
               чернилами: 5.2:1 на кремовом. */
            style={{ animationDelay: 200 + i * 120 + 'ms', color: i === 0 ? '#b04a12' : undefined }}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  )
}

/* Открыть модалку нужно из первого экрана, из меню и из подвала. Чтобы не
   тянуть проп через три раскладки героя, держим одну ссылку на функцию —
   App подставляет в неё настоящий обработчик. */
const modalBus = { open: () => {} }

/*
  Кнопки первого экрана взяты из Lumora: «таблетка» с круглым бейджем и
  стрелкой, которая едет вправо на наведении. Раскладка первого экрана
  не тронута — поменялись только сами кнопки.
*/
function Actions({ stacked = false }: { stacked?: boolean }) {
  const book = (
    <button type="button" className="pill dark witharrow ar-right" onClick={() => modalBus.open()}>
      <span>
        Записаться на приём
        <span className="badge">
          <ArrowRight className="ic" strokeWidth={2.2} aria-hidden="true" />
        </span>
      </span>
    </button>
  )
  const call = (
    <a href={PHONE.href} className="pill ghost noarrow">
      <span>Вызвать врача на дом</span>
    </a>
  )

  if (stacked) {
    return (
      <div className="animate-fade-up delay-700 flex flex-col items-center gap-2">
        {book}
        {call}
      </div>
    )
  }
  return (
    <div className="animate-fade-up delay-700 flex flex-wrap items-center justify-center gap-3">
      {book}
      {call}
    </div>
  )
}
/* Hero layouts                                                        */
/* ------------------------------------------------------------------ */

function DesktopHero() {
  return (
    <div className="relative hidden h-full w-full lg:block">
      <div className="relative z-[5] px-12 pt-6 text-center">
        <Heading
          style={{
            fontSize: 'clamp(38px, 3.9vw, 58px)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
          }}
        />
        <p className="animate-fade-up delay-500 text-ink/70 mx-auto mt-4 max-w-[640px] text-[17px] leading-relaxed">
          {SUB}
        </p>
        <div className="mt-6">
          <Actions />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <BottomBand
          sizes={{ row: bandWidth(430), side: 'min(70vh, 55vw)', center: 'min(85vh, 70vw)' }}
        />
      </div>
    </div>
  )
}

function TabletHero() {
  return (
    <div className="relative hidden h-full w-full md:block lg:hidden">
      {/*
        На планшете лента упирается в 100vw и выше 40.6vw не становится, так
        что над ней остаётся 600+ px пустоты — прижимать текст к шапке значит
        оставить дыру. Поэтому блок центрируется в свободной зоне: её высота
        это высота окна минус высота ленты (40.6vw), но не меньше 280px.
      */}
      <div
        className="relative z-[5] flex flex-col justify-center px-8 text-center"
        style={{ height: 'max(calc(100vh - 40.6vw), 280px)' }}
      >
        <Heading style={{ fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.03em' }} />
        <p className="animate-fade-up delay-500 text-ink/70 mx-auto mt-5 max-w-[520px] text-[16px] leading-relaxed">
          {SUB}
        </p>
        <div className="mt-7">
          <Actions />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <BottomBand sizes={{ row: bandWidth(280), side: '60vh', center: '75vh' }} />
      </div>
    </div>
  )
}

function MobileHero() {
  return (
    <div className="relative h-full w-full overflow-hidden md:hidden">
      <div className="relative z-[5] px-4 pt-3 text-center">
        <Heading style={{ fontSize: 30, lineHeight: 1.1, letterSpacing: '-0.03em' }} />
        <ul className="hero-chips animate-fade-up delay-500">
          {SUB_MOBILE.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
        <div className="mt-5">
          <Actions stacked />
        </div>
      </div>

      {/* Кадр с ретривером шире экрана только на узких телефонах. На широком
          и низком (414×736) он уже экрана, и по бокам вылезал бы светлый фон,
          поэтому под ним лежит полоса того же цвета: 32.91% от высоты кадра —
          ровно столько занимает плашка внутри PNG, а кадр — 54% высоты блока,
          значит полоса — 17.77%. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[17.77%]"
        style={{ backgroundColor: PLAQUE_CENTER }}
      />
      <img
        src={ASSET.bottomCenter}
        alt="Золотистый ретривер"
        className="animate-photo-reveal delay-600 absolute bottom-0 left-1/2 h-[54%] w-auto max-w-none -translate-x-1/2"
      />
      <div
        className="animate-scale-in delay-1100 absolute inset-x-0 flex justify-center px-4"
        style={{ bottom: 'clamp(14px, 2.6vh, 28px)' }}
      >
        <EmergencyCall compact />
      </div>
    </div>
  )
}


/* ------------------------------------------------------------------ */
/* Механика Lumora                                                     */
/* ------------------------------------------------------------------ */

/* Плавная прокрутка. Lenis перехватывает колесо и двигает страницу сам,
   поэтому scroll-behavior:smooth в CSS выключен — иначе плавность
   накладывалась бы дважды. */
function useLenis() {
  const ref = useRef<{ stop: () => void; start: () => void } | null>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let alive = true
    let inst: { raf: (t: number) => void; destroy: () => void; stop: () => void; start: () => void }
    import('lenis').then(({ default: Lenis }) => {
      if (!alive) return
      inst = new Lenis({ smoothWheel: true })
      ref.current = inst
      const raf = (t: number) => {
        if (!alive) return
        inst.raf(t)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    })
    return () => {
      alive = false
      ref.current = null
      if (inst) inst.destroy()
    }
  }, [])

  return ref
}

function useScrollLock(lenis: ReturnType<typeof useLenis>) {
  return (locked: boolean) => {
    const html = document.documentElement
    if (locked) {
      lenis.current?.stop()
      html.style.position = 'relative'
      html.style.overflow = 'hidden'
      html.style.height = '100%'
    } else {
      lenis.current?.start()
      html.style.removeProperty('position')
      html.style.removeProperty('overflow')
      html.style.removeProperty('height')
    }
  }
}

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' })
}

/*
  Ревилы. Разметка размечается атрибутом data-rv: fade / scale / lines / words.
  Строки и слова заранее раскладываются по span-ам с нарастающей задержкой.

  Скрытый по умолчанию текст — риск: не сработает наблюдатель, и половина
  страницы останется невидимой. IntersectionObserver вызывает колбэк сразу
  после observe(); если через 1.5 с вызова не было вообще, показываем всё.
*/
function useReveals(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-rv]'))

    for (const el of nodes) {
      if (el.dataset.rv === 'lines') {
        const stagger = parseInt(el.dataset.stagger || '0', 10)
        const base = parseFloat((el.style.getPropertyValue('--d') || '0').replace('ms', '')) || 0
        el.querySelectorAll<HTMLElement>(':scope > .ln > span').forEach((s, i) => {
          s.style.transitionDelay = base + i * stagger + 'ms'
        })
      }
      if (el.dataset.rv === 'words' && !el.dataset.split) {
        el.dataset.split = '1'
        const stagger = parseInt(el.dataset.stagger || '35', 10)
        let i = 0
        const walk = (node: Node) => {
          ;[...node.childNodes].forEach((child) => {
            if (child.nodeType === 3) {
              const parts = (child.textContent || '').split(/(\s+)/)
              const frag = document.createDocumentFragment()
              parts.forEach((p) => {
                if (!p.trim()) {
                  frag.appendChild(document.createTextNode(p))
                  return
                }
                const s = document.createElement('span')
                s.className = 'wd'
                s.textContent = p
                s.style.transitionDelay = i * stagger + 'ms'
                i++
                frag.appendChild(s)
              })
              ;(child as ChildNode).replaceWith(frag)
            } else if (child.nodeType === 1) walk(child)
          })
        }
        walk(el)
      }
    }

    const showAll = () => nodes.forEach((n) => n.classList.add('is-in'))
    if (!('IntersectionObserver' in window)) {
      showAll()
      return
    }

    let delivered = false
    const io = new IntersectionObserver(
      (entries) => {
        delivered = true
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    nodes.forEach((n) => io.observe(n))

    const guard = window.setTimeout(() => {
      if (!delivered) {
        io.disconnect()
        showAll()
      }
    }, 1500)

    return () => {
      window.clearTimeout(guard)
      io.disconnect()
    }
  }, [ready])
}

const MONTHS_RU = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

function useClock() {
  const [t, setT] = useState({ time: '', date: '' })
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setT({
        time: String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'),
        date: d.getDate() + ' ' + MONTHS_RU[d.getMonth()] + ' ' + d.getFullYear(),
      })
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  return t
}

/* Корневой кегль растёт на экранах шире 1920px — как в оригинале. Уменьшать
   его не даём: геометрия первого экрана считалась при 16px. */
function useWideScreenScale() {
  useEffect(() => {
    const apply = () => {
      const size = 16 + ((window.innerWidth - 1920) / 1920) * 16 * 0.6666
      if (size > 16) document.documentElement.style.fontSize = size + 'px'
      else document.documentElement.style.removeProperty('font-size')
    }
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])
}

/*
  Шапка едет вместе со страницей, а не остаётся на первом экране.

  Держать её видимой всё время нельзя: на телефоне полоса занимает 78px —
  десятую часть экрана, и на длинных секциях это заметно мешает. Поэтому
  на движении вниз она уезжает вверх, на движении вверх возвращается: меню
  оказывается под рукой в любой точке страницы, но не закрывает её.

  stuck включается сразу после первого экрана — прозрачной шапке нужен фон,
  иначе тёмные подписи лягут на фотографии клиник.

  Порог в 8px гасит дрожь тачпада и инерцию Lenis, а порог в 160px не даёт
  шапке спрятаться, пока пользователь ещё в пределах первого экрана.

  Опрос рядом со слушателем нужен потому, что страницу крутит Lenis своим
  циклом rAF: в фоновой вкладке цикл замирает вместе с событиями скролла,
  и без опроса шапка застывает в том виде, в каком её застали.
*/
function useStickyHeader() {
  const [state, setState] = useState({ stuck: false, gone: false })

  useEffect(() => {
    let last = window.scrollY
    let gone = false
    const check = () => {
      const y = window.scrollY
      if (Math.abs(y - last) > 8) {
        gone = y > last && y > 160
        last = y
      }
      setState((prev) =>
        prev.stuck === y > 24 && prev.gone === gone ? prev : { stuck: y > 24, gone },
      )
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    const poll = window.setInterval(check, 250)
    return () => {
      window.removeEventListener('scroll', check)
      window.clearInterval(poll)
    }
  }, [])

  return state
}

/* ------------------------------------------------------------------ */
/* Фоновые знаки                                                       */
/* ------------------------------------------------------------------ */

/*
  Лапы и предметы из ветеринарного кабинета, разложенные по секциям
  поштучно. Почти каждый знак выходит за край секции: так он читается
  подложкой, а не забытой посреди страницы иконкой, и заодно держится
  подальше от текста.

  Прозрачность 0.055 — на белом это #f2f2f2: знак различим, а тёмный
  текст на нём держит 12.2:1 вместо 13.5, то есть до нормы AA далеко в
  запасе. Мелкие знаки на телефоне скрыты: там секции узкие и плотные,
  подложка превращается в грязь.
*/
type DecoItem = {
  icon: typeof PawPrint
  size: string
  top?: string
  bottom?: string
  left?: string
  right?: string
  rot?: number
  lgOnly?: boolean
}

/*
  Знаки у краёв секций вылезают за край и обрезаются — так и задумано.
  Знаки, стоящие целиком внутри, наоборот, посажены в свободные полосы:
  верхнее и нижнее поля секции, где заведомо нет ни текста, ни карточек.
  Замерено на 1440: у клиник свободная полоса снизу 112px (карточки
  кончаются на 1923, секция — на 2035), у «кого лечим» по 96px сверху и
  снизу, у услуг заголовок занимает только левую половину, поэтому справа
  и по центру сверху пусто на 260px в высоту.

  Знаки с долей по горизонтали (left в процентах) стоят ближе к середине,
  чтобы страница не выглядела обклеенной только по краям. Все они видны
  от 1024px: на телефоне полосы между блоками узкие, и знак посередине
  неизбежно ложится на текст.
*/
const DECOR: Record<string, DecoItem[]> = {
  home: [
    { icon: PawPrint, size: '11rem', left: '-2rem', top: '16%', rot: -18, lgOnly: true },
    { icon: Stethoscope, size: '9rem', right: '-1.5rem', top: '11%', rot: 12, lgOnly: true },
    /* между кнопками и лентой остаётся 46px по высоте и пустой левый край */
    { icon: PawPrint, size: '5rem', left: '22%', top: '38%', rot: 12, lgOnly: true },
  ],
  /*
    Карточек клиник три, а сетка двухколоночная — правая половина второго
    ряда (x 725–1385, y 1507–1923) остаётся пустой. Сначала туда легла
    цепочка из трёх следов, но вместе с двумя лапами внизу секции их
    выходило пять на один экран, и угол читался как россыпь одинаковых
    пятен. Осталась одна крупная вещь и одна лапа рядом.
  */
  clinics: [
    { icon: PawPrint, size: '5rem', left: '4%', bottom: '0.5rem', rot: 14 },
    { icon: Stethoscope, size: '10rem', left: '57%', top: '58%', rot: -12, lgOnly: true },
    { icon: PawPrint, size: '4.5rem', left: '74%', top: '76%', rot: -22, lgOnly: true },
    { icon: Syringe, size: '7rem', right: '-2rem', top: '1.5rem', rot: -25, lgOnly: true },
  ],
  pets: [
    { icon: Bone, size: '5.5rem', left: '1rem', top: '0.75rem', rot: -12 },
    { icon: PawPrint, size: '4.5rem', left: '46%', top: '0.75rem', rot: 16, lgOnly: true },
    { icon: HeartPulse, size: '5.5rem', right: '2rem', bottom: '0.25rem', rot: 6, lgOnly: true },
  ],
  about: [{ icon: Syringe, size: '5.5rem', left: '45%', top: '1rem', rot: -14, lgOnly: true }],
  services: [
    { icon: Stethoscope, size: '14rem', right: '-3rem', top: '2rem', rot: 8 },
    { icon: Thermometer, size: '6rem', left: '45%', top: '3rem', rot: 20, lgOnly: true },
    { icon: Pill, size: '6rem', left: '2rem', bottom: '1.25rem', rot: 22, lgOnly: true },
    { icon: Bone, size: '5rem', left: '48%', bottom: '0.75rem', rot: -10, lgOnly: true },
  ],
}

function Decor({ where }: { where: keyof typeof DECOR }) {
  return (
    <>
      {DECOR[where].map((d, i) => (
        <d.icon
          key={i}
          className={'ic deco' + (d.lgOnly ? ' deco-lg' : '')}
          strokeWidth={1.1}
          aria-hidden="true"
          /* Размер идёт переменной, а не готовым font-size: инлайновое
             свойство перебило бы медиазапрос, которым знаки ужимаются
             на узком экране. */
          style={
            {
              '--deco-size': d.size,
              top: d.top,
              bottom: d.bottom,
              left: d.left,
              right: d.right,
              transform: `rotate(${d.rot ?? 0}deg)`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Секции                                                              */
/* ------------------------------------------------------------------ */

function Loader({ out, pct }: { out: boolean; pct: number }) {
  return (
    <div id="loader" className={out ? 'out' : ''}>
      <div className="center">
        <img className="brandmark" src={ASSET.logoWhite} alt="" />
        <p className="tag">Ветеринарная медицина XXI века</p>
      </div>
      <div className="prog">
        <div className="track">
          <div className="fill" style={{ width: pct + '%' }} />
        </div>
        <div className="meta">
          <span>Загрузка</span>
          <span className="num">{String(pct).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  )
}

function SiteHeader({
  onMenu,
  clock,
  stuck,
  gone,
}: {
  onMenu: () => void
  clock: { time: string; date: string }
  stuck: boolean
  gone: boolean
}) {
  return (
    <header
      id="site-header"
      className="rv-fade"
      data-rv="fade"
      /*
        Состояние шапки — атрибутами, а не классами: класс is-in вешает на
        неё наблюдатель ревилов напрямую в DOM, и React, переписывая
        className на новое состояние, стирал бы его вместе с появлением —
        шапка оставалась бы с opacity:0. Постоянную строку className React
        не трогает.
      */
      data-stuck={stuck || undefined}
      data-gone={gone || undefined}
      style={{ '--y': '-14px', '--d': '150ms' } as React.CSSProperties}
    >
      <div className="shell bar">
        <button className="brandbtn" onClick={() => scrollToId('top')} aria-label="Ветмир — наверх">
          <img src={ASSET.logo} alt="Ветмир — ветеринарная клиника" width={1202} height={300} />
        </button>

        <nav className="main" aria-label="Основная навигация">
          <ul>
            {NAV.slice(0, 5).map((it) => (
              <li key={it.id}>
                <button className="navlift" onClick={() => scrollToId(it.id)}>
                  {it.l}
                </button>
              </li>
            ))}
            <li>
              <button className="navlift" onClick={() => modalBus.open()}>
                Контакты
              </button>
            </li>
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div id="clock" className="chip">
            <span className="lbl">Москва</span>
            <span className="t">{clock.time}</span>
            <span className="sep">•</span>
            <span className="d">{clock.date}</span>
          </div>
          <button id="menu-btn" className="chip" aria-haspopup="dialog" onClick={onMenu}>
            <span className="inner">
              <LayoutGrid className="ic" style={{ fontSize: '.875rem' }} aria-hidden="true" />
              <span className="word">Меню</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

function About() {
  const [why, setWhy] = useState(false)

  return (
    <section id="about" className="has-deco">
      <Decor where="about" />
      <div className="shell grid">
        {/*
          Лапа остаётся только как замена фотографии. Вместе с фигурой она
          не работала: главная подушечка пряталась за врачом, наружу торчали
          два пальца, и вместо лапы читались случайные серые круги.
        */}
        <div className="globe-block">
          {ABOUT_PET.src ? (
            <div className="about-figure">
              <img className="about-pet" src={ABOUT_PET.src} alt={ABOUT_PET.alt} decoding="async" />
            </div>
          ) : (
            <PawPrint className="ic globe-bg" aria-hidden="true" />
          )}
        </div>

        <div className="stmt">
          <h2 data-rv="words" data-stagger="35">
            Мы лечим животных, которых любят, —{' '}
            <span className="mut">
              приём, операции и стационар круглые сутки, а если нужно — приедем сами
            </span>
          </h2>

          {/*
            Подпись про три клиники переехала сюда из левой колонки: там она
            висела внизу сама по себе, далеко и от фотографии, и от текста.
            Здесь она заодно уравновешивает низ блока — после удаления
            соцсетей под линией оставалась одна кнопка.
          */}
          {/*
            Подвал и раскрывающийся текст лежат в общей обёртке: у .stmt
            между детьми зазор 2.5rem, и свёрнутая панель нулевой высоты
            всё равно добавляла бы его к низу блока.
          */}
          <div className="about-tail rv-fade" data-rv="fade" style={{ '--y': '12px', '--d': '200ms' } as React.CSSProperties}>
            <div className="about-foot">
              <div className="globe-note">
                <MapPin className="ic" aria-hidden="true" />
                <span>Три клиники в Москве и выезд врача на дом по всему городу</span>
              </div>
              <button
                className={'pill ghost witharrow ar-right why-btn' + (why ? ' on' : '')}
                aria-expanded={why}
                aria-controls="why-panel"
                onClick={() => setWhy((v) => !v)}
              >
                <span>
                  {why ? 'Свернуть' : 'Почему нам доверяют'}
                  <span className="badge">
                    <ArrowRight className="ic" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                </span>
              </button>
            </div>

            {/*
              Раскрытие через grid-template-rows: 0fr → 1fr — единственный
              способ довести высоту до auto плавно, без замера в коде и без
              max-height наугад, от которого текст либо обрезается, либо
              открывается рывком.
            */}
            <div id="why-panel" className={'why' + (why ? ' open' : '')} aria-hidden={!why}>
              <div className="why-inner">
                <ul>
                  {WHY.map((w, i) => (
                    <li key={w.t} style={{ '--i': i } as React.CSSProperties}>
                      <h3>{w.t}</h3>
                      <p>{w.d}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Pets() {
  return (
    <section id="pets" className="has-deco">
      <Decor where="pets" />
      <div className="shell">
        <div className="head">
          <h2 data-rv="lines" style={{ '--d': '120ms' } as React.CSSProperties}>
            <span className="ln">
              <span>Мы лечим не только собак и кошек</span>
            </span>
          </h2>
        </div>

        <ul className="pet-grid">
          {PETS.map((p, i) => (
            <li
              key={p.name}
              className="rv-fade"
              data-rv="fade"
              style={{ '--y': '28px', '--d': i * 80 + 'ms' } as React.CSSProperties}
            >
              <button type="button" className="pet-tile" onClick={() => modalBus.open()}>
                {/* Квадрат держит высоту в потоке, а вырезка внутри него
                    прижата к низу и выше него — так животное выходит за
                    верхнюю кромку плитки. alt пустой: подпись под плиткой
                    уже говорит, кто это, дублировать нечего. */}
                <span className={'slot' + (p.photo ? '' : ' ph')}>
                  {p.photo ? (
                    <img
                      className="shot"
                      src={p.photo}
                      alt=""
                      decoding="async"
                      style={{ height: p.h }}
                    />
                  ) : (
                    <p.icon className="ic" strokeWidth={1.4} aria-hidden="true" />
                  )}
                </span>
                <span className="nm">{p.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Band() {
  return (
    <section id="band" aria-hidden="true">
      <ul className="shell">
        {BAND.map((b, i) => (
          <li
            key={b.kind}
            className="rv-fade"
            data-rv="fade"
            style={{ '--y': '28px', '--d': i * 120 + 'ms' } as React.CSSProperties}
          >
            <div className={'tile t-' + b.kind}>
              {b.kind === 'dark' ? <ArrowRight className="ic" strokeWidth={2} /> : b.text}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Clinics() {
  return (
    <section id="clinics" className="has-deco">
      <Decor where="clinics" />
      <div className="shell">
        <div className="head">
          <h2 data-rv="lines" style={{ '--d': '120ms' } as React.CSSProperties}>
            <span className="ln">
              <span>Три клиники в Москве</span>
            </span>
          </h2>
        </div>

        <ul className="cards">
          {CLINICS.map((c, i) => (
            <li
              key={c.address}
              className="rv-fade"
              data-rv="fade"
              style={{ '--y': '48px', '--d': i * 90 + 'ms' } as React.CSSProperties}
            >
              <article className={'clinic-card' + (c.open ? '' : ' closed')}>
                {/* Без loading="lazy": блок адресов идёт вторым, на большом мониторе
                    он почти над сгибом, и отложенная загрузка дала бы пустые
                    карточки в первые секунды. */}
                <img className="shot" src={c.photo} alt={c.alt} decoding="async" />
                {/* Затемнение снизу: без него белый заголовок ложится прямо на
                    фотографию и читается через раз. У нижней кромки плотность
                    0.96 — даже на белом кадре под текстом получается 7:1. */}
                <div className="scrim" aria-hidden="true" />
                <div className="meta">
                  <span>{c.hours}</span>
                  <span className="badge">
                    <ArrowUpRight className="ic" strokeWidth={2} aria-hidden="true" />
                  </span>
                </div>
                <div className="bot">
                  <h3>{c.metro}</h3>
                  <p>{c.desc}</p>
                  <div className="tags">
                    {c.tags.map((t) => (
                      <span className="tag-chip" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="has-deco">
      <Decor where="services" />
      <div className="shell">
        <h2 data-rv="lines" style={{ '--d': '120ms' } as React.CSSProperties}>
          <span className="ln">
            <span>Что мы делаем лучше всего</span>
          </span>
        </h2>
        <ul>
          {SERVICES.map((s, i) => (
            <li
              key={s.n}
              className="srow rv-fade"
              data-rv="fade"
              style={{ '--y': '24px', '--d': i * 80 + 'ms' } as React.CSSProperties}
            >
              <button type="button" style={{ width: '100%' }} onClick={() => modalBus.open()}>
                <div className="inner">
                  <span className="idx">{s.n}</span>
                  <h3>{s.t}</h3>
                  <p className="desc">{s.d}</p>
                  <span className="go">
                    <ArrowUpRight className="ic" strokeWidth={2} aria-hidden="true" />
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Stats() {
  const listRef = useRef<HTMLUListElement>(null)

  /*
    В оригинале цифры привязаны к положению блока на экране: прокрутил вверх —
    они поехали обратно вниз. Здесь иначе: блок доезжает до экрана, счётчик
    один раз прокручивается за 1.4 с и замирает на итоговом значении.

    Тик идёт по таймеру, а не по requestAnimationFrame: это просто текст, на
    глаз 16 мс не отличить, зато цифры досчитывают и в фоновой вкладке, где
    кадров нет.
  */
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const cells = Array.from(el.querySelectorAll<HTMLElement>('.stat .num'))
    const write = (p: number) => {
      cells.forEach((num, i) => {
        /* toLocaleString ставит разряды по-русски: 3 000, а не 3000. */
        num.textContent = Math.round(p * STATS[i].v).toLocaleString('ru-RU')
      })
    }

    let started = false
    let timer = 0
    const run = () => {
      if (started) return
      started = true
      const DUR = 1400
      const t0 = performance.now()
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
      timer = window.setInterval(() => {
        const t = Math.min((performance.now() - t0) / DUR, 1)
        write(easeOut(t))
        if (t >= 1) window.clearInterval(timer)
      }, 16)
    }

    write(0)

    /* Наблюдатель — основной способ; опрос по таймеру страхует на случай,
       если колбэк наблюдателя не приходит. */
    const inView = () => el.getBoundingClientRect().top < window.innerHeight * 0.85
    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            run()
            io?.disconnect()
          }
        },
        { threshold: 0.25 },
      )
      io.observe(el)
    }
    const poll = window.setInterval(() => {
      if (inView()) {
        run()
        window.clearInterval(poll)
      }
    }, 200)

    return () => {
      io?.disconnect()
      window.clearInterval(poll)
      window.clearInterval(timer)
    }
  }, [])

  return (
    <section id="stats">
      <div className="shell">
        <div className="stats-panel rv-fade" data-rv="fade" style={{ '--y': '40px' } as React.CSSProperties}>
          <h2 data-rv="lines" style={{ '--d': '120ms' } as React.CSSProperties}>
            <span className="ln">
              <span>Доказательство — в работе, а не в словах</span>
            </span>
          </h2>
          <ul className="stats-grid" ref={listRef}>
            {STATS.map((s, i) => (
              <li
                key={s.l}
                className="stat rv-fade"
                data-rv="fade"
                style={{ '--y': '20px', '--d': i * 90 + 'ms' } as React.CSSProperties}
              >
                <div className="val">
                  <span className="num">0</span>
                  {s.suf}
                </div>
                <div className="lbl">{s.l}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer id="site-footer">
      <div className="shell">
        <div className="f-cta">
          <h2 data-rv="lines" data-stagger="100">
            <span className="ln">
              <span>Питомцу нужна помощь?</span>
            </span>
            <span className="ln">
              <span>Звоните прямо сейчас</span>
            </span>
          </h2>
          <button className="pill accent witharrow ar-up" onClick={() => modalBus.open()}>
            <span>
              Записаться на приём
              <span className="badge">
                <ArrowUpRight className="ic" strokeWidth={2.2} aria-hidden="true" />
              </span>
            </span>
          </button>
        </div>

        <div className="f-cols">
          <div className="f-brand">
            <img src={ASSET.logoWhite} alt="Ветмир — ветеринарная клиника" width={1202} height={300} />
            <p>
              Ветеринарная медицина XXI века. Круглосуточная помощь, стационар и выезд врача на дом
            </p>
            <div className="phones">
              {[PHONE, PHONE_ALT].map((p) => (
                <a key={p.href} href={p.href}>
                  {p.label}
                </a>
              ))}
            </div>
          </div>

          <div className="f-col">
            <h3>Клиника</h3>
            <ul>
              {NAV.slice(1, 5).map((it) => (
                <li key={it.id}>
                  <button className="alink" onClick={() => scrollToId(it.id)}>
                    <span>{it.l}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="f-col">
            <h3>Услуги</h3>
            <ul>
              {SERVICES.slice(0, 4).map((s) => (
                <li key={s.n}>
                  <button className="alink" onClick={() => scrollToId('services')}>
                    <span>{s.t}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="f-col">
            <h3>Адреса</h3>
            <ul>
              {CLINICS.map((c) => (
                <li key={c.address}>
                  <button className="alink" onClick={() => scrollToId('clinics')}>
                    <span>{c.address}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="f-legal">
          <span>© 2008–2026 ООО «Ветмир». Информация на сайте не является публичной офертой</span>
          <div className="links">
            <a className="alink" href="#contact">
              <span>Конфиденциальность</span>
            </a>
            <a className="alink" href="#contact">
              <span>Согласие на обработку</span>
            </a>
          </div>
        </div>
      </div>
      <div id="footer-mark" aria-hidden="true">
        ВЕТМИР
      </div>
    </footer>
  )
}

function NavMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div id="navmenu" className={open ? 'open' : ''} role="dialog" aria-modal="true" aria-label="Меню" aria-hidden={!open}>
      {/* Три колонки: пустая, логотип, кнопка. Логотип встаёт ровно по
          середине экрана и не зависит от ширины кнопки «Закрыть». */}
      <div className="shell top">
        <span aria-hidden="true" />
        <div className="brand">
          <img src={ASSET.logoWhite} alt="Ветмир" width={1202} height={300} />
        </div>
        {/* На узком экране остаётся только крестик: со словом кнопка шире
            своей колонки и сдвигает логотип с середины. */}
        <button className="close" onClick={onClose} aria-label="Закрыть меню">
          <X className="ic" style={{ fontSize: '.875rem' }} aria-hidden="true" />
          <span className="word">Закрыть</span>
        </button>
      </div>
      <div className="shell mid">
        <ul>
          {NAV.map((it, i) => (
            <li key={it.id}>
              <button
                className="item"
                style={{ transitionDelay: i * 45 + 80 + 'ms' }}
                onClick={() => {
                  onClose()
                  if (it.id === 'contact') window.setTimeout(() => modalBus.open(), 220)
                  else window.setTimeout(() => scrollToId(it.id), 220)
                }}
              >
                <span className="n">0{i + 1}</span>
                <span className="l">{it.l}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="shell bot">
        <button
          className="pill light big witharrow ar-right"
          onClick={() => {
            onClose()
            window.setTimeout(() => modalBus.open(), 220)
          }}
        >
          <span>
            Записаться на приём
            <span className="badge">
              <ArrowRight className="ic" strokeWidth={2.2} aria-hidden="true" />
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

/*
  Свой выпадающий список вместо <select>. У нативного список рисует
  операционная система: ни отступы, ни стрелку, ни само раскрытие
  поменять нельзя, и на каждой платформе он выглядит по-своему. Здесь
  список — обычная разметка, поэтому открывается той же анимацией, что и
  всё остальное на сайте, а стрелка отодвинута от края на 1rem.

  Значение дублируется в скрытое поле: если форму однажды подключат к
  бэкенду, она отправится как обычная форма.
*/
function ClinicSelect({
  value,
  onChange,
  invalid,
}: {
  value: string
  onChange: (v: string) => void
  invalid?: boolean
}) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const options = CLINICS.filter((c) => c.open)

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
    }
    /* Перехват на всплытии вниз: Escape должен закрыть список, а не всю
       модалку, пока список открыт. */
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc, true)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc, true)
    }
  }, [open])

  const current = options.find((o) => o.address === value)

  return (
    <div className={'sel' + (open ? ' open' : '') + (invalid ? ' bad' : '')} ref={box}>
      <input type="hidden" name="clinic" value={value} readOnly />
      <button
        type="button"
        className="sel-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={current ? undefined : 'ph'}>
          {current ? `${current.metro} — ${current.address}` : 'Выберите адрес'}
        </span>
        <ChevronDown className="ic sel-arrow" aria-hidden="true" />
      </button>
      <ul className="sel-list" role="listbox" aria-label="Клиника">
        {options.map((o) => (
          <li key={o.address} role="option" aria-selected={o.address === value}>
            <button
              type="button"
              onClick={() => {
                onChange(o.address)
                setOpen(false)
              }}
            >
              <span className="m">{o.metro}</span>
              <span className="a">{o.address}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

type BookingErrors = { name?: string; phone?: string; clinic?: string }

function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', clinic: '', text: '' })
  const [errors, setErrors] = useState<BookingErrors>({})
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      const id = window.setTimeout(() => {
        setDone(false)
        setForm({ name: '', phone: '', clinic: '', text: '' })
        setErrors({})
      }, 300)
      return () => window.clearTimeout(id)
    }
  }, [open])

  /*
    Проверяем сами, а не через required у браузера: нативные подсказки
    всплывают системным пузырём мимо оформления сайта и на разных
    браузерах пишут разное. Телефон считаем по цифрам — человек введёт
    его со скобками, пробелами или через восьмёрку, и любой из вариантов
    должен пройти.
  */
  const check = (): BookingErrors => {
    const e: BookingErrors = {}
    if (form.name.trim().length < 2) e.name = 'Напишите, как к вам обращаться'
    const digits = form.phone.replace(/\D/g, '')
    if (digits.length < 10) e.phone = 'Нужен номер, по которому перезвонить'
    if (!form.clinic) e.clinic = 'Выберите клинику'
    return e
  }

  const field = (k: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (k in errors) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  return (
    <div
      id="modal"
      className={(open ? 'open' : '') + (done ? ' done' : '')}
      role="dialog"
      aria-modal="true"
      aria-label="Запись на приём"
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="panel">
        <button className="x" onClick={onClose} aria-label="Закрыть">
          <X className="ic" aria-hidden="true" />
        </button>

        <div className="formwrap">
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="kicker">Запись на приём</span>
            <h2>Расскажите о питомце</h2>
          </div>
          {/* Форма пока не подключена: отправлять некуда. */}
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              const bad = check()
              setErrors(bad)
              if (bad.name) return nameRef.current?.focus()
              if (bad.phone) return phoneRef.current?.focus()
              if (bad.clinic) return
              setSending(true)
              window.setTimeout(() => {
                setSending(false)
                setDone(true)
              }, 700)
            }}
          >
            <label>
              <span className="cap">Ваше имя</span>
              <input
                ref={nameRef}
                type="text"
                className={errors.name ? 'bad' : undefined}
                aria-invalid={!!errors.name}
                placeholder="Как к вам обращаться"
                value={form.name}
                onChange={(e) => field('name')(e.target.value)}
              />
              {errors.name && <span className="err">{errors.name}</span>}
            </label>
            <label>
              <span className="cap">Телефон</span>
              <input
                ref={phoneRef}
                type="tel"
                inputMode="tel"
                className={errors.phone ? 'bad' : undefined}
                aria-invalid={!!errors.phone}
                placeholder="+7 (___) ___-__-__"
                value={form.phone}
                onChange={(e) => field('phone')(e.target.value)}
              />
              {errors.phone && <span className="err">{errors.phone}</span>}
            </label>
            <div className="fld">
              <span className="cap">Клиника</span>
              <ClinicSelect
                value={form.clinic}
                onChange={field('clinic')}
                invalid={!!errors.clinic}
              />
              {errors.clinic && <span className="err">{errors.clinic}</span>}
            </div>
            <label>
              <span className="cap">
                Что случилось <em>— необязательно</em>
              </span>
              <textarea
                rows={4}
                placeholder="Кто питомец, что беспокоит, как срочно"
                value={form.text}
                onChange={(e) => field('text')(e.target.value)}
              />
            </label>
            <div className="frow">
              <button type="submit" className="pill dark witharrow ar-up">
                <span>
                  {sending ? 'Отправляем…' : 'Отправить заявку'}
                  <span className="badge">
                    <ArrowUpRight className="ic" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                </span>
              </button>
            </div>
          </form>
        </div>

        <div className="success">
          <div className="sbadge">
            <PawPrint className="ic" aria-hidden="true" />
          </div>
          <h2>Заявка получена</h2>
          <p>Спасибо. Перезвоним в ближайшее время и подтвердим запись</p>
          <button className="pill dark noarrow" onClick={onClose}>
            <span>Закрыть</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

const LOADER_MS = 1300

export default function App() {
  const [pct, setPct] = useState(0)
  const [out, setOut] = useState(false)
  const [ready, setReady] = useState(false)
  const [menu, setMenu] = useState(false)
  const [modal, setModal] = useState(false)

  const lenis = useLenis()
  const lock = useScrollLock(lenis)
  const clock = useClock()
  useWideScreenScale()
  const header = useStickyHeader()
  useReveals(ready)

  useEffect(() => {
    modalBus.open = () => setModal(true)
  }, [])

  /* Загрузчик. Полосу гоняет requestAnimationFrame, но в фоновой вкладке
     кадров нет, и без страховки экран остался бы закрытым навсегда —
     поэтому дублируем таймером. */
  useEffect(() => {
    lock(true)
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    const start = performance.now()
    let raf = 0
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      setPct(100)
      setOut(true)
      window.setTimeout(() => {
        setReady(true)
        lock(false)
      }, 720)
    }

    const tick = (now: number) => {
      const t = Math.min((now - start) / LOADER_MS, 1)
      setPct(Math.round(easeInOutCubic(t) * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else finish()
    }
    raf = requestAnimationFrame(tick)
    const backstop = window.setTimeout(finish, LOADER_MS + 600)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(backstop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (ready) lock(menu || modal)
  }, [menu, modal, ready, lock])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (modal) setModal(false)
      else if (menu) setMenu(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu, modal])

  useEffect(() => {
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
      document.body.classList.add('hoverable')
    }
  }, [])

  return (
    <div id="top">
      {!ready && <Loader out={out} pct={pct} />}

      <a className="skip" href="#main">
        Перейти к содержимому
      </a>

      <SiteHeader onMenu={() => setMenu(true)} clock={clock} stuck={header.stuck} gone={header.gone} />

      <main id="main">
        {/* Первый экран оставлен без изменений — поменялись только кнопки. */}
        <section
          id="home"
          className="bg-background relative h-screen overflow-hidden"
          style={{ borderRadius: '0 0 2rem 2rem' }}
        >
          {/* Знаки идут первыми и без z-index: позиционированные соседи
              ниже по разметке рисуются поверх них сами. */}
          <Decor where="home" />
          <div className="relative z-[1] flex h-full flex-col pt-[5.25rem]">
            <div className="relative flex min-h-0 flex-1 flex-col">
              <DesktopHero />
              <TabletHero />
              <MobileHero />
            </div>
          </div>
        </section>

        {/* Адреса идут сразу после первого экрана: человек, которому нужна
            помощь, ищет ближайшую клинику, а не рассказ о ней. */}
        <Clinics />
        <Pets />
        <About />
        <Services />
        <Stats />
        {/* Лента-слоган стояла между «кого лечим» и «о клинике» и разрывала
            рассказ на середине. Внизу она работает точкой: сначала цифры,
            потом «мы лечим всегда», потом тёмный подвал с записью. */}
        <Band />
      </main>

      <SiteFooter />

      <NavMenu open={menu} onClose={() => setMenu(false)} />
      <BookingModal open={modal} onClose={() => setModal(false)} />
    </div>
  )
}
