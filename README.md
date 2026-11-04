# Iskierka ⚡ — elektronika dla dzieci i nastolatków

Urocza gra edukacyjna w stylu kursów językowych z krótkimi lekcjami. Maskotka Iskierka
**dorasta razem z graczem**: im trudniejszy etap, tym starsza postać i poważniejsza elektronika.

| Etap | Wiek | Maskotka | Co jest w środku |
| --- | --- | --- | --- |
| 1 · Pierwsze iskry | 10+ | Iskierka | prąd i bateria, bezpieczeństwo, obwód, przewodniki, symbole, szeregowo i równolegle, zwarcie, opornik, dioda LED, czujniki, zielona energia |
| 2 · Fizyka prądu | 12+ | Iskra | jednostki i przedrostki, multimetr, prawo Ohma, łączenie oporników, dzielnik i potencjometr, kod kolorów, moc i energia (kWh), bezpiecznik, elektromagnes, silnik, prądnica, transformator |
| 3 · Elektronika na serio | 14+ | Błyskawica | kondensator i stała RC, diody i prostowanie, zasilacz, tranzystor jako przełącznik i wzmacniacz, czujnik zmierzchu, bramki logiczne, tabele prawdy, liczby binarne |

Starsze dziecko może zacząć od razu od etapu 2 albo 3: przy pierwszym uruchomieniu gra pyta o wiek,
a w profilu jest przycisk „Odblokuj wszystkie etapy”.

## Jak uruchomić

Kliknij dwa razy `index.html`. Gra działa w przeglądarce, bez instalacji i bez internetu
(z internetem wczytają się ładniejsze czcionki).

## Aplikacja na telefon i komputer

Iskierka jest aplikacją instalowaną ze strony (PWA): ma własną ikonę, otwiera się na pełnym ekranie
i działa bez internetu.

1. Opublikuj grę przez GitHub Pages: **Settings → Pages → Build and deployment → Source: Deploy from a branch →
   Branch: `main`, folder `/ (root)` → Save**. Po minucie gra będzie pod adresem `https://dziewanna.github.io/iskierka/`.
2. Otwórz ten adres na telefonie:
   - **Android (Chrome):** pojawi się „Zainstaluj aplikację” (albo menu ⋮ → *Zainstaluj aplikację*). Przycisk jest też w grze, w zakładce Profil.
   - **iPhone/iPad (Safari):** *Udostępnij* → *Do ekranu początkowego*.
   - **Komputer (Chrome, Edge):** ikona instalacji na końcu paska adresu.

Przy każdej nowej wersji zmień numer `CACHE` w `sw.js` (np. `iskierka-v2`), żeby zainstalowane aplikacje pobrały nowe pliki.

