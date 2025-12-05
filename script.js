// Элементы DOM
const currentOperationElement = document.querySelector('.current-operation');
const previousOperationElement = document.querySelector('.previous-operation');
const historyListElement = document.getElementById('history-list');
const clearHistoryButton = document.getElementById('clear-history');

// Переменные калькулятора
let currentOperand = '0';
let previousOperand = '';
let operation = null;
let resetScreen = false;

// История операций
let operationHistory = JSON.parse(localStorage.getItem('calculatorHistory')) || [];

// Инициализация истории
updateHistoryDisplay();

// Функция обновления дисплея
function updateDisplay() {
    currentOperationElement.textContent = currentOperand;
    previousOperationElement.textContent = previousOperand + (operation ? ` ${getOperationSymbol(operation)}` : '');
}

// Функция получения символа операции
function getOperationSymbol(op) {
    switch(op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        case '%': return '%';
        default: return op;
    }
}

// Добавление цифры
function appendNumber(number) {
    if (currentOperand === '0' || resetScreen) {
        currentOperand = number;
        resetScreen = false;
    } else {
        currentOperand += number;
    }
}

// Добавление десятичной точки
function addDecimalPoint() {
    if (resetScreen) {
        currentOperand = '0.';
        resetScreen = false;
        return;
    }
    
    if (!currentOperand.includes('.')) {
        currentOperand += '.';
    }
}

// Выбор операции
function chooseOperation(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        calculate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    resetScreen = true;
}

// Вычисление результата
function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert("Ошибка: деление на ноль!");
                clearCalculator();
                return;
            }
            computation = prev / current;
            break;
        case '%':
            computation = prev % current;
            break;
        default:
            return;
    }
    
    // Добавление в историю
    const historyItem = {
        expression: `${previousOperand} ${getOperationSymbol(operation)} ${currentOperand}`,
        result: computation.toString(),
        timestamp: new Date().toLocaleTimeString()
    };
    
    operationHistory.unshift(historyItem);
    
    // Ограничиваем историю 50 записями
    if (operationHistory.length > 50) {
        operationHistory.pop();
    }
    
    // Сохраняем историю в localStorage
    localStorage.setItem('calculatorHistory', JSON.stringify(operationHistory));
    
    // Обновляем историю на экране
    updateHistoryDisplay();
    
    // Устанавливаем результат
    currentOperand = roundResult(computation).toString();
    operation = null;
    previousOperand = '';
    resetScreen = true;
}

// Округление результата
function roundResult(num) {
    return Math.round((num + Number.EPSILON) * 1000000) / 1000000;
}

// Очистка калькулятора
function clearCalculator() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
}

// Полная очистка калькулятора
function clearAll() {
    clearCalculator();
    updateDisplay();
}

// Обновление отображения истории
function updateHistoryDisplay() {
    if (operationHistory.length === 0) {
        historyListElement.innerHTML = '<div class="empty-history">История операций пуста</div>';
        return;
    }
    
    historyListElement.innerHTML = '';
    
    operationHistory.forEach(item => {
        const historyItemElement = document.createElement('div');
        historyItemElement.className = 'history-item';
        historyItemElement.innerHTML = `
            <div><strong>${item.expression} = ${item.result}</strong></div>
            <div style="font-size:0.8rem; margin-top:5px; color:#a9a9a9;">${item.timestamp}</div>
        `;
        historyListElement.appendChild(historyItemElement);
    });
}

// Очистка истории
function clearHistory() {
    operationHistory = [];
    localStorage.removeItem('calculatorHistory');
    updateHistoryDisplay();
}

// Обработка нажатий клавиш
function handleButtonClick(e) {
    const button = e.target;
    
    if (button.classList.contains('number-btn')) {
        if (button.dataset.number === '.') {
            addDecimalPoint();
        } else {
            appendNumber(button.dataset.number);
        }
        updateDisplay();
        return;
    }
    
    if (button.classList.contains('operation-btn')) {
        chooseOperation(button.dataset.operation);
        updateDisplay();
        return;
    }
    
    if (button.dataset.action === 'equals') {
        calculate();
        updateDisplay();
        return;
    }
    
    if (button.dataset.action === 'clear') {
        currentOperand = '0';
        updateDisplay();
        return;
    }
    
    if (button.dataset.action === 'clear-all') {
        clearAll();
        return;
    }
}

// Обработка нажатий клавиатуры
function handleKeyboardInput(e) {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
        updateDisplay();
    } else if (e.key === '.') {
        addDecimalPoint();
        updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        chooseOperation(e.key);
        updateDisplay();
    } else if (e.key === '%') {
        chooseOperation('%');
        updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
        updateDisplay();
    } else if (e.key === 'Escape' || e.key === 'Delete') {
        clearAll();
    } else if (e.key === 'Backspace') {
        currentOperand = currentOperand.toString().slice(0, -1);
        if (currentOperand === '') {
            currentOperand = '0';
        }
        updateDisplay();
    }
}

// Инициализация калькулятора
function initCalculator() {
    // Обработчики для кнопок калькулятора
    document.querySelector('.buttons-grid').addEventListener('click', handleButtonClick);
    
    // Обработчик для кнопки очистки истории
    clearHistoryButton.addEventListener('click', clearHistory);
    
    // Обработчик для клавиатуры
    document.addEventListener('keydown', handleKeyboardInput);
    
    // Начальное отображение
    updateDisplay();
}

// Запуск калькулятора при загрузке страницы
window.addEventListener('DOMContentLoaded', initCalculator);