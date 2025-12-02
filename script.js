// Переменные состояния
let display = '0';
let previousValue = '';
let operator = null;
let shouldResetDisplay = false;
let history = [];
let results = [];

const displayElement = document.getElementById('display');
const prevDisplayElement = document.getElementById('prevDisplay');
const historyListElement = document.getElementById('historyList');

// Добавление числа на дисплей
function appendNumber(num) {
    if (shouldResetDisplay) {
        display = num;
        shouldResetDisplay = false;
    } else {
        if (display === '0' && num !== '.') {
            display = num;
        } else if (num === '.' && display.includes('.')) {
            return;
        } else {
            display += num;
        }
    }
    updateDisplay();
}

// Добавление оператора
function appendOperator(op) {
    if (previousValue === '') {
        previousValue = display;
    } else if (!shouldResetDisplay && operator !== null) {
        calculate();
    }
    operator = op;
    shouldResetDisplay = true;
    updateDisplay();
}

// Вычисление результата
function calculate() {
    if (operator === null || shouldResetDisplay) {
        return;
    }

    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(display);

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Ошибка: деление на ноль!');
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = (prev * current) / 100;
            break;
        default:
            return;
    }

    // Формирование записи в историю
    const formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
    const historyEntry = `${previousValue} ${operator} ${display} = ${formattedResult}`;
    history.push(historyEntry);
    results.push(result);

    // Обновление дисплея
    display = formattedResult.toString();
    previousValue = '';
    operator = null;
    shouldResetDisplay = true;

    updateDisplay();
    updateHistory();
    updateAnalytics();
}

// Очистка дисплея
function clearAll() {
    display = '0';
    previousValue = '';
    operator = null;
    shouldResetDisplay = false;
    prevDisplayElement.textContent = '';
    updateDisplay();
}

// Обновление дисплея
function updateDisplay() {
    displayElement.textContent = display;
    if (operator) {
        prevDisplayElement.textContent = `${previousValue} ${operator}`;
    }
}

// Обновление истории
function updateHistory() {
    if (history.length === 0) {
        historyListElement.innerHTML = '<div class="history-empty">История пуста</div>';
        return;
    }

    historyListElement.innerHTML = history
        .slice()
        .reverse()
        .map((item, index) => {
            return `<div class="history-item" onclick="useHistory(${history.length - 1 - index})">${item}</div>`;
        })
        .join('');
}

// Использование значения из истории
function useHistory(index) {
    const entry = history[index];
    const result = entry.split(' = ')[1];
    display = result;
    previousValue = '';
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Очистка истории
function clearHistory() {
    if (confirm('Вы уверены, что хотите очистить всю историю?')) {
        history = [];
        results = [];
        historyListElement.innerHTML = '<div class="history-empty">История пуста</div>';
        updateAnalytics();
    }
}

// Обновление аналитики
function updateAnalytics() {
    if (results.length === 0) {
        return;
    }

    const total = results.length;
    const sum = results.reduce((a, b) => a + b, 0);
    const avg = (sum / total).toFixed(2);
    const max = Math.max(...results).toFixed(2);
    const min = Math.min(...results).toFixed(2);
}

// Инициализация
updateDisplay();
