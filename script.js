let currentInput = '0';
let firstOperand = null;
let operator = null;
let shouldResetInput = false;
let history = [];

const displayEl = document.getElementById('display');
const prevExpressionEl = document.getElementById('prev-expression');
const historyListEl = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

const statTotalEl = document.getElementById('statTotal');
const statLastEl = document.getElementById('statLast');
const statMinEl = document.getElementById('statMin');
const statMaxEl = document.getElementById('statMax');
const statAvgEl = document.getElementById('statAvg');

function updateDisplay() {
    displayEl.value = currentInput;
}

function appendDigit(digit) {
    if (shouldResetInput) {
        currentInput = digit;
        shouldResetInput = false;
    } else {
        if (currentInput === '0') {
            currentInput = digit;
        } else {
            currentInput += digit;
        }
    }
    updateDisplay();
}

function appendDot() {
    if (shouldResetInput) {
        currentInput = '0.';
        shouldResetInput = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function toggleSign() {
    if (currentInput === '0') return;
    if (currentInput.startsWith('-')) {
        currentInput = currentInput.slice(1);
    } else {
        currentInput = '-' + currentInput;
    }
    updateDisplay();
}

function applyPercent() {
    const value = parseFloatSafe(currentInput);
    currentInput = (value / 100).toString();
    updateDisplay();
}

function setOperator(nextOperator) {
    const inputValue = parseFloatSafe(currentInput);

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (!shouldResetInput) {
        const result = performCalculation(firstOperand, inputValue, operator);
        addToHistory(`${firstOperand} ${operator} ${inputValue}`, result);
        firstOperand = result;
        currentInput = result.toString();
        updateDisplay();
    }

    operator = nextOperator;
    prevExpressionEl.textContent = `${firstOperand} ${operator}`;
    shouldResetInput = true;
}

function calculate() {
    if (operator === null || firstOperand === null) return;

    const secondOperand = parseFloatSafe(currentInput);
    const result = performCalculation(firstOperand, secondOperand, operator);

    const expression = `${firstOperand} ${operator} ${secondOperand}`;
    addToHistory(expression, result);

    currentInput = result.toString();
    firstOperand = null;
    operator = null;
    prevExpressionEl.textContent = `${expression} =`;
    shouldResetInput = true;
    updateDisplay();
}

function performCalculation(a, b, op) {
    let result;
    switch (op) {
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '*':
            result = a * b;
            break;
        case '/':
            if (b === 0) {
                alert('Деление на ноль невозможно');
                return a;
            }
            result = a / b;
            break;
        default:
            result = b;
    }
    return parseFloat(result.toFixed(10));
}

function clearAll() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    shouldResetInput = false;
    prevExpressionEl.textContent = '';
    updateDisplay();
}

function parseFloatSafe(value) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
}

function addToHistory(expression, result) {
    const record = {
        expression,
        result,
        timestamp: new Date()
    };
    history.push(record);
    renderHistory();
    updateAnalytics();
}

function renderHistory() {
    historyListEl.innerHTML = '';

    if (history.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'История пока пуста';
        p.className = 'history-empty';
        historyListEl.appendChild(p);
        return;
    }

    history.slice().reverse().forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';

        const expr = document.createElement('div');
        expr.className = 'history-item-expression';
        expr.textContent = item.expression;

        const res = document.createElement('div');
        res.className = 'history-item-result';
        res.textContent = '= ' + item.result;

        div.appendChild(expr);
        div.appendChild(res);

        div.addEventListener('click', () => {
            currentInput = item.result.toString();
            updateDisplay();
        });

        historyListEl.appendChild(div);
    });
}

function clearHistory() {
    history = [];
    renderHistory();
    updateAnalytics();
}

function updateAnalytics() {
    const total = history.length;
    statTotalEl.textContent = total;

    if (total === 0) {
        statLastEl.textContent = '—';
        statMinEl.textContent = '—';
        statMaxEl.textContent = '—';
        statAvgEl.textContent = '—';
        return;
    }

    const results = history.map(h => h.result);
    const last = results[results.length - 1];
    const min = Math.min(...results);
    const max = Math.max(...results);
    const avg = results.reduce((sum, v) => sum + v, 0) / results.length;

    statLastEl.textContent = last;
    statMinEl.textContent = min;
    statMaxEl.textContent = max;
    statAvgEl.textContent = parseFloat(avg.toFixed(4));
}

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const num = btn.dataset.num;
    const op = btn.dataset.op;
    const action = btn.dataset.action;

    if (num !== undefined) {
        appendDigit(num);
    } else if (op !== undefined) {
        setOperator(op);
    } else if (action) {
        switch (action) {
            case 'clear':
                clearAll();
                break;
            case 'dot':
                appendDot();
                break;
            case 'equal':
                calculate();
                break;
            case 'sign':
                toggleSign();
                break;
            case 'percent':
                applyPercent();
                break;
        }
    }
});

clearHistoryBtn.addEventListener('click', clearHistory);

document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key >= '0' && key <= '9') {
        appendDigit(key);
    } else if (key === '.' || key === ',') {
        e.preventDefault();
        appendDot();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        setOperator(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        clearAll();
    } else if (key === '%') {
        applyPercent();
    }
});

updateDisplay();
renderHistory();
updateAnalytics();
