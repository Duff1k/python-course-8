// Основные переменные калькулятора
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;
let calculationHistory = [];

// Элементы DOM
const displayElement = document.getElementById('display');
const expressionElement = document.getElementById('expression');
const historyListElement = document.getElementById('history-list');
const totalOperationsElement = document.getElementById('total-operations');
const sumResultsElement = document.getElementById('sum-results');
const averageResultElement = document.getElementById('average-result');
const maxResultElement = document.getElementById('max-result');
const fileInfoElement = document.getElementById('file-info');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    updateDisplay();
    updateStats();
    updateFileInfo();
    
    // Добавляем поддержку клавиатуры
    document.addEventListener('keydown', handleKeyboardInput);
});

// === ОСНОВНЫЕ ФУНКЦИИ КАЛЬКУЛЯТОРА ===

// Добавление цифры
function appendNumber(number) {
    if (shouldResetScreen) {
        currentInput = '';
        shouldResetScreen = false;
    }
    
    if (currentInput === '0') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    
    updateDisplay();
}

// Добавление оператора
function appendOperator(op) {
    if (operator !== null && !shouldResetScreen) {
        calculate();
    }
    
    if (currentInput && currentInput !== 'Ошибка') {
        previousInput = currentInput;
        currentInput = '';
        operator = op;
        shouldResetScreen = false;
        updateExpression();
    }
}

// Добавление десятичной точки
function appendDecimal() {
    if (shouldResetScreen) {
        currentInput = '0';
        shouldResetScreen = false;
    }
    
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    
    updateDisplay();
}

// Вычисление результата
function calculate() {
    if (operator === null || previousInput === '' || currentInput === '') {
        return;
    }
    
    try {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        // Выполнение операции
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
                    throw new Error('Деление на ноль');
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Форматирование результата
        result = parseFloat(result.toFixed(10));
        
        // Сохранение в историю
        const historyEntry = {
            expression: `${previousInput} ${operator} ${currentInput}`,
            result: result,
            timestamp: new Date().toLocaleString()
        };
        
        calculationHistory.unshift(historyEntry);
        saveHistory();
        
        // Обновление интерфейса
        previousInput = '';
        operator = null;
        currentInput = result.toString();
        shouldResetScreen = true;
        
        updateDisplay();
        updateExpression();
        updateHistoryList();
        updateStats();
        
    } catch (error) {
        currentInput = 'Ошибка';
        updateDisplay();
    }
}

// === ФУНКЦИИ ОЧИСТКИ ===

// Полная очистка (AC)
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetScreen = false;
    updateDisplay();
    updateExpression();
}

// Очистка текущего ввода (CE)
function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

// Удаление последнего символа
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// === АНАЛИТИЧЕСКИЕ ФУНКЦИИ ===

// Возведение в квадрат
function calculateSquare() {
    try {
        const num = parseFloat(currentInput);
        const result = num * num;
        addAnalyticsOperation(`(${num})²`, result);
    } catch (error) {
        currentInput = 'Ошибка';
        updateDisplay();
    }
}

// Квадратный корень
function calculateSqrt() {
    try {
        const num = parseFloat(currentInput);
        if (num < 0) {
            throw new Error('Отрицательное число');
        }
        const result = Math.sqrt(num);
        addAnalyticsOperation(`√(${num})`, result);
    } catch (error) {
        currentInput = 'Ошибка';
        updateDisplay();
    }
}

// Процент
function calculatePercentage() {
    try {
        const num = parseFloat(currentInput);
        const result = num / 100;
        addAnalyticsOperation(`${num}%`, result);
    } catch (error) {
        currentInput = 'Ошибка';
        updateDisplay();
    }
}

// Обратное число (1/x)
function calculateInverse() {
    try {
        const num = parseFloat(currentInput);
        if (num === 0) {
            throw new Error('Деление на ноль');
        }
        const result = 1 / num;
        addAnalyticsOperation(`1/(${num})`, result);
    } catch (error) {
        currentInput = 'Ошибка';
        updateDisplay();
    }
}

// Смена знака
function toggleSign() {
    if (currentInput !== '0' && currentInput !== 'Ошибка') {
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }
}

// Вспомогательная функция для аналитических операций
function addAnalyticsOperation(expression, result) {
    const historyEntry = {
        expression: expression,
        result: result,
        timestamp: new Date().toLocaleString()
    };
    
    calculationHistory.unshift(historyEntry);
    currentInput = result.toString();
    shouldResetScreen = true;
    
    saveHistory();
    updateDisplay();
    updateHistoryList();
    updateStats();
}

