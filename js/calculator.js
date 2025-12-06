let currentValue = '0';
let previousValue = '';
let operator = '';
let calculationHistory = [];
let waitingForNewValue = false;

const display = document.getElementById('calc-display');
const prevDisplay = document.getElementById('calc-prev');
const historyList = document.getElementById('history-list');

function updateDisplay() {
    display.value = currentValue;
    
    if (previousValue !== '' && operator !== '') {
        prevDisplay.textContent = `${previousValue} ${operator}`;
    } else {
        prevDisplay.textContent = '';
    }
}

function addDigit(digit) {
    if (waitingForNewValue) {
        currentValue = digit;
        waitingForNewValue = false;
    } else {
        if (currentValue === '0' && digit !== '.') {
            currentValue = digit;
        } else {
            currentValue = currentValue + digit;
        }
    }
    updateDisplay();
}

function addDecimal() {
    if (waitingForNewValue) {
        currentValue = '0.';
        waitingForNewValue = false;
    } else if (!currentValue.includes('.')) {
        currentValue = currentValue + '.';
    }
    updateDisplay();
}

function changeSign() {
    if (currentValue !== '0') {
        if (currentValue.startsWith('-')) {
            currentValue = currentValue.substring(1);
        } else {
            currentValue = '-' + currentValue;
        }
        updateDisplay();
    }
}

function addOperator(op) {
    if (currentValue === '') return;
    
    if (operator !== '' && previousValue !== '') {
        calculate();
    }
    
    operator = op;
    previousValue = currentValue;
    waitingForNewValue = true;
    updateDisplay();
}

function calculate() {
    if (previousValue === '' || operator === '' || currentValue === '') return;
    
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    let result;
    
    if (isNaN(prev) || isNaN(current)) return;
    
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
                alert('Ошибка: деление на ноль');
                clearAll();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Округляем результат
    result = Math.round(result * 1000000) / 1000000;
    
    const expression = `${previousValue} ${operator} ${currentValue}`;
    addToHistory(expression, result);
    
    currentValue = result.toString();
    previousValue = '';
    operator = '';
    waitingForNewValue = true;
    
    updateDisplay();
}

function percent() {
    const value = parseFloat(currentValue);
    if (isNaN(value)) return;
    
    let result;
    
    if (operator !== '' && previousValue !== '') {
        // Процент от предыдущего значения
        const prev = parseFloat(previousValue);
        result = prev * (value / 100);
    } else {
        // Просто процент
        result = value / 100;
    }
    
    const expression = operator !== '' ? 
        `${previousValue} ${operator} ${value}%` : 
        `${value}%`;
    
    addToHistory(expression, result);
    
    currentValue = result.toString();
    waitingForNewValue = true;
    updateDisplay();
}

function addToHistory(expression, result) {
    const historyItem = {
        expression: expression,
        result: result,
        time: new Date().toLocaleTimeString()
    };
    
    calculationHistory.unshift(historyItem);
    updateHistoryDisplay();
    updateStats();
}

function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<div class="history-item">История операций будет отображаться здесь</div>';
        return;
    }
    
    calculationHistory.slice(0, 10).forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div>${item.expression}</div>
            <div><strong>= ${item.result}</strong></div>
            <div style="font-size: 12px; color: #666;">${item.time}</div>
        `;
        historyList.appendChild(div);
    });
}

function updateStats() {
    const totalOperations = calculationHistory.length;
    let sumResults = 0;
    
    calculationHistory.forEach(item => {
        sumResults += item.result;
    });
    
    const averageResult = totalOperations > 0 ? sumResults / totalOperations : 0;
    
    document.getElementById('total-operations').textContent = totalOperations;
    document.getElementById('sum-results').textContent = sumResults.toFixed(2);
    document.getElementById('average-result').textContent = averageResult.toFixed(2);
}

function clearAll() {
    currentValue = '0';
    previousValue = '';
    operator = '';
    waitingForNewValue = false;
    updateDisplay();
}

function deleteLast() {
    if (waitingForNewValue) {
        return;
    }
    
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
    }
    updateDisplay();
}

function clearHistory() {
    if (calculationHistory.length === 0) return;
    
    if (confirm('Очистить историю вычислений?')) {
        calculationHistory = [];
        updateHistoryDisplay();
        updateStats();
    }
}

// Инициализация
updateDisplay();
updateHistoryDisplay();

// Поддержка клавиатуры
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        addDigit(key);
    } else if (key === '.') {
        addDecimal();
    } else if (key === '+') {
        addOperator('+');
    } else if (key === '-') {
        addOperator('-');
    } else if (key === '*') {
        addOperator('*');
    } else if (key === '/') {
        event.preventDefault();
        addOperator('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'Delete') {
        clearAll();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === '%') {
        percent();
    }
});