**Sklepy z aplikacjami:** z adresu GitHub Pages można zbudować paczkę do Google Play w darmowym narzędziu
[PWABuilder](https://www.pwabuilder.com) (konto dewelopera Google Play kosztuje jednorazowo 25 USD).
App Store wymaga konta Apple Developer (99 USD rocznie) i komputera Mac. Aplikacje dla dzieci wymagają
w obu sklepach polityki prywatności – Iskierka nie zbiera żadnych danych, co bardzo to ułatwia.

## Rodzaje zadań

- **Nauka:** karta wiedzy, wybór odpowiedzi, prawda/fałsz, pary, uzupełnianie zdań, sortowanie,
  układanie kolejności, obliczenia z klawiaturą kalkulatora.
- **Eksperymenty na żywych obwodach** (`js/circuit.js` naprawdę je przelicza): żarówki w szeregu świecą słabiej,
  zwarcie grzeje baterię, dioda działa w jedną stronę, woltomierz i amperomierz pokazują prawdziwe wartości,
  tranzystor zapala diodę, gdy zasłonisz czujnik światła. Każdy obwód da się przełączyć na schemat.
- **Misje** – obwody na obrazkach: dziecko łączy złote zaciski kabelkami, żeby coś konkretnego zadziałało.
  Potwór Mruczek otwiera oczy, puszcza oczko i ryczy po wciśnięciu nosa, skrzynia skarbów ma alarm na światło,
  robot strzeże słoika z ciastkami, Wolcik potrzebuje dokładnie 9 V, a nocny strażnik otwiera oko, gdy robi się ciemno.
  Gra sprawdza działanie w każdej sytuacji (nos wciśnięty i puszczony, dzień i noc), wykrywa zwarcie i przepaloną diodę.
- **Symbol czy jednostka?** – tabela wielkość–symbol–jednostka w kolorach (U i V, I i A, R i Ω, P i W)
  oraz trójkąt Ohma, w którym zasłania się literę palcem i od razu widać wzór z jednostkami.
- **Śmieszne złe odpowiedzi** – na wiele z nich Iskierka odpowiada osobnym żartem.
- **Warsztaty z łamigłówkami** (kwadratowe kółka na ścieżce):
  - *Płytka stykowa* – wkładasz opornik, diodę i kabelki w otwory, a obwód działa od razu.
  - *Wzorki świetlne* – zapalasz diody tak, żeby ułożyły obrazek (grupy przełączników albo ekran rzędy × kolumny).
  - *Zasil robota* – składasz baterie w szereg, aż napięcie się zgadza.
  - *Złóż opór* – dobierasz oporniki szeregowo albo równolegle.
  - *Kolorowy szyfr* – ustawiasz paski na oporniku.
  - *Multimetr, potencjometr, dobór opornika dla diody, bramki logiczne, bity.*
- **Motywacja:** iskry, seria dni, cel dnia, serduszka (z minigrą ładowania baterii), skrzynie z dodatkami,
  album 22 naklejek z ciekawostkami.

Teksty są neutralne płciowo. Postęp zapisuje się w przeglądarce (localStorage), gra niczego nie wysyła.

## Pliki

| Plik | Co zawiera |
| --- | --- |
| `index.html` | strona startowa |
| `style.css` | wygląd (jasny i ciemny motyw) |
| `js/etap1.js`, `js/etap2.js`, `js/etap3.js` | **treść kursu** — tu dopisuje się lekcje |
| `js/kit.js` | funkcje do tworzenia zadań |
| `js/game.js` | silnik gry: ścieżka, lekcje, etapy, profil |
| `js/ex-stage.js` | zadania: obliczenia, multimetr, potencjometr, kolejność, logika, bity |
| `js/ex-puzzle.js` | łamigłówki: płytka stykowa, wzorki, baterie, oporniki, kolory |
| `js/ex-build.js` | misje: obwody na obrazkach (potwór, skrzynia, słoik, robot, noc) |
| `js/circuit.js` | symulator i rysowanie obwodów |
| `js/art.js`, `js/art2.js` | wszystkie ilustracje (SVG rysowane kodem) |
| `js/sound.js` | dźwięki generowane na żywo |
| `js/pwa.js`, `sw.js`, `manifest.webmanifest`, `icons/` | instalacja jako aplikacja i tryb offline |

## Jak dopisać zadanie

W pliku etapu dodaj linijkę do tablicy `ex` wybranej lekcji, np.:

```js
tf('Miedź przewodzi prąd.', true, 'Miedź to jeden z najlepszych przewodników.'),
calc('Bateria 9 V, opornik 450 Ω. Jaki prąd (mA)?', 20, 'mA', 'I = U : R = 20 mA.'),
volts('Robot potrzebuje 6 V.', 6, [1.5, 1.5, 1.5, 1.5, 4.5], 'Cztery paluszki dają 6 V.'),
choice('Co świeci?', ['Żarówka', F('Księżyc w kieszeni', 'Piękne, ale kieszeń by się przepaliła!')], 0, 'Żarówka zamienia prąd w światło.'),
```

Lekcja z `ws: true` jest warsztatem. `F('tekst', 'żart')` tworzy śmieszną złą odpowiedź z komentarzem Iskierki.
Misje (`build`) są opisane na początku `js/ex-build.js`, pozostałe funkcje w `js/kit.js`.
