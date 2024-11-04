const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware для обработки JSON с увеличением лимита размера
app.use(express.json({ limit: '10mb' }));

// Указываем папку с файлами для выдачи статических файлов
app.use(express.static(path.join(__dirname, 'public')));

const cardsFilePath = './cards.json';

// Чтение карточек из файла
app.get('/api/cards', (req, res) => {
    fs.readFile(cardsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }
        res.json(JSON.parse(data));
    });
});

// Добавление новой карточки
app.post('/api/cards', (req, res) => {
    const newCard = req.body;

    fs.readFile(cardsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }
        
        const cards = JSON.parse(data);
        cards.push(newCard);

        fs.writeFile(cardsFilePath, JSON.stringify(cards, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка записи файла' });
            }
            res.json(newCard);
        });
    });
});

// Удаление карточки
app.delete('/api/cards/:title', (req, res) => {
    const cardTitle = req.params.title;

    fs.readFile(cardsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }
        
        let cards = JSON.parse(data);
        cards = cards.filter(card => card.title !== cardTitle);

        fs.writeFile(cardsFilePath, JSON.stringify(cards, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка записи файла' });
            }
            res.json({ message: 'Карточка удалена' });
        });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});