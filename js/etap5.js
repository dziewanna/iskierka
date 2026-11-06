/* ISKIERKA — ETAP 5 · Iskrosława · dla dorosłych
   Prąd w dorosłym życiu: instalacja w mieszkaniu, bezpieczniki i różnicówka, budżet mocy,
   światło schodowe, akumulatory i ładowarki, fotowoltaika.
   Humor z mrugnięciem oka: rachunki, teściowa, kawa, urząd. Funkcje do zadań są w js/kit.js. */
(function () {
  'use strict';
  var K = window.ISK_KIT;
  var learn = K.learn, choice = K.choice, tf = K.tf, pairs = K.pairs, sort = K.sort, calc = K.calc, order = K.order;
  var truth = K.truth, volts = K.volts, build = K.build, design = K.design, F = K.F;

  /* misja: światło na schodach sterowane z dołu i z góry */
  var STAIRS = [
    { id: 'B', t: 'bat', at: [84, 270], name: 'Zasilanie' },
    { id: 'S1', t: 'spdt', at: [64, 168], name: 'Na dole', on: false },
    { id: 'S2', t: 'spdt', at: [282, 58], name: 'Na górze', on: true, flip: true },
    { id: 'L', t: 'lamp', at: [176, 46], name: 'Lampa' }
  ];

  var units = [
    /* ================= ROZDZIAŁ 1 ================= */
    {
      id: 'a5u1', color: 'copper', title: 'Prąd w ścianie', sub: 'Instalacja w mieszkaniu',
      guide: [
        'W gniazdku jest napięcie przemienne <b>230 V, 50 Hz</b> – groźne dla życia. Prace przy instalacji wykonuje się po wyłączeniu zasilania, a najlepiej zleca elektrykowi z uprawnieniami.',
        'Kolory żył: <b>L</b> (faza) – brązowy, czarny lub szary; <b>N</b> (neutralny) – niebieski; <b>PE</b> (ochronny) – żółto-zielony.',
        'Wyłącznik nadprądowy, potocznie „bezpiecznik”, np. <b>B16</b>, chroni <b>przewody</b> przed przegrzaniem przy przeciążeniu i zwarciu.',
        'Wyłącznik różnicowoprądowy („różnicówka”) chroni <b>ludzi</b>: wyłącza, gdy prąd w L i N różni się o więcej niż <b>30 mA</b>. Przycisk TEST naciskaj co jakiś czas.',
        'Moc obwodu: P = U · I. Przy 230 V i B16: 230 · 16 = <b>3680 W</b>.',
        'Przełącznik schodowy ma trzy zaciski: wspólny C oraz A i B. Dwa takie przełączniki łączy się dwoma przewodami.'
      ],
      lessons: [
        {
          id: 'a5u1l1', title: 'Trzy żyły w ścianie', icon: 'plug', desc: 'L, N, PE i gniazdko od środka.',
          ex: [
            learn('mascot', 'Iskrosława. Dla przyjaciół Sława.', 'Urosłam. Nie róbmy z tego wydarzenia. Teraz tematy z dorosłego życia: prąd w mieszkaniu, akumulatory i słońce na dachu. Konkretnie i bez entuzjazmu – entuzjazm został w etapie 2. Wody i prądu nie mieszamy. Kawy i prądu – owszem.'),
            learn('wires3', 'Trzy żyły w ścianie', 'W przewodzie do gniazdka biegną trzy żyły: <b>L</b> – faza (brązowa, czarna albo szara), <b>N</b> – przewód neutralny (niebieski) i <b>PE</b> – przewód ochronny (żółto-zielony). Napięcie 230 V jest między L a N. PE łączy metalowe obudowy z uziemieniem.'),
            choice('Który przewód jest ochronny (PE)?', ['Żółto-zielony', 'Niebieski', 'Brązowy', F('Ten, który najlepiej pasuje do zasłon', 'Gust doceniam, ale PE zawsze jest żółto-zielony.')], 0, 'Żółto-zielony zarezerwowano wyłącznie dla przewodu ochronnego.'),
            K.pairs('Połącz przewód z kolorem izolacji', [['L – faza', 'brązowy'], ['N – neutralny', 'niebieski'], ['PE – ochronny', 'żółto-zielony']]),
            choice('Jakie napięcie jest w zwykłym gniazdku w Polsce?', ['230 V prądu przemiennego, 50 Hz', '12 V prądu stałego', '1,5 V jak w paluszku', F('Tyle, ile zostało w portfelu po opłatach', 'Smutne, ale prawdziwe. Fizycznie jednak: 230 V AC, 50 Hz.')], 0, 'Napięcie zmienia kierunek 50 razy na sekundę.'),
            tf('Kolor izolacji gwarantuje, że przewód jest bez napięcia.', false, 'Kolory pomagają, ale ktoś mógł podłączyć inaczej. Przed pracą wyłącz zasilanie i sprawdź brak napięcia odpowiednim miernikiem.'),
            learn('socket', 'Gniazdko od środka', 'Bolec na górze to <b>PE</b>. Styka się z obudową urządzenia, zanim zetkną się pozostałe styki – i rozłącza się ostatni. Dwa otwory to L i N. Wtyczkę wyjmujemy, trzymając za obudowę, nie za kabel.'),
            tf('Bolec ochronny łączy się wcześniej niż pozostałe styki.', true, 'Dzięki temu obudowa jest uziemiona, zanim pojawi się napięcie.'),
            choice('Co zrobić przed wymianą gniazdka?', ['Wyłączyć właściwy bezpiecznik i sprawdzić brak napięcia', 'Wystarczy zgasić światło w pokoju', F('Zrobić zdjęcie „przed” na Instagram', 'Zdjęcie zrób, ale dopiero po wyłączeniu bezpiecznika i sprawdzeniu napięcia.'), 'Założyć rękawiczki do zmywania'], 0, 'A jeśli to Twój pierwszy raz – zadzwoń po elektryka. Serio.')
          ]
        },
        {
          id: 'a5u1l2', title: 'Bezpiecznik i różnicówka', icon: 'shield', sticker: 'rcd', desc: 'Kto pilnuje przewodów, a kto ludzi?',
          ex: [
            learn('fuse', 'Bezpiecznik B16', 'W rozdzielnicy mieszkają wyłączniki nadprądowe. Napis <b>B16</b> znaczy: charakterystyka B, prąd znamionowy 16 A. Przy przeciążeniu wyłącza po chwili, przy zwarciu – natychmiast. Chroni <b>przewody</b> przed przegrzaniem.'),
            calc('Ile watów maksymalnie pociągnie obwód z B16? (P = U · I, 230 V · 16 A)', 3680, 'W', 'P = 230 V · 16 A = 3680 W.'),
            learn('rcd', 'Różnicówka Renata', 'Renata liczy, ile prądu wpływa przewodem L i ile wraca przewodem N. Jeśli brakuje więcej niż <b>30 mA</b>, prąd ucieka gdzie indziej – może przez człowieka. Wtedy wyłącza w ułamku sekundy. „Trzydzieści miliamper i ani grosza więcej.”', { friend: true }),
            choice('Przed czym chroni różnicówka?', ['Przed porażeniem, gdy prąd ucieka np. przez człowieka', 'Przed burzą', F('Przed teściową', 'Niestety. Na to jeszcze nie wynaleziono zabezpieczenia.'), F('Przed wysokim rachunkiem', 'Gdyby! Rachunek przychodzi i tak.')], 0, 'Różnicówka porównuje prąd w L i N. Różnica to prąd, który uciekł.'),
            tf('Bezpiecznik B16 chroni człowieka przed porażeniem.', false, '16 A to ogromny prąd dla człowieka – groźny jest już ułamek ampera. B16 chroni przewody, ludzi chroni różnicówka 30 mA.'),
            calc('Przez człowieka popłynęło 0,05 A. Ile to miliamperów?', 50, 'mA', '0,05 · 1000 = 50 mA. To więcej niż 30 mA, więc różnicówka wyłączy.'),
            choice('Do czego służy przycisk TEST na różnicówce?', ['Sprawdza mechanizm – różnicówka powinna od razu wyłączyć', 'Zeruje licznik prądu', F('Do testowania cierpliwości domowników', 'To też działa. Ale głównie sprawdza mechanizm – po teście włącz dźwignię z powrotem.'), 'Zwiększa moc obwodu'], 0, 'Naciśnij co jakiś czas. Jeśli nie wyłącza – wezwij elektryka.'),
            sort('Kto czego pilnuje?', [{ t: 'Bezpiecznik B16', icon: 'shieldBolt' }, { t: 'Różnicówka', icon: 'heart' }], [
              { t: 'Za dużo urządzeń w jednym obwodzie', b: 0 }, { t: 'Prąd uciekający przez człowieka', b: 1 },
              { t: 'Zwarcie w przedłużaczu', b: 0 }, { t: 'Pralka z przebiciem na obudowę', b: 1 },
              { t: 'Grzejący się przewód', b: 0 }, { t: 'Suszarka wpadła do wanny', b: 1 }
            ], 'Bezpiecznik pilnuje, żeby przewody się nie przegrzały. Różnicówka wyczuwa prąd uciekający poza obwód.')
          ]
        },
        {
          id: 'a5u1l3', title: 'Czy wywali korki?', icon: 'calc', desc: 'Budżet mocy i rachunek za prąd.',
          ex: [
            learn('kwh', 'Budżet mocy', 'Każde urządzenie ma moc w watach. Gdy w jednym obwodzie włączysz za dużo naraz, prąd przekroczy 16 A i bezpiecznik wyłączy obwód. Moce się sumują, a prąd liczymy ze wzoru <b>I = P : U</b>.'),
            calc('Czajnik ma 2000 W. Jaki prąd pobiera? (I = P : U, U = 230 V; zaokrąglij do 0,1)', 8.7, 'A', '2000 : 230 ≈ 8,7 A.', { tol: 0.02 }),
            choice('Czajnik 2000 W, mikrofala 1200 W i toster 900 W w jednym obwodzie B16 (max 3680 W). Co się stanie?', ['Razem 4100 W – bezpiecznik wyłączy obwód', 'Wszystko zadziała', F('Śniadanie zrobi się samo', 'Raczej zrobi się ciemno. 4100 W to więcej niż 3680 W.'), 'Czajnik zagotuje szybciej'], 0, '2000 + 1200 + 900 = 4100 W, a obwód wytrzyma 3680 W.'),
            calc('Grzejnik 2 kW działa 3 godziny. Ile kWh zużyje?', 6, 'kWh', '2 kW · 3 h = 6 kWh.'),
            calc('Przy cenie 1,10 zł za kWh: ile kosztuje te 6 kWh?', 6.6, 'zł', '6 · 1,10 zł = 6,60 zł.'),
            choice('Ładowarka 20 W pracuje 2 godziny dziennie przez 30 dni. Ile to energii?', ['1,2 kWh', '120 kWh', '12 kWh', F('Tyle co lodówka przez tydzień', 'Brzmi wiarygodnie, ale policzmy: 20 W · 2 h · 30 = 1200 Wh = 1,2 kWh.')], 0, '20 W · 60 h = 1200 Wh = 1,2 kWh. Telefon to drobiazg w rachunku.'),
            tf('Urządzenie w trybie czuwania (stand-by) nie pobiera prądu.', false, 'Pobiera mało, ale bez przerwy – zwykle od ułamka wata do kilku watów. Przez rok trochę się uzbiera.'),
            choice('Przedłużacz z napisem „max 2500 W”. Podłączasz czajnik 2000 W i grzejnik 1500 W. Werdykt?', ['Za dużo – 3500 W przegrzeje przedłużacz', 'W porządku, gniazdko i tak wytrzyma', F('W porządku, jeśli przedłużacz jest ładny', 'Estetyka nie chroni przed przegrzaniem. 3500 W > 2500 W.'), 'Wystarczy rozwinąć kabel do połowy'], 0, 'Przedłużacz ma własny limit. Zwinięty na bębnie grzeje się jeszcze bardziej – rozwijaj do końca.')
          ]
        },
        {
          id: 'a5u1w', title: 'Światło schodowe', icon: 'stairs', ws: true, desc: 'Warsztat: pstryk na dole, pstryk na górze.',
          ex: [
            learn('stairsSch', 'Pstryk na dole, pstryk na górze', 'Przełącznik schodowy ma trzy zaciski: wspólny <b>C</b> oraz <b>A</b> i <b>B</b>. Pstryczek łączy C albo z A, albo z B. Dwa takie przełączniki łączymy dwoma przewodami: A z A, B z B. Wtedy każdy z nich zmienia stan światła – bez względu na to, jak ustawiony jest drugi.'),
            build('Ktoś chce zapalać światło na dole schodów i gasić je na górze. I odwrotnie. Połącz zasilanie, dwa przełączniki schodowe i lampę.', {
              scene: 'stairs', parts: STAIRS,
              goal: { cases: [
                { name: 'Wieczór: nikt nie pstrykał', want: 'ciemno', set: { S1: { on: false }, S2: { on: true } }, lit: { L: false } },
                { name: 'Pstryk na dole', want: 'jasno', set: { S1: { on: true }, S2: { on: true } }, lit: { L: true } },
                { name: 'Pstryk na górze', want: 'ciemno', set: { S1: { on: true }, S2: { on: false } }, lit: { L: false } },
                { name: 'Ktoś schodzi i pstryka na dole', want: 'jasno', set: { S1: { on: false }, S2: { on: false } }, lit: { L: true } }
              ] },
              route: 'Plus zasilania do <b>C</b> dolnego przełącznika. Potem dwa przewody między przełącznikami: <b>A z A</b> i <b>B z B</b>. Z <b>C</b> górnego przełącznika do lampy, a z lampy do minusa.',
              sol: [['B:+', 'S1:C'], ['S1:A', 'S2:A'], ['S1:B', 'S2:B'], ['S2:C', 'L:b'], ['L:a', 'B:-']]
            }, 'Prąd ma dwie drogi między przełącznikami. Światło świeci, gdy oba wskazują tę samą drogę. Każdy pstryk zmienia drogę jednego z nich – więc zawsze zmienia stan światła.'),
            choice('Ile przewodów biegnie między dwoma przełącznikami schodowymi?', ['Dwa', 'Jeden', 'Trzy', F('Zależy od humoru elektryka', 'Humor bywa zmienny, fizyka nie: dwa przewody.')], 0, 'Te dwa przewody to dwie możliwe drogi dla prądu.'),
            truth('Schody działają jak bramka logiczna. Gdy przełączniki są ustawione różnie, lampa świeci. Uzupełnij tabelę.', 'XOR', 'To bramka XOR: 1, gdy wejścia są różne. Zmiana dowolnego wejścia zmienia wynik – dokładnie tak jak na schodach.'),
            choice('Jak sterować światłem z trzech miejsc (dół, półpiętro, góra)?', ['Dwa schodowe na końcach, a pośrodku przełącznik krzyżowy', 'Trzy zwykłe przełączniki szeregowo', 'Trzy schodowe równolegle', F('Zatrudnić lokaja', 'Elegancko, ale drogo. Wystarczy przełącznik krzyżowy pośrodku.')], 0, 'Przełącznik krzyżowy zamienia ze sobą dwa przewody biegnące między schodowymi.'),
            tf('W domowej instalacji wyłącznik światła przerywa przewód fazowy L, a nie neutralny N.', true, 'Dzięki temu po wyłączeniu w oprawce lampy nie ma napięcia – można bezpieczniej wymienić żarówkę.')
          ]
        },
        {
          id: 'a5u1p', title: 'Projektant: korytarz', icon: 'wrench', ws: true, desc: 'Światło z dwóch miejsc. Bez instrukcji.',
          ex: [
            design('Zaprojektuj oświetlenie schodów sterowane z dołu i z góry.', {
              id: 'd-korytarz', scene: 'stairs', help: 1,
              brief: 'Klient wchodzi po schodach i chce zapalać światło na dole, a gasić na górze. I odwrotnie. Magazyn jak w hurtowni: jest wszystko, także rzeczy zbędne.',
              slots: [{ id: 'PWR', at: [84, 270], name: 'Zasilanie' }, { id: 'DOL', at: [64, 168], name: 'Na dole' }, { id: 'GORA', at: [282, 58], name: 'Na górze', flip: true }, { id: 'OUT', at: [176, 46], name: 'Lampa' }],
              bin: [{ t: 'bat', v: 4.5 }, { t: 'sw' }, { t: 'spdt' }, { t: 'sw' }, { t: 'spdt' }, { t: 'lamp' }, { t: 'buzz' }],
              goal: { cases: [
                { name: 'Oba w pozycji startowej', want: 'jasno', set: { DOL: { on: false }, GORA: { on: false } }, lit: { OUT: true } },
                { name: 'Pstryk na dole', want: 'ciemno', set: { DOL: { on: true }, GORA: { on: false } }, lit: { OUT: false } },
                { name: 'Potem pstryk na górze', want: 'jasno', set: { DOL: { on: true }, GORA: { on: true } }, lit: { OUT: true } },
                { name: 'Sam pstryk na górze', want: 'ciemno', set: { DOL: { on: false }, GORA: { on: true } }, lit: { OUT: false } }
              ] },
              route: 'Dwa <b>przełączniki schodowe</b>: plus do C dolnego, A z A, B z B, C górnego do lampy, lampa do minusa.',
              sol: { parts: { PWR: 0, DOL: 2, GORA: 4, OUT: 5 }, wires: [['PWR:+', 'DOL:C'], ['DOL:A', 'GORA:A'], ['DOL:B', 'GORA:B'], ['GORA:C', 'OUT:b'], ['OUT:a', 'PWR:-']] }
            }, 'Zwykłe przełączniki tu nie wystarczą – potrzebne są dwa schodowe i dwa przewody między nimi. Teraz wiesz, czego szukać w hurtowni.')
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 2 ================= */
    {
      id: 'a5u2', color: 'mint', title: 'Akumulatory i ładowarki', sub: 'Li-Ion, Wh i USB-C',
      guide: [
        'Ogniwo litowo-jonowe ma napięcie nominalne ok. <b>3,6–3,7 V</b>, w pełni naładowane – <b>4,2 V</b>. Nie rozładowujemy go do zera.',
        'mAh mówi o ładunku, a energię liczymy w <b>Wh</b>: E = U · Q, np. 3,7 V · 10 Ah = 37 Wh.',
        'Szeregowo rośnie napięcie (3S = 3 · 3,7 V = 11,1 V), równolegle rośnie pojemność.',
        'Ładowanie: najpierw stałym prądem (CC), potem stałym napięciem (CV). Ostatnie 20% trwa najdłużej.',
        'Akumulatory nie lubią upału. Spuchnięty akumulator: nie ładuj, nie przebijaj, oddaj do serwisu lub punktu zbiórki.',
        'USB-C Power Delivery: ładowarka i urządzenie uzgadniają napięcie (5, 9, 15, 20 V). Moc P = U · I, np. 20 V · 3 A = 60 W.'
      ],
      lessons: [
        {
          id: 'a5u2l1', title: 'Ilona Li-Ion', icon: 'cell', sticker: 'liion', desc: 'Wolty, miliamperogodziny i waty.',
          ex: [
            learn('liion', 'Ilona Li-Ion', 'Ilona to ogniwo litowo-jonowe – takie jak w telefonie, laptopie i hulajnodze. Nominalnie ma <b>3,7 V</b>, naładowana do pełna – <b>4,2 V</b>. „Ładuj mnie mądrze i nie zostawiaj w nagrzanym aucie. Mam swoje lata.”', { friend: true }),
            choice('Jakie napięcie ma w pełni naładowane ogniwo Li-Ion?', ['4,2 V', '1,5 V', '9 V', '230 V'], 0, 'Nominalnie 3,6–3,7 V, a na pełnym naładowaniu 4,2 V.'),
            calc('Powerbank: 10 000 mAh przy 3,7 V. Ile to Wh? (10 000 mAh = 10 Ah; E = U · Q)', 37, 'Wh', '3,7 V · 10 Ah = 37 Wh.'),
            choice('Dlaczego na lotnisku pytają o Wh, a nie o mAh?', ['Wh mówi o energii, a mAh bez napięcia – nie', 'mAh to jednostka amerykańska', F('Bo ochrona lubi waty', 'Ochrona lubi porządek. Wh to energia, a o nią chodzi przy ryzyku pożaru.'), 'Bez powodu'], 0, 'Zwykle powerbanki do 100 Wh można wziąć do kabiny bez dodatkowej zgody.'),
            calc('Telefon ma akumulator 15 Wh. Powerbank 37 Wh oddaje ok. 70% energii, reszta to ciepło. Ile pełnych ładowań? (zaokrąglij do 0,1)', 1.7, 'raza', '37 · 0,7 ≈ 25,9 Wh; 25,9 : 15 ≈ 1,7.', { tol: 0.04 }),
            tf('Powerbankiem 10 000 mAh naładujesz telefon 5000 mAh dokładnie dwa razy.', false, 'Mniej. Napięcia są różne, a część energii zamienia się w ciepło. Zwykle wychodzi ok. 1,3–1,5 raza.'),
            choice('Co znaczy „3S” na akumulatorze do drona?', ['Trzy ogniwa szeregowo – 11,1 V', 'Trzy sekundy ładowania', 'Trzy stopnie bezpieczeństwa', F('Szybki, Smukły, Seksowny', 'Dział marketingu by się ucieszył. Elektronika mówi: 3 ogniwa w szeregu, 3 · 3,7 V = 11,1 V.')], 0, 'S od angielskiego „series” – szeregowo.')
          ]
        },
        {
          id: 'a5u2l2', title: 'Ładowanie z głową', icon: 'battery', desc: 'CC, CV, upał i spuchnięte baterie.',
          ex: [
            learn('chargeCurve', 'Jak się ładuje akumulator', 'Najpierw ładowarka podaje stały prąd (<b>CC</b>) – akumulator szybko się napełnia. Gdy napięcie dojdzie do 4,2 V, trzyma stałe napięcie (<b>CV</b>), a prąd powoli maleje. Dlatego od 0 do 80% idzie szybko, a ostatnie 20% – jak kolejka w urzędzie.'),
            order('Ułóż etapy ładowania akumulatora Li-Ion', ['Akumulator prawie pusty', 'Ładowanie stałym prądem (CC)', 'Napięcie dochodzi do 4,2 V', 'Stałe napięcie (CV), prąd maleje', 'Ładowarka kończy ładowanie'], 'CC, potem CV. Tak ładuje każdy telefon.'),
            choice('Co najbardziej szkodzi akumulatorowi Li-Ion?', ['Upał i trzymanie na 100% w gorącym miejscu', 'Ładowanie w chłodnym pokoju', 'Ładowanie od 20% do 80%', F('Brak komplementów', 'Ilona przyjmuje komplementy, ale szkodzi jej głównie upał.')], 0, 'Wysoka temperatura i pełne naładowanie przyspieszają starzenie się ogniwa.'),
            learn('swollen', 'Spuchnięty akumulator', 'Gdy obudowa telefonu się wybrzusza, a ekran odstaje – w ogniwie zbiera się gaz. To sygnał alarmowy. Nie ładuj, nie przebijaj, nie dociskaj. Odłóż z dala od rzeczy palnych i oddaj do serwisu.', { mood: 'oops' }),
            choice('Akumulator w laptopie spuchł. Co robisz?', ['Przestaję używać i oddaję do serwisu', 'Dociskam obudowę, żeby się domknęła', F('Przekłuwam, żeby zszedł gaz', 'Nie! Przebite ogniwo Li-Ion może się zapalić. Zostaw to serwisowi.'), F('Przechodzi na dietę', 'Akumulatory nie chudną. Wymiana, nie dieta.')], 0, 'Spuchnięte ogniwo jest uszkodzone i może się zapalić.'),
            tf('Zużyte akumulatory można wyrzucić do zwykłego kosza.', false, 'Oddajemy je do punktu zbiórki – pojemniki są w wielu sklepach z elektroniką.'),
            learn('usbc', 'USB-C Power Delivery', 'Ładowarka i telefon najpierw „rozmawiają” i ustalają napięcie: 5, 9, 15 albo 20 V. Moc to napięcie razy prąd. Dlatego mała kostka potrafi ładować laptopa – jeśli umie dać 20 V.'),
            calc('Ładowarka daje 20 V przy 3 A. Jaka to moc?', 60, 'W', 'P = U · I = 20 · 3 = 60 W.'),
            choice('Ładowarka z bazaru za 9,99 zł, bez znaku CE i bez nazwy producenta. Decyzja?', ['Nie kupuję – może nie mieć izolacji i zabezpieczeń', 'Biorę dwie, na zapas', F('Biorę, pachnie nowością', 'Pachnie raczej ryzykiem. Tanie podróbki często nie oddzielają porządnie 230 V od wtyczki USB.'), 'Kupuję i ładuję telefon pod poduszką'], 0, 'Między 230 V a Twoją ręką jest tylko to, co producent zmieścił w środku.')
          ]
        },
        {
          id: 'a5u2w', title: 'Pakiet do drona', icon: 'wrench', ws: true, desc: 'Warsztat: składasz ogniwa i liczysz zasięg.',
          ex: [
            volts('Dron potrzebuje 11,1 V. Złóż pakiet z ogniw.', 11.1, [3.7, 3.7, 3.7, 3.7, 1.5, 9], 'Trzy ogniwa Li-Ion szeregowo: 3 · 3,7 V = 11,1 V – pakiet 3S.', { name: 'Dron' }),
            volts('Latarka czołowa chce 7,4 V. Złóż pakiet.', 7.4, [3.7, 3.7, 3.7, 1.5, 4.5], 'Dwa ogniwa szeregowo: 2 · 3,7 V = 7,4 V – pakiet 2S.', { name: 'Czołówka' }),
            choice('Dwa ogniwa 3,7 V / 3 Ah połączono równolegle. Co wychodzi?', ['3,7 V i 6 Ah', '7,4 V i 3 Ah', '7,4 V i 6 Ah', '3,7 V i 3 Ah'], 0, 'Równolegle napięcie zostaje, a pojemności się sumują.'),
            K.pairs('Połącz pojęcia', [['szeregowo', 'rośnie napięcie'], ['równolegle', 'rośnie pojemność'], ['Wh', 'energia'], ['mAh', 'ładunek']]),
            calc('Hulajnoga ma akumulator 36 V i 10 Ah. Ile to Wh?', 360, 'Wh', '36 V · 10 Ah = 360 Wh.'),
            calc('Hulajnoga zużywa ok. 12 Wh na kilometr. Ile kilometrów przejedzie na 360 Wh?', 30, 'km', '360 : 12 = 30 km. Pod górkę i zimą mniej – fizyka nie zna litości.'),
            tf('Ogniwa łączone równolegle powinny mieć ten sam stan naładowania.', true, 'Inaczej pełne ogniwo gwałtownie ładuje puste bardzo dużym prądem.')
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 3 ================= */
    {
      id: 'a5u3', color: 'sky', title: 'Słońce na dachu', sub: 'Fotowoltaika w domu',
      guide: [
        'Panel fotowoltaiczny zamienia światło w prąd stały (DC). Moc instalacji podaje się w <b>kWp</b> – tyle dałaby w idealnych warunkach.',
        'W Polsce 1 kWp daje rocznie średnio ok. <b>1000 kWh</b>. Najlepiej na dachu od południa, bez cienia.',
        'Panele łączy się szeregowo w łańcuchy: 10 paneli po 40 V = 400 V prądu stałego. To już groźne napięcie.',
        'Falownik zamienia prąd stały na zmienny 230 V / 50 Hz. Gdy w sieci zabraknie prądu, falownik sieciowy natychmiast się wyłącza, żeby nie zagrażać elektrykom na linii.',
        'Autokonsumpcja: najbardziej opłaca się zużywać prąd wtedy, gdy panele go produkują – np. pranie w południe.'
      ],
      lessons: [
        {
          id: 'a5u3l1', title: 'Elektrownia na dachu', icon: 'house', desc: 'kWp, kWh i łańcuchy paneli.',
          ex: [
            learn('housePV', 'Elektrownia na dachu', 'Panele zamieniają światło w prąd stały. Falownik robi z niego 230 V dla domu, a nadmiar płynie do sieci. Moc instalacji podaje się w <b>kWp</b> – kilowatach szczytowych.'),
            calc('W Polsce 1 kWp daje rocznie ok. 1000 kWh. Ile da instalacja 5 kWp?', 5000, 'kWh', '5 · 1000 = 5000 kWh rocznie.'),
            choice('Gdzie panele w Polsce wyprodukują najwięcej?', ['Na dachu od południa, bez cienia', 'Na północnej ścianie', 'W piwnicy, żeby nie ukradli', F('Na balkonie pod parasolem', 'Optymizm godny podziwu. Ale panel potrzebuje słońca, nie cienia.')], 0, 'Kierunek południowy i kąt ok. 30–40° to klasyka.'),
            tf('W pochmurny dzień panel nie produkuje nic.', false, 'Produkuje mniej – często kilka razy mniej – ale nie zero.'),
            calc('Łańcuch to 10 paneli po 40 V połączonych szeregowo. Jakie ma napięcie?', 400, 'V', '10 · 40 V = 400 V prądu stałego. Dlatego instalację montuje fachowiec.'),
            choice('Dlaczego cień na jednym panelu psuje cały łańcuch?', ['W szeregu prąd jest wspólny – słaby panel ogranicza wszystkie', 'Cień jest zimny', F('Panele są zazdrosne', 'Trochę jak w zespole: najwolniejszy wyznacza tempo. W szeregu prąd jest jeden dla wszystkich.'), 'Nie psuje'], 0, 'Dlatego stosuje się diody obejściowe i optymalizatory.')
          ]
        },
        {
          id: 'a5u3l2', title: 'Falownik Feliks', icon: 'wave', sticker: 'inverter', desc: 'Z prądu stałego robi zmienny. I ma zasady.',
          ex: [
            learn('inverter', 'Falownik Feliks', 'Feliks zamienia prąd stały z paneli na zmienny 230 V / 50 Hz – tak równy, że sieć go przyjmuje. Gdy w sieci zabraknie prądu, natychmiast się wyłącza. „Nie podam napięcia na linię, przy której pracuje elektryk. Mam zasady.”', { friend: true }),
            choice('Dlaczego falownik sieciowy wyłącza się przy awarii sieci?', ['Żeby nie podać napięcia na linię, którą naprawiają elektrycy', 'Bo panele bez sieci nie działają', F('Bo obraża się na zakład energetyczny', 'Feliks ma charakter, ale to zabezpieczenie: chroni ludzi pracujących na linii.'), 'Bo kończy mu się paliwo'], 0, 'To zabezpieczenie przed tak zwaną pracą wyspową.'),
            tf('Zwykła instalacja fotowoltaiczna bez magazynu energii zasila dom podczas awarii sieci.', false, 'Bez magazynu i specjalnego falownika – nie. Niespodzianka wielu właścicieli przy pierwszej burzy.'),
            K.pairs('Kto co robi?', [['Panel', 'zamienia światło w prąd stały'], ['Falownik', 'robi z prądu stałego zmienny'], ['Licznik dwukierunkowy', 'liczy pobór i oddanie'], ['Magazyn energii', 'przechowuje nadwyżkę']]),
            choice('Co to jest autokonsumpcja?', ['Zużywanie prądu z paneli na bieżąco, w chwili produkcji', 'Samochód, który jeździ sam', F('Jedzenie przy biurku', 'To też, ale w fotowoltaice: zużywanie własnego prądu w chwili produkcji.'), 'Oddawanie prądu sąsiadom'], 0, 'Prąd zużyty od razu nie musi wędrować do sieci i z powrotem.'),
            sort('Co warto przestawić na słoneczne południe?', [{ t: 'Na południe', icon: 'sun' }, { t: 'Obojętnie', icon: 'moon' }], [
              { t: 'Pralka', b: 0 }, { t: 'Zmywarka', b: 0 }, { t: 'Lodówka', b: 1 },
              { t: 'Ładowanie auta', b: 0 }, { t: 'Router Wi-Fi', b: 1 }, { t: 'Grzanie wody w bojlerze', b: 0 }
            ], 'Urządzenia, które da się zaplanować, przesuwamy na godziny produkcji. Lodówka i router chodzą cały czas.')
          ]
        },
        {
          id: 'a5u3w', title: 'Słoneczne rachunki', icon: 'calc', ws: true, desc: 'Warsztat: ile paneli i kiedy się zwrócą?',
          ex: [
            calc('Dom zużywa rocznie 4000 kWh. Ile kWp paneli potrzeba? (1 kWp ≈ 1000 kWh)', 4, 'kWp', '4000 : 1000 = 4 kWp.'),
            calc('Jeden panel ma 400 Wp. Ile paneli potrzeba na 4 kWp?', 10, 'szt.', '4000 Wp : 400 Wp = 10 paneli.'),
            calc('Instalacja kosztuje 20 000 zł i obniża rachunki o 2500 zł rocznie. Po ilu latach się zwróci?', 8, 'lat', '20 000 : 2500 = 8 lat. Potem panele pracują już na Twoją kawę.'),
            choice('Licznik pokazuje: pobrano 3000 kWh, oddano 2000 kWh. Co to znaczy?', ['Dom pobrał z sieci 3000 kWh, a nadwyżki 2000 kWh oddał do sieci', 'Panele są zepsute', F('Licznik ma kryzys tożsamości', 'Ma po prostu dwa kierunki: osobno liczy pobór i oddanie.'), 'Dom zużył 5000 kWh z paneli'], 0, 'Licznik dwukierunkowy liczy dwie wartości.'),
            order('Droga energii od słońca do czajnika', ['Słońce świeci na panel', 'Panel daje prąd stały', 'Falownik robi z niego 230 V AC', 'Prąd płynie do gniazdka', 'Czajnik grzeje wodę na kawę'], 'Od fotonu do kawy w pięciu krokach.'),
            tf('Umyte panele mogą odzyskać część utraconej mocy.', true, 'Kurz i ptasie pamiątki zabierają kilka procent. Ale na dach tylko z zabezpieczeniem!')
          ]
        }
      ]
    }
  ];

  var stickers = [
    { id: 'rcd', name: 'Różnicówka Renata', art: 'rcd', lesson: 'a5u1l2', does: 'Porównuje prąd w L i N. Gdy różnica przekracza 30 mA, wyłącza w ułamku sekundy.', fact: 'Reaguje szybciej, niż zdążysz powiedzieć „to tylko na chwilę”.' },
    { id: 'liion', name: 'Ilona Li-Ion', art: 'liion', lesson: 'a5u2l1', does: 'Magazynuje energię w telefonach, laptopach i hulajnogach. 3,7 V nominalnie, 4,2 V do pełna.', fact: 'Za ogniwa litowo-jonowe przyznano w 2019 roku Nagrodę Nobla z chemii.' },
    { id: 'inverter', name: 'Falownik Feliks', art: 'inverter', lesson: 'a5u3l2', does: 'Zamienia prąd stały z paneli na zmienny 230 V / 50 Hz.', fact: 'Przy awarii sieci wyłącza się w ułamku sekundy – żeby nie porazić elektryków na linii.' }
  ];

  var accs = [
    { id: 'shades', name: 'Okulary przeciwsłoneczne', from: 'chest:a5u1', desc: 'Na dach z panelami i na poniedziałkowe poranki.' },
    { id: 'pearls', name: 'Sznur pereł', from: 'chest:a5u2', desc: 'Klasyka. Jak 230 V i 50 Hz.' },
    { id: 'monocle', name: 'Monokl', from: 'chest:a5u3', desc: 'Do czytania drobnego druku na tabliczkach znamionowych.' },
    { id: 'hardhat', name: 'Kask z uprawnieniami', from: 'xp:900', desc: 'Za zebranie 900 iskier. Szacunek na budowie gwarantowany.' }
  ];

  window.ISK_STAGES.push({
    id: 'e5', n: 5, name: 'Iskrosława', gen: 'Iskrosławy', form: 4, look: 'pencil', level: 'dla dorosłych', title: 'Prąd w dorosłym życiu',
    topics: 'instalacja w mieszkaniu (L, N, PE), bezpiecznik i różnicówka, budżet mocy i rachunki, światło schodowe, akumulatory Li-Ion i ładowarki, fotowoltaika i falownik',
    grow: 'Poznaj <b>Iskrosławę</b>. Dla przyjaciół – Sława. Przyjaciół ma niewielu. Okulary, kawa i mina „widziałam już wszystko”. Teraz prąd w dorosłym życiu: mieszkanie, akumulatory, słońce na dachu. Bez fajerwerków. Fajerwerki to zwarcie.',
    units: units, stickers: stickers, accs: accs
  });
})();
