/* ISKIERKA — ETAP 1 · Iskierka · 10+
   Pierwsze iskry: prąd, bateria, bezpieczeństwo, obwód, połączenia, opornik, dioda, czujniki.
   Funkcje do tworzenia zadań są w js/kit.js.
   Pole sol przy płytkach stykowych to przykładowe rozwiązanie (otwory dla kolejnych części z pudełka). */
(function () {
  'use strict';
  var K = window.ISK_KIT, B = K.B;
  var learn = K.learn, choice = K.choice, tf = K.tf, pairs = K.pairs, fill = K.fill, sort = K.sort, circ = K.circ, slider = K.slider;
  var board = K.board, pattern = K.pattern, volts = K.volts;
  var L = K.L, LL = K.LL, YESNO = K.YESNO;

  var units = [
    /* ================= ROZDZIAŁ 1 ================= */
    {
      id: 'u1', color: 'sky', title: 'Iskra w kablu', sub: 'Co to jest prąd?',
      guide: [
        'Prąd elektryczny to ruch malutkich cząstek – <b>elektronów</b> – w jedną stronę.',
        'Elektrony są tak małe, że nie widać ich nawet pod najlepszym mikroskopem.',
        'Prąd płynie przewodami trochę jak woda rurami.',
        'Źródła prądu to np. bateria, akumulator, panel słoneczny i elektrownia (z niej prąd płynie do gniazdka).',
        'Bateria ma dwa bieguny: <b>plus (+)</b> i <b>minus (−)</b>. Jej „siłę”, czyli <b>napięcie</b>, mierzymy w woltach (V).',
        'Gniazdko ma 230 V – to bardzo groźne! Eksperymentujemy <b>tylko z bateriami</b>.'
      ],
      lessons: [
        {
          id: 'u1l1', title: 'Co to jest prąd?', icon: 'bolt', sticker: 'wire', desc: 'Poznasz elektrony i Kabelka Kubę.',
          ex: [
            learn('mascot', 'Cześć, tu Iskierka!', 'Wszystko wokół zbudowane jest z atomów, a w nich krążą malutkie <b>elektrony</b>. Kiedy elektrony ruszają razem w jedną stronę, płynie <b>prąd elektryczny</b>.', { mood: 'cheer' }),
            choice('Czym jest prąd elektryczny?', ['Ruchem malutkich elektronów', 'Gorącym powietrzem w kablu', 'Wodą płynącą w przewodzie', 'Dymem z baterii'], 0, 'Prąd to ruch elektronów. Nie widać ich, ale widać, co potrafią: zapalić światło albo uruchomić silnik!'),
            learn('wire', 'Kabelek Kuba', 'To mój kolega Kuba. W środku ma <b>miedziany drucik</b>, po którym elektrony pędzą jak po torze. Prąd płynie przewodem trochę jak woda rurą.', { friend: true }),
            fill(['Prąd płynie przez przewód trochę jak woda przez ', 0, '.'], ['rurę', 'balon', 'chmurę'], ['rurę'], 'Przewód prowadzi prąd tak, jak rura prowadzi wodę.'),
            tf('Elektrony są tak duże, że widać je gołym okiem.', false, 'Są tak malutkie, że nie widać ich nawet pod najlepszym mikroskopem!'),
            choice('Które z tych urządzeń działa BEZ prądu?', ['Rower', 'Lodówka', 'Telewizor', 'Lampka nocna'], 0, 'Rower napędzają Twoje nogi. Ale lampka rowerowa już potrzebuje prądu!'),
            pairs('Co robi prąd w tych urządzeniach?', [['Lampka', 'świeci'], ['Głośnik', 'gra'], ['Wentylator', 'dmucha'], ['Czajnik', 'grzeje']])
          ]
        },
        {
          id: 'u1l2', title: 'Bateria Basia', icon: 'battery', sticker: 'battery', desc: 'Plus, minus i wolty.',
          ex: [
            learn('battery', 'Bateria Basia', 'Bateria to <b>źródło prądu</b> – mały magazyn energii. Ma dwa bieguny: <b>plus (+)</b> i <b>minus (−)</b>. Prąd wypływa z baterii, robi kółko po obwodzie i do niej wraca.', { friend: true }),
            choice('Ile biegunów ma bateria?', ['Jeden', 'Dwa', 'Trzy', 'Dziesięć'], 1, 'Dwa: plus (+) i minus (−). Na każdej baterii znajdziesz te znaczki.'),
            learn('battery', 'Napięcie', 'Siłę, z jaką bateria „pcha” elektrony, nazywamy <b>napięciem</b>. Mierzymy je w <b>woltach</b> (V). Paluszek AA ma 1,5 V, płaska bateria 4,5 V, a prostokątna 9 V.', { mood: 'wow' }),
            choice('W czym mierzymy napięcie?', ['W woltach (V)', 'W kilogramach (kg)', 'W metrach (m)', 'W litrach (l)'], 0, 'Nazwa „wolt” pochodzi od nazwiska Alessandra Volty, który zbudował pierwszą baterię.'),
            tf('Bateria 9 V ma większe napięcie niż paluszek 1,5 V.', true, '9 to więcej niż 1,5 – taka bateria mocniej „pcha” elektrony.'),
            choice('Co z tych rzeczy jest źródłem prądu?', ['Panel słoneczny', 'Gumka do mazania', 'Drewniana łyżka', 'Kubek'], 0, 'Panel słoneczny zamienia światło słońca w prąd. Źródłem prądu są też baterie i akumulatory.'),
            pairs('Połącz znaczek z nazwą', [['+', 'plus'], ['−', 'minus'], ['V', 'wolt'], ['AA', 'paluszek']], { big: true }),
            tf('Zużyte baterie wyrzucamy do zwykłego kosza.', false, 'Zużyte baterie oddajemy do specjalnego pojemnika – w sklepie albo w szkole. Są w nich substancje groźne dla przyrody.')
          ]
        },
        {
          id: 'u1l3', title: 'Bezpiecznie z prądem', icon: 'shield', desc: 'Najważniejsza lekcja: jak się nie skrzywdzić.',
          ex: [
            learn('socket', 'Uwaga, gniazdko!', 'Prąd z gniazdka ma napięcie <b>230 V</b> – to ponad 150 razy więcej niż paluszek! Taki prąd może bardzo poważnie zranić. Dlatego eksperymentujemy <b>tylko z bateriami</b>.'),
            sort('Bezpieczne czy niebezpieczne?', [{ t: 'Bezpieczne', icon: 'check' }, { t: 'Niebezpieczne', icon: 'x' }], [
              { t: 'Eksperyment z baterią 4,5 V i żaróweczką', b: 0 },
              { t: 'Wkładanie spinacza do gniazdka', b: 1, art: 'socket' },
              { t: 'Suszarka do włosów przy pełnej wannie', b: 1 },
              { t: 'Poproszenie dorosłego o pomoc przy kablu', b: 0 },
              { t: 'Dotykanie lampy mokrymi rękami', b: 1 },
              { t: 'Puszczanie latawca daleko od linii prądu', b: 0 }
            ], 'Prąd z gniazdka i woda to groźne połączenie. Z bateriami możesz eksperymentować bezpiecznie.'),
            tf('Wtyczkę wyciągamy z gniazdka, ciągnąc za kabel.', false, 'Zawsze chwytamy za wtyczkę. Szarpanie za kabel może go uszkodzić.'),
            choice('Widzisz uszkodzony kabel z wystającymi drucikami. Co robisz?', ['Nie dotykam i mówię dorosłemu', 'Sprawdzam palcem, czy działa', 'Owijam go taśmą klejącą', 'Bawię się nim'], 0, 'Uszkodzony kabel może razić prądem. Zostaw go i powiedz dorosłemu.'),
            tf('Woda i prąd to groźne połączenie.', true, 'Woda z kranu przewodzi prąd. Nie dotykaj urządzeń elektrycznych mokrymi rękami.'),
            choice('Kogoś poraził prąd i ta osoba dalej dotyka kabla. Co robisz?', ['Nie dotykam jej! Wołam dorosłego i dzwonię pod 112', 'Od razu ciągnę ją za rękę', 'Polewam ją wodą', 'Czekam, aż samo przejdzie'], 0, 'Gdy jej dotkniesz, prąd może porazić także Ciebie. Dorosły najpierw wyłącza prąd. Numer alarmowy to 112.'),
            tf('Małą okrągłą baterię guzikową można włożyć do buzi.', false, 'Nigdy! Połknięta bateria guzikowa jest bardzo groźna. Gdyby ktoś ją połknął – od razu do lekarza.')
          ]
        },
        {
          id: 'u1w', title: 'Zasil robota', icon: 'robot', ws: true, desc: 'Warsztat: składasz baterie jak klocki.',
          ex: [
            learn('battery', 'Baterie w szeregu', 'Gdy ustawisz baterie <b>jedna za drugą</b> (plus do minusa), ich napięcia się <b>sumują</b>: dwa paluszki po 1,5 V dają 3 V. Tak włożone są baterie w pilocie do telewizora!'),
            volts('Robot Wolcik potrzebuje 3 V. Włóż baterie do koszyka!', 3, [1.5, 1.5, 1.5, 4.5], 'Dwa paluszki po 1,5 V to razem 3 V.'),
            choice('Masz trzy paluszki 1,5 V ustawione jeden za drugim. Jakie jest razem napięcie?', ['4,5 V', '1,5 V', '3 V', '15 V'], 0, '1,5 + 1,5 + 1,5 = 4,5 V.'),
            volts('Teraz Wolcik potrzebuje 6 V. Znajdziesz dwa sposoby?', 6, [1.5, 1.5, 1.5, 1.5, 4.5, 9], 'Cztery paluszki albo płaska bateria 4,5 V i jeden paluszek – oba sposoby dają 6 V.'),
            volts('Super-Wolcik potrzebuje aż 12 V!', 12, [1.5, 1.5, 1.5, 4.5, 9, 9], 'Na przykład 9 V + 1,5 V + 1,5 V = 12 V.', { name: 'Super-Wolcik' }),
            tf('Za wysokie napięcie może zepsuć urządzenie.', true, 'Dlatego zawsze sprawdzamy, ile woltów potrzebuje urządzenie.')
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 2 ================= */
    {
      id: 'u2', color: 'copper', title: 'Kółko dla prądu', sub: 'Obwód elektryczny',
      guide: [
        '<b>Obwód</b> to zamknięta droga dla prądu: z baterii, przez odbiornik (np. żarówkę) i z powrotem do baterii.',
        'Obwód zamknięty – prąd płynie. Obwód otwarty, czyli przerwany – prąd nie płynie.',
        'Uwaga: „otwarty” obwód działa odwrotnie niż drzwi! Przez otwarty obwód prąd <b>nie</b> przejdzie.',
        '<b>Przełącznik</b> otwiera i zamyka obwód.',
        '<b>Przewodniki</b> przepuszczają prąd: metale, grafit, woda z kranu. <b>Izolatory</b> nie: plastik, guma, drewno, szkło.',
        'Inżynierowie rysują obwody prostymi znakami – to <b>schematy</b>.'
      ],
      lessons: [
        {
          id: 'u2l1', title: 'Zamknij kółko', icon: 'loop', sticker: 'bulb', desc: 'Twój pierwszy obwód z Żarówką Zuzią.',
          ex: [
            learn('bulbOn', 'Żarówka Zuzia', 'Zuzia świeci tylko wtedy, gdy prąd może zrobić <b>pełne kółko</b>: z baterii, przez nią i z powrotem do baterii. Taką drogę nazywamy <b>obwodem</b>.', { friend: true }),
            circ('Wstaw brakujący kabelek, żeby Zuzia zaświeciła!', function () { return B.loop(L(), { t: 'gap', id: 'G', tap: true }); }, { lit: { A: true } }, 'Teraz obwód jest zamknięty: prąd okrąża go i wraca do baterii.', { hint: 'Dotknij przerwy na dole obwodu.' }),
            tf('Prąd płynie tylko w zamkniętym obwodzie.', true, 'Prąd musi mieć którędy wrócić do baterii.'),
            choice('Czy ta żarówka zaświeci?', YESNO, 1, 'Obwód jest przerwany – prąd nie ma którędy wrócić do baterii.', { art: { c: function () { return B.loop(L(), { t: 'gap' }); } }, keep: true }),
            choice('A ta? Czy zaświeci?', YESNO, 0, 'Tak! Droga jest zamknięta, więc prąd płynie.', { art: { c: function () { return B.loop(L()); } }, keep: true }),
            learn('mascot', 'Zagadka słówek', 'W elektronice <b>otwarty obwód</b> znaczy <b>przerwany</b> – prąd przez niego nie przejdzie. Odwrotnie niż z drzwiami! <b>Zamknięty obwód</b> to pełne kółko, w którym prąd płynie.', { mood: 'think' }),
            fill(['Gdy obwód jest ', 0, ', prąd nie płynie.'], ['otwarty', 'zamknięty', 'niebieski'], ['otwarty'], 'Otwarty obwód to przerwany obwód. Prąd stoi.')
          ]
        },
        {
          id: 'u2l2', title: 'Przełącznik Pstryk', icon: 'toggle', sticker: 'switch', desc: 'Pstryk – jest światło!',
          ex: [
            learn('switchOn', 'Przełącznik Pstryk', 'Pstryk! – i obwód jest <b>zamknięty</b>, prąd płynie. Pstryk! – obwód się <b>otwiera</b> i prąd staje. Taki przełącznik masz przy drzwiach do pokoju.', { friend: true }),
            circ('Włącz światło przełącznikiem.', function () { return B.loop(L(), { t: 'sw', id: 'S', tap: true }); }, { lit: { A: true } }, 'Przełącznik zamknął obwód. Jest światło!', { hint: 'Dotknij przełącznika.' }),
            circ('Ta lampka ma DWA przełączniki, jeden za drugim. Zapal ją!', function () { return B.loop2b(L(), { t: 'sw', id: 'S1', label: '1', tap: true }, { t: 'sw', id: 'S2', label: '2', tap: true }); }, { lit: { A: true } }, 'Prąd musi przejść przez oba przełączniki, więc oba muszą być włączone.', { hint: 'Włącz oba przełączniki.' }),
            choice('Czy żarówka zaświeci?', YESNO, 1, 'Jeden przełącznik jest wyłączony, więc obwód jest przerwany.', { art: { c: function () { return B.loop2b(L(), { t: 'sw', on: true }, { t: 'sw', on: false }); } }, keep: true }),
            tf('Wyłączony przełącznik otwiera obwód.', true, 'Wyłączony przełącznik robi przerwę, więc prąd nie płynie.'),
            fill(['Przełącznik ', 0, ' i ', 1, ' obwód.'], ['otwiera', 'zamyka', 'maluje', 'gotuje'], ['otwiera', 'zamyka'], 'Pstryk w jedną stronę zamyka obwód, pstryk w drugą – otwiera.', { any: true })
          ]
        },
        {
          id: 'u2l3', title: 'Przewodnik czy izolator?', icon: 'plug', desc: 'Co przepuszcza prąd, a co go zatrzymuje?',
          ex: [
            learn('coin', 'Przewodniki i izolatory', 'Niektóre materiały chętnie przepuszczają prąd – to <b>przewodniki</b>, np. metale. Inne prądu nie przepuszczają – to <b>izolatory</b>, np. plastik, guma, drewno i szkło.'),
            sort('Przewodnik czy izolator?', [{ t: 'Przewodnik', icon: 'bolt' }, { t: 'Izolator', icon: 'insul' }], [
              { t: 'Gwóźdź', art: 'nail', b: 0 }, { t: 'Gumowa kaczuszka', art: 'duck', b: 1 },
              { t: 'Moneta', art: 'coin', b: 0 }, { t: 'Drewniany patyczek', art: 'stick', b: 1 },
              { t: 'Łyżeczka', art: 'spoon', b: 0 }, { t: 'Plastikowa linijka', art: 'ruler', b: 1 },
              { t: 'Spinacz', art: 'clip', b: 0 }, { t: 'Szklana kulka', art: 'marble', b: 1 }
            ], 'Metale przewodzą prąd. Plastik, guma, drewno i szkło – nie.'),
            choice('Co wstawisz w przerwę obwodu, żeby żarówka zaświeciła?', [{ t: 'Monetę', art: 'coin' }, { t: 'Gumkę', art: 'eraser' }, { t: 'Patyczek', art: 'stick' }, { t: 'Kaczuszkę', art: 'duck' }], 0, 'Moneta jest z metalu, więc przewodzi prąd i zamknie obwód.'),
            choice('Dlaczego kabel ma plastikową osłonkę?', ['Żeby prąd nie uciekał i nie raził', 'Żeby był ładniejszy', 'Żeby prąd płynął szybciej', 'Żeby był cięższy'], 0, 'Plastik to izolator. Chroni nas przed prądem płynącym w środku.'),
            tf('Rysik w ołówku (grafit) przewodzi prąd.', true, 'Zaskakujące, prawda? Grafit nie jest metalem, a jednak przewodzi.', { art: 'pencil' }),
            fill(['Guma i plastik to ', 0, ', a metale to ', 1, '.'], ['izolatory', 'przewodniki', 'baterie'], ['izolatory', 'przewodniki'], 'Izolatory zatrzymują prąd, przewodniki go przepuszczają.'),
            tf('Ludzkie ciało przewodzi prąd.', true, 'Dlatego prąd z gniazdka jest dla nas tak groźny.')
          ]
        },
        {
          id: 'u2l4', title: 'Szyfr inżyniera', icon: 'sym', desc: 'Symbole i schematy.',
          ex: [
            learn('symtable', 'Schemat to szyfr', 'Inżynierowie nie rysują obwodów z obrazków. Używają prostych znaków – <b>symboli</b>. Rysunek z symboli to <b>schemat</b>. Ten szyfr rozumieją ludzie na całym świecie!'),
            choice('Który symbol oznacza żarówkę?', [{ art: 'sym-bulb' }, { art: 'sym-battery' }, { art: 'sym-switch' }, { art: 'sym-wire' }], 0, 'Żarówka to kółko z krzyżykiem w środku.'),
            choice('Który symbol oznacza baterię?', [{ art: 'sym-switch' }, { art: 'sym-battery' }, { art: 'sym-bulb' }, { art: 'sym-wire' }], 1, 'Bateria to dwie kreski: dłuższa i krótsza.'),
            pairs('Połącz symbol z nazwą', [[{ art: 'sym-battery' }, 'bateria'], [{ art: 'sym-bulb' }, 'żarówka'], [{ art: 'sym-switch' }, 'przełącznik'], [{ art: 'sym-wire' }, 'przewód']]),
            tf('Na symbolu baterii dłuższa kreska to plus (+).', true, 'Dłuższa kreska to plus, krótsza i grubsza to minus.', { art: 'sym-battery' }),
            choice('Co pokazuje ten schemat?', ['Baterię, żarówkę i włączony przełącznik', 'Dwie baterie', 'Samą żarówkę', 'Silniczek i brzęczyk'], 0, 'Kreski to bateria, kółko z krzyżykiem to żarówka, a kreska z kropkami to przełącznik.', { art: { c: function () { return B.loop(L(), { t: 'sw', on: true }); }, style: 'schem' } }),
            choice('Czy żarówka na tym schemacie zaświeci?', YESNO, 1, 'Przełącznik jest podniesiony, czyli otwarty, więc obwód jest przerwany.', { art: { c: function () { return B.loop(L(), { t: 'sw', on: false }); }, style: 'schem' }, keep: true })
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 3 ================= */
    {
      id: 'u3', color: 'violet', title: 'Szeregowo czy równolegle?', sub: 'Połączenia i zwarcie',
      guide: [
        '<b>Szeregowo</b>: elementy stoją jeden za drugim, jak wagoniki pociągu. Prąd ma jedną drogę.',
        'Gdy w połączeniu szeregowym wykręcisz jedną żarówkę, gasną wszystkie.',
        'Dwie żarówki w szeregu świecą słabiej niż jedna.',
        '<b>Równolegle</b>: każda żarówka ma własną drogę. Wykręcisz jedną – reszta dalej świeci.',
        'W domu lampy i gniazdka są połączone równolegle.',
        '<b>Zwarcie</b> to droga na skróty z pominięciem odbiornika. Bateria się grzeje, żarówka gaśnie. Unikamy zwarć!'
      ],
      lessons: [
        {
          id: 'u3l1', title: 'Jak wagoniki', icon: 'series', desc: 'Połączenie szeregowe.',
          ex: [
            learn({ c: function () { return B.loop2t(LL('A'), LL('B')); }, sim: true }, 'Szeregowo', 'Gdy żarówki stoją jedna za drugą, jak wagoniki pociągu, są połączone <b>szeregowo</b>. Prąd ma tylko <b>jedną drogę</b> – musi przejść przez obie.'),
            circ('Zgaś OBIE żarówki, wykręcając tylko jedną z nich.', function () { return B.loop2t(LL('A', { tap: true }), LL('B', { tap: true })); }, { lit: { A: false, B: false }, removed: 1 }, 'W szeregu prąd ma jedną drogę. Wykręcona żarówka przerywa ją dla wszystkich.', { hint: 'Dotknij jednej żarówki, żeby ją wykręcić.' }),
            choice('W lampkach połączonych szeregowo przepaliła się jedna. Co z resztą?', ['Wszystkie gasną', 'Reszta świeci jaśniej', 'Nic się nie zmienia', 'Bateria się ładuje'], 0, 'Przepalona żarówka przerywa jedyną drogę prądu.'),
            tf('Dwie żarówki w szeregu świecą jaśniej niż jedna.', false, 'Świecą słabiej, bo dzielą się napięciem baterii. Zobacz – są przygaszone.', { art: { c: function () { return B.loop2t(LL('A'), LL('B')); }, sim: true } }),
            circ('Zapal obie żarówki naraz.', function () { return B.loop2t(LL('A'), LL('B'), { t: 'gap', id: 'G', tap: true }); }, { lit: { A: true, B: true } }, 'Jedna droga, dwie żarówki – i obie świecą.', { hint: 'Wstaw kabelek w przerwę.' }),
            fill(['W połączeniu szeregowym prąd ma ', 0, ' drogę.'], ['jedną', 'dwie', 'zero'], ['jedną'], 'Jedna droga – jak tory dla pociągu.')
          ]
        },
        {
          id: 'u3l2', title: 'Każda swoją drogą', icon: 'parallel', desc: 'Połączenie równoległe.',
          ex: [
            learn({ c: function () { return B.ladder([[LL('A')], [LL('B')]]); }, sim: true }, 'Równolegle', 'Tu każda żarówka ma <b>własną drogę</b> do baterii. To połączenie <b>równoległe</b>. Obie świecą jasno!'),
            circ('Wykręć żarówkę A. Czy B dalej świeci?', function () { return B.ladder([[LL('A', { tap: true })], [LL('B', { tap: true })]]); }, { lit: { A: false, B: true } }, 'Tak! Żarówka B ma swoją drogę, więc świeci dalej.', { hint: 'Dotknij żarówki A.' }),
            choice('Dlaczego w domu, gdy przepali się jedna lampa, inne dalej świecą?', ['Bo są połączone równolegle', 'Bo są połączone szeregowo', 'Bo każda ma swoją baterię', 'Bo lampy są magiczne'], 0, 'W domu każda lampa ma swoją drogę dla prądu.'),
            circ('Każda żarówka ma swój przełącznik. Zapal TYLKO żarówkę B.', function () { return B.ladder([[LL('A'), { t: 'sw', id: 'SA', label: 'A', tap: true }], [LL('B'), { t: 'sw', id: 'SB', label: 'B', tap: true }]]); }, { lit: { A: false, B: true } }, 'Równoległe drogi można włączać osobno. Tak działają światła w Twoim domu.', { hint: 'Włącz tylko przełącznik B.' }),
            tf('W połączeniu równoległym każda żarówka ma własną drogę dla prądu.', true, 'Dlatego jedna może świecić, a druga nie.'),
            choice('Który obwód jest połączony równolegle?', [{ t: 'Obwód 1', c: function () { return B.loop2t(L({ id: 'x' }), L({ id: 'y' })); } }, { t: 'Obwód 2', c: function () { return B.ladder([[L({ id: 'x' })], [L({ id: 'y' })]]); } }], 1, 'W obwodzie 2 każda żarówka ma osobną drogę. W obwodzie 1 stoją jedna za drugą.')
          ]
        },
        {
          id: 'u3l3', title: 'Zwarcie – uwaga!', icon: 'warn', desc: 'Droga na skróty, której unikamy.',
          ex: [
            learn({ c: function () { return B.ladder([[LL('A')], [{ t: 'wire' }]]); }, sim: true }, 'Zwarcie', '<b>Zwarcie</b> to droga na skróty. Gdy przewód połączy plus z minusem z pominięciem żarówki, prąd pędzi tą łatwą drogą. Żarówka gaśnie, a bateria robi się <b>gorąca</b>!'),
            circ('Ojej, zwarcie! Przełącznik B daje prądowi drogę na skróty. Napraw obwód, żeby żarówka świeciła.', function () { return B.ladder([[LL('A')], [{ t: 'sw', id: 'SB', label: 'B', on: true, tap: true }]]); }, { lit: { A: true }, noShort: true }, 'Brawo! Wyłączony przełącznik zamknął drogę na skróty. Prąd znów płynie przez żarówkę.', { hint: 'Wyłącz przełącznik B.' }),
            tf('Zwarcie jest bezpieczne i baterie je lubią.', false, 'Przy zwarciu bateria szybko się rozładowuje i nagrzewa. W domu zwarcie może nawet wywołać pożar.'),
            choice('Co jest nie tak z tym obwodem?', ['Jest zwarcie – przewód omija żarówkę', 'Brakuje baterii', 'Obwód jest otwarty', 'Wszystko jest dobrze'], 0, 'Dolny przewód łączy plus z minusem na skróty. Prąd omija żarówkę.', { art: { c: function () { return B.ladder([[LL('A')], [{ t: 'wire' }]]); } } }),
            fill(['Przy zwarciu prąd płynie na ', 0, '.'], ['skróty', 'około', 'wakacje'], ['skróty'], 'Na skróty – z pominięciem odbiornika.'),
            choice('Do czego służy bezpiecznik w domu?', ['Wyłącza prąd, gdy dzieje się coś groźnego', 'Zwiększa prąd w gniazdkach', 'Ozdabia ścianę', 'Ładuje telefon'], 0, 'Bezpiecznik pilnuje instalacji. Przy zwarciu sam odcina prąd.')
          ]
        },
        {
          id: 'u3w', title: 'Wzorki świetlne', icon: 'grid', ws: true, desc: 'Warsztat: zapal diody tak, żeby ułożyły obrazek.',
          ex: [
            learn('ledOn', 'Panel świetlny', 'Każdy przełącznik zapala swoją grupę diod – to osobne drogi, połączone <b>równolegle</b>. Kolorowe kropki na diodzie pokazują, które przełączniki ją zasilają. Ułóż wzorek z obrazka!'),
            pattern('Zapal plusik.', { size: [3, 3], target: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]], switches: [
              { cells: [[0, 1], [1, 1], [2, 1]] }, { cells: [[1, 0], [1, 1], [1, 2]] }, { cells: [[0, 0], [0, 2], [2, 0], [2, 2]] }, { cells: [[0, 0], [1, 1], [2, 2]] }] },
            'Pionowa i pozioma kreska razem tworzą plus.', { hint: 'szukaj kresek: pionowej i poziomej' }),
            pattern('Teraz ułóż literę X.', { size: [3, 3], target: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]], switches: [
              { cells: [[0, 0], [1, 1], [2, 2]] }, { cells: [[0, 1], [1, 1], [2, 1]] }, { cells: [[0, 2], [1, 1], [2, 0]] }, { cells: [[1, 0], [1, 2]] }] },
            'Dwie ukośne kreski tworzą X. Środkowa dioda jest w obu grupach.'),
            pattern('Zapal serce dla Iskierki!', { size: [5, 5], target: [[0, 1], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [3, 1], [3, 2], [3, 3], [4, 2]], switches: [
              { cells: [[0, 1], [0, 3]] }, { cells: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] }, { cells: [[0, 0], [0, 4], [4, 0], [4, 4]] },
              { cells: [[3, 1], [3, 2], [3, 3], [4, 2]] }, { cells: [[2, 2], [3, 2], [4, 1], [4, 2], [4, 3]] }] },
            'Serce składa się z uszek, szerokiego środka i czubka na dole.', { hint: 'uważaj na grupy, które zapalają diody poza sercem' }),
            learn('mascot', 'Ekran z diod', 'W prawdziwych ekranach LED diody łączy się w <b>rzędy (R)</b> i <b>kolumny (K)</b>. Dioda świeci, gdy włączony jest <b>jej rząd i jej kolumna</b> – oba naraz, jak dwa przełączniki w szeregu. Tak działają tablice na dworcach!', { mood: 'think' }),
            pattern('Zapal tylko środkową diodę.', { mode: 'matrix', size: [3, 3], target: [[1, 1]] }, 'Rząd 2 i kolumna 2 spotykają się w środku.', { hint: 'włącz jeden rząd i jedną kolumnę' }),
            pattern('Zapal cztery rogi.', { mode: 'matrix', size: [3, 3], target: [[0, 0], [0, 2], [2, 0], [2, 2]] }, 'Rzędy 1 i 3 oraz kolumny 1 i 3 krzyżują się dokładnie w rogach.', { hint: 'potrzebujesz dwóch rzędów i dwóch kolumn' }),
            pattern('Zapal cały środkowy rząd.', { mode: 'matrix', size: [3, 3], target: [[1, 0], [1, 1], [1, 2]] }, 'Jeden rząd i wszystkie kolumny – i cały pasek świeci.')
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 4 ================= */
    {
      id: 'u4', color: 'mint', title: 'Opornik i Dioda', sub: 'Jak okiełznać prąd',
      guide: [
        '<b>Opornik</b> (rezystor) hamuje prąd – jak przewężenie w rurze.',
        'Opór mierzymy w <b>omach (Ω)</b>. Im większy opór, tym mniejszy prąd.',
        'Prąd mierzymy w <b>amperach (A)</b>. Mały prąd – w miliamperach (mA). 1 A = 1000 mA.',
        '<b>Dioda LED</b> świeci tylko w jedną stronę. Dłuższa nóżka to plus (anoda), krótsza – minus (katoda).',
        'Dioda LED zawsze potrzebuje opornika, bo inaczej się przepali.',
        'Dla ambitnych – <b>prawo Ohma</b>: prąd = napięcie : opór (I = U : R).'
      ],
      lessons: [
        {
          id: 'u4l1', title: 'Opornik Olek', icon: 'resistor', sticker: 'resistor', desc: 'Kto hamuje prąd?',
          ex: [
            learn('resistor', 'Opornik Olek', 'Olek <b>hamuje prąd</b>. Działa jak przewężenie w rurze: przepuszcza mniej wody. Kolorowe paski na brzuszku mówią, jak mocno hamuje.', { friend: true }),
            choice('Co robi opornik?', ['Zmniejsza prąd w obwodzie', 'Wytwarza prąd', 'Świeci na czerwono', 'Mierzy temperaturę'], 0, 'Opornik ogranicza prąd, żeby inne elementy się nie przegrzały.'),
            learn('resistor', 'Omy', 'Opór mierzymy w <b>omach</b>. Znak omów to grecka litera <b>Ω</b> (omega). Olek ma paski czerwony, czerwony i brązowy – to znaczy 220 Ω.', { mood: 'wow' }),
            pairs('Połącz znak z tym, co mierzy', [['V', 'napięcie (wolt)'], ['A', 'prąd (amper)'], ['Ω', 'opór (om)']], { big: true }),
            choice('Większy opór oznacza…', ['Mniejszy prąd', 'Większy prąd', 'Więcej baterii', 'Kolorowy kabel'], 0, 'Im mocniej Olek hamuje, tym mniej prądu przepływa.'),
            choice('Który symbol oznacza opornik?', [{ art: 'sym-resistor' }, { art: 'sym-bulb' }, { art: 'sym-battery' }, { art: 'sym-switch' }], 0, 'W Polsce opornik rysujemy jako mały prostokąt.'),
            tf('1 amper to 1000 miliamperów.', true, 'Tak jak 1 metr to 1000 milimetrów.')
          ]
        },
        {
          id: 'u4l2', title: 'Dioda Lena', icon: 'led', sticker: 'led', desc: 'Lampka, która świeci w jedną stronę.',
          ex: [
            learn('ledOn', 'Dioda Lena', 'Lena to <b>dioda LED</b>. Jest malutka, oszczędna i świeci w wielu kolorach. Ale uwaga: przepuszcza prąd tylko <b>w jedną stronę</b>!', { friend: true }),
            learn('ledLegs', 'Dwie nóżki', 'Lena ma dwie nóżki. <b>Dłuższa to plus</b> (anoda), krótsza to minus (katoda). Dłuższą nóżkę podłączamy do plusa baterii.'),
            choice('Którą nóżkę diody podłączysz do plusa baterii?', ['Dłuższą', 'Krótszą', 'Obojętnie którą', 'Żadną'], 0, 'Dłuższa nóżka to plus. Łatwo zapamiętać: plus jest „dłuższy”, bo ma dodatkową kreskę!', { art: 'ledLegs' }),
            circ('Lena nie świeci! Odwróć ją – dotknij diody.', function () { return B.loop({ t: 'led', id: 'D', flip: true, tap: true }, null, { t: 'res', r: 220 }); }, { lit: { D: true } }, 'Teraz plus diody patrzy w stronę plusa baterii i prąd może przez nią płynąć.', { hint: 'Dotknij diody, żeby ją obrócić.' }),
            tf('Dioda LED świeci bez względu na to, w którą stronę ją podłączysz.', false, 'Dioda to jednokierunkowa furtka dla prądu.'),
            choice('Dlaczego żarówki LED są dobre dla planety?', ['Zużywają mało prądu', 'Są cięższe', 'Świecą tylko w nocy', 'Nie potrzebują prądu'], 0, 'LED-y dają tyle samo światła, zużywając kilka razy mniej energii niż zwykłe żarówki.')
          ]
        },
        {
          id: 'u4l3', title: 'Ochroniarz diody', icon: 'gauge', desc: 'Dobierz opornik jak inżynier.',
          ex: [
            learn({ c: function () { return B.loop({ t: 'led', id: 'D' }, null, { t: 'res', r: 220 }); }, sim: true }, 'Ochroniarz Leny', 'Dioda bez opornika dostałaby za dużo prądu i by się przepaliła. Opornik to jej <b>ochroniarz</b>! Zwykłej diodzie wystarczy od 5 do 20 miliamperów (mA).'),
            slider('Bateria ma 5 V. Dobierz opornik, żeby Lena świeciła bezpiecznie – w zielonej strefie.', { v: 5, vf: 2, start: 7, ok: [5, 20] }, 'Przy 5 V pasuje opornik 220 Ω albo 470 Ω.'),
            choice('Co się stanie, gdy podłączysz diodę do baterii bez opornika?', ['Może się przepalić', 'Zaświeci w kolorach tęczy', 'Bateria się naładuje', 'Nic'], 0, 'Za duży prąd przegrzewa diodę. Opornik chroni ją przed tym.'),
            slider('Teraz bateria ma 9 V. Znajdź opornik dla Leny!', { v: 9, vf: 2, start: 2, ok: [5, 20] }, 'Przy 9 V pasuje 470 Ω albo 1 kΩ. Większe napięcie – większy opornik.'),
            tf('Im większy opornik, tym jaśniej świeci dioda.', false, 'Odwrotnie! Większy opornik mocniej hamuje prąd, więc dioda świeci słabiej.'),
            choice('Dla ambitnych: prąd = napięcie : opór. Bateria ma 6 V, opornik 3 Ω. Jaki płynie prąd?', ['2 A', '18 A', '3 A', '9 A'], 0, '6 : 3 = 2. Płynie prąd 2 amperów. To jest prawo Ohma!')
          ]
        },
        {
          id: 'u4w', title: 'Płytka stykowa', icon: 'board', ws: true, desc: 'Warsztat: budujesz obwody jak prawdziwy elektronik.',
          ex: [
            learn('boardDemo', 'Płytka stykowa', 'Na płytce stykowej buduje się obwody <b>bez lutowania</b>. Pięć otworów w jednej kolumnie (a–e) łączy metalowa blaszka – na obrazku podświetliliśmy kolumnę 3. Długie rzędy <b>+</b> i <b>−</b> to <b>szyny zasilania</b>, podłączone do baterii.'),
            choice('Które otwory są połączone z otworem a3?', ['b3, c3, d3 i e3', 'a4 i a5', 'Wszystkie w rzędzie a', 'Żadne'], 0, 'W płytce połączone są otwory w tej samej kolumnie – od a do e.', { art: 'boardDemo' }),
            board('Dioda i opornik już stoją. Dodaj kabelek z kolumny 5 do szyny −, żeby dioda zaświeciła.', {
              fixed: [{ t: 'res', r: 220, legs: ['+2', 'a2'] }, { t: 'led', id: 'D1', legs: ['c2', 'c5'] }],
              tray: [{ t: 'wire' }], goal: { lit: { D1: true } }, hint: 'połącz dowolny otwór kolumny 5 z szyną −', sol: [['d5', '-5']]
            }, 'Prąd płynie: szyna + → opornik → dioda → kabelek → szyna −.'),
            board('Wstaw diodę tak, żeby świeciła. Dłuższa nóżka (+) idzie od strony opornika.', {
              fixed: [{ t: 'res', r: 220, legs: ['+3', 'a3'] }, { t: 'wire', legs: ['a7', '-7'] }],
              tray: [{ t: 'led', id: 'D1' }], goal: { lit: { D1: true } }, hint: 'plus diody w kolumnie 3, minus w kolumnie 7', sol: [['b3', 'b7']]
            }, 'Dioda łączy kolumnę 3 (od plusa) z kolumną 7 (do minusa).'),
            board('Zbuduj wszystko sam: opornik, dioda i kabelek.', {
              tray: [{ t: 'res', r: 220 }, { t: 'led', id: 'D1' }, { t: 'wire' }], goal: { lit: { D1: true } }, hint: 'szyna + → opornik → dioda → kabelek → szyna −', sol: [['+2', 'a2'], ['b2', 'b5'], ['c5', '-5']]
            }, 'Gotowe! To najczęstszy pierwszy obwód każdego elektronika.'),
            board('Dwie diody, jeden kabelek do minusa. Zapal obie!', {
              fixed: [{ t: 'res', r: 220, legs: ['+2', 'a2'] }, { t: 'res', r: 220, legs: ['+8', 'a8'] }, { t: 'wire', legs: ['e5', '-5'] }],
              tray: [{ t: 'led', id: 'D1' }, { t: 'led', id: 'D2', col: '#22C3A4' }], goal: { lit: { D1: true, D2: true } }, hint: 'obie diody mogą mieć minus w kolumnie 5', sol: [['b2', 'b5'], ['b8', 'c5']]
            }, 'Obie diody dzielą kolumnę 5, która prowadzi do szyny −.'),
            tf('Na płytce stykowej trzeba wszystko lutować.', false, 'Elementy po prostu wciskasz w otwory. Można je wyjąć i zbudować coś nowego.')
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 5 ================= */
    {
      id: 'u5', color: 'berry', title: 'Mali wynalazcy', sub: 'Dźwięk, ruch i czujniki',
      guide: [
        'Prąd potrafi zamieniać się w światło, dźwięk, ruch i ciepło.',
        '<b>Brzęczyk</b> zamienia prąd w dźwięk, a <b>silniczek</b> – w ruch.',
        '<b>Czujniki</b> to zmysły urządzeń: fotorezystor czuje światło, termometr – ciepło, mikrofon – dźwięk.',
        'Panel słoneczny i turbina wiatrowa robią prąd ze słońca i wiatru – to <b>energia odnawialna</b>.',
        'Oszczędzaj energię: gaś światło, wyjmuj ładowarki z gniazdka, oddawaj zużyte baterie do zbiórki.'
      ],
      lessons: [
        {
          id: 'u5l1', title: 'Bzyk i Szymek', icon: 'sound', sticker: ['buzzer', 'motor'], desc: 'Prąd, który gra i się kręci.',
          ex: [
            learn('buzzerOn', 'Brzęczyk Bzyk', 'Gdy płynie przez niego prąd – bzzzz! Bzyk <b>zamienia prąd w dźwięk</b>. Znajdziesz go w dzwonku, budziku i mikrofalówce.', { friend: true }),
            learn('motorOn', 'Silniczek Szymek', 'Szymek <b>zamienia prąd w ruch</b> – kręci się! Silniczki są w wentylatorach, zabawkach i hulajnogach elektrycznych.', { friend: true }),
            circ('Zbuduj dzwonek: włącz brzęczyk.', function () { return B.loop({ t: 'buzz', id: 'Z' }, { t: 'sw', id: 'S', tap: true }); }, { lit: { Z: true } }, 'Bzzzz! Tak działa najprostszy dzwonek do drzwi.', { hint: 'Dotknij przełącznika.' }),
            pairs('W co zamieniają prąd?', [['Żarówka', 'światło'], ['Brzęczyk', 'dźwięk'], ['Silniczek', 'ruch'], ['Grzałka', 'ciepło']]),
            choice('W co zamienia prąd wentylator?', ['W ruch', 'W światło', 'W wodę', 'W dźwięk dzwonka'], 0, 'W wentylatorze silniczek kręci łopatkami.'),
            circ('Włącz wiatraczek, ale zostaw światło zgaszone.', function () { return B.ladder([[LL('A'), { t: 'sw', id: 'SA', label: 'A', tap: true }], [{ t: 'motor', id: 'M' }, { t: 'sw', id: 'SM', label: 'M', tap: true }]]); }, { lit: { A: false, M: true } }, 'Każde urządzenie ma swoją drogę i swój przełącznik.', { hint: 'Włącz tylko przełącznik M.' })
          ]
        },
        {
          id: 'u5l2', title: 'Zmysły elektroniki', icon: 'eye', sticker: 'ldr', desc: 'Czujniki, które widzą i słyszą.',
          ex: [
            learn('ldr', 'Fotorezystor Fotek', 'Fotek to opornik, który <b>czuje światło</b>: w jasności przepuszcza dużo prądu, a w ciemności mało. Dzięki niemu latarnie same zapalają się wieczorem!', { friend: true }),
            choice('Jaki czujnik pomoże lampce zapalać się, gdy robi się ciemno?', ['Czujnik światła (fotorezystor)', 'Czujnik temperatury', 'Mikrofon', 'Waga'], 0, 'Fotorezystor „widzi”, że zrobiło się ciemno.'),
            pairs('Co wyczuwa ten czujnik?', [['Fotorezystor', 'światło'], ['Termometr', 'ciepło'], ['Mikrofon', 'dźwięk'], ['Przycisk', 'naciśnięcie']]),
            tf('Czujnik ruchu może zapalić światło, gdy ktoś wejdzie do pokoju.', true, 'Tak działa światło na wielu klatkach schodowych.'),
            choice('Robot sprzątający nie spada ze schodów. Co mu pomaga?', ['Czujniki, które wyczuwają krawędź', 'Mocne kółka', 'Głośna muzyka', 'Kolorowa obudowa'], 0, 'Czujniki pod spodem sprawdzają, czy pod robotem jest podłoga.'),
            fill(['Czujniki to ', 0, ' urządzeń elektronicznych.'], ['zmysły', 'buty', 'kapelusze'], ['zmysły'], 'Czujniki pozwalają urządzeniom „widzieć”, „słyszeć” i „czuć”.')
          ]
        },
        {
          id: 'u5l3', title: 'Zielona energia', icon: 'sun', sticker: 'solar', desc: 'Prąd ze słońca i wiatru.',
          ex: [
            learn('solar', 'Panel Promyk', 'Promyk <b>zamienia światło słońca w prąd</b> – bez dymu i spalin! A turbiny wiatrowe robią prąd z wiatru. To <b>energia odnawialna</b>: słońce i wiatr się nie kończą.', { friend: true }),
            choice('Które źródło energii jest odnawialne?', ['Słońce', 'Węgiel', 'Benzyna', 'Gaz ziemny'], 0, 'Słońce świeci każdego dnia. Węgla, benzyny i gazu kiedyś zabraknie.'),
            sort('Oszczędza energię czy ją marnuje?', [{ t: 'Oszczędza', icon: 'leaf' }, { t: 'Marnuje', icon: 'waste' }], [
              { t: 'Gaszę światło, gdy wychodzę z pokoju', b: 0 },
              { t: 'Telewizor gra w pustym pokoju', b: 1 },
              { t: 'Wyjmuję ładowarkę z gniazdka', b: 0 },
              { t: 'Długo stoję przy otwartej lodówce', b: 1 },
              { t: 'Używam żarówek LED', b: 0 },
              { t: 'Komputer zostaje włączony na całą noc', b: 1 }
            ], 'Każde zgaszone światło to oszczędność energii – i pieniędzy!'),
            choice('Co zamienia wiatr w prąd?', ['Turbina wiatrowa', 'Parasol', 'Latawiec', 'Wiatraczek z papieru'], 0, 'Wiatr kręci łopatami turbiny, a w środku prądnica robi prąd.'),
            tf('Zużyte baterie oddajemy do specjalnego pojemnika.', true, 'Tak! Z odzyskanych baterii można zrobić nowe rzeczy, a przyroda jest bezpieczna.'),
            learn('mascot', 'Gratulacje!', 'Znasz już podstawy elektroniki: obwody, przełączniki, diody i czujniki. Prawdziwi inżynierowie zaczynali tak samo – od baterii, kabelka i żaróweczki. Co zbudujesz jutro?', { mood: 'cheer' })
          ]
        },
        {
          id: 'u5w', title: 'Warsztat wynalazcy', icon: 'wrench', ws: true, desc: 'Warsztat: dzwonki, wiatraczki i światełka.',
          ex: [
            board('Zbuduj dzwonek: brzęczyk już stoi, dodaj kabelki do obu szyn.', {
              fixed: [{ t: 'buzz', id: 'Z1', legs: ['b3', 'b6'] }],
              tray: [{ t: 'wire' }, { t: 'wire', col: '#2A2153' }], goal: { lit: { Z1: true } }, hint: 'kolumna 3 do szyny +, kolumna 6 do szyny −', sol: [['+3', 'a3'], ['a6', '-6']]
            }, 'Bzzzz! Brzęczyk dostał prąd z obu stron.'),
            volts('Wiatraczek potrzebuje 4,5 V. Ułóż baterie.', 4.5, [1.5, 1.5, 1.5, 9], 'Trzy paluszki po 1,5 V dają 4,5 V.', { name: 'Wiatraczek' }),
            pattern('Zbuduj sygnalizator: zapal strzałkę w prawo.', { size: [3, 4], target: [[1, 0], [1, 1], [1, 2], [1, 3], [0, 2], [2, 2]], switches: [
              { cells: [[1, 0], [1, 1], [1, 2], [1, 3]] }, { cells: [[0, 1], [2, 1]] }, { cells: [[0, 2], [2, 2]] }, { cells: [[0, 3], [2, 3]] }] },
            'Trzon strzałki i grot razem pokazują kierunek.'),
            board('Dwie diody w szeregu: zapal obie jednym kabelkiem.', {
              fixed: [{ t: 'res', r: 100, legs: ['+2', 'a2'] }, { t: 'led', id: 'D1', legs: ['b2', 'b4'] }, { t: 'led', id: 'D2', col: '#3BA7FF', legs: ['c4', 'c6'] }],
              tray: [{ t: 'wire' }], goal: { lit: { D1: true, D2: true } }, hint: 'połącz kolumnę 6 z szyną −', v: 9, sol: [['d6', '-6']]
            }, 'Diody stoją jedna za drugą, więc prąd przechodzi przez obie.')
          ]
        }
      ]
    }
  ];

  var stickers = [
    { id: 'wire', name: 'Kabelek Kuba', art: 'wire', lesson: 'u1l1', does: 'Prowadzi prąd z miejsca na miejsce. W środku ma miedziany drucik, a na zewnątrz plastikowy płaszczyk.', fact: 'Miedź to jeden z najlepszych przewodników. Lepiej przewodzi tylko srebro!' },
    { id: 'battery', name: 'Bateria Basia', art: 'battery', lesson: 'u1l2', does: 'Jest źródłem prądu – małym magazynem energii z plusem i minusem.', fact: 'Pierwszą baterię zbudował Alessandro Volta około 1800 roku. Od jego nazwiska pochodzi słowo „wolt”.' },
    { id: 'bulb', name: 'Żarówka Zuzia', art: 'bulbOn', lesson: 'u2l1', does: 'Zamienia prąd w światło.', fact: 'W zwykłej żarówce świeci cieniutki drucik rozgrzany do ponad 2000°C!' },
    { id: 'switch', name: 'Przełącznik Pstryk', art: 'switchOn', lesson: 'u2l2', does: 'Otwiera i zamyka obwód, czyli wyłącza i włącza prąd.', fact: 'Przełącznik jest nawet w lodówce: zapala światło, gdy otwierasz drzwi.' },
    { id: 'resistor', name: 'Opornik Olek', art: 'resistor', lesson: 'u4l1', does: 'Hamuje prąd, żeby inne elementy się nie przegrzały.', fact: 'Kolorowe paski to szyfr. Czerwony, czerwony i brązowy oznaczają 220 omów.' },
    { id: 'led', name: 'Dioda Lena', art: 'ledOn', lesson: 'u4l2', does: 'Świeci, zużywając bardzo mało prądu. Przepuszcza prąd tylko w jedną stronę.', fact: 'Za wynalezienie niebieskiej diody LED przyznano w 2014 roku Nagrodę Nobla.' },
    { id: 'buzzer', name: 'Brzęczyk Bzyk', art: 'buzzerOn', lesson: 'u5l1', does: 'Zamienia prąd w dźwięk.', fact: 'W środku drga cieniutka blaszka – tysiące razy na sekundę!' },
    { id: 'motor', name: 'Silniczek Szymek', art: 'motorOn', lesson: 'u5l1', does: 'Zamienia prąd w ruch obrotowy.', fact: 'W środku silniczka są magnesy. To dzięki nim wirnik się kręci.' },
    { id: 'ldr', name: 'Fotorezystor Fotek', art: 'ldr', lesson: 'u5l2', does: 'Wyczuwa światło: im jaśniej, tym łatwiej przepuszcza prąd.', fact: 'Dzięki takim czujnikom latarnie same zapalają się o zmierzchu.' },
    { id: 'solar', name: 'Panel Promyk', art: 'solar', lesson: 'u5l3', does: 'Zamienia światło słońca w prąd.', fact: 'Panele słoneczne zasilają nawet Międzynarodową Stację Kosmiczną!' }
  ];

  var accs = [
    { id: 'goggles', name: 'Gogle ochronne', from: 'chest:u1', desc: 'Każdy elektronik chroni oczy podczas eksperymentów.' },
    { id: 'bow', name: 'Kokardka', from: 'chest:u2', desc: 'Różowa, w sam raz na pierwszy obwód.' },
    { id: 'helmet', name: 'Kask elektryka', from: 'chest:u3', desc: 'Z latarką! Przyda się w ciemnej piwnicy.' },
    { id: 'glasses', name: 'Okulary wynalazcy', from: 'chest:u4', desc: 'Pomagają odczytać paski na opornikach.' },
    { id: 'crown', name: 'Korona', from: 'chest:u5', desc: 'Dla kogoś, kto przeszedł całą ścieżkę.' },
    { id: 'headphones', name: 'Słuchawki', from: 'xp:100', desc: 'Za zebranie 100 iskier.' },
    { id: 'beret', name: 'Beret artysty', from: 'xp:250', desc: 'Za zebranie 250 iskier. Elektronika też jest sztuką!' }
  ];

  window.ISK_STAGES.push({
    id: 'e1', n: 1, name: 'Iskierka', form: 1, age: '10+', ageLabel: '10–11 lat', title: 'Pierwsze iskry',
    grow: '', units: units, stickers: stickers, accs: accs
  });
})();
