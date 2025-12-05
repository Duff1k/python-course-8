document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const display = document.getElementById('display');
    const historyList = document.getElementById('history-list');
    const emptyHistory = document.getElementById('empty-history');
    const clearHistoryBtn = document.getElementById('clear-history');
    const clearBtn = document.getElementById('clear');

    // Элементы аналитики
    const totalOperationsEl = document.getElementById('total-operations');
    const mostUsedOperationEl = document.getElementById('most-used-operation');
    const largestResultEl = document.getElementById('largest-result');

    // Переменные состояния калькулятора
    let currentValue = '0';
    let previousValue = '';
    let operation = null;
    let waitingForNewValue = false;
    let calculationHistory = [];

    // Статистика операций
    let operationStats = {
        '+': 0,
        '-': 0,
        '*': 0,
        '/': 0
    };

    // Инициализация из localStorage
    function loadFromLocalStorage() {
        const savedHistory = localStorage.getItem('calculatorHistory');
        const savedStats = localStorage.getItem('calculatorStats');

        if (savedHistory) {
            calculationHistory = JSON.parse(savedHistory);
            updateHistoryDisplay();
        }

        if (savedStats) {
            operationStats = JSON.parse(savedStats);
            updateAnalytics();
        }
    }

    // Сохранение в localStorage
    function saveToLocalStorage() {
        localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
        localStorage.setItem('calculatorStats', JSON.stringify(operationStats));
    }

    // Обновление дисплея
    function updateDisplay() {
        // Форматируем число для отображения
        let displayValue = currentValue;

        // Если число слишком длинное, используем экспоненциальную запись
        if (displayValue.length > 12) {
            if (displayValue.includes('.')) {
                // Если есть десятичная точка, округляем до 10 знаков
                displayValue = parseFloat(displayValue).toFixed(10);
            } else {
                // Используем экспоненциальную запись для очень длинных целых чисел
                displayValue = parseFloat(displayValue).toExponential(6);
            }
        }

        display.textContent = displayValue;
    }

    // Добавление цифры
    function inputDigit(digit) {
        if (waitingForNewValue) {
            currentValue = digit;
            waitingForNewValue = false;
        } else {
            currentValue = currentValue === '0' ? digit : currentValue + digit;
        }
        updateDisplay();
    }

    // Добавление десятичной точки
    function inputDecimal() {
        if (waitingForNewValue) {
            currentValue = '0.';
            waitingForNewValue = false;
        } else if (!currentValue.includes('.')) {
            currentValue += '.';
        }
        updateDisplay();
    }

    // Обработка операций
    function handleOperation(nextOperation) {
        const inputValue = parseFloat(currentValue);

        if (previousValue === '') {
            previousValue = inputValue;
        } else if (operation) {
            const result = calculate();
            currentValue = `${parseFloat(result.toFixed(10))}`;
            previousValue = result;
        }

        waitingForNewValue = true;
        operation = nextOperation;
    }

    // Выполнение расчета
    function calculate() {
        const prev = parseFloat(previousValue);
        const current = parseFloat(currentValue);

        if (isNaN(prev) || isNaN(current)) return 0;

        let result = 0;

        switch (operation) {
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
                result = prev / current;
                break;
            default:
                return current;
        }

        // Добавляем операцию в историю
        addToHistory(prev, current, operation, result);

        // Обновляем статистику операций
        if (operation in operationStats) {
            operationStats[operation]++;
            updateAnalytics();
        }

        // Сбрасываем состояние операции
        operation = null;

        return result;
    }

    // Добавление операции в историю
    function addToHistory(prev, current, op, result) {
        const historyItem = {
            id: Date.now(),
            expression: `${prev} ${op} ${current}`,
            result: parseFloat(result.toFixed(10))
        };

        calculationHistory.unshift(historyItem); // Добавляем в начало

        // Ограничиваем историю 20 последними операциями
        if (calculationHistory.length > 20) {
            calculationHistory.pop();
        }

        updateHistoryDisplay();
        saveToLocalStorage();
    }

    // Обновление отображения истории
    function updateHistoryDisplay() {
        // Показываем или скрываем сообщение о пустой истории
        if (calculationHistory.length === 0) {
            emptyHistory.style.display = 'block';
            historyList.innerHTML = '<div class="empty-history" id="empty-history">История операций пуста</div>';
        } else {
            emptyHistory.style.display = 'none';

            let historyHTML = '';
            calculationHistory.forEach(item => {
                historyHTML += `
                    <div class="history-item">
                        <div class="history-expression">${item.expression}</div>
                        <div class="history-result">= ${item.result}</div>
                    </div>
                `;
            });

            historyList.innerHTML = historyHTML;
        }

        updateAnalytics();
    }

    // Обновление аналитики
    function updateAnalytics() {
        // Общее количество операций
        totalOperationsEl.textContent = calculationHistory.length;

        // Самая частая операция
        let mostUsed = '-';
        let maxCount = 0;

        for (const [op, count] of Object.entries(operationStats)) {
            if (count > maxCount) {
                maxCount = count;
                mostUsed = op;
            }
        }

        mostUsedOperationEl.textContent = mostUsed !== '-' ? mostUsed : '-';

        // Наибольший результат
        let largestResult = 0;
        if (calculationHistory.length > 0) {
            largestResult = Math.max(...calculationHistory.map(item => Math.abs(item.result)));
            largestResultEl.textContent = parseFloat(largestResult.toFixed(5));
        } else {
            largestResultEl.textContent = '0';
        }
    }

    // Очистка калькулятора
    function clearCalculator() {
        currentValue = '0';
        previousValue = '';
        operation = null;
        waitingForNewValue = false;
        updateDisplay();
    }

    // Очистка истории
    function clearHistory() {
        calculationHistory = [];

        // Сбрасываем статистику операций
        operationStats = {
            '+': 0,
            '-': 0,
            '*': 0,
            '/': 0
        };

        updateHistoryDisplay();
        saveToLocalStorage();
    }

    // Обработка нажатий кнопок
    function setupButtonListeners() {
        // Цифровые кнопки (0-9)
        document.querySelectorAll('.number:not(#decimal)').forEach(button => {
            button.addEventListener('click', () => {
                inputDigit(button.textContent);
            });
        });

        // Кнопка десятичной точки
        document.getElementById('decimal').addEventListener('click', inputDecimal);

        // Кнопки операций
        document.querySelectorAll('.operation').forEach(button => {
            button.addEventListener('click', () => {
                handleOperation(button.textContent);
                updateDisplay();
            });
        });

        // Кнопка равно
        document.getElementById('equals').addEventListener('click', () => {
            if (operation && previousValue !== '') {
                const result = calculate();
                currentValue = `${parseFloat(result.toFixed(10))}`;
                previousValue = '';
                updateDisplay();
            }
        });

        // Кнопка очистки (AC)
        clearBtn.addEventListener('click', clearCalculator);

        // Кнопка очистки истории
        clearHistoryBtn.addEventListener('click', clearHistory);

        // Обработка клавиатуры
        document.addEventListener('keydown', event => {
            const key = event.key;

            if (key >= '0' && key <= '9') {
                inputDigit(key);
            } else if (key === '.') {
                inputDecimal();
            } else if (key === '+' || key === '-' || key === '*' || key === '/') {
                handleOperation(key);
                updateDisplay();
            } else if (key === 'Enter' || key === '=') {
                if (operation && previousValue !== '') {
                    const result = calculate();
                    currentValue = `${parseFloat(result.toFixed(10))}`;
                    previousValue = '';
                    updateDisplay();
                }
                event.preventDefault();
            } else if (key === 'Escape' || key === 'Delete') {
                clearCalculator();
            }
        });
    }

    // Инициализация приложения
    function init() {
        loadFromLocalStorage();
        updateDisplay();
        setupButtonListeners();
    }

    init();
});