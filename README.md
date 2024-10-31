Bibliai Vers Megjelenítő
Ez az alkalmazás egy bibliai verset jelenít meg naponta egyszer. A megjelenített vers a data.json fájlban található hivatkozásokból kerül kiválasztásra, és a szentiras.hu API-ját használja a vers szövegének lekéréséhez.

Előkészületek 🚀
Node.js és npm telepítése: Győződj meg róla, hogy a gépeden telepítve van a Node.js 16 vagy újabb verziója és az npm (Node Package Manager). A telepítés módja az operációs rendszered függvénye (lásd: Node.js hivatalos weboldal).

Függőségek telepítése: Klónozd le a projektet, majd navigálj a projekt könyvtárába a terminálon/parancssoron keresztül. Telepítsd a szükséges függőségeket a package.json fájl alapján:

npm install

data.json fájl: A data.json fájl tartalmazza a bibliai versek hivatkozásait. Ez a fájl JSON formátumban van, és minden vers egy objektumként van reprezentálva egy egyedi azonosítóval (id) és egy hivatkozással (reference):

[
    {"id": 1, "reference": "Jn3,16-17"},
    {"id": 2, "reference": "1Kor13,4-7"},
    // ... több vers ...
]

Ha más verseket szeretnél megjeleníteni, módosítsd ezt a fájlt. A reference mezőbe írd be a szentiras.hu API által elfogadható bibliai vers hivatkozást.

landscape_sunset.jpg háttérkép: A HTML fájl egy háttérképet használ. Cseréld le a landscape_sunset.jpg elérési útját a saját képfájlra. Győződj meg róla, hogy a fájl a megfelelő helyen van, vagy módosítsd az elérési utat a index_2.0.html fájlban.

log.json fájl: Ez a fájl a legutóbb megjelenített vers adatait tárolja (azonosító és dátum). Ez automatikusan jön létre, ha a szerver elindul először.

Szerver futtatása ⚙️
Indítsd el a szervert: A projekt könyvtárában futtasd a következő parancsot a terminálon/parancssoron:

node app.js

Nyisd meg a böngészőben: Nyisd meg a index_2.0.html fájlt egy webböngészőben. Alapértelmezésben a http://localhost:5000 címen érhető el.

Működés 💡
Az alkalmazás naponta egyszer kér be egy új bibliai verset. A log.json fájl tárolja az utoljára megjelenített vers azonosítóját és dátumát. A szerver ezt ellenőrzi minden kérésnél. Ha új nap van, véletlenszerűen választ egy verset a data.json fájlból, aminek az azonosítója nagyobb az előzőnél, és a szentiras.hu API-ját használja a vers szövegének lekéréséhez. Ellenkező esetben, visszaküldi a log.json-ban tárolt verset.

Lehetséges hibák és megoldásaik ⚠️
Hiba a vers lekérése közben: Ellenőrizd az internetkapcsolatodat, és hogy a szentiras.hu API elérhető-e.

Hiba a data.json fájl olvasásakor: Ellenőrizd, hogy a data.json fájl létezik, és helyes a formátuma.

log.json problémák: A log.json fájl törlése megoldhatja a dátummal kapcsolatos problémákat, de a program újrakezdi a versválasztást az első versetől.

Időzóna probléma: A szerver helyes időzónájának beállítása elengedhetetlen. Ellenőrizd az app.js fájlt, a moment().tz() függvényben a helyes időzónát kell megadni (pl. 'Europe/Budapest', vagy 'UTC').

Jó olvasgatást! 🙏
