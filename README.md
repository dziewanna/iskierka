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

## Rodzaje zadań

- **Nauka:** karta wiedzy, wybór odpowiedzi, prawda/fałsz, pary, uzupełnianie zdań, sortowanie,
  układanie kolejności, obliczenia z klawiaturą kalkulatora.
- **Eksperymenty na żywych obwodach** (`js/circuit.js` naprawdę je przelicza): żarówki w szeregu świecą słabiej,
  zwarcie grzeje baterię, dioda działa w jedną stronę, woltomierz i amperomierz pokazują prawdziwe wartości,
  tranzystor zapala diodę, gdy zasłonisz czujnik światła. Każdy obwód da się przełączyć na schemat.
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
| `js/circuit.js` | symulator i rysowanie obwodów |
| `js/art.js`, `js/art2.js` | wszystkie ilustracje (SVG rysowane kodem) |
| `js/sound.js` | dźwięki generowane na żywo |

## Jak dopisać zadanie

W pliku etapu dodaj linijkę do tablicy `ex` wybranej lekcji, np.:

```js
tf('Miedź przewodzi prąd.', true, 'Miedź to jeden z najlepszych przewodników.'),
calc('Bateria 9 V, opornik 450 Ω. Jaki prąd (mA)?', 20, 'mA', 'I = U : R = 20 mA.'),
volts('Robot potrzebuje 6 V.', 6, [1.5, 1.5, 1.5, 1.5, 4.5], 'Cztery paluszki dają 6 V.'),
```

Lekcja z `ws: true` jest warsztatem. Wszystkie funkcje są opisane w `js/kit.js`.
