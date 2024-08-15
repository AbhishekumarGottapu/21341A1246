const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const WINDOW_SIZE = 10;
let numberWindow = [];

const API_ENDPOINTS = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/rand',
};

function calculateAverage(numbers) {
    if (!numbers.length) return 0.00;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return parseFloat((sum / numbers.length).toFixed(2));
}

app.get('/numbers/:number_id', async (req, res) => {
    const numberId = req.params.number_id;

    if (!API_ENDPOINTS[numberId]) {
        return res.status(400).json({ error: "Invalid number ID. Use 'p', 'f', 'e', or 'r'." });
    }

    const previousState = [...numberWindow];

    try {
        const response = await axios.get(API_ENDPOINTS[numberId], { timeout: 500 });
        const fetchedNumbers = response.data.numbers;

        const uniqueFetchedNumbers = fetchedNumbers.filter(num => !numberWindow.includes(num));

        for (const num of uniqueFetchedNumbers) {
            if (numberWindow.length >= WINDOW_SIZE) {
                numberWindow.shift();
            }
            numberWindow.push(num);
        }

        const currentState = [...numberWindow];
        const average = calculateAverage(numberWindow);

        res.json({
            windowPrevState: previousState,
            windowCurrState: currentState,
            numbers: fetchedNumbers,
            avg: average
        });
    } catch (error) {
        res.json({
            windowPrevState: previousState,
            windowCurrState: numberWindow,
            numbers: [],
            avg: calculateAverage(numberWindow)
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
