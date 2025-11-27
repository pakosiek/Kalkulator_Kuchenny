To jest świetny pomysł. Profesjonalna dokumentacja (`README.md`) w repozytorium to znak dla klienta: *"Ten gość nie tylko napisał kod, ale dba o to, żeby łatwo się go używało"*. To też ułatwi sprawę jego programiście, który będzie to wpinał.

Przygotowałem dla Ciebie treść pliku `README.md`. Jest sformatowana w Markdown (standard dla GitHub).

### Co musisz zrobić:

1.  Otwórz plik `README.md` w swoim edytorze kodu (VS Code).
2.  Skasuj wszystko, co tam jest.
3.  Wklej poniższą treść.
4.  Zapisz i wyślij na GitHuba (komendy na dole).

-----

### Treść do wklejenia do `README.md`:

````markdown
# 🍳 Kalkulator Kuchenny & Skaler Porcji (Kitchen Converter)

Kompletne, lekkie rozwiązanie JavaScript do przeliczania jednostek kuchennych, skalowania przepisów i obliczania wartości odżywczych. Aplikacja obsługuje 3 języki (PL, EN, GR) oraz uwzględnia specyfikę produktów (gęstość).

## 🚀 Możliwości (Features)

* **Inteligentny Przelicznik:** Zamiana Wagi (g) na Objętość (ml, szklanki, łyżki) z wykorzystaniem gęstości produktu (np. 1 szklanka mąki ≠ 1 szklanka cukru).
* **Skalowanie Przepisów:** Automatyczne przeliczanie ilości składników w przepisie po zmianie liczby porcji.
* **Wielojęzyczność:** Pełne tłumaczenie interfejsu (Polski, Angielski, Grecki).
* **Poprawna Gramatyka:** Obsługa odmiany jednostek przez przypadki (np. 1 szklanka, 2 szklanki, 5 szklanek).
* **Kalkulator Kalorii:** (Opcjonalnie) Dynamiczne sumowanie makroskładników (Kcal, Białko, Tłuszcze, Węglowodany).

---

## 💻 Jak wdrożyć na stronę? (Integration Guide)

Aplikacja nie wymaga żadnych frameworków (React/Vue/Angular) – jest napisana w czystym JavaScript (Vanilla JS), dzięki czemu działa na każdej stronie (WordPress, Wix, Custom HTML).

### Krok 1: Pliki
Skopiuj pliki `style.css` oraz `Aplikacja.js` do folderu swojej strony.

### Krok 2: Import w sekcji `<head>`
Dodaj styl CSS w nagłówku strony:
```html
<link rel="stylesheet" href="style.css">
````

### Krok 3: Struktura HTML

Wklej kontener przelicznika w miejscu, gdzie ma się wyświetlać (kod z pliku `index.html` wewnątrz `<body>`).

### Krok 4: Import Skryptu

Na samym końcu strony (przed zamknięciem `</body>`) dodaj skrypt:

```html
<script src="Aplikacja.js"></script>
```

-----

## ⚙️ Konfiguracja i Zarządzanie Danymi

Wszystkie dane znajdują się na początku pliku `Aplikacja.js`.

### 1\. Dodawanie nowych produktów (`ingredients`)

Aby dodać produkt, dopisz nowy obiekt do tablicy `ingredients`.

**Ważne:** Parametr `density` (gęstość) jest kluczowy dla poprawnych przeliczeń.
*Wzór:* Waga pełnej szklanki (250ml) podzielona przez 250.

```javascript
{ 
    id: "nowy-produkt",      // Unikalne ID (używane w HTML)
    density: 0.6,            // Gęstość (np. 1ml waży 0.6g)
    hideInConverter: false,  // Czy ukryć w górnym przeliczniku? (np. Jajka = true)
    nutrition: {             // Wartości na 100g
        kcal: 364, 
        protein: 10, 
        fat: 1, 
        carbs: 76 
    }, 
    names: {
        pl: "Mąka",                 // Nazwa podstawowa
        pl_recipe: "Mąki",          // Nazwa w dopełniaczu (do przepisu: 200g Mąki)
        en: "Flour", 
        el: "Αλεύρι"
    }
}
```

### 2\. Tworzenie Przepisu (HTML)

Skrypt automatycznie wykrywa składniki w liście, jeśli posiadają odpowiednie atrybuty `data`.

Przykład wiersza przepisu:

```html
<li class="recipe-item" data-id="maka-pszenna" data-unit="g">
    <span class="qty" data-base="200">200</span> 
    
    <span class="unit-name">g</span> 
    
    <span class="ing-name">Mąki pszennej</span>
</li>
```

  * `data-id`: Musi pasować do `id` w pliku JS.
  * `data-unit`: Jednostka (g, ml, cup, tbsp, tsp).
  * `data-base`: Ilość składnika dla wyjściowej liczby porcji.

-----

## 🌍 Tłumaczenia i Gramatyka

  * **Interfejs:** Teksty statyczne (nagłówki, etykiety) edytujesz w obiekcie `uiTranslations`.
  * **Odmiana jednostek:** Zasady odmiany (np. łyżka/łyżki/łyżek) znajdują się w obiekcie `unitDeclensions`.

-----

Autor: Damian Pakosiński
