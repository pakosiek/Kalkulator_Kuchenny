// --- 1. DANE (Baza wiedzy) ---
    
    // Lista składników i ich gęstość (g/ml)
    const ingredients = [
    { 
        id: "maka-pszenna", 
        density: 0.64, 
        nutrition: { kcal: 364, protein: 10, fat: 1, carbs: 76 }, 
        names: {pl: "Mąka pszenna", en: "Wheat flour", el: "αλεύρι σίτου"}
    },
    { 
        id: "jajko", 
        density: 1.03,
        hideInConverter: true, // bo nie przeliczymy jajka na litry albo szklanki to ukrywam
        nutrition: { kcal: 155, protein: 13, fat: 11, carbs: 1.1 }, 
        names: {pl: "Jajka", en: "Eggs", el: "Αυγά"}
    },
    { 
        id: "mleko", 
        density: 1.03, 
        nutrition: { kcal: 42, protein: 3.4, fat: 1.5, carbs: 5 }, 
        names: {pl: "Mleko", en: "Milk", el: "Γάλα"}
    },
    { 
        id: "oliwa", 
        density: 0.92, 
        nutrition: { kcal: 884, protein: 0, fat: 100, carbs: 0 }, 
        names: {pl: "Oliwa", en: "Olive Oil", el: "Ελαιόλαδο"}
    }
    // ... reszta składników ...
];

    // Definicje jednostek
    const units = {
        volume: [
            { id: 'ml', val: 1, names: { pl: 'Mililitry (ml)', en: 'Milliliters (ml)', el: 'ml' } },
            { id: 'tsp', val: 5, names: { pl: 'Łyżeczka (5ml)', en: 'Teaspoon', el: 'Κουταλάκι' } },
            { id: 'tbsp', val: 15, names: { pl: 'Łyżka (15ml)', en: 'Tablespoon', el: 'Κουταλιά' } },
            { id: 'cup', val: 250, names: { pl: 'Szklanka (250ml)', en: 'Cup', el: 'Φλιτζάνι' } }
        ],
        weight: [
            { id: 'g', val: 1, names: { pl: 'Gramy (g)', en: 'Grams (g)', el: 'παίζουμε' } },
            { id: 'kg', val: 1000, names: { pl: 'Kilogramy (kg)', en: 'Kilograms (kg)', el: 'Κιλά' } },
            { id: 'dag', val: 10, names: { pl: 'Dekagramy (dag)', en: 'Decagrams', el: 'dag' } }
        ]
    };

    // Tłumaczenia interfejsu
    const uiTranslations = {
        pl: { 
            titleConverter: 'Przelicznik Składników', lblIngredient: 'Wybierz składnik:', lblAmount: 'Ilość:', 
            lblUnitFrom: 'Z jednostki:', lblUnitTo: 'Na jednostkę:', 
            titlePortions: 'Zmiana liczby porcji', lblPortionsOrig: 'Stara liczba porcji:', lblPortionsNew: 'Nowa liczba porcji:', lblAmountRecipe: 'Ilość składnika:',
            resNeed: 'Potrzebujesz:',
            recipeTitle: 'Przepis: Naleśniki',
            lblPortionsCount: 'Liczba porcji:',
            nutrTitle: 'Wartości odżywcze (Całość):',
            nutrKcal: 'Kcal', nutrProtein: 'Białko', nutrFat: 'Tłuszcze', nutrCarbs: 'Węgle',
            nutrInfo: '* Wartości przybliżone'
        },
        en: { 
            titleConverter: 'Ingredient Converter', lblIngredient: 'Select ingredient:', lblAmount: 'Amount:', 
            lblUnitFrom: 'From unit:', lblUnitTo: 'To unit:', 
            titlePortions: 'Portion Scaler', lblPortionsOrig: 'Original portions:', lblPortionsNew: 'New portions:', lblAmountRecipe: 'Ingredient amount:',
            resNeed: 'You need:',
            recipeTitle: 'Recipe: Pancakes',
            lblPortionsCount: 'Servings:',
            nutrTitle: 'Nutrition Facts (Total):',
            nutrKcal: 'Kcal', nutrProtein: 'Protein', nutrFat: 'Fat', nutrCarbs: 'Carbs',
            nutrInfo: '* Approximate values'
        },
        el: { 
            titleConverter: 'Μετατροπέας Συστατικών', lblIngredient: 'Επιλέξτε συστατικό:', lblAmount: 'Ποσότητα:', 
            lblUnitFrom: 'Από μονάδα:', lblUnitTo: 'Σε μονάδα:', 
            titlePortions: 'Αλλαγή Μερίδων', lblPortionsOrig: 'Αρχικές μερίδες:', lblPortionsNew: 'Νέες μερίδες:', lblAmountRecipe: 'Ποσότητα υλικού:',
            resNeed: 'Χρειάζεστε:',
            recipeTitle: 'Συνταγή: Τηγανίτες',
            lblPortionsCount: 'Μερίδες:',
            nutrTitle: 'Διατροφικά Στοιχεία (Σύνολο):',
            nutrKcal: 'Θερμίδες', nutrProtein: 'Πρωτεΐνη', nutrFat: 'Λιπαρά', nutrCarbs: 'Υδατάνθρακες',
            nutrInfo: '* Κατά προσέγγιση'
        }
    };
    let currentLang = 'pl';

    // --- 2. LOGIKA I INICJALIZACJA ---

    const BASE_PORTIONS = 4; 

    function init() {
        populateSelects();
        setLanguage('pl');
        calculate();
        
    }

    function populateSelects() {
        const ingSelect = document.getElementById('ingredient-select');
        const unitFromSelect = document.getElementById('unit-from');
        const unitToSelect = document.getElementById('unit-to');

        ingSelect.innerHTML = '';
        unitFromSelect.innerHTML = '';
        unitToSelect.innerHTML = '';

        // Wypełnij składniki
        ingredients.forEach(ing => {
            if (ing.hideInConverter) return; 

            let opt = new Option(ing.names[currentLang], ing.id);
            opt.setAttribute('data-density', ing.density);
            ingSelect.add(opt);
        });

        // Wypełnij jednostki
        const allUnits = [...units.volume, ...units.weight];
        
        allUnits.forEach(u => {
            unitFromSelect.add(new Option(u.names[currentLang], u.id));
            unitToSelect.add(new Option(u.names[currentLang], u.id));
        });

        // Domyślne ustawienia
        unitFromSelect.value = 'cup'; 
        unitToSelect.value = 'g';   
    }

    function setLanguage(lang) {
        currentLang = lang;
        
        //1. Obsługa guzików
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // 2. Aktualizacja tekstów statycznych (UI)
        const t = uiTranslations[lang];
        
        // Sekcja górna
        document.getElementById('title-converter').innerText = t.titleConverter;
        document.getElementById('lbl-ingredient').innerText = t.lblIngredient;
        document.getElementById('lbl-amount').innerText = t.lblAmount;
        document.getElementById('lbl-unit-from').innerText = t.lblUnitFrom;
        document.getElementById('lbl-unit-to').innerText = t.lblUnitTo;
        
        // Sekcja dolna (Przepis i Makro) 
        document.getElementById('txt-recipe-title').innerText = t.recipeTitle;
        document.getElementById('lbl-portions-count').innerText = t.lblPortionsCount;
        document.getElementById('txt-nutr-title').innerText = t.nutrTitle;
        document.getElementById('txt-nutr-kcal').innerText = t.nutrKcal;
        document.getElementById('txt-nutr-protein').innerText = t.nutrProtein;
        document.getElementById('txt-nutr-fat').innerText = t.nutrFat;
        document.getElementById('txt-nutr-carbs').innerText = t.nutrCarbs;
        document.getElementById('txt-nutr-info').innerText = t.nutrInfo;

        //3. Logika aplikacji
        populateSelects();
        
        // Odśwież widok
        calculate();
        if (typeof updateRecipe === "function") updateRecipe();
        if (typeof translateRecipe === "function") translateRecipe();
    }

    // 3. ALGORYTM PRZELICZANIA

    function getUnitType(unitId) {
        if (units.volume.find(u => u.id === unitId)) return 'volume';
        if (units.weight.find(u => u.id === unitId)) return 'weight';
        return null;
    }

    function getUnitValue(unitId, type) {
        if (type === 'volume') return units.volume.find(u => u.id === unitId).val;
        if (type === 'weight') return units.weight.find(u => u.id === unitId).val;
        return 1;
    }

    function calculate() {
        const amount = parseFloat(document.getElementById('input-amount').value);
        const fromUnitId = document.getElementById('unit-from').value;
        const toUnitId = document.getElementById('unit-to').value;
        const ingredientId = document.getElementById('ingredient-select').value;
        
        if (isNaN(amount)) return;

        const ingredient = ingredients.find(i => i.id === ingredientId);
        const density = ingredient.density; 

        const fromType = getUnitType(fromUnitId);
        const toType = getUnitType(toUnitId);
        
        const fromVal = getUnitValue(fromUnitId, fromType); 
        const toVal = getUnitValue(toUnitId, toType);       

        let result = 0;
        let resultML = 0; 

        // KROK 1: Normalizacja do jednostki bazowej (ml lub g)
        let baseValue = amount * fromVal; 

        // KROK 2: Konwersja Fizyczna
        if (fromType === toType) {
            result = baseValue / toVal;
        } 
        // Objętość -> Masa (ml -> g)
        else if (fromType === 'volume' && toType === 'weight') {
            // Wzór: Masa = Objętość * Gęstość
            let grams = baseValue * density;
            result = grams / toVal;
        } 
        // Masa -> Objętość (g -> ml)
        else if (fromType === 'weight' && toType === 'volume') {
            // Wzór: Objętość = Masa / Gęstość
            let ml = baseValue / density;
            result = ml / toVal;
        }

        // Wyświetlanie
        const resLabel = uiTranslations[currentLang].resNeed;
        const unitName = document.getElementById('unit-to').options[document.getElementById('unit-to').selectedIndex].text;
        
        // Zaokrąglanie do 2 miejsc po przecinku, ale jeśli liczba całkowita to bez zer
        let displayedResult = parseFloat(result.toFixed(2));
        
        document.getElementById('result-display').innerText = `${amount} ... = ${displayedResult} ${unitName}`;
    }

    // 4. ALGORYTM PORCJI
    function changePortions(delta) {
        const input = document.getElementById('recipe-portions');
        let val = parseInt(input.value) || 0;
        val += delta;
        if (val < 1) val = 1;
        input.value = val;
        updateRecipe();
    }

    // Główna logika skalowania przepisu
    function updateRecipe() {
        const input = document.getElementById('recipe-portions');
        const newPortions = parseFloat(input.value);
        if (!newPortions || newPortions <= 0) return;
        const ratio = newPortions / BASE_PORTIONS;
        const qtyElements = document.querySelectorAll('.qty');

        qtyElements.forEach(el => {
            const baseAmount = parseFloat(el.getAttribute('data-base'));
            let newAmount = baseAmount * ratio;
            if (newAmount % 1 !== 0) newAmount = parseFloat(newAmount.toFixed(2)); 
            el.innerText = newAmount;
        });

        calculateNutrition();
    }
    // FUNKCJA LICZĄCA WARTOŚCI ODŻYWCZE
    function calculateNutrition() {
        let total = { kcal: 0, protein: 0, fat: 0, carbs: 0 };

        const items = document.querySelectorAll('.recipe-item');

        items.forEach(item => {
            const id = item.getAttribute('data-id');
            const unit = item.getAttribute('data-unit');
            
            const qtySpan = item.querySelector('.qty');
            const currentAmount = parseFloat(qtySpan.innerText);

            const product = ingredients.find(i => i.id === id);
            
            if (product && product.nutrition) {
                let weightInGrams = 0;

                if (unit === 'g') {
                    weightInGrams = currentAmount;
                } else {
                    
                    let unitVol = 1; 
                    if (unit === 'tbsp') unitVol = 15;
                    if (unit === 'tsp') unitVol = 5;
                    if (unit === 'cup') unitVol = 250;
                    if (unit === 'ml') unitVol = 1;

                    const volumeML = currentAmount * unitVol;
                    
                    weightInGrams = volumeML * product.density;
                }

                const factor = weightInGrams / 100;

                total.kcal += product.nutrition.kcal * factor;
                total.protein += product.nutrition.protein * factor;
                total.fat += product.nutrition.fat * factor;
                total.carbs += product.nutrition.carbs * factor;
            }
        });

        document.getElementById('total-kcal').innerText = Math.round(total.kcal);
        document.getElementById('total-protein').innerText = Math.round(total.protein);
        document.getElementById('total-fat').innerText = Math.round(total.fat);
        document.getElementById('total-carbs').innerText = Math.round(total.carbs);
    }
    function translateRecipe() {
        
        const items = document.querySelectorAll('.recipe-item');

        items.forEach(item => {
            const id = item.getAttribute('data-id');
            const unitCode = item.getAttribute('data-unit');
            
            const product = ingredients.find(i => i.id === id);
            if (product) {
                const nameSpan = item.querySelector('.ing-name');
                if (nameSpan) nameSpan.innerText = product.names[currentLang];
            }

            const allUnits = [...units.volume, ...units.weight];
            const unitData = allUnits.find(u => u.id === unitCode);
            
            if (unitData) {
                const unitSpan = item.querySelector('.unit-name');
                if (unitSpan && unitCode !== 'g' && unitCode !== 'ml') {
                     if(currentLang === 'en') {
                         if(unitCode === 'tbsp') unitSpan.innerText = 'tablespoons';
                         if(unitCode === 'tsp') unitSpan.innerText = 'tsp';
                         if(unitCode === 'cup') unitSpan.innerText = 'cup';
                     } else if (currentLang === 'el') {
                         if(unitCode === 'tbsp') unitSpan.innerText = 'κουτάλια ';
                         if(unitCode === 'cup') unitSpan.innerText = 'φλιτζ.';
                     } else {
                         if(unitCode === 'tbsp') unitSpan.innerText = 'łyżki';
                         if(unitCode === 'cup') unitSpan.innerText = 'szklanki';
                     }
                }
            }
        });

        document.querySelectorAll('.dynamic-note').forEach(note => {
            const text = note.getAttribute(`data-${currentLang}`);
            if (text) {
                note.innerText = text;
            }
        });
    }
    // Start
    init();