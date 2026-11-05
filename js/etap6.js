/* ISKIERKA — ETAP 6 · Iskrosława · dla dorosłych+
   Elektronika, która myśli: mikrokontroler, program w pętli, PWM, logika automatyki domowej,
   przekaźniki i tranzystory mocy, lutowanie i szukanie usterek. Funkcje do zadań są w js/kit.js. */
(function () {
  'use strict';
  var K = window.ISK_KIT;
  var learn = K.learn, choice = K.choice, tf = K.tf, pairs = K.pairs, sort = K.sort, calc = K.calc, order = K.order;
  var logic = K.logic, binary = K.binary, build = K.build, V = K.V, G = K.G, F = K.F;

  var units = [
    /* ================= ROZDZIAŁ 1 ================= */
    {
      id: 'e6u1', color: 'violet', title: 'Mikrokontroler', sub: 'Elektronika, która myśli',
      guide: [
        '<b>Mikrokontroler</b> to mały komputer w jednym układzie: procesor, pamięć i piny wejść/wyjść. Siedzi w pralce, pilocie i w każdej płytce Arduino.',
        'Pin wyjściowy ustawiamy na <b>HIGH</b> (np. 5 V albo 3,3 V) lub <b>LOW</b> (0 V). Pin wejściowy czyta przycisk albo czujnik.',
        'Pin daje mały prąd – zwykle do ok. 20 mA. Dioda zawsze przez opornik, silnik i przekaźnik – przez tranzystor.',
        'Program działa w pętli: wczytaj wejścia → zdecyduj → ustaw wyjścia → powtórz. Tysiące razy na sekundę.',
        '<b>PWM</b>: bardzo szybkie włączanie i wyłączanie. Wypełnienie 25% daje średnio ćwierć napięcia – dioda świeci słabiej, silnik kręci wolniej.',
        'Przetwornik analogowo-cyfrowy (ADC) zamienia napięcie na liczbę, np. 10 bitów: 0–1023 dla 0–5 V.'
      ],
      lessons: [
        {
          id: 'e6u1l1', title: 'Mikrokontroler Mirek', icon: 'chip', sticker: 'mcu', desc: 'Mały komputer, który nie bierze urlopu.',
          ex: [
            learn('mascot', 'Nowy etap. Nowa kawa.', 'Etap 6: mikrokontrolery i automatyka. Elektronika, która myśli – czyli robi dokładnie to, co jej każesz. W przeciwieństwie do niektórych.', { mood: 'cheer' }),
            learn('mcu', 'Mikrokontroler Mirek', 'Mirek to mały komputer w jednym układzie: procesor, pamięć i piny. Siedzi w pralce, pilocie, ekspresie do kawy i w każdej płytce Arduino. Pracuje całą dobę, nie bierze urlopu i nie narzeka. Jedyny taki w biurze.', { friend: true }),
            choice('Co jest w środku mikrokontrolera?', ['Procesor, pamięć i piny wejść/wyjść', 'Tylko bateria', 'Mały wiatraczek', F('Malutki człowieczek z kalkulatorem', 'Urocza wizja. Ale to procesor, pamięć i piny.')], 0, 'Cały komputer w jednej kostce.'),
            pairs('Połącz pojęcia', [['HIGH', 'na pinie jest napięcie'], ['LOW', 'na pinie jest 0 V'], ['wejście', 'czyta przycisk lub czujnik'], ['wyjście', 'zapala diodę lub steruje tranzystorem']]),
            tf('Pin mikrokontrolera może bezpośrednio zasilić silnik hulajnogi.', false, 'Pin daje kilkanaście miliamperów. Silnik steruje się przez tranzystor albo specjalny sterownik.'),
            calc('Pin daje 5 V, dioda potrzebuje 2 V i 15 mA. Jaki opornik? (R = (5 − 2) : 0,015)', 200, 'Ω', '3 V : 0,015 A = 200 Ω. W praktyce bierzemy najbliższy większy: 220 Ω.'),
            choice('Ile prądu bezpiecznie da typowy pin?', ['Około 20 mA', '10 A', '1 µA', F('Ile zechce', 'Pin ma swoje granice. Jak każdy z nas. Zwykle ok. 20 mA.')], 0, 'Dokładną wartość podaje karta katalogowa układu.')
          ]
        },
        {
          id: 'e6u1l2', title: 'Program w pętli', icon: 'loop', desc: 'Wczytaj, zdecyduj, ustaw, powtórz.',
          ex: [
            learn('mcu', 'Pętla bez końca', 'Program mikrokontrolera kręci się w pętli: <b>wczytaj</b> wejścia → <b>zdecyduj</b> → <b>ustaw</b> wyjścia → powtórz. Tysiące razy na sekundę. Jak poranek: budzik, decyzja, kawa. Tylko bez drzemki.'),
            order('Ułóż program migającej diody', ['Ustaw pin 13 jako wyjście', 'Włącz diodę (HIGH)', 'Czekaj 1 sekundę', 'Wyłącz diodę (LOW)', 'Czekaj 1 sekundę i wróć do włączania'], 'To pierwszy program prawie każdej osoby, która zaczyna z Arduino.'),
            choice('Dioda świeci 0,5 s i gaśnie na 0,5 s. Ile razy mignie w ciągu minuty?', ['60', '30', '120', '1'], 0, 'Jeden cykl trwa 1 s, a w minucie jest 60 sekund.'),
            order('Ułóż logikę automatycznej lampki', ['Odczytaj czujnik światła', 'Sprawdź, czy jest ciemno', 'Jeśli tak – włącz lampę', 'Jeśli nie – wyłącz lampę', 'Wróć na początek pętli'], 'Wczytaj, zdecyduj, ustaw, powtórz.'),
            tf('Bez pętli program wykonałby się raz i przestałby reagować na przycisk.', true, 'Dlatego program mikrokontrolera kręci się w kółko.'),
            choice('Dioda w ogóle nie miga. Pierwszy krok?', ['Sprawdzić, czy pin jest wyjściem i czy dioda nie jest odwrotnie', 'Kupić nową płytkę', F('Wyłączyć i włączyć ponownie', 'Klasyka działu IT. Czasem pomaga, ale najpierw sprawdź pin i biegunowość diody.'), 'Dolać kawy'], 0, 'Najczęstsze błędy: zły pin, odwrotna dioda, brak opornika lub wspólnej masy.')
          ]
        },
        {
          id: 'e6u1l3', title: 'PWM, czyli ściemniacz', icon: 'wave', desc: 'Szybkie mruganie zamiast pokrętła.',
          ex: [
            learn('pwm', 'Szybkie mruganie', 'PWM to bardzo szybkie włączanie i wyłączanie – setki razy na sekundę. Oko widzi średnią. <b>Wypełnienie</b> 25% to włączenie przez ćwierć czasu: dioda świeci słabiej, a silnik kręci się wolniej.'),
            calc('Pin 5 V, wypełnienie 40%. Jakie jest średnie napięcie?', 2, 'V', '5 V · 0,4 = 2 V.'),
            calc('Chcesz średnio 3,3 V z pinu 5 V. Jakie wypełnienie? (w procentach)', 66, '%', '3,3 : 5 = 0,66, czyli 66%.', { tol: 0.02 }),
            choice('Po co PWM wentylatorowi w komputerze?', ['Żeby płynnie regulować obroty', 'Żeby grał melodię', F('Żeby do Ciebie mrugał', 'Mruga za szybko, żeby to zauważyć. PWM reguluje obroty.'), 'Żeby zmienić kierunek obrotów'], 0, 'Większe wypełnienie – szybsze obroty i głośniejszy szum.'),
            tf('Przy wypełnieniu 100% pin jest włączony cały czas.', true, 'A przy 0% – wyłączony cały czas.'),
            calc('Przetwornik 10-bitowy: 0–1023 to 0–5 V. Odczyt wynosi 512. Ile to woltów? (zaokrąglij do 0,1)', 2.5, 'V', '512 : 1023 · 5 ≈ 2,5 V.', { tol: 0.03 })
          ]
        },
        {
          id: 'e6u1w', title: 'Inteligentny dom', icon: 'home', ws: true, desc: 'Warsztat: logika, która steruje domem.',
          ex: [
            logic('Lampa w korytarzu. C = ciemno, R = ruch. Lampa świeci, gdy jest ciemno i ktoś idzie. Zapal ją.', G('AND', V('C'), V('R')), { out: 1 }, 'C AND R: oba warunki muszą być spełnione.', { hint: 'ciemno i ruch' }),
            logic('Alarm. O = okno otwarte, D = drzwi otwarte. Alarm wyje, gdy otwarte jest okno lub drzwi. Ktoś zostawił otwarte okno – ucisz alarm.', G('OR', V('O'), V('D')), { out: 0 }, 'OR daje 0 tylko wtedy, gdy oba wejścia mają 0. Zamknij okno.', { start: { O: 1 }, hint: 'zamknij wszystko' }),
            logic('Podlewanie ogrodu. S = sucho, N = noc. Podlewamy, gdy jest sucho, ale nie w nocy: Y = S AND (NOT N). Uruchom podlewanie.', G('AND', V('S'), G('NOT', V('N'))), { out: 1 }, 'S = 1 i N = 0. Sąsiedzi będą wdzięczni, że nie o trzeciej w nocy.', { hint: 'sucho, ale dzień' }),
            binary('Czujnik temperatury wysłał liczbę 22 (stopnie). Pokaż ją na 8 bitach.', 8, 22, '22 = 16 + 4 + 2, czyli 00010110.'),
            choice('Ekspres do kawy ma się włączać o 6:30, ale tylko w dni robocze. Jaki warunek?', ['godzina 6:30 AND dzień roboczy', 'godzina 6:30 OR dzień roboczy', 'NOT dzień roboczy', F('kawa = zawsze', 'Kusi. Ale wtedy ekspres parzyłby też o trzeciej w nocy.')], 0, 'AND – oba warunki naraz. OR uruchomiłby ekspres w każdej minucie dnia roboczego.'),
            tf('Termostat z histerezą włącza grzanie przy 20°C, a wyłącza przy 21°C, żeby piec nie przełączał się co chwilę.', true, 'Histereza to celowy „zapas” między włączeniem a wyłączeniem.')
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 2 ================= */
    {
      id: 'e6u2', color: 'berry', title: 'Przekaźniki i moc', sub: 'Mały pin, duży prąd',
      guide: [
        'Mikrokontroler steruje dużym prądem pośrednio: pin → tranzystor → przekaźnik, silnik albo taśma LED.',
        '<b>Przekaźnik</b> to przełącznik z elektromagnesem. Styki: COM (wspólny), NO (normalnie otwarty), NC (normalnie zamknięty).',
        'Cewka przy wyłączaniu daje skok napięcia. <b>Dioda gasząca</b> równolegle do cewki chroni tranzystor.',
        'W przekaźniku obwód cewki i obwód styków są oddzielone elektrycznie (izolacja galwaniczna).',
        'Tranzystor jako klucz: prąd bazy ≥ prąd obciążenia : β, w praktyce z zapasem 2–3 razy.',
        'Silnik w dwóch kierunkach – <b>mostek H</b>. Masa (GND) sterownika i zasilacza musi być wspólna.'
      ],
      lessons: [
        {
          id: 'e6u2l1', title: 'Przekaźnik Przemek', icon: 'toggle', sticker: 'relay', desc: 'Klika, gdy podejmie decyzję.',
          ex: [
            learn('relay', 'Przekaźnik Przemek', 'Przemek to przełącznik z elektromagnesem. Mały prąd w cewce przyciąga blaszkę i – klik! – zamyka duży obwód, nawet 230 V. Decyzje podejmuje szybko i głośno. Jak szef na zebraniu.', { friend: true }),
            pairs('Styki przekaźnika', [['COM', 'styk wspólny'], ['NO', 'zamyka się po kliknięciu'], ['NC', 'otwiera się po kliknięciu'], ['cewka', 'elektromagnes, który przełącza']]),
            choice('Lampa ma świecić tylko wtedy, gdy przekaźnik jest włączony. Które styki?', ['COM i NO', 'COM i NC', 'NO i NC', F('Wszystkie naraz, dla pewności', 'Pewne będzie tylko zwarcie. Wybierz COM i NO.')], 0, 'NO jest otwarty, dopóki cewka nie zadziała.'),
            tf('W przekaźniku obwód cewki i obwód styków są elektrycznie oddzielone.', true, 'Dlatego płytka 5 V może przełączać 230 V – o ile całość jest porządnie zmontowana i zamknięta w obudowie.'),
            choice('Po co dioda równolegle do cewki przekaźnika?', ['Tłumi skok napięcia przy wyłączaniu i chroni tranzystor', 'Świeci, gdy przekaźnik działa', F('Dla ozdoby', 'Ozdobą nie jest. Bez niej tranzystor może nie przeżyć wyłączenia cewki.'), 'Podnosi napięcie'], 0, 'Cewka „nie lubi” nagłego przerwania prądu i odpowiada skokiem napięcia.'),
            calc('Cewka 5 V ma opór 70 Ω. Ile prądu pobiera? (w mA, zaokrąglij)', 71, 'mA', '5 : 70 ≈ 0,071 A = 71 mA. Za dużo dla pinu – potrzebny tranzystor.', { tol: 0.03 })
          ]
        },
        {
          id: 'e6u2l2', title: 'Tranzystor robi ciężką robotę', icon: 'transistor', desc: 'Pin mówi „teraz”, tranzystor dźwiga.',
          ex: [
            learn('npn', 'Pośrednik', 'Pin mikrokontrolera daje kilka miliamperów. Przez opornik steruje bazą tranzystora, a tranzystor przełącza prąd cewki, silnika albo taśmy LED. Pin mówi „teraz”, tranzystor robi ciężką robotę. Podział obowiązków jak w dobrym zespole.'),
            calc('Taśma LED pobiera 600 mA, tranzystor ma β = 100. Jaki prąd bazy wystarczy? (mA)', 6, 'mA', '600 : 100 = 6 mA. W praktyce daje się zapas 2–3 razy.'),
            choice('Silnik ma kręcić się w obie strony na rozkaz mikrokontrolera. Co zastosować?', ['Mostek H', 'Jeden opornik', 'Diodę LED', F('Dwie osoby na zmianę', 'Tańsze niż mostek H? Raczej nie. Mostek H zamienia kierunek prądu.')], 0, 'Cztery klucze w kształcie litery H pozwalają odwrócić prąd w silniku.'),
            sort('Co prosto do pinu, a co przez tranzystor?', [{ t: 'Prosto do pinu', icon: 'bolt' }, { t: 'Przez tranzystor', icon: 'shieldBolt' }], [
              { t: 'Dioda LED z opornikiem', b: 0 }, { t: 'Przycisk', b: 0 }, { t: 'Silnik wentylatora', b: 1 },
              { t: 'Przekaźnik', b: 1 }, { t: 'Metr taśmy LED', b: 1 }, { t: 'Czujnik temperatury', b: 0 }
            ], 'Wszystko, co pobiera więcej niż kilkanaście mA, idzie przez tranzystor albo sterownik.'),
            tf('Masa (GND) mikrokontrolera i masa zasilacza silnika powinny być połączone.', true, 'Bez wspólnej masy napięcie z pinu nie ma punktu odniesienia i tranzystor nie wie, co robić.')
          ]
        },
        {
          id: 'e6u2w', title: 'Ekspres o świcie', icon: 'robot', ws: true, desc: 'Warsztat: pompa ekspresu na tranzystorze.',
          ex: [
            build('Przycisk START udaje pin mikrokontrolera. Pompa ekspresu ma ruszyć tylko po jego wciśnięciu, a ciężką robotę ma zrobić tranzystor. Dokończ obwód.', {
              scene: 'coffee', parts: [
                { id: 'B', t: 'bat', v: 9, at: [62, 270], name: 'Zasilacz' },
                { id: 'S', t: 'sw', at: [70, 150], name: 'START' },
                { id: 'R1', t: 'res', r: 1000, at: [120, 70] },
                { id: 'T', t: 'npn', at: [150, 216], name: 'Tranzystor' },
                { id: 'M', t: 'motor', at: [250, 130], name: 'Pompa', words: ['pompuje', 'stoi'] }
              ],
              wires: [['B:+', 'M:a'], ['T:E', 'B:-']],
              goal: { cases: [
                { name: 'START wciśnięty', want: 'pompa pracuje', set: { S: { on: true } }, lit: { M: true } },
                { name: 'START puszczony', want: 'pompa stoi', set: { S: { on: false } }, lit: { M: false } }
              ] },
              route: 'Sterowanie: <b>plus → START → opornik → baza (B)</b>. Moc: <b>druga nóżka pompy → kolektor (C)</b>. Emiter już jest na minusie.',
              sol: [['B:+', 'S:a'], ['S:b', 'R1:a'], ['R1:b', 'T:B'], ['M:b', 'T:C']]
            }, 'Mały prąd przez opornik do bazy otwiera tranzystor, a ten przepuszcza duży prąd pompy. Dokładnie tak mikrokontroler steruje silnikami.'),
            calc('Pompa pobiera 0,6 A przy 9 V. Jaka to moc?', 5.4, 'W', 'P = 9 · 0,6 = 5,4 W.'),
            choice('Pompa to silnik, czyli cewka. Co dodać równolegle do niej?', ['Diodę gaszącą', 'Drugą pompę', 'Kondensator 1 F', F('Filiżankę', 'Filiżanka stoi niżej. Równolegle do silnika – dioda gasząca.')], 0, 'Dioda chroni tranzystor przed skokiem napięcia przy wyłączaniu.'),
            tf('Opornik w bazie ogranicza prąd płynący z pinu do tranzystora.', true, 'Złącze baza–emiter to dioda. Bez opornika popłynąłby przez nie za duży prąd.')
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 3 ================= */
    {
      id: 'e6u3', color: 'copper', title: 'Warsztat dorosłego elektronika', sub: 'Lutowanie i szukanie usterek',
      guide: [
        'Lutownica: grot ok. <b>330–370°C</b>. Najpierw grzejesz punkt lutowniczy, potem podajesz cynę. Dobry lut jest gładki i błyszczący.',
        'Zimny lut jest matowy i chropowaty – połączenie może działać „czasem”. To najgorszy rodzaj usterki.',
        'Lutuj w przewiewnym miejscu, w okularach. Cyna i topnik dymią. Lutownica zawsze w podstawce.',
        'Szukanie usterek zaczynamy od najprostszego: zasilanie, bezpiecznik, kabel, styk. Potem miernik.',
        'Test ciągłości (piszczy multimetr) sprawdzamy tylko w obwodzie <b>bez zasilania</b>.'
      ],
      lessons: [
        {
          id: 'e6u3l1', title: 'Lutownica Lucyna', icon: 'iron', sticker: 'solder', desc: 'Gorąca. Komplementy przyjmuje, dotyku nie.',
          ex: [
            learn('solder', 'Lutownica Lucyna', 'Lucyna łączy metale roztopioną cyną. Grot ma ok. <b>330°C</b>. Komplementy przyjmuje, dotyku – nie. Najpierw grzeje punkt, potem dostaje cynę. Pośpiech kończy się zimnym lutem.', { friend: true }),
            order('Ułóż kolejność lutowania', ['Przytknij grot do pola i nóżki', 'Podaj cynę do miejsca styku', 'Odsuń cynę', 'Odsuń grot', 'Nie ruszaj, aż lut zastygnie'], 'Grzej, podaj, odsuń cynę, odsuń grot, czekaj.'),
            choice('Jak wygląda dobry lut?', ['Gładki, błyszczący, w kształcie stożka', 'Matowy i chropowaty', 'Duża kula cyny', F('Jak dzieło sztuki współczesnej', 'Sztuka współczesna bywa chropowata. Dobry lut – gładki i błyszczący.')], 0, 'Matowy, popękany lut to zimny lut.'),
            tf('Zimny lut może powodować usterkę, która pojawia się i znika.', true, 'Najbardziej irytujące usterki świata – działa, dopóki nie przyjdzie serwisant.'),
            choice('Gdzie odkładasz gorącą lutownicę?', ['Do podstawki', 'Na stół, przecież zaraz wrócę', F('Do kieszeni', 'Nie. Po prostu nie.'), 'Na kabel zasilający'], 0, 'Podstawka chroni stół, kable i dłonie.'),
            sort('Bezpieczne czy nie?', [{ t: 'Bezpieczne', icon: 'check' }, { t: 'Ryzykowne', icon: 'x' }], [
              { t: 'Otwarte okno przy lutowaniu', b: 0 }, { t: 'Okulary ochronne', b: 0 }, { t: 'Lutowanie urządzenia podłączonego do 230 V', b: 1 },
              { t: 'Mycie rąk po pracy z cyną', b: 0 }, { t: 'Łapanie spadającej lutownicy', b: 1 }, { t: 'Jedzenie przy lutowaniu', b: 1 }
            ], 'Spadającej lutownicy się nie łapie. Nigdy. Odsuń się i pozwól jej spaść.')
          ]
        },
        {
          id: 'e6u3l2', title: 'Detektyw usterek', icon: 'meter', desc: 'Od najprostszego do najtrudniejszego.',
          ex: [
            learn('meter', 'Detektyw usterek', 'Gdy coś nie działa, zaczynamy od najprostszego: czy jest zasilanie? Bezpiecznik? Kabel? Dopiero potem rozkręcamy i mierzymy. Dziewięć na dziesięć „zepsutych” urządzeń jest po prostu niepodłączonych.'),
            order('Lampka nie świeci. Ułóż kroki diagnozy', ['Sprawdź, czy jest włączona do gniazdka', 'Sprawdź żarówkę w innej lampie', 'Sprawdź bezpiecznik w rozdzielnicy', 'Odłącz od prądu i sprawdź ciągłość kabla', 'Dopiero potem rozkręcaj wyłącznik'], 'Od najprostszego i najtańszego do najtrudniejszego.'),
            choice('Multimetr piszczy przy teście ciągłości. Co to znaczy?', ['Między sondami jest połączenie o bardzo małym oporze', 'Bateria w mierniku się kończy', F('Multimetr się cieszy', 'Też, ale głównie mówi: tu jest połączenie.'), 'Jest wysokie napięcie'], 0, 'Ciągłość sprawdzamy tylko w obwodzie bez zasilania.'),
            tf('Test ciągłości można robić w obwodzie pod napięciem.', false, 'Odłącz zasilanie. Inaczej wynik będzie bez sensu, a miernik może się uszkodzić.'),
            choice('Ładowarka do laptopa: na wtyczce 0 V, ale dioda na zasilaczu świeci. Gdzie szukasz usterki?', ['W kablu między zasilaczem a wtyczką', 'W gniazdku w ścianie', 'W laptopie', F('W horoskopie', 'Gwiazdy milczą, ale zasilacz działa – więc kabel do wtyczki.')], 0, 'Zasilacz dostaje prąd (świeci), a na końcu nic nie ma – przerwa jest po drodze, najczęściej przy zgięciu.'),
            calc('Na wyjściu zasilacza 12 V jest 11,6 V przy obciążeniu. Ile to procent znamionowego napięcia? (zaokrąglij)', 97, '%', '11,6 : 12 ≈ 0,967, czyli ok. 97%. To w normie.', { tol: 0.02 })
          ]
        }
      ]
    }
  ];

  var stickers = [
    { id: 'mcu', name: 'Mikrokontroler Mirek', art: 'mcu', lesson: 'e6u1l1', does: 'Czyta wejścia, podejmuje decyzje i ustawia wyjścia – tysiące razy na sekundę.', fact: 'W nowoczesnym samochodzie pracuje kilkadziesiąt mikrokontrolerów, a czasem ponad sto.' },
    { id: 'relay', name: 'Przekaźnik Przemek', art: 'relay', lesson: 'e6u2l1', does: 'Małym prądem cewki przełącza duży obwód, nawet 230 V.', fact: 'Pierwsze komputery, np. Harvard Mark I, liczyły na przekaźnikach – i słychać było, jak myślą.' },
    { id: 'solder', name: 'Lutownica Lucyna', art: 'solder', lesson: 'e6u3l1', does: 'Łączy metale roztopioną cyną. Grot ma ok. 330°C.', fact: 'W Unii Europejskiej elektronika użytkowa używa cyny bezołowiowej od 2006 roku.' }
  ];

  var accs = [
    { id: 'tie', name: 'Krawat', from: 'chest:e6u1', desc: 'Na zebrania, na których i tak decyduje przekaźnik.' },
    { id: 'scarf', name: 'Apaszka', from: 'chest:e6u2', desc: 'Elegancja i izolacja w jednym.' },
    { id: 'medal', name: 'Medal za całokształt', from: 'chest:e6u3', desc: 'Za przejście całej ścieżki, od żaróweczki do mikrokontrolera.' }
  ];

  window.ISK_STAGES.push({
    id: 'e6', n: 6, name: 'Iskrosława', gen: 'Iskrosławy', form: 4, level: 'dla dorosłych+', title: 'Automatyka i mikrokontrolery',
    topics: 'mikrokontroler i piny, program w pętli, PWM i ADC, logika automatyki domowej, przekaźnik, tranzystor jako klucz, mostek H, lutowanie, szukanie usterek',
    grow: 'Etap 6: elektronika, która myśli. Mikrokontrolery, przekaźniki, PWM i lutowanie. Kawa już jest. Zaczynamy.',
    units: units, stickers: stickers, accs: accs
  });
})();
