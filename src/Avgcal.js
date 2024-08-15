import React, { useState } from 'react';

// Static data for different number types
const staticData = {
    'p': [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
    'f': [0, 1, 1, 2, 3, 5, 8, 13, 21, 34],
    'e': [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    'r': [9, 7, 5, 2, 8, 3, 1, 6, 4, 10]
};

function AverageCalculator() {
    const [numberId, setNumberId] = useState('p');
    const [response, setResponse] = useState({
        windowPrevState: [],
        windowCurrState: [],
        numbers: [],
        avg: 0
    });
    const [numbersWindow, setNumbersWindow] = useState([]);

    const fetchData = () => {
        const fetchedNumbers = staticData[numberId] || [];
        const newNumbers = fetchedNumbers.filter(num => !numbersWindow.includes(num));
        
        // Update the window state
        const updatedNumbersWindow = [...numbersWindow, ...newNumbers];
        if (updatedNumbersWindow.length > 10) {
            updatedNumbersWindow.splice(0, updatedNumbersWindow.length - 10);
        }
        
        setNumbersWindow(updatedNumbersWindow);

        // Update the response
        setResponse({
            windowPrevState: numbersWindow,
            windowCurrState: updatedNumbersWindow,
            numbers: newNumbers,
            avg: calculateAverage(updatedNumbersWindow)
        });
    };

    const calculateAverage = (numbers) => {
        if (numbers.length === 0) return 0;
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        return parseFloat((sum / numbers.length).toFixed(2));
    };

    return (
        <div>
            <h1>Average Calculator</h1>
            <label>
                Select number type:
                <select value={numberId} onChange={(e) => setNumberId(e.target.value)}>
                    <option value="p">Prime</option>
                    <option value="f">Fibonacci</option>
                    <option value="e">Even</option>
                    <option value="r">Random</option>
                </select>
            </label>
            <button onClick={fetchData}>Calculate Average</button>

            {response && (
                <div>
                    <h2>Response</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default AverageCalculator;
