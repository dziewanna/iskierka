# Iskierka ⚡ — elektronika dla dzieci od 10 lat

Urocza gra edukacyjna w stylu kursów językowych z krótkimi lekcjami. Dziecko idzie ścieżką
lekcji z maskotką Iskierką, poznaje bohaterów-podzespoły (Baterię Basię, Żarówkę Zuzię,
Diodę Lenę…) i robi eksperymenty na żywych obwodach.

## Jak uruchomić

Kliknij dwa razy `index.html`. Gra działa w przeglądarce, bez instalacji i bez internetu
(z internetem wczytają się ładniejsze czcionki).

## Co jest w środku

- **5 rozdziałów, 16 lekcji, ponad 100 zadań:** prąd i bateria, bezpieczeństwo, obwód,
  przewodniki i izolatory, symbole i schematy, połączenia szeregowe i równoległe, zwarcie,
  opornik, dioda LED, prawo Ohma, brzęczyk i silniczek, czujniki, zielona energia.
- **8 rodzajów zadań:** karta wiedzy, wybór odpowiedzi, prawda/fałsz, pary, uzupełnianie zdań,
  sortowanie, eksperyment z obwodem, laboratorium „dobierz opornik”.
- **Prawdziwy symulator obwodów** (`js/circuit.js`): żarówki w szeregu świecą słabiej,
  zwarcie gasi żarówkę i grzeje baterię, dioda przewodzi w jedną stronę. Każdy obwód
  można przełączyć z obrazków na schemat.
- **Motywacja:** iskry (punkty), seria dni, cel dnia, serduszka (z minigrą ładowania baterii),
  skrzynie z dodatkami dla Iskierki, album naklejek z ciekawostkami.
- Błędne odpowiedzi wracają na końcu lekcji. Teksty są neutralne płciowo.
- Postęp zapisuje się w przeglądarce (localStorage). Gra niczego nie wysyła.

## Pliki

| Plik | Co zawiera |
| --- | --- |
| `index.html` | strona startowa |
| `style.css` | wygląd (jasny i ciemny motyw) |
| `js/lessons.js` | **treść kursu** — tu dopisuje się lekcje |
| `js/game.js` | silnik gry |
| `js/circuit.js` | symulator i rysowanie obwodów |
| `js/art.js` | wszystkie ilustracje (SVG rysowane kodem) |
| `js/sound.js` | dźwięki generowane na żywo |

## Jak dopisać zadanie

W `js/lessons.js` dodaj linijkę do tablicy `ex` wybranej lekcji, np.:

```js
tf('Miedź przewodzi prąd.', true, 'Miedź to jeden z najlepszych przewodników.'),
choice('Co świeci?', ['Żarówka', 'Gumka'], 0, 'Żarówka zamienia prąd w światło.'),
```

Na górze pliku jest opis wszystkich rodzajów zadań.
