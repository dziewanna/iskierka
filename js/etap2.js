/* ISKIERKA — ETAP 2 · Iskra · 12+
   Fizyka prądu: pomiary, prawo Ohma, łączenie oporników, moc i energia, magnetyzm.
   Funkcje do tworzenia zadań są w js/kit.js. */
(function () {
  'use strict';
  var K = window.ISK_KIT, B = K.B;
  var learn = K.learn, choice = K.choice, tf = K.tf, pairs = K.pairs, fill = K.fill, sort = K.sort, circ = K.circ;
  var calc = K.calc, dial = K.dial, tune = K.tune, volts = K.volts, rcombo = K.rcombo, bands = K.bands;
  var build = K.build, triangle = K.triangle, grid = K.grid, F = K.F;
  var LL = K.LL;

  /* dzielnik z przerwą do zamknięcia */
  function dividerGap() {
    var c = B.divider(100, 100, { v: 6 });
    c.parts = c.parts.map(function (p) { return p.n[0] === 'c' && p.n[1] === 'd' ? { t: 'gap', id: 'G', n: ['c', 'd'], tap: true } : p; });
    return c;
  }

  var units = [
    /* ================= ROZDZIAŁ 1 ================= */
    {
      id: 'e2u1', color: 'sky', title: 'Mierzymy prąd', sub: 'Jednostki, multimetr, prawo Ohma',
      guide: [
        '<b>Symbol</b> to litera we wzorze (U, I, R, P), a <b>jednostka</b> to miara w wyniku (V, A, Ω, W). Wzór: I = U : R, wynik: 0,02 A.',
        'Napięcie <b>U</b> mierzymy w woltach (V), natężenie prądu <b>I</b> w amperach (A), opór <b>R</b> w omach (Ω).',
        'Przedrostki: <b>m</b> (mili) = 1/1000, <b>k</b> (kilo) = 1000, <b>M</b> (mega) = 1 000 000. Czyli 250 mA = 0,25 A, a 4,7 kΩ = 4700 Ω.',
        '<b>Woltomierz</b> podłączamy równolegle do elementu, <b>amperomierz</b> – szeregowo.',
        'Multimetr to woltomierz, amperomierz i omomierz w jednym. Przed pomiarem wybierz tryb pokrętłem.',
        '<b>Prawo Ohma</b>: U = I · R, czyli I = U : R oraz R = U : I.',
        'Nie mierz oporu w obwodzie, w którym płynie prąd.'
      ],
      lessons: [
        {
          id: 'e2u1l0', title: 'Symbol czy jednostka?', icon: 'calc', desc: 'Dlaczego prąd to I, a wynik podajemy w A?',
          ex: [
            learn('mascot', 'Hej, to ja – Iskra!', 'Urosłam i teraz będziemy liczyć jak prawdziwi fizycy. Na start rozplączemy coś, co myli prawie wszystkich: <b>symbole</b> i <b>jednostki</b>.', { mood: 'cheer' }),
            learn('qtable', 'Imię i miara', 'Każda wielkość ma <b>symbol</b> – literę, której używamy we <b>wzorze</b> – i <b>jednostkę</b>, w której podajemy <b>wynik</b>. Znasz to z czasu: we wzorze piszemy <b>t</b>, a wynik to np. 5 <b>s</b>. Z prądem jest tak samo: wzór mówi <b>I</b>, a wynik mówi <b>A</b>. Kolory pomagają: symbol i jego jednostka mają ten sam kolor.'),
            learn('mascot', 'Sztuczki na zapamiętanie', '<b>I</b> jak <b>I</b>ntensywność – po francusku natężenie prądu to „intensité”, tak pisał André-Marie Ampère. <b>R</b> jak <b>R</b>ezystancja, czyli opór. <b>P</b> jak <b>P</b>ower – po angielsku moc. <b>U</b> jak <b>U</b>pychanie elektronów – napięcie upycha je w przewód. To tylko sztuczka, ale działa!', { mood: 'think' }),
            grid('Uzupełnij tabelę: symbol we wzorze i jednostkę w wyniku.', { cols: ['Wielkość', 'Symbol', 'Jednostka'], rows: [['Napięcie', 'U', 'V'], ['Natężenie prądu', 'I', 'A'], ['Opór', 'R', 'Ω'], ['Moc', 'P', 'W']], blanks: [1, 2] }, 'Symbol to litera we wzorze, a jednostka jedzie do wyniku.'),
            tf('Ω to symbol oporu we wzorze.', false, 'Ω (om) to jednostka. We wzorze opór zapisujemy literą R.'),
            choice('We wzorze I = U : R litera I oznacza…', ['natężenie prądu', 'jednostkę amper', 'opornik', F('Iskierkę', 'Miło! Ale tym razem I to natężenie prądu.')], 0, 'I to symbol natężenia prądu. Wynik podamy w amperach (A).'),
            choice('W wyniku „I = 0,5 A” litera A oznacza…', ['jednostkę – amper', 'symbol napięcia', 'opór', F('Pana Ampera, który wpadł na lekcję', 'Hihi! Ampère był fizykiem, a jego nazwisko stało się jednostką: amper.')], 0, 'A to amper – jednostka, w której podajemy natężenie prądu.'),
            pairs('Połącz symbol z jego jednostką', [['U', 'V'], ['I', 'A'], ['R', 'Ω'], ['P', 'W']], { big: true })
          ]
        },
        {
          id: 'e2u1l1', title: 'Przedrostki', icon: 'calc', desc: 'Mili, kilo, mega – liczymy jak fizycy.',
          ex: [
            pairs('Połącz symbol z wielkością', [['U', 'napięcie [V]'], ['I', 'natężenie prądu [A]'], ['R', 'opór [Ω]'], ['P', 'moc [W]']], { big: true }),
            learn('mascot', 'Przedrostki', 'Bardzo małe i bardzo duże liczby skracamy przedrostkami: <b>m</b> (mili) to tysięczna część, <b>k</b> (kilo) to tysiąc, <b>M</b> (mega) to milion. Czyli 20 mA = 0,02 A, a 4,7 kΩ = 4700 Ω.', { mood: 'think' }),
            calc('Zamień: 250 mA = ? A', 0.25, 'A', '250 : 1000 = 0,25 A.', { hint: 'mili to tysięczna część: podziel przez 1000' }),
            calc('Zamień: 2,2 kΩ = ? Ω', 2200, 'Ω', '2,2 · 1000 = 2200 Ω.', { hint: 'kilo to tysiąc: pomnóż przez 1000' }),
            choice('Ile to 1,5 kV?', ['1500 V', '150 V', '15 V', '0,0015 V'], 0, 'Kilo to tysiąc: 1,5 · 1000 = 1500 V.'),
            tf('1 MΩ to tysiąc kiloomów.', true, '1 MΩ = 1 000 000 Ω = 1000 kΩ.'),
            calc('Zamień: 0,05 A = ? mA', 50, 'mA', '0,05 · 1000 = 50 mA.')
          ]
        },
        {
          id: 'e2u1l2', title: 'Multimetr Mira', icon: 'meter', sticker: 'meter', desc: 'Jak mierzy elektronik?',
          ex: [
            learn('meter', 'Multimetr Mira', 'Mira to <b>multimetr</b>: woltomierz, amperomierz i omomierz w jednym. Pokrętłem wybierasz, co mierzy: <b>V=</b> napięcie stałe, <b>V~</b> napięcie zmienne, <b>A</b> prąd, <b>Ω</b> opór.', { friend: true }),
            dial('Ustaw Mirę, żeby zmierzyć napięcie baterii 9 V.', 'vdc', 'Bateria daje napięcie stałe, więc wybieramy V=. Mira pokazuje 9,02 V – nowa bateria ma trochę więcej niż 9 V.', { reading: '9,02' }),
            dial('Chcesz sprawdzić, jaki opór ma opornik. Ustaw pokrętło.', 'ohm', 'Opór mierzymy w trybie Ω – i zawsze bez prądu w obwodzie.', { reading: '220' }),
            dial('W gniazdku jest napięcie zmienne (230 V~). Który tryb wybrałby elektryk?', 'vac', 'V~ to napięcie zmienne. Ale uwaga: pomiary w gniazdku zostawiamy dorosłym elektrykom!', { reading: '231' }),
            learn({ c: function () { return B.ladder([[LL('A')], [{ t: 'vm', id: 'V' }]], null, { v: 4.5, rint: 0.01, lab: '4,5 V' }); }, sim: true }, 'Jak podłączyć?', '<b>Woltomierz</b> podłączamy <b>równolegle</b> – jego przewody dotykają obu końców elementu. <b>Amperomierz</b> wpinamy <b>szeregowo</b> – prąd musi przez niego przepłynąć.'),
            choice('Jak podłącza się woltomierz?', ['Równolegle do elementu', 'Szeregowo z elementem', 'Do jednej nóżki elementu', 'Prosto do gniazdka'], 0, 'Woltomierz porównuje napięcie po obu stronach elementu.'),
            tf('Amperomierz wpinamy szeregowo, żeby prąd przez niego przepływał.', true, 'Amperomierz liczy prąd, który przez niego płynie.')
          ]
        },
        {
          id: 'e2u1l3', title: 'Prawo Ohma', icon: 'resistor', desc: 'Jeden wzór, trzy wielkości.',
          ex: [
            learn('ohm', 'Trójkąt Ohma', 'Napięcie, prąd i opór łączy wzór <b>U = I · R</b>. W trójkącie <b>U</b> siedzi na górze, a <b>I</b> i <b>R</b> na dole obok siebie. Pod literami są jednostki: V, A i Ω. Zasłoń palcem to, czego szukasz – reszta pokaże wzór!'),
            triangle('Chcesz policzyć prąd (I). Zasłoń w trójkącie to, czego szukasz.', 'I', 'Zostaje U nad R, czyli I = U : R. W jednostkach: A = V : Ω.'),
            triangle('Teraz chcesz policzyć opór (R). Co zasłonisz?', 'R', 'Zostaje U nad I, czyli R = U : I. W jednostkach: Ω = V : A.'),
            triangle('A teraz napięcie (U).', 'U', 'Zostają I i R obok siebie – mnożymy: U = I · R. W jednostkach: V = A · Ω.'),
            learn('ohm', 'Liczymy w trzech krokach', '<b>1.</b> Wzór z literami: I = U : R. <b>2.</b> Wstaw liczby z jednostkami: I = 9 V : 450 Ω. <b>3.</b> Wynik z jednostką: I = 0,02 A. Litera zostaje we wzorze, a jednostka jedzie do wyniku.'),
            calc('Bateria 9 V, opornik 450 Ω. Jaki prąd płynie? Wynik w mA.', 20, 'mA', 'I = 9 V : 450 Ω = 0,02 A = 20 mA.', { hint: 'I = U : R, a potem zamień ampery na miliampery' }),
            calc('Przez opornik 100 Ω płynie 0,05 A. Jakie jest na nim napięcie?', 5, 'V', 'U = 0,05 A · 100 Ω = 5 V.', { hint: 'U = I · R' }),
            calc('Żarówka przy 12 V pobiera 0,5 A. Jaki ma opór?', 24, 'Ω', 'R = 12 V : 0,5 A = 24 Ω.', { hint: 'R = U : I' }),
            choice('Ile pokaże amperomierz?', ['50 mA', '5 mA', '500 mA', '0,5 mA'], 0, 'I = 5 V : 100 Ω = 0,05 A = 50 mA.', { art: { c: function () { return B.loop({ t: 'res', r: 100, lab: '100 Ω' }, { t: 'am', id: 'A1' }, null, { v: 5, rint: 0.01, lab: '5 V' }); } } }),
            tf('Gdy dwa razy zwiększysz napięcie, a opór się nie zmieni, prąd też wzrośnie dwa razy.', true, 'Prąd jest wprost proporcjonalny do napięcia – to właśnie prawo Ohma.'),
            fill(['Prawo Ohma: I = ', 0, ' : ', 1], ['U', 'R', 'P', 'I'], ['U', 'R'], 'Prąd to napięcie podzielone przez opór.')
          ]
        },
        {
          id: 'e2u1w', title: 'Laboratorium pomiarów', icon: 'meter', ws: true, desc: 'Warsztat: mierzysz na żywych obwodach.',
          ex: [
            circ('Woltomierz pilnuje opornika R₂. Wstaw kabelek w przerwę i odczytaj wynik.', dividerGap, { on: { G: true } }, 'Woltomierz pokazał 3 V – połowę z 6 V, bo oba oporniki są równe.', { hint: 'dotknij przerwy na dole obwodu' }),
            dial('Chcesz zmierzyć prąd płynący przez diodę. Który tryb wybierasz?', 'a', 'Prąd mierzymy w trybie A, a miernik wpinamy w obwód szeregowo. Mira pokazuje 18,5 mA.', { reading: '18,5' }),
            circ('Amperomierz stoi na wspólnej drodze. Włącz obie żarówki i zobacz, co pokaże.', function () { return B.ladder([[LL('A'), { t: 'sw', id: 'SA', label: 'A', tap: true }], [LL('B'), { t: 'sw', id: 'SB', label: 'B', tap: true }]], { t: 'am', id: 'M' }, { v: 4.5, rint: 0.01, lab: '4,5 V' }); }, { lit: { A: true, B: true } }, 'Każda żarówka bierze swój prąd, a amperomierz na wspólnej drodze pokazuje ich sumę.', { hint: 'włącz oba przełączniki' }),
            calc('Amperomierz pokazał 900 mA. Ile to amperów?', 0.9, 'A', '900 : 1000 = 0,9 A.'),
            calc('Woltomierz na żarówce pokazuje 4,5 V, amperomierz 0,45 A. Jaki opór ma żarówka?', 10, 'Ω', 'R = 4,5 V : 0,45 A = 10 Ω. Tak elektronicy mierzą opór „w działaniu”.', { hint: 'R = U : I' })
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 2 ================= */
    {
      id: 'e2u2', color: 'copper', title: 'Oporniki w drużynie', sub: 'Szeregowo, równolegle, dzielnik',
      guide: [
        'Szeregowo opory się <b>sumują</b>: R = R₁ + R₂.',
        'Równolegle opór zastępczy jest <b>mniejszy od najmniejszego</b>. Dla dwóch: R = R₁ · R₂ : (R₁ + R₂). Dwa jednakowe – połowa.',
        'W szeregu płynie ten sam prąd, a napięcie się dzieli. Równolegle każdy ma to samo napięcie, a prądy się sumują.',
        '<b>Dzielnik napięcia</b>: oporniki w szeregu dzielą napięcie w proporcji swoich oporów.',
        '<b>Potencjometr</b> to opornik z suwakiem – regulowany dzielnik, np. pokrętło głośności.',
        'Kod kolorów: czarny 0, brązowy 1, czerwony 2, pomarańczowy 3, żółty 4, zielony 5, niebieski 6, fioletowy 7, szary 8, biały 9.'
      ],
      lessons: [
        {
          id: 'e2u2l1', title: 'Szeregowo', icon: 'series', desc: 'Oporniki jeden za drugim.',
          ex: [
            learn({ c: function () { return B.divider(100, 100, { v: 6 }); }, sim: true }, 'W szeregu', 'Oporniki w szeregu działają jak jeden dłuższy: <b>R = R₁ + R₂</b>. Prąd jest wszędzie ten sam, a napięcie baterii <b>dzieli się</b> między nie – zobacz, ile pokazuje woltomierz.'),
            calc('Oporniki 220 Ω i 330 Ω połączono szeregowo. Ile wynosi opór zastępczy?', 550, 'Ω', '220 + 330 = 550 Ω.'),
            calc('Trzy oporniki po 1 kΩ w szeregu. Ile wynosi opór zastępczy?', 3, 'kΩ', '1 + 1 + 1 = 3 kΩ.'),
            choice('Dwa jednakowe oporniki w szeregu, bateria 6 V. Co pokaże woltomierz na jednym z nich?', ['3 V', '6 V', '12 V', '0 V'], 0, 'Równe oporniki dzielą napięcie po równo: 6 V : 2 = 3 V.', { art: { c: function () { return B.divider(100, 100, { v: 6 }); } } }),
            tf('W połączeniu szeregowym przez każdy opornik płynie taki sam prąd.', true, 'Prąd ma tylko jedną drogę.'),
            calc('Bateria 9 V, oporniki 200 Ω i 250 Ω w szeregu. Jaki płynie prąd (mA)?', 20, 'mA', 'R = 450 Ω, więc I = 9 V : 450 Ω = 0,02 A = 20 mA.', { hint: 'najpierw dodaj opory, potem I = U : R' }),
            rcombo('Złóż 330 Ω z oporników w szeregu.', 330, [100, 220, 470, 1000, 10], '100 + 220 + 10 = 330 Ω.', { hint: 'szukaj trzech oporników, które razem dają 330' })
          ]
        },
        {
          id: 'e2u2l2', title: 'Równolegle', icon: 'parallel', desc: 'Kilka dróg naraz.',
          ex: [
            learn({ c: function () { return B.ladder([[{ t: 'res', r: 100, lab: '100 Ω' }], [{ t: 'res', r: 100, lab: '100 Ω' }]], { t: 'am', id: 'M' }, { v: 4.5, rint: 0.01, lab: '4,5 V' }); }, sim: true }, 'Równolegle', 'Gdy oporniki stoją obok siebie, prąd ma kilka dróg, więc opór zastępczy <b>maleje</b>. Dla dwóch: <b>R = R₁ · R₂ : (R₁ + R₂)</b>. Dwa jednakowe? Wychodzi połowa jednego.'),
            calc('Dwa oporniki po 200 Ω połączono równolegle. Opór zastępczy?', 100, 'Ω', 'Dwa jednakowe równolegle to połowa: 200 : 2 = 100 Ω.'),
            calc('Oporniki 30 Ω i 60 Ω równolegle. Opór zastępczy?', 20, 'Ω', '30 · 60 : (30 + 60) = 1800 : 90 = 20 Ω.', { hint: 'iloczyn podziel przez sumę' }),
            choice('Do opornika 100 Ω dołączasz równolegle drugi opornik. Opór zastępczy będzie…', ['mniejszy niż 100 Ω', 'większy niż 100 Ω', 'równy 100 Ω', 'równy zero'], 0, 'Każda nowa droga ułatwia przepływ prądu.'),
            tf('Lampy w domu są połączone równolegle, więc każda dostaje pełne 230 V.', true, 'Równolegle każdy odbiornik ma to samo napięcie.'),
            rcombo('Złóż 50 Ω, łącząc oporniki równolegle.', 50, [100, 100, 220, 470], 'Dwa oporniki 100 Ω równolegle dają 50 Ω.', { mode: 'parallel', hint: 'dwa jednakowe równolegle dają połowę' })
          ]
        },
        {
          id: 'e2u2l3', title: 'Dzielnik i potencjometr', icon: 'gauge', sticker: 'pot', desc: 'Jak podzielić napięcie?',
          ex: [
            learn('pot', 'Potencjometr Pola', 'Pola to <b>potencjometr</b> – opornik z ruchomym suwakiem. Kręcąc gałką, zmieniasz, jak dzieli się napięcie. Tak działa pokrętło głośności i ściemniacz lampki.', { friend: true }),
            calc('Dzielnik: bateria 12 V, R₁ = 1 kΩ, R₂ = 2 kΩ. Jakie napięcie jest na R₂?', 8, 'V', 'R₂ to 2 z 3 części oporu, więc dostaje 2/3 napięcia: 12 · 2 : 3 = 8 V.', { hint: 'U₂ = U · R₂ : (R₁ + R₂)' }),
            choice('Co pokaże woltomierz na oporniku 300 Ω?', ['6 V', '2 V', '8 V', '4 V'], 0, '300 Ω to 3 z 4 części oporu: 8 V · 3 : 4 = 6 V.', { art: { c: function () { return B.divider(100, 300, { v: 8 }); } } }),
            tune('Bateria ma 9 V. Ustaw pokrętło Poli tak, żeby woltomierz pokazał 4,5 V.', { v: 9, steps: 10, start: 0, ok: [4.5, 4.5] }, 'Pokrętło w połowie drogi daje połowę napięcia.'),
            tf('Pokrętło głośności w radiu to często potencjometr.', true, 'Potencjometr zmienia, jaka część sygnału trafia do wzmacniacza.'),
            fill(['W dzielniku większy opór dostaje ', 0, ' napięcia.'], ['więcej', 'mniej', 'zero'], ['więcej'], 'Napięcie dzieli się w proporcji oporów.')
          ]
        },
        {
          id: 'e2u2w', title: 'Kolorowy szyfr', icon: 'bands', ws: true, desc: 'Warsztat: odczytaj i ustaw paski oporników.',
          ex: [
            learn('res-220', 'Paski to liczby', 'Każdy kolor to cyfra: czarny 0, brązowy 1, czerwony 2, pomarańczowy 3, żółty 4, zielony 5, niebieski 6, fioletowy 7, szary 8, biały 9. <b>Dwa pierwsze paski</b> to cyfry, <b>trzeci</b> mówi, ile zer dopisać. Czerwony, czerwony, brązowy: 2, 2 i jedno zero = <b>220 Ω</b>. Złoty pasek na końcu to dokładność.'),
            choice('Ile omów ma ten opornik?', ['470 Ω', '47 Ω', '4700 Ω', '74 Ω'], 0, 'Żółty 4, fioletowy 7, brązowy – jedno zero: 470 Ω.', { art: 'res-470' }),
            bands('Ustaw paski dla opornika 220 Ω.', 220, 'Czerwony (2), czerwony (2), brązowy (jedno zero).'),
            bands('Ustaw paski dla 1 kΩ (1000 Ω).', 1000, 'Brązowy (1), czarny (0), czerwony (dwa zera): 10 i 00 = 1000 Ω.'),
            choice('Ile omów ma ten opornik?', ['10 kΩ', '1 kΩ', '100 Ω', '100 kΩ'], 0, 'Brązowy 1, czarny 0, pomarańczowy – trzy zera: 10 000 Ω = 10 kΩ.', { art: 'res-10000' }),
            bands('Ustaw paski dla 4,7 kΩ.', 4700, 'Żółty (4), fioletowy (7), czerwony (dwa zera): 4700 Ω.'),
            rcombo('Złóż 1,32 kΩ z oporników w szeregu.', 1320, [1000, 470, 220, 100, 47], '1000 + 220 + 100 = 1320 Ω.', { hint: '1,32 kΩ to 1320 Ω' })
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 3 ================= */
    {
      id: 'e2u3', color: 'violet', title: 'Moc i energia', sub: 'Waty, kilowatogodziny, rachunki',
      guide: [
        '<b>Moc</b> mówi, jak szybko urządzenie zużywa energię: P = U · I, w watach (W).',
        '<b>Energia</b>: E = P · t. Rachunek za prąd liczy się w kilowatogodzinach (kWh).',
        '1 kWh to np. 10 godzin pracy lampy 100 W albo pół godziny czajnika 2000 W.',
        'Prąd pobierany z gniazdka: I = P : U, gdzie U = 230 V.',
        '<b>Bezpiecznik</b> wyłącza obwód, gdy prąd jest za duży (np. B16 – powyżej 16 A).',
        'Część energii zawsze zamienia się w ciepło. <b>Sprawność</b> mówi, ile idzie na pożyteczną pracę.'
      ],
      lessons: [
        {
          id: 'e2u3l1', title: 'Waty', icon: 'bolt', desc: 'Kto zużywa energię najszybciej?',
          ex: [
            learn('mascot', 'Moc', 'Moc mówi, <b>jak szybko</b> urządzenie zużywa energię. Liczymy ją wzorem <b>P = U · I</b> i podajemy w <b>watach</b> (W). Czajnik ma około 2000 W, a ładowarka telefonu – kilkanaście.', { mood: 'think' }),
            calc('Żarówka w latarce: 3 V i 0,5 A. Jaka jest jej moc?', 1.5, 'W', 'P = 3 V · 0,5 A = 1,5 W.', { hint: 'P = U · I' }),
            calc('Grzałka podłączona do 230 V pobiera 2 A. Jaka jest jej moc?', 460, 'W', 'P = 230 V · 2 A = 460 W.'),
            choice('Które urządzenie ma zwykle największą moc?', ['Czajnik elektryczny', 'Ładowarka telefonu', 'Lampka LED', F('Chomik w kołowrotku', 'Chomik bardzo się stara, ale czajnik jest dużo mocniejszy!')], 0, 'Grzanie wody wymaga dużo energii w krótkim czasie.'),
            sort('Duża czy mała moc?', [{ t: 'Duża (ponad 1000 W)', icon: 'bolt' }, { t: 'Mała (do 100 W)', icon: 'leaf' }], [
              { t: 'Czajnik', b: 0 }, { t: 'Ładowarka telefonu', b: 1 }, { t: 'Piekarnik', b: 0 },
              { t: 'Żarówka LED', b: 1 }, { t: 'Suszarka do włosów', b: 0 }, { t: 'Router Wi-Fi', b: 1 }
            ], 'Najwięcej mocy potrzebują urządzenia, które grzeją.'),
            tf('Moc 1 kW to 1000 W.', true, 'Kilo to tysiąc.')
          ]
        },
        {
          id: 'e2u3l2', title: 'Kilowatogodziny', icon: 'gauge', sticker: 'kwh', desc: 'Skąd się bierze rachunek za prąd?',
          ex: [
            learn('kwh', 'Licznik Leon', 'Leon mieszka w skrzynce przy drzwiach i liczy zużytą <b>energię</b>: E = P · t. Wynik podaje w <b>kilowatogodzinach</b> (kWh). 1 kWh to moc 1 kW pracująca przez 1 godzinę.', { friend: true }),
            calc('Lampa 100 W świeci 10 godzin. Ile zużyje kWh?', 1, 'kWh', 'E = 0,1 kW · 10 h = 1 kWh.', { hint: 'zamień waty na kilowaty: 100 W = 0,1 kW' }),
            calc('Czajnik 2000 W gotuje wodę 3 minuty dziennie przez 30 dni. Ile to kWh?', 3, 'kWh', '3 minuty to 0,05 h. 2 kW · 0,05 h · 30 = 3 kWh.', { hint: '3 minuty = 0,05 godziny' }),
            calc('Przyjmij, że 1 kWh kosztuje 1 zł. Telewizor 100 W gra 5 godzin dziennie przez 30 dni. Ile kosztuje ten prąd?', 15, 'zł', '0,1 kW · 5 h · 30 = 15 kWh, czyli około 15 zł.'),
            choice('Co zużyje najwięcej energii?', ['Czajnik 2000 W przez 6 minut', 'Lampka 10 W przez 1 godzinę', 'Ładowarka 5 W przez 2 godziny', 'Zegarek przez dzień'], 0, 'Czajnik: 2 kW · 0,1 h = 0,2 kWh. Lampka i ładowarka zużyją po 0,01 kWh.'),
            tf('Urządzenie w trybie czuwania (z czerwoną diodą) nie zużywa ani trochę prądu.', false, 'Czuwanie też zużywa energię. Warto wyłączać listwę zasilającą.')
          ]
        },
        {
          id: 'e2u3l3', title: 'Bezpiecznik i ciepło', icon: 'shield', sticker: 'fuse', desc: 'Kto pilnuje domowej instalacji?',
          ex: [
            learn('fuse', 'Bezpiecznik Bartek', 'Bartek pilnuje instalacji. Gdy prąd jest za duży – przy zwarciu albo gdy włączysz za dużo urządzeń naraz – <b>wyłącza obwód</b>, zanim kable się przegrzeją.', { friend: true }),
            calc('Czajnik 2300 W, napięcie w gniazdku 230 V. Jaki prąd pobiera?', 10, 'A', 'I = P : U = 2300 W : 230 V = 10 A.', { hint: 'I = P : U' }),
            choice('Na jednym obwodzie działają czajnik (10 A) i grzejnik (8 A). Bezpiecznik to B16. Co się stanie?', ['Bezpiecznik wyłączy prąd', 'Nic, wszystko zadziała', 'Czajnik będzie grzał szybciej', F('Grzejnik zacznie świecić', 'Grzejnik-lampa? Ciekawy pomysł, ale bezpiecznik po prostu wyłączy prąd.')], 0, '10 A + 8 A = 18 A, a to więcej niż 16 A.'),
            tf('Przepalony bezpiecznik można zastąpić kawałkiem drutu.', false, 'To bardzo groźne! Bez bezpiecznika kable mogą się przegrzać i wywołać pożar.'),
            learn('bulbOn', 'Sprawność', 'Żadne urządzenie nie zamienia całej energii w to, co chcemy. Zwykła żarówka oddaje jako światło tylko kilka procent energii, a reszta to ciepło. LED ma dużo większą <b>sprawność</b>.'),
            choice('Dlaczego ładowarka robi się ciepła?', ['Część energii zamienia się w ciepło', 'Bo bateria jest pełna', F('Bo prąd jest zimny', 'Prąd nie jest ani zimny, ani ciepły jak lody. Ciepło to zgubiona energia.'), 'Bo kabel jest za długi'], 0, 'Każde urządzenie traci trochę energii jako ciepło.')
          ]
        },
        {
          id: 'e2u3w', title: 'Misje Wolcika', icon: 'robot', ws: true, desc: 'Misja: napięcie musi się zgadzać.',
          ex: [
            learn('robot', 'Robot Wolcik', 'Wolcik ma wiatraczek, który potrzebuje <b>9 V</b>, i dwie baterie po 4,5 V. Żeby napięcia się dodały, baterie łączymy <b>szeregowo</b>: plus jednej do minusa drugiej.'),
            build('Połącz baterie szeregowo i zasil wiatraczek Wolcika napięciem 9 V.', {
              scene: 'robot', parts: [{ id: 'B1', t: 'bat', rint: 0.01, at: [62, 200], name: 'Górna bateria' }, { id: 'B2', t: 'bat', rint: 0.01, at: [62, 262], name: 'Dolna bateria' }, { id: 'M', t: 'motor', skin: 'fan', at: [203, 42], name: 'Wiatraczek', vmin: 7, need: 9 }],
              goal: { lit: { M: true } }, route: 'Najpierw <b>plus górnej baterii → minus dolnej</b>. Potem <b>plus dolnej → wiatraczek → minus górnej</b>.', hint: 'plus jednej baterii połącz z minusem drugiej, a wolne końce z wiatraczkiem', sol: [['B1:+', 'B2:-'], ['B2:+', 'M:a'], ['M:b', 'B1:-']]
            }, 'Plus do minusa – i 4,5 V + 4,5 V = 9 V. Wiatraczek ruszył!'),
            tf('Odwrotnie połączona bateria w szeregu odejmuje napięcie zamiast je dodawać.', true, '4,5 V − 4,5 V = 0 V. Dlatego w pilocie baterie wkłada się według rysunku.'),
            calc('Trzy baterie po 1,5 V i jedna 4,5 V połączone szeregowo. Ile to razem woltów?', 9, 'V', '1,5 + 1,5 + 1,5 + 4,5 = 9 V.'),
            build('Wolcik ma oko z diody LED. Zapal je tak, żeby się nie przepaliło.', {
              scene: 'robot', parts: [{ id: 'B', t: 'bat', v: 9, at: [62, 262] }, { id: 'R', t: 'res', r: 470, at: [70, 176] }, { id: 'D', t: 'led', skin: 'eye', col: '#22C3A4', at: [203, 214], name: 'Oko-dioda' }],
              goal: { lit: { D: true }, noBurn: true }, route: 'Droga prądu: <b>plus baterii → opornik → plus diody (+)</b>, a potem <b>minus diody → minus baterii</b>.', hint: 'opornik musi stać w drodze prądu do diody, a plus diody od strony plusa baterii', sol: [['B:+', 'R:a'], ['R:b', 'D:+'], ['D:-', 'B:-']]
            }, 'Opornik 470 Ω ogranicza prąd do bezpiecznych ok. 15–19 mA.'),
            calc('Bateria 9 V, dioda zabiera 2 V, chcesz 15 mA. Jaki opornik (Ω)?', 467, 'Ω', 'R = (9 − 2) V : 0,015 A ≈ 467 Ω. W sklepie wybierzesz najbliższy: 470 Ω.', { tol: 0.02, hint: 'R = (U baterii − U diody) : I' })
          ]
        }
      ]
    },

    /* ================= ROZDZIAŁ 4 ================= */
    {
      id: 'e2u4', color: 'mint', title: 'Magnes i prąd', sub: 'Elektromagnes, silnik, prądnica',
      guide: [
        'Prąd płynący w przewodzie wytwarza wokół niego <b>pole magnetyczne</b>.',
        'Cewka z żelaznym rdzeniem to <b>elektromagnes</b>. Więcej zwojów albo większy prąd – silniejszy magnes.',
        '<b>Przekaźnik</b> to przełącznik sterowany elektromagnesem: mały prąd włącza duży.',
        'W silniku prąd i magnesy wprawiają wirnik w ruch.',
        '<b>Prądnica</b> działa odwrotnie: ruch magnesu przy cewce wytwarza prąd (indukcja). Tak działają elektrownie i dynamo.',
        '<b>Transformator</b> zmienia napięcie prądu zmiennego: U₂ = U₁ · n₂ : n₁ (n – liczba zwojów).'
      ],
      lessons: [
        {
          id: 'e2u4l1', title: 'Elektromagnes Edek', icon: 'magnet', sticker: 'coil', desc: 'Magnes, który się włącza.',
          ex: [
            learn('coil', 'Elektromagnes Edek', 'Edek to <b>cewka</b> – drut nawinięty na żelazny gwóźdź. Gdy płynie prąd, Edek staje się <b>magnesem</b> i przyciąga spinacze. Wyłączysz prąd – puszcza!', { friend: true }),
            choice('Jak wzmocnić elektromagnes?', ['Nawinąć więcej zwojów drutu', F('Pomalować go na czerwono', 'Na czerwono wygląda groźniej, ale magnes od tego nie urośnie!'), 'Użyć plastikowego rdzenia', 'Wyłączyć prąd'], 0, 'Więcej zwojów i większy prąd dają silniejsze pole magnetyczne.'),
            tf('Elektromagnes działa także wtedy, gdy nie płynie przez niego prąd.', false, 'Bez prądu nie ma pola magnetycznego.'),
            learn('mascot', 'Przekaźnik', '<b>Przekaźnik</b> to przełącznik, którym steruje elektromagnes. Mały prąd z baterii może nim włączyć duże urządzenie – dlatego przekaźniki są w samochodach i pralkach.', { mood: 'think' }),
            choice('Do czego służy przekaźnik?', ['Mały prąd włącza nim duży obwód', 'Zamienia światło w prąd', 'Mierzy napięcie', 'Przechowuje energię'], 0, 'Elektromagnes w przekaźniku przyciąga styk i zamyka drugi obwód.'),
            tf('Duński fizyk Ørsted odkrył, że prąd w przewodzie porusza igłą kompasu.', true, 'Stało się to w 1820 roku – to był początek elektromagnetyzmu.')
          ]
        },
        {
          id: 'e2u4l2', title: 'Silnik i prądnica', icon: 'wave', desc: 'Ruch z prądu i prąd z ruchu.',
          ex: [
            learn('motorOn', 'Silnik od środka', 'W silniku prąd płynie przez cewkę, która staje się magnesem. Magnesy przyciągają się i odpychają – i wirnik się kręci.'),
            learn('induction', 'Prądnica', 'A teraz odwrotnie! Gdy poruszasz magnesem przy cewce, w cewce <b>powstaje prąd</b>. To <b>indukcja elektromagnetyczna</b>. Tak działa dynamo w rowerze i generatory w elektrowniach.'),
            choice('Co wytwarza prąd w elektrowni wiatrowej?', ['Prądnica kręcona przez wiatr', F('Bateria w środku wiatraka', 'Taka bateria musiałaby być wielka jak autobus! Prąd robi prądnica.'), 'Panel słoneczny na łopatach', 'Kabel z miasta'], 0, 'Łopaty kręcą wirnikiem prądnicy.'),
            pairs('Co w co zamienia?', [['Silnik', 'prąd → ruch'], ['Prądnica', 'ruch → prąd'], ['Elektromagnes', 'prąd → magnetyzm'], ['Panel słoneczny', 'światło → prąd']]),
            tf('Dynamo w rowerze świeci tylko wtedy, gdy jedziesz.', true, 'Bez ruchu magnes się nie kręci i prąd nie powstaje.'),
            choice('Michael Faraday pokazał w 1831 roku, że…', ['ruch magnesu przy cewce wytwarza prąd', 'prąd jest zrobiony z wody', 'magnesy nie działają na żelazo', 'bateria nigdy się nie rozładowuje'], 0, 'To odkrycie stoi za każdą elektrownią na świecie.')
          ]
        },
        {
          id: 'e2u4l3', title: 'Transformator Tola', icon: 'wave', sticker: 'trafo', desc: 'Prąd stały, zmienny i zmiana napięcia.',
          ex: [
            learn('acWave', 'Prąd stały i zmienny', 'Bateria daje <b>prąd stały</b> (=) – płynie ciągle w jedną stronę. Gniazdko daje <b>prąd zmienny</b> (~) – zmienia kierunek, w Polsce 50 razy na sekundę (50 Hz).'),
            learn('trafo', 'Transformator Tola', 'Tola ma dwie cewki na jednym żelaznym rdzeniu. Prąd zmienny w pierwszej cewce wytwarza prąd w drugiej. <b>Liczba zwojów decyduje o napięciu</b>: mniej zwojów w drugiej cewce – niższe napięcie.', { friend: true }),
            choice('Jaki prąd jest w gniazdku w Polsce?', ['Zmienny, 230 V, 50 Hz', 'Stały, 9 V', 'Zmienny, 5 V, 1 Hz', 'Stały, 1000 V'], 0, '230 V prądu zmiennego o częstotliwości 50 Hz.'),
            calc('Transformator: 230 V, cewka pierwotna 1000 zwojów, wtórna 100 zwojów. Jakie napięcie na wyjściu?', 23, 'V', 'U₂ = 230 V · 100 : 1000 = 23 V.', { hint: 'U₂ = U₁ · n₂ : n₁' }),
            tf('Transformator działa z prądem stałym z baterii.', false, 'Potrzebuje zmian prądu, żeby zaszła indukcja.'),
            sort('Prąd stały czy zmienny?', [{ t: 'Stały =', icon: 'battery' }, { t: 'Zmienny ~', icon: 'bolt' }], [
              { t: 'Bateria', b: 0 }, { t: 'Gniazdko w ścianie', b: 1 }, { t: 'Akumulator w telefonie', b: 0 },
              { t: 'Prądnica w elektrowni', b: 1 }, { t: 'Panel słoneczny', b: 0 }, { t: 'Port USB', b: 0 }
            ], 'Baterie, akumulatory, panele i USB dają prąd stały. Sieć w gniazdku – zmienny.')
          ]
        },
        {
          id: 'e2u4w', title: 'Dźwig ze złomowiska', icon: 'magnet', ws: true, desc: 'Warsztat: elektromagnesy w akcji.',
          ex: [
            circ('Włącz elektromagnes, żeby podniósł spinacz.', function () { return B.loop({ t: 'coil', id: 'K' }, { t: 'sw', id: 'S', tap: true }); }, { lit: { K: true } }, 'Prąd płynie przez cewkę – i spinacz skacze do gwoździa!', { hint: 'dotknij przełącznika' }),
            circ('Dźwig ma dwa przyciski bezpieczeństwa – oba muszą być wciśnięte. Uruchom magnes.', function () { return B.loop2b({ t: 'coil', id: 'K' }, { t: 'sw', id: 'S1', label: '1', tap: true }, { t: 'sw', id: 'S2', label: '2', tap: true }); }, { lit: { K: true } }, 'Przyciski stoją szeregowo, więc magnes działa tylko wtedy, gdy wciśnięte są oba.', { hint: 'włącz oba przełączniki' }),
            volts('Duży elektromagnes potrzebuje 9 V. Ułóż baterie.', 9, [4.5, 4.5, 1.5, 1.5, 1.5], 'Dwie płaskie baterie po 4,5 V dają 9 V.', { name: 'Elektromagnes' }),
            choice('Co się stanie ze spinaczem, gdy wyłączysz prąd w elektromagnesie?', ['Spadnie', 'Zostanie na zawsze', 'Zacznie świecić', 'Rozgrzeje się do czerwoności'], 0, 'Bez prądu pole magnetyczne znika. Tak dźwig upuszcza złom w wybranym miejscu.')
          ]
        }
      ]
    }
  ];

  var stickers = [
    { id: 'meter', name: 'Multimetr Mira', art: 'meter', lesson: 'e2u1l2', does: 'Mierzy napięcie, prąd i opór – to oczy każdego elektronika.', fact: 'Dawne mierniki miały wskazówkę zamiast ekranu. Niektórzy elektronicy wciąż je lubią!' },
    { id: 'pot', name: 'Potencjometr Pola', art: 'pot', lesson: 'e2u2l3', does: 'Pozwala płynnie zmieniać napięcie albo głośność.', fact: 'W gałce do gier są dwa potencjometry: jeden czuje ruch w lewo i w prawo, drugi – w górę i w dół.' },
    { id: 'kwh', name: 'Licznik Leon', art: 'kwh', lesson: 'e2u3l2', does: 'Liczy, ile energii zużył cały dom.', fact: 'Nowe liczniki są elektroniczne i same wysyłają odczyt do dostawcy prądu.' },
    { id: 'fuse', name: 'Bezpiecznik Bartek', art: 'fuse', lesson: 'e2u3l3', does: 'Wyłącza prąd, gdy płynie go za dużo.', fact: 'Napis B16 oznacza, że wyłączy prąd większy niż 16 amperów.' },
    { id: 'coil', name: 'Elektromagnes Edek', art: 'coil', lesson: 'e2u4l1', does: 'Staje się magnesem, gdy płynie przez niego prąd.', fact: 'Ogromne elektromagnesy na złomowiskach podnoszą całe samochody!' },
    { id: 'trafo', name: 'Transformator Tola', art: 'trafo', lesson: 'e2u4l3', does: 'Zmienia napięcie prądu zmiennego.', fact: 'W stacjach przy liniach energetycznych transformatory zamieniają wysokie napięcie na 230 V do domów.' }
  ];

  var accs = [
    { id: 'cap', name: 'Czapka z daszkiem', from: 'chest:e2u1', desc: 'Na wyjazd z miernikiem w teren.' },
    { id: 'ledband', name: 'Opaska z diodami', from: 'chest:e2u2', desc: 'Trzy kolorowe diody – jak w prawdziwym obwodzie.' },
    { id: 'beanie', name: 'Czapka z pomponem', from: 'chest:e2u3', desc: 'Oszczędzamy prąd na grzaniu, więc ciepła czapka się przyda!' },
    { id: 'loupe', name: 'Lupa elektronika', from: 'chest:e2u4', desc: 'Do czytania malutkich napisów na podzespołach.' }
  ];

  window.ISK_STAGES.push({
    id: 'e2', n: 2, name: 'Iskra', form: 2, age: '12+', ageLabel: '12–13 lat', title: 'Fizyka prądu',
    grow: 'Urosłam! Teraz jestem <b>Iskrą</b>. W etapie 2 mierzymy i liczymy jak fizycy: multimetr, prawo Ohma, moc, energia i magnesy.',
    units: units, stickers: stickers, accs: accs
  });
})();
