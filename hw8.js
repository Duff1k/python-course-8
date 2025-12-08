let currentInput = '';
const displayEl = document.getElementById('display');
const historyEl = document.getElementById('history');

function updateDisplay() {
    displayEl.textContent = currentInput || '0';
}

function addDigit(digit) {
    if (currentInput === '0') {
        currentInput = String(digit);
    } else {
        currentInput += String(digit);
    }
    updateDisplay();
}

function addOperation(operation) {
    if (currentInput === '') return;

    if (['+', '-', '*', '/'].includes(currentInput.slice(-1))) {
        currentInput = currentInput.slice(0, -1) + operation;
    } else {
        currentInput += operation;
    }
    updateDisplay();
}

function addDecimal() {
    if (currentInput === '') {
        currentInput = '0.';
    } else if (!currentInput.includes('.') && !currentInput.match(/[+\-*/]$/)) {
        currentInput += '.';
    }
    updateDisplay();
}

function changeSign() {
    if (currentInput === '') return;

    if (currentInput.startsWith('-')) {
        currentInput = currentInput.substring(1);
    } else {
        currentInput = '-' + currentInput;
    }
    updateDisplay();
}

function percentage() {
    if (currentInput === '') return;

    try {
        const result = eval(currentInput) / 100;
        currentInput = String(result);
        updateDisplay();
    } catch {
        displayEl.textContent = 'Error';
        currentInput = '';
    }
}

function calculate() {
    if (currentInput === '') return;

    try {
        const result = eval(currentInput);
        saveCalculation(currentInput, result);
        currentInput = String(result);
        updateDisplay();
    } catch {
        displayEl.textContent = 'Error';
        currentInput = '';
    }
}

function saveCalculation(expression, result) {
    const now = new Date();
    const timestamp = `[${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;

    const operation = `${timestamp} ${expression} = ${result}`;

    const historyItems = historyEl.textContent.split('\n').filter(item => item.trim());
    historyItems.unshift(operation);

    if (historyItems.length > 20) {
        historyItems.pop();
    }

    historyEl.textContent = historyItems.join('\n');
}

function clearAll() {
    currentInput = '';
    updateDisplay();
}

function clearEntry() {
    if (currentInput) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }
}

function clearHistory() {
    historyEl.textContent = '';
}