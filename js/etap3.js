/* ISKIERKA — ETAP 3 · Błyskawica · 14+
   Elektronika na serio: kondensator, diody i prostowanie, tranzystor, logika cyfrowa.
   Funkcje do tworzenia zadań są w js/kit.js. */
(function () {
  'use strict';
  var K = window.ISK_KIT, B = K.B;
  var learn = K.learn, choice = K.choice, tf = K.tf, pairs = K.pairs, fill = K.fill, sort = K.sort, circ = K.circ;
  var calc = K.calc, order = K.order, truth = K.truth, logic = K.logic, binary = K.binary, pattern = K.pattern;
  var V = K.V, G = K.G, build = K.build, F = K.F;

  function twilightDark() { var c = B.twilight('ldr'); c.parts.forEach(function (p) { if (p.t === 'ldr') p.dark = true; }); return c; }

  var units = [
    /* ================= ROZDZIAŁ 1 ================= */
    {
      id: 'e3u1', color: 'sky', title: 'Kondensator', sub: 'Magazyn ładunku',
      guide: [
        '<b>Kondensator</b> gromadzi ładunek elektryczny – to mały, szybki zbiornik energii.',
        'Pojemność C mierzymy w <b>faradach</b> (F). W praktyce: µF (mikro – milionowa część), nF, pF.',
        'Kondensator elektrolityczny ma biegunowość: dłuższa nóżka to plus, pasek na obudowie oznacza minus.',
        'Przez opornik kondensator ładuje się stopniowo. Stała czasowa <b>τ = R · C</b>. Po około 5τ jest prawie pełny.',
        'Energia w kondensatorze: E = ½ · C · U².',
        'Duże kondensatory mogą być naładowane nawet po wyłączeniu urządzenia – nie dotykaj wnętrza zasilaczy!'
      ],
      lessons: [
        {
          id: 'e3u1l1', title: 'Kondensator Kaja', icon: 'cap', sticker: 'capChar', desc: 'Mały zbiornik ładunku.',
          ex: [
            learn('mascot', 'Błyskawica melduje się!', 'Znowu urosłam! Przed nami prawdziwa elektronika: kondensatory, tranzystory i logika, z której zbudowane są komputery. Będzie trudniej – i ciekawiej.', { mood: 'cheer' }),
            learn('capChar', 'Kondensator Kaja', 'Kaja ma w środku dwie metalowe okładki przedzielone izolatorem. Gdy podłączysz napięcie, na okładkach gromadzi się <b>ładunek</b>. Kaja jest jak mały, szybki zbiornik energii.', { friend: true }),
            choice('W czym mierzymy pojemność kondensatora?', ['W faradach (F)', 'W omach (Ω)', 'W watach (W)', 'W hercach (Hz)'], 0, 'Jednostka uczci Michaela Faradaya. 1 F to bardzo dużo, więc zwykle spotkasz µF i nF.'),
            calc('Zamień: 0,001 F = ? µF', 1000, 'µF', 'Mikro to milionowa część: 0,001 · 1 000 000 = 1000 µF.', { hint: '1 F = 1 000 000 µF' }),
            tf('Kondensator elektrolityczny można podłączyć odwrotnie bez żadnych skutków.', false, 'Odwrotnie podłączony elektrolit może się nagrzać, a nawet pęknąć. Pasek na obudowie oznacza minus.'),
            choice('Jak rozpoznać minus kondensatora elektrolitycznego?', ['Po pasku na obudowie i krótszej nóżce', 'Po kolorze nóżek', F('Po zapachu', 'Nie wąchamy elementów! Minus pokazuje pasek na obudowie.'), 'Nie da się'], 0, 'Pasek z minusami pokazuje biegun ujemny.', { art: 'capChar' }),
            pairs('Połącz przedrostek z wartością', [['µ', 'milionowa część'], ['n', 'miliardowa część'], ['m', 'tysięczna część'], ['k', 'tysiąc']], { big: true })
          ]
        },
        {
          id: 'e3u1l2', title: 'Ładowanie i stała RC', icon: 'gauge', desc: 'Jak szybko napełnia się kondensator?',
          ex: [
            learn('rcCurve', 'Stała czasowa', 'Przez opornik kondensator ładuje się stopniowo – najpierw szybko, potem coraz wolniej. Czas <b>τ = R · C</b> to stała czasowa: po τ kondensator jest naładowany w około 63%, a po 5τ – prawie do pełna.'),
            calc('R = 10 kΩ, C = 100 µF. Ile wynosi τ (w sekundach)?', 1, 's', 'τ = 10 000 Ω · 0,0001 F = 1 s.', { hint: 'zamień na omy i farady: 10 kΩ = 10 000 Ω, 100 µF = 0,0001 F' }),
            calc('τ = 1 s. Po ilu sekundach kondensator jest prawie pełny (5τ)?', 5, 's', '5 · 1 s = 5 s.'),
            choice('Jak sprawić, żeby kondensator ładował się wolniej?', ['Zwiększyć opornik albo pojemność', 'Zmniejszyć opornik', 'Odwrócić baterię', 'Dodać drugą diodę'], 0, 'Większe R albo C to większe τ.'),
            tf('Lampa błyskowa w aparacie korzysta z kondensatora, który oddaje energię bardzo szybko.', true, 'Kondensator ładuje się kilka sekund, a oddaje energię w ułamku sekundy.'),
            choice('Do czego często używa się kondensatora w zasilaczu?', ['Do wygładzania napięcia', 'Do świecenia', 'Do mierzenia temperatury', 'Do grania muzyki'], 0, 'Kondensator wypełnia „dziury” między falami napięcia.')
          ]
        },
        {
          id: 'e3u1l3', title: 'Kondensator w akcji', icon: 'bolt', desc: 'Gdzie pracują kondensatory?',
          ex: [
            learn('capChar', 'Kondensatory są wszędzie', 'Wygładzają napięcie w zasilaczach, odmierzają czas w migaczach, oddają energię w lampach błyskowych, a w ekranach dotykowych wyczuwają Twój palec!'),
            choice('Jak ekran dotykowy wyczuwa palec?', ['Palec zmienia pojemność między elektrodami', 'Ekran słyszy dotyk', 'Palec przewodzi światło', F('Ekran waży palec', 'Palec waży kilka gramów – za mało, żeby ekran go zważył!')], 0, 'Twoje ciało przewodzi, więc zmienia pojemność malutkich kondensatorów w ekranie.'),
            tf('Duży kondensator w odłączonym zasilaczu może być nadal naładowany.', true, 'Dlatego nie rozkręcamy zasilaczy i telewizorów.'),
            calc('Kondensator 0,01 F naładowano do 10 V. Ile energii zgromadził? (E = ½ · C · U²)', 0.5, 'J', 'E = 0,5 · 0,01 · 10² = 0,5 J.', { hint: 'najpierw U² = 100' }),
            sort('Magazynuje energię czy ją zamienia?', [{ t: 'Magazynuje', icon: 'battery' }, { t: 'Zamienia', icon: 'bolt' }], [
              { t: 'Kondensator', b: 0 }, { t: 'Żarówka', b: 1 }, { t: 'Akumulator', b: 0 },
              { t: 'Silnik', b: 1 }, { t: 'Bateria', b: 0 }, { t: 'Grzałka', b: 1 }
            ], 'Kondensatory, baterie i akumulatory przechowują energię. Żarówki, silniki i grzałki ją zamieniają.'),
            fill(['Stała czasowa to τ = ', 0, ' · ', 1, '.'], ['R', 'C', 'U', 'P'], ['R', 'C'], 'Opór razy pojemność.', { any: true })
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 2 ================= */
    {
      id: 'e3u2', color: 'copper', title: 'Diody i prąd zmienny', sub: 'Prostowanie i zasilacze',
      guide: [
        'Dioda przewodzi w jedną stronę. Krzemowa „zabiera” około <b>0,7 V</b>, a LED od ok. 1,8 V (czerwona) do ok. 3 V (niebieska, biała).',
        'Pasek na diodzie oznacza <b>katodę</b> (minus).',
        'Prąd zmienny zmienia kierunek. Jedna dioda przepuszcza tylko połówki fali – to prostowanie jednopołówkowe.',
        '<b>Mostek Graetza</b> z czterech diod prostuje obie połówki fali.',
        'Kondensator za mostkiem wygładza napięcie, a stabilizator utrzymuje je równe. Tak działa zasilacz.',
        'Ciepło w stabilizatorze: P = (U wejścia − U wyjścia) · I.'
      ],
      lessons: [
        {
          id: 'e3u2l1', title: 'Dioda Darek', icon: 'led', sticker: 'diode', desc: 'Furtka dla prądu.',
          ex: [
            learn('diode', 'Dioda Darek', 'Darek to <b>dioda prostownicza</b>. Przepuszcza prąd tylko w jedną stronę i „zabiera” sobie około <b>0,7 V</b>. Srebrny pasek oznacza katodę, czyli minus.', { friend: true }),
            choice('Co oznacza pasek na diodzie?', ['Katodę (minus)', 'Anodę (plus)', 'Moc diody', 'Kolor światła'], 0, 'Pasek na obudowie zgadza się z kreską na symbolu diody.'),
            calc('Bateria 5 V, dioda krzemowa w kierunku przewodzenia. Ile napięcia zostaje dla reszty obwodu?', 4.3, 'V', '5 V − 0,7 V = 4,3 V.'),
            calc('Czerwona LED: 2 V i 15 mA, bateria 5 V. Jaki opornik dobrać?', 200, 'Ω', 'Na oporniku zostaje 3 V. R = 3 V : 0,015 A = 200 Ω.', { hint: 'R = (U baterii − U diody) : I' }),
            choice('Która dioda LED potrzebuje najwyższego napięcia?', ['Niebieska', 'Czerwona', 'Podczerwona', 'Wszystkie tyle samo'], 0, 'Im krótsza fala światła, tym wyższe napięcie: niebieska ok. 3 V, czerwona ok. 2 V.'),
            tf('Dioda w kierunku zaporowym przepuszcza prąd tak samo jak w kierunku przewodzenia.', false, 'W kierunku zaporowym dioda jest zamkniętą furtką.')
          ]
        },
        {
          id: 'e3u2l2', title: 'Prostownik', icon: 'wave', sticker: 'bridge', desc: 'Jak wyprostować falę?',
          ex: [
            learn('acWave', 'Prąd zmienny', 'Napięcie w gniazdku zmienia się jak fala: w górę, w dół, 50 razy na sekundę. Elektronika potrzebuje jednak prądu <b>stałego</b>. Trzeba go „wyprostować”.'),
            learn('halfWave', 'Jedna dioda', 'Jedna dioda przepuszcza tylko górne połówki fali – to <b>prostowanie jednopołówkowe</b>. Dolne połówki znikają.'),
            learn('bridge', 'Mostek Marek', 'Marek to cztery diody połączone w kwadrat. Kieruje obie połówki fali w tę samą stronę – to <b>prostowanie dwupołówkowe</b>.', { friend: true }),
            choice('Ile diod ma mostek Graetza?', ['4', '1', '2', '8'], 0, 'Cztery: dwie pracują przy górnej połówce fali, dwie przy dolnej.'),
            choice('Który wykres pokazuje napięcie za mostkiem (jeszcze bez kondensatora)?', [{ art: 'fullWave' }, { art: 'acWave' }, { art: 'halfWave' }, { art: 'dcSmooth' }], 0, 'Za mostkiem obie połówki fali są „na górze”.'),
            tf('Kondensator za prostownikiem wygładza napięcie.', true, 'Ładuje się na szczytach fali i oddaje energię w dołkach.')
          ]
        },
        {
          id: 'e3u2l3', title: 'Zasilacz od środka', icon: 'plug', desc: 'Od 230 V do równych 5 V.',
          ex: [
            learn('dcSmooth', 'Zasilacz krok po kroku', 'Prosty zasilacz robi cztery rzeczy po kolei: obniża napięcie, prostuje prąd, wygładza go kondensatorem i stabilizuje do równej wartości, np. 5 V.'),
            order('Ułóż kroki zasilacza w dobrej kolejności.', ['Obniżenie napięcia (transformator)', 'Prostowanie (mostek)', 'Wygładzanie (kondensator)', 'Stabilizacja (stabilizator)'], 'Transformator → mostek → kondensator → stabilizator.'),
            choice('Do czego służy stabilizator napięcia?', ['Utrzymuje stałe napięcie mimo zmian', 'Zwiększa napięcie do 230 V', 'Wyłącza prąd w nocy', 'Zamienia prąd w światło'], 0, 'Nawet gdy napięcie wejściowe się waha, na wyjściu zostaje równe 5 V.'),
            calc('Stabilizator daje 5 V. Na wejściu jest 9 V i płynie 0,2 A. Ile watów zamienia się w nim w ciepło?', 0.8, 'W', 'P = (9 V − 5 V) · 0,2 A = 0,8 W.', { hint: 'P = (U wejścia − U wyjścia) · I' }),
            tf('Nowoczesne ładowarki są małe, bo pracują z bardzo wysoką częstotliwością.', true, 'To zasilacze impulsowe: przy wysokiej częstotliwości wystarczy malutki transformator.'),
            choice('Dlaczego nie rozkręcamy zasilaczy podłączonych do gniazdka?', ['W środku jest groźne 230 V i naładowane kondensatory', 'Bo są nudne', F('Bo zepsują się od patrzenia', 'Od patrzenia nic się nie psuje. Ale 230 V w środku jest naprawdę groźne!'), 'Bo są za lekkie'], 0, 'Bezpieczeństwo przede wszystkim – to zasada każdego elektronika.')
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 3 ================= */
    {
      id: 'e3u3', color: 'violet', title: 'Tranzystor', sub: 'Mały prąd steruje dużym',
      guide: [
        '<b>Tranzystor</b> to elektroniczny zawór: mały prąd bazy steruje dużym prądem kolektora.',
        'Tranzystor NPN ma trzy nóżki: <b>bazę (B)</b>, <b>kolektor (C)</b> i <b>emiter (E)</b>.',
        'Jako przełącznik: prąd w bazie – tranzystor przewodzi; brak prądu – nie przewodzi.',
        'Tranzystor zaczyna przewodzić, gdy na bazie jest ok. <b>0,7 V</b> więcej niż na emiterze.',
        'Wzmocnienie <b>β</b> (beta): I kolektora = β · I bazy.',
        'Bazę zawsze zasilamy przez opornik.'
      ],
      lessons: [
        {
          id: 'e3u3l1', title: 'Tranzystor Tadek', icon: 'transistor', sticker: 'npn', desc: 'Elektroniczny zawór.',
          ex: [
            learn('npn', 'Tranzystor Tadek', 'Tadek to <b>tranzystor</b> – elektroniczny zawór. Ma trzy nóżki: <b>bazę</b>, <b>kolektor</b> i <b>emiter</b>. Mały prąd wpływający do bazy otwiera drogę dużemu prądowi od kolektora do emitera.', { friend: true }),
            pairs('Połącz nóżkę z jej zadaniem', [['B', 'baza – steruje'], ['C', 'kolektor – tu wpływa prąd'], ['E', 'emiter – tędy wypływa']], { big: true }),
            choice('Co steruje przepływem prądu przez tranzystor?', ['Mały prąd bazy', 'Kolor obudowy', 'Temperatura w pokoju', 'Długość nóżek'], 0, 'Baza działa jak klamka do dużych drzwi.'),
            calc('β = 100, prąd bazy 0,2 mA. Jaki może płynąć prąd kolektora?', 20, 'mA', 'I_C = 100 · 0,2 mA = 20 mA.', { hint: 'I kolektora = β · I bazy' }),
            tf('Bazę tranzystora zasilamy zawsze przez opornik.', true, 'Bez opornika do bazy wpłynąłby za duży prąd i tranzystor by się spalił.'),
            choice('Ile tranzystorów może mieć współczesny procesor?', ['Miliardy', 'Dziesięć', 'Sto', 'Tysiąc'], 0, 'Są tak małe, że na paznokciu zmieściłyby się ich miliardy.')
          ]
        },
        {
          id: 'e3u3l2', title: 'Tranzystor jako przełącznik', icon: 'toggle', desc: 'Włączasz bazę – świeci dioda.',
          ex: [
            learn({ c: function () { var c = B.twilight('switch'); c.parts.forEach(function (p) { if (p.t === 'sw') p.on = true; }); return c; }, sim: true }, 'Przełącznik bez palca', 'Gdy do bazy płynie prąd, tranzystor <b>przewodzi</b> i dioda świeci. Gdy prądu w bazie nie ma – tranzystor się <b>zatyka</b> i dioda gaśnie. Tak działa każdy układ cyfrowy.'),
            circ('Zapal diodę, podając prąd do bazy tranzystora.', function () { return B.twilight('switch'); }, { lit: { D: true } }, 'Przez opornik 10 kΩ do bazy płynie ok. 0,35 mA – to wystarczy, żeby tranzystor przepuścił prąd diody.', { hint: 'włącz przełącznik przy bazie' }),
            choice('Po co tranzystor, skoro jest zwykły przełącznik?', ['Może nim sterować czujnik albo mikrokontroler', 'Jest ładniejszy', F('Świeci w ciemności', 'Sam tranzystor nie świeci – ale potrafi zapalić lampkę, gdy zrobi się ciemno!'), 'Nie potrzebuje prądu'], 0, 'Tranzystor przełącza bez ruchomych części – miliony razy na sekundę.'),
            calc('Opornik bazy: zasilanie 5 V, na złączu baza–emiter 0,7 V, chcemy prąd bazy 0,43 mA. Jaki opornik (kΩ)?', 10, 'kΩ', 'R = (5 − 0,7) V : 0,43 mA = 4,3 V : 0,00043 A = 10 000 Ω = 10 kΩ.', { hint: 'R = (U − 0,7 V) : I' }),
            tf('Tranzystor zaczyna przewodzić, gdy na bazie jest około 0,7 V więcej niż na emiterze.', true, 'To napięcie złącza krzemowego – takie samo jak w diodzie.')
          ]
        },
        {
          id: 'e3u3l3', title: 'Wzmacniacz', icon: 'sound', desc: 'Z cichego sygnału robi się głośny.',
          ex: [
            learn('npn', 'Wzmacnianie', 'Tranzystor potrafi też <b>wzmacniać</b>: słaby sygnał z mikrofonu zamienia na silny prąd dla głośnika. Wzmocnienie oznaczamy grecką literą <b>β</b> (beta).'),
            calc('Sygnał w bazie zmienia się o 0,05 mA, β = 200. O ile zmienia się prąd kolektora?', 10, 'mA', '200 · 0,05 mA = 10 mA.'),
            pairs('Kto co robi w głośniku Bluetooth?', [['Mikrofon', 'zamienia dźwięk w prąd'], ['Wzmacniacz', 'wzmacnia sygnał'], ['Głośnik', 'zamienia prąd w dźwięk'], ['Akumulator', 'daje energię']]),
            tf('Pierwszy tranzystor zbudowano w 1947 roku w laboratorium Bella w USA.', true, 'Jego twórcy dostali za to Nagrodę Nobla w 1956 roku.'),
            choice('Co się stanie, gdy podasz na bazę za duży prąd bez opornika?', ['Tranzystor może się spalić', F('Zagra muzyka', 'Byłoby zabawnie! Ale za duży prąd bazy raczej spali tranzystor.'), 'Bateria się naładuje', 'Nic'], 0, 'Złącze baza–emiter to dioda – bez opornika popłynie przez nią ogromny prąd.')
          ]
        },
        {
          id: 'e3u3w', title: 'Czujnik zmierzchu', icon: 'eye', ws: true, desc: 'Warsztat: lampka, która sama wie, kiedy świecić.',
          ex: [
            learn({ c: function () { return B.twilight('ldr'); }, sim: true }, 'Czujnik zmierzchu', 'Fotorezystor Fotek i opornik 10 kΩ tworzą <b>dzielnik napięcia</b> dla bazy. W świetle Fotek ma mały opór, więc na bazie jest za mało napięcia. W ciemności jego opór rośnie – i tranzystor się otwiera.'),
            circ('Zrób noc: zasłoń czujnik światła (dotknij go), żeby lampka się zapaliła.', function () { return B.twilight('ldr'); }, { lit: { D: true } }, 'Ciemność → duży opór fotorezystora → wyższe napięcie na bazie → tranzystor przewodzi.', { hint: 'dotknij fotorezystora' }),
            circ('Jest już rano. Odsłoń czujnik – lampka ma zgasnąć.', twilightDark, { lit: { D: false } }, 'W świetle opór fotorezystora spada, napięcie na bazie maleje i tranzystor się zatyka.', { hint: 'dotknij fotorezystora jeszcze raz' }),
            build('Strażnik nocy: oko potwora ma się otwierać samo, gdy zrobi się ciemno. Dokończ obwód z tranzystorem.', {
              scene: 'night', parts: [
                { id: 'B', t: 'bat', at: [56, 270] },
                { id: 'R1', t: 'res', r: 10000, at: [70, 150] },
                { id: 'F', t: 'ldr', at: [150, 232], name: 'Czujnik światła' },
                { id: 'T', t: 'npn', at: [232, 222], name: 'Tranzystor' },
                { id: 'R2', t: 'res', r: 220, at: [290, 150] },
                { id: 'E1', t: 'led', skin: 'eye', col: '#22C3A4', at: [226, 110], name: 'Oko strażnika' }
              ],
              wires: [['B:+', 'R1:a'], ['R1:b', 'T:B'], ['B:+', 'R2:b'], ['R2:a', 'E1:+'], ['T:E', 'B:-']],
              goal: { noBurn: true, cases: [
                { name: 'Noc (ciemno)', want: 'oko świeci', set: { F: { dark: true } }, lit: { E1: true } },
                { name: 'Dzień (jasno)', want: 'oko śpi', set: { F: { dark: false } }, lit: { E1: false } }
              ] }, hint: 'czujnik światła od bazy do minusa baterii, a minus oka do kolektora', sol: [['E1:-', 'T:C'], ['F:a', 'T:B'], ['F:b', 'B:-']]
            }, 'Ciemność zwiększa opór fotorezystora, baza dostaje napięcie i tranzystor otwiera oko. Tak działa prawdziwy czujnik zmierzchu!'),
            order('Ułóż po kolei, co dzieje się wieczorem.', ['Robi się ciemno', 'Opór fotorezystora rośnie', 'Napięcie na bazie rośnie', 'Tranzystor zaczyna przewodzić', 'Dioda się zapala'], 'Tak działają latarnie i lampki ogrodowe.'),
            choice('Co zrobić, żeby lampka zapalała się dopiero w głębszej ciemności?', ['Zwiększyć opornik 10 kΩ, np. na 47 kΩ', 'Odwrócić diodę', 'Dodać drugą diodę', 'Zasłonić diodę'], 0, 'Większy opornik słabiej „ciągnie” bazę w górę. Wtedy fotorezystor musi mieć jeszcze większy opór – czyli musi być ciemniej – żeby na bazie pojawiło się 0,7 V.')
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 4 ================= */
    {
      id: 'e3u4', color: 'mint', title: 'Logika cyfrowa', sub: 'Zera, jedynki i bramki',
      guide: [
        'W elektronice cyfrowej są tylko dwa stany: <b>0</b> (brak napięcia) i <b>1</b> (jest napięcie).',
        '<b>NOT</b> odwraca: 0 → 1, 1 → 0.',
        '<b>AND</b> (I) daje 1 tylko, gdy oba wejścia mają 1. <b>OR</b> (LUB) daje 1, gdy choć jedno wejście ma 1.',
        '<b>XOR</b> (ALBO) daje 1, gdy wejścia są różne – jak światło na schodach z dwoma przełącznikami.',
        'Tabela prawdy pokazuje wynik bramki dla wszystkich kombinacji wejść.',
        'Liczby binarne: każda pozycja to potęga dwójki (…, 8, 4, 2, 1). 1011₂ = 8 + 2 + 1 = 11. Osiem bitów to bajt.'
      ],
      lessons: [
        {
          id: 'e3u4l1', title: 'Bramka Bea', icon: 'gate', sticker: 'gate', desc: 'AND, OR i NOT.',
          ex: [
            learn('gate', 'Bramka Bea', 'Bea myśli tylko zerami i jedynkami. <b>1</b> to „jest napięcie”, <b>0</b> to „nie ma napięcia”. Z takich prostych bramek zbudowane są wszystkie komputery i telefony!', { friend: true }),
            learn('sym-and', 'Bramka AND', '<b>AND</b> (po polsku I) daje 1 tylko wtedy, gdy <b>oba</b> wejścia mają 1. Pamiętasz dwa przełączniki w szeregu z etapu 1? To właśnie AND!'),
            logic('Ustaw wejścia tak, żeby bramka AND dała na wyjściu 1.', G('AND', V('A'), V('B')), { out: 1 }, 'Oba wejścia muszą mieć 1.', { hint: 'włącz oba wejścia' }),
            learn('sym-or', 'OR i NOT', '<b>OR</b> (LUB) daje 1, gdy <b>choć jedno</b> wejście ma 1 – jak przełączniki równolegle. <b>NOT</b> (NIE) odwraca: z 0 robi 1, a z 1 robi 0. Na symbolu NOT widać kółeczko na wyjściu.'),
            truth('Uzupełnij tabelę prawdy bramki OR.', 'OR', 'OR daje 0 tylko wtedy, gdy oba wejścia mają 0.'),
            choice('Bramka NOT dostaje 1. Co daje na wyjściu?', ['0', '1', '2', F('Wysyła SMS-a', 'Hihi! Bramki nie piszą SMS-ów, choć bez nich telefon by nie działał. NOT zamienia 1 na 0.')], 0, 'NOT zawsze odwraca stan.'),
            logic('Obie jedynki są włączone. Zrób tak, żeby bramka OR dała 0.', G('OR', V('A'), V('B')), { out: 0 }, 'Żeby OR dała 0, oba wejścia muszą mieć 0.', { start: { A: 1, B: 1 }, hint: 'wyłącz oba wejścia' })
          ]
        },
        {
          id: 'e3u4l2', title: 'Tabele prawdy', icon: 'grid', desc: 'Myślenie jak procesor.',
          ex: [
            truth('Uzupełnij tabelę prawdy bramki AND.', 'AND', 'AND daje 1 tylko w ostatnim wierszu: 1 i 1.'),
            learn('sym-xor', 'Bramka XOR', '<b>XOR</b> (ALBO–ALBO) daje 1, gdy wejścia są <b>różne</b>. Tak działa światło na schodach: przełącznik na dole i na górze – każdy może je zapalić i zgasić!'),
            truth('Uzupełnij tabelę prawdy bramki XOR.', 'XOR', 'XOR daje 1 dla 0-1 i 1-0, a 0 dla takich samych wejść.'),
            logic('Światło na schodach świeci (A = 1, B = 0). Zgaś je, zmieniając tylko przełącznik B na górze.', G('XOR', V('A'), V('B')), { out: 0, need: { A: 1 } }, 'Gdy oba przełączniki są w tej samej pozycji, XOR daje 0 i światło gaśnie.', { start: { A: 1 }, hint: 'nie ruszaj A, przełącz B' }),
            logic('Y = A AND (NOT B). Ustaw wejścia, żeby Y = 1.', G('AND', V('A'), G('NOT', V('B'))), { out: 1 }, 'A musi być 1, a B – 0, bo NOT zamienia je na 1.', { hint: 'NOT odwraca B' }),
            tf('Bramka AND daje 1, gdy przynajmniej jedno wejście ma 1.', false, 'To opis bramki OR. AND potrzebuje dwóch jedynek.'),
            logic('Y = (A OR B) AND C. Zapal wyjście, używając najwyżej dwóch jedynek.', G('AND', G('OR', V('A'), V('B')), V('C')), { out: 1, maxOnes: 2 }, 'Wystarczy C = 1 i jedno z wejść A albo B.', { hint: 'C musi być 1' })
          ]
        },
        {
          id: 'e3u4l3', title: 'Liczby binarne', icon: 'binary', sticker: 'bit', desc: 'Licz jak komputer.',
          ex: [
            learn('binary', 'Bity', 'Komputer liczy w systemie <b>dwójkowym</b>. Każda lampka to jeden <b>bit</b>. Od prawej: 1, 2, 4, 8 – każda kolejna jest warta dwa razy więcej. Zapalone lampki sumujemy: 1010 = 8 + 2 = <b>10</b>.'),
            binary('Zapal lampki tak, żeby pokazały liczbę 5.', 4, 5, '5 = 4 + 1, czyli 0101.'),
            binary('Pokaż liczbę 13.', 4, 13, '13 = 8 + 4 + 1, czyli 1101.'),
            calc('Ile to dziesiętnie: 1111₂?', 15, '', '8 + 4 + 2 + 1 = 15.'),
            binary('Pokaż liczbę 100 na ośmiu bitach. Tym razem bez podglądu wyniku!', 8, 100, '100 = 64 + 32 + 4, czyli 01100100.', { hide: true }),
            choice('Ile różnych liczb zapiszesz na 8 bitach (1 bajt)?', ['256', '8', '16', '100'], 0, '2 do potęgi 8 to 256: od 0 do 255.'),
            tf('1 bajt to 8 bitów.', true, 'Kilobajt to około tysiąc bajtów, a megabajt – około milion.')
          ]
        },
        {
          id: 'e3u4w', title: 'Warsztat cyfrowy', icon: 'grid', ws: true, desc: 'Warsztat: ekrany, bajty i bramki.',
          ex: [
            learn('mascot', 'Ekran to logika', 'Każda dioda w ekranie LED świeci, gdy włączony jest jej <b>rząd AND jej kolumna</b>. Procesor przełącza rzędy tak szybko, że widzisz cały obraz naraz.', { mood: 'think' }),
            pattern('Zapal kwadrat 2×2 na środku ekranu.', { mode: 'matrix', size: [4, 4], target: [[1, 1], [1, 2], [2, 1], [2, 2]] }, 'Rzędy 2 i 3 AND kolumny 2 i 3.', { hint: 'dwa środkowe rzędy i dwie środkowe kolumny' }),
            pattern('Zapal ramkę wokół ekranu… a może się nie da? Zapal przynajmniej cztery rogi.', { mode: 'matrix', size: [4, 4], target: [[0, 0], [0, 3], [3, 0], [3, 3]] }, 'Całej ramki nie da się zapalić naraz – dlatego ekrany przełączają rzędy po kolei, bardzo szybko.'),
            binary('Pokaż na ośmiu bitach liczbę 42.', 8, 42, '42 = 32 + 8 + 2, czyli 00101010.', { hide: true }),
            logic('Alarm (Y) ma się włączyć, gdy drzwi są otwarte (A) AND alarm jest uzbrojony (B), ale NIE wtedy, gdy wpisano kod (C). Włącz alarm.', G('AND', G('AND', V('A'), V('B')), G('NOT', V('C'))), { out: 1 }, 'A = 1, B = 1, C = 0. Tak myśli prawdziwy system alarmowy.', { hint: 'kod (C) musi być 0' }),
            learn('mascot', 'Wielki finał!', 'Przeszliśmy razem drogę od żaróweczki do logiki komputerów. Kolejny krok to <b>mikrokontrolery i programowanie</b> – tam Twoje obwody zaczną myśleć same!', { mood: 'cheer' })
          ]
        }
      ]
    }
  ];

  var stickers = [
    { id: 'capChar', name: 'Kondensator Kaja', art: 'capChar', lesson: 'e3u1l1', does: 'Gromadzi ładunek i szybko oddaje energię.', fact: 'Superkondensatory potrafią napędzać autobusy elektryczne na krótkich trasach.' },
    { id: 'diode', name: 'Dioda Darek', art: 'diode', lesson: 'e3u2l1', does: 'Przepuszcza prąd tylko w jedną stronę.', fact: 'Pierwsze diody były szklanymi lampami próżniowymi wielkości żarówki!' },
    { id: 'bridge', name: 'Mostek Marek', art: 'bridge', lesson: 'e3u2l2', does: 'Zamienia prąd zmienny na stały – prostuje go.', fact: 'Nazwa pochodzi od niemieckiego fizyka Leo Graetza.' },
    { id: 'npn', name: 'Tranzystor Tadek', art: 'npn', lesson: 'e3u3l1', does: 'Mały prąd bazy steruje w nim dużym prądem.', fact: 'Pierwszy tranzystor zbudowano w 1947 roku. Dziś w jednym procesorze są ich miliardy.' },
    { id: 'gate', name: 'Bramka Bea', art: 'gate', lesson: 'e3u4l1', does: 'Liczy logicznie: z zer i jedynek robi nowe zera i jedynki.', fact: 'Z samych bramek NAND można zbudować cały komputer!' },
    { id: 'bit', name: 'Bajtek', art: 'bit', lesson: 'e3u4l3', does: 'Zapamiętuje liczby zapisane zerami i jedynkami.', fact: '8 bitów to 1 bajt. Jedno zdjęcie z telefonu to kilka milionów bajtów!' }
  ];

  var accs = [
    { id: 'visor', name: 'Gogle VR', from: 'chest:e3u1', desc: 'Do oglądania obwodów w wirtualnym świecie.' },
    { id: 'headset', name: 'Zestaw z mikrofonem', from: 'chest:e3u2', desc: 'Do prowadzenia własnego kanału o elektronice.' },
    { id: 'star', name: 'Spinka gwiazdka', from: 'chest:e3u3', desc: 'Za świecenie przykładem!' },
    { id: 'laurel', name: 'Wieniec laurowy', from: 'chest:e3u4', desc: 'Dla mistrzyni i mistrza całej ścieżki.' }
  ];

  window.ISK_STAGES.push({
    id: 'e3', n: 3, name: 'Błyskawica', form: 3, age: '14+', ageLabel: '14 lat i więcej', title: 'Elektronika na serio',
    grow: 'Znowu urosłam – teraz jestem <b>Błyskawicą</b>! Przed nami prawdziwa elektronika: kondensatory, tranzystory i logika, z której zbudowane są komputery.',
    units: units, stickers: stickers, accs: accs
  });
})();
