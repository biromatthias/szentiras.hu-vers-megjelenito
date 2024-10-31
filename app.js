const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const moment = require('moment-timezone');

const app = express();
const port = process.env.PORT || 5000; // Port beállítása (környezeti változó vagy 5000)

app.use(cors());

// Bibliai versek hivatkozásainak betöltése a JSON fájlból
function loadVerseReferences() {
    const filePath = 'data.json';
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`HIBA: A ${filePath} fájl nem található.`);
            return [];
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        if (!content.trim()) {
            console.warn(`FIGYELMEZTETÉS: A ${filePath} fájl üres.`);
            return [];
        }

        const data = JSON.parse(content);
        if (!Array.isArray(data)) {
            console.error(`HIBA: A ${filePath} fájl tartalma nem lista formátumú.`);
            return [];
        }

        if (!data.length) {
            console.warn(`FIGYELMEZTETÉS: A ${filePath} fájl nem tartalmaz hivatkozásokat.`);
        }

        return data;
    } catch (error) {
        console.error(`HIBA: Hiba történt a ${filePath} fájl olvasásakor: ${error}`);
        return [];
    }
}

// Log fájl kezelése
const logFilePath = 'log.json';

function loadLog() {
    try {
        if (!fs.existsSync(logFilePath)) {
            return { lastVerseId: 0, lastRequestDate: new Date().toISOString() }; // Új log fájl létrehozása
        }
        const content = fs.readFileSync(logFilePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`HIBA: Hiba történt a log fájl olvasásakor: ${error}`);
        return { lastVerseId: 0, lastRequestDate: new Date().toISOString() }; // Alapértelmezett értékek hiba esetén
    }
}

function saveLog(verseId) {
    const now = moment().tz('Europe/Budapest'); // a szerver időzónája
    const logData = {
        lastVerseId: verseId,
        lastRequestDate: now.toISOString()
    };
    fs.writeFileSync('log.json', JSON.stringify(logData, null, 2));
}

const verseReferences = loadVerseReferences();

function cleanHtml(text) {
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<[^>]+>/g, '');
    return text.trim();
}

async function getVerse(reference, translation = 'SZIT') {
    const url = `https://szentiras.hu/api/idezet/${reference}/${translation}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        const verses = data.valasz.versek;

        const title = verses[0].szoveg.includes('<em>')
            ? cleanHtml(verses[0].szoveg.split('\n')[0])
            : '';

        const fullText = verses.map(verse => cleanHtml(verse.szoveg)).join('\n');

        const cleanedText = title ? fullText.replace(title, '').trim() : fullText;

        return {
            title: title,
            text: cleanedText,
            reference: verses[0].hely.szep,
            translation: data.valasz.forditas.nev
        };

    } catch (error) {
        console.error(`HIBA: Nem sikerült lekérni a verset: ${error}`);
        return null;
    }
}

app.get('/verse', async (req, res) => {
    if (!verseReferences.length) {
        return res.status(500).json({ error: "Nincsenek betöltve bibliai vers hivatkozások. Kérem, ellenőrizze a data.json fájlt." });
    }

    const log = loadLog();
    const now = new Date();
    const lastRequest = new Date(log.lastRequestDate);

    let verseId;
    if (now.getDate() !== lastRequest.getDate()) { // Új nap
        verseId = (log.lastVerseId + 1) % verseReferences.length; // Körbejárás
    } else {
        verseId = log.lastVerseId;
    }

    const verseData = verseReferences[verseId];
    const verse = await getVerse(verseData.reference, 'SZIT');


    if (verse) {
        saveLog(verseId);
        res.json(verse);
    } else {
        res.status(500).json({ error: "Nem sikerült verset lekérni. Kérem, ellenőrizze a naplófájlokat további információkért." });
    }
});


app.listen(port, () => {
    console.log(`A szerver fut a ${port} porton.`);
});