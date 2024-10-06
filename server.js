const express = require('express');
const axios = require('axios'); // HTTP istekleri için Axios modülü

const app = express();
const PORT = process.env.PORT || 3005;

// CollectAPI için API anahtarınızı buraya ekleyin
const API_KEY = '5nNXjSikL7rF3MeyOZMr5P:2QXNBgyVdwJlGT7JIdG7vB'; // CollectAPI'den aldığınız anahtar

// Süper Lig Puan Durumu Rotası: /superlig-puan-durumu
app.get('/superlig-puan-durumu', async (req, res) => {
    try {
        const data = await getSuperligTable();
        res.json(data);
    } catch (error) {
        console.error('Hata:', error.message);
        res.status(500).json({ error: 'Veri çekilemedi' });
    }
});

// Gelecek Maçlar Rotası: /superlig-gelecek-maclar
app.get('/superlig-gelecek-maclar', async (req, res) => {
    try {
        const data = await getUpcomingMatches();
        const upcomingMatches = data.filter(match => match.skor === 'undefined-undefined');
        res.json(upcomingMatches);
    } catch (error) {
        console.error('Hata:', error.message);
        res.status(500).json({ error: 'Veri çekilemedi' });
    }
});

app.get('/superlig-son-maclar', async (req, res) => {
    try {
        const data = await getUpcomingMatches();
        const pastMatches = data.filter(match => match.skor !== 'undefined-undefined');
        res.json(pastMatches);
    } catch (error) {
        console.error('Hata:', error.message);
        res.status(500).json({ error: 'Veri çekilemedi' });
    }
});

// CollectAPI'den Süper Lig puan durumu verilerini çekme
async function getSuperligTable() {
    try {
        const response = await axios.get('https://api.collectapi.com/football/league?data.league=super-lig', {
            headers: {
                'authorization': `apikey ${API_KEY}`,
                'content-type': 'application/json'
            }
        });

        const standings = response.data.result;
        return standings;
    } catch (error) {
        console.error('API Hatası:', error.message);
        throw new Error('Veri çekilemedi.');
    }
}

// CollectAPI'den Gelecek Maçlar verilerini çekme (Ligin kodu ile)
async function getUpcomingMatches() {
    try {
        const response = await axios.get('https://api.collectapi.com/football/results?data.league=super-lig', {
            headers: {
                'authorization': `apikey ${API_KEY}`,
                'content-type': 'application/json'
            }
        });

        const matches = response.data.result;
        return matches;
    } catch (error) {
        console.error('API Hatası:', error.message);
        throw new Error('Veri çekilemedi.');
    }
}

// Sunucuyu başlatma
app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