// === УПРАВЛЕНИЕ ИСТОРИЕЙ ===

// Сохранение истории в localStorage
function saveHistory() {
    try {
        localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
        updateFileInfo();
    } catch (error) {
        console.error('Ошибка сохранения истории:', error);
    }
}

// Загрузка истории из localStorage
function loadHistory() {
    try {
        const savedHistory = localStorage.getItem('calculatorHistory');
        if (savedHistory) {
            calculationHistory = JSON.parse(savedHistory);
        }
        updateHistoryList();
    } catch (error) {
        console.error('Ошибка загрузки истории:', error);
    }
}

// Очистка истории
function clearHistory() {
    if (calculationHistory.length > 0 && confirm('Вы уверены, что хотите очистить всю историю операций?')) {
        calculationHistory = [];
        saveHistory();
        updateHistoryList();
        updateStats();
    }
}

// Экспорт истории в файл
function exportHistory() {
    if (calculationHistory.length === 0) {
        alert('История операций пуста');
        return;
    }
    
    let exportText = 'История операций калькулятора\n';
    exportText += '='.repeat(50) + '\n\n';
    
    calculationHistory.forEach((entry, index) => {
        exportText += `${index + 1}. ${entry.timestamp}\n`;
        exportText += `   Выражение: ${entry.expression}\n`;
        exportText += `   Результат: ${entry.result}\n\n`;
    });
    
    exportText += `Всего операций: ${calculationHistory.length}\n`;
    exportText += `Дата экспорта: ${new Date().toLocaleString()}`;
    
    // Создание и скачивание файла
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator_history_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// === ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ===

// Обновление дисплея
function updateDisplay() {
    displayElement.textContent = currentInput;
}

// Обновление строки выражения
function updateExpression() {
    if (previousInput && operator) {
        expressionElement.textContent = `${previousInput} ${operator}`;
    } else {
        expressionElement.textContent = '';
    }
}

// Обновление списка истории
function updateHistoryList() {
    if (calculationHistory.length === 0) {
        historyListElement.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-clock"></i>
                <p>История операций пуста</p>
                <p class="hint">Начните вычисления, чтобы увидеть историю</p>
            </div>
        `;
        return;
    }
    
    let historyHTML = '';
    calculationHistory.slice(0, 10).forEach(entry => {
        historyHTML += `
            <div class="history-item">
                <div>
                    <div class="history-expression">${entry.expression}</div>
                    <div class="history-time">${entry.timestamp}</div>
                </div>
                <div class="history-result">${entry.result}</div>
            </div>
        `;
    });
    
    historyListElement.innerHTML = historyHTML;
}

// Обновление статистики
function updateStats() {
    const total = calculationHistory.length;
    totalOperationsElement.textContent = total;
    
    if (total > 0) {
        const results = calculationHistory.map(entry => entry.result);
        const sum = results.reduce((a, b) => a + b, 0);
        const average = sum / total;
        const max = Math.max(...results);
        
        sumResultsElement.textContent = sum.toFixed(2);
        averageResultElement.textContent = average.toFixed(2);
        maxResultElement.textContent = max.toFixed(2);
    } else {
        sumResultsElement.textContent = '0';
        averageResultElement.textContent = '0';
        maxResultElement.textContent = '0';
    }
}

// Обновление информации о файле
function updateFileInfo() {
    const totalEntries = calculationHistory.length;
    const storageUsed = JSON.stringify(calculationHistory).length;
    
    fileInfoElement.textContent = 
        `Записей: ${totalEntries} | Использовано памяти: ${storageUsed} байт | Последнее обновление: ${new Date().toLocaleTimeString()}`;
}

// === ОБРАБОТКА КЛАВИАТУРЫ ===

function handleKeyboardInput(event) {
    const key = event.key;
    
    // Цифры
    if (key >= '0' && key <= '9') {
        appendNumber(key);
        return;
    }
    
    // Операторы
    switch (key) {
        case '+':
        case '-':
        case '*':
        case '/':
            appendOperator(key);
            break;
        case '.':
        case ',':
            appendDecimal();
            break;
        case 'Enter':
        case '=':
            event.preventDefault();
            calculate();
            break;
        case 'Escape':
        case 'Delete':
            clearAll();
            break;
        case 'Backspace':
            deleteLast();
            break;
        case '%':
            calculatePercentage();
            break;
    }
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

// Форматирование чисел
function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU', {
        maximumFractionDigits: 10
    }).format(num);
}