document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const currentOperationElement = document.querySelector('.current-operation');
    const previousOperationElement = document.querySelector('.previous-operation');
    const historyListElement = document.getElementById('history-list');
    const clearHistoryButton = document.getElementById('clear-history');

    // Элементы для аналитики
    const totalOperationsElement = document.getElementById('total-operations');
    const lastResultElement = document.getElementById('last-result');
    const averageResultElement = document.getElementById('average-result');
    const maxResultElement = document.getElementById('max-result');

    // Переменные состояния
    let currentOperand = '0';
    let previousOperand = '';
    let operation = null;
    let resetCurrentOperand = false;

    // История операций и аналитика
    let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
    let analytics = JSON.parse(localStorage.getItem('calculatorAnalytics')) || {
        totalOperations: 0,
        lastResult: 0,
        averageResult: 0,
        maxResult: 0,
        sumResults: 0
    };

    // Инициализация
    updateDisplay();
    updateHistory();
    updateAnalytics();

    // Обработчики событий для кнопок
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', () => {
            const number = button.getAttribute('data-number');
            const action = button.getAttribute('data-action');

            if (number !== null) {
                inputNumber(number);
            } else if (action !== null) {
                handleAction(action);
            }

            updateDisplay();
        });
    });

    // Очистка истории
    clearHistoryButton.addEventListener('click', clearHistory);

    // Обработка ввода цифр
    function inputNumber(number) {
        if (currentOperand === '0' || resetCurrentOperand) {
            currentOperand = number;
            resetCurrentOperand = false;
        } else {
            currentOperand += number;
        }
    }

    // Обработка действий
    function handleAction(action) {
        switch(action) {
            case 'clear':
                clearCalculator();
                break;
            case 'clear-entry':
                clearEntry();
                break;
            case 'backspace':
                backspace();
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                chooseOperation(action);
                break;
            case '.':
                inputDecimal();
                break;
            case 'calculate':
                calculate();
                break;
        }
    }

    // Очистка калькулятора
    function clearCalculator() {
        currentOperand = '0';
        previousOperand = '';
        operation = null;
    }

    // Очистка текущего ввода
    function clearEntry() {
        currentOperand = '0';
    }

    // Удаление последнего символа
    function backspace() {
        if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }

    // Выбор операции
    function chooseOperation(op) {
        if (currentOperand === '0' && previousOperand === '') return;

        if (previousOperand !== '' && !resetCurrentOperand) {
            calculate();
        }

        operation = op;
        previousOperand = currentOperand;
        resetCurrentOperand = true;
    }

    // Ввод десятичной точки
    function inputDecimal() {
        if (resetCurrentOperand) {
            currentOperand = '0.';
            resetCurrentOperand = false;
            return;
        }

        if (!currentOperand.includes('.')) {
            currentOperand += '.';
        }
    }

    // Вычисление
    function calculate() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch(operation) {
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
                    updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Добавление в историю
        addToHistory(prev, current, operation, computation);

        // Обновление аналитики
        updateAnalyticsData(computation);

        // Установка результата
        currentOperand = roundResult(computation).toString();
        operation = null;
        previousOperand = '';
        resetCurrentOperand = true;
    }

    // Округление результата
    function roundResult(num) {
        // Округляем до 10 знаков после запятой, чтобы избежать ошибок с плавающей точкой
        return Math.round(num * 10000000000) / 10000000000;
    }

    // Обновление дисплея
    function updateDisplay() {
        currentOperationElement.textContent = currentOperand;

        if (operation != null) {
            const operatorSymbols = {
                '+': '+',
                '-': '−',
                '*': '×',
                '/': '÷'
            };
            previousOperationElement.textContent = `${previousOperand} ${operatorSymbols[operation]}`;
        } else {
            previousOperationElement.textContent = previousOperand;
        }
    }

    // Добавление операции в историю
    function addToHistory(prev, current, op, result) {
        const operatorSymbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };

        const historyItem = {
            expression: `${prev} ${operatorSymbols[op]} ${current}`,
            result: result,
            timestamp: new Date().toLocaleString('ru-RU')
        };

        history.unshift(historyItem);

        // Сохраняем только последние 20 операций
        if (history.length > 20) {
            history.pop();
        }

        // Сохранение в localStorage
        localStorage.setItem('calculatorHistory', JSON.stringify(history));

        // Обновление отображения истории
        updateHistory();
    }

    // Обновление отображения истории
    function updateHistory() {
        historyListElement.innerHTML = '';

        if (history.length === 0) {
            historyListElement.innerHTML = '<div class="empty-history">История операций пуста</div>';
            return;
        }

        history.forEach(item => {
            const historyItemElement = document.createElement('div');
            historyItemElement.className = 'history-item';
            historyItemElement.innerHTML = `
                <div class="history-expression">${item.expression} =</div>
                <div class="history-result">${item.result}</div>
                <div style="font-size: 0.8rem; color: #6c757d; margin-top: 5px;">${item.timestamp}</div>
            `;
            historyListElement.appendChild(historyItemElement);
        });
    }

    // Очистка истории
    function clearHistory() {
        if (history.length === 0) return;

        if (confirm('Вы уверены, что хотите очистить всю историю операций?')) {
            history = [];
            localStorage.removeItem('calculatorHistory');
            updateHistory();

            // Сброс аналитики
            analytics = {
                totalOperations: 0,
                lastResult: 0,
                averageResult: 0,
                maxResult: 0,
                sumResults: 0
            };
            localStorage.setItem('calculatorAnalytics', JSON.stringify(analytics));
            updateAnalytics();
        }
    }

    // Обновление данных аналитики
    function updateAnalyticsData(result) {
        analytics.totalOperations++;
        analytics.lastResult = result;
        analytics.sumResults += result;
        analytics.averageResult = analytics.sumResults / analytics.totalOperations;

        if (result > analytics.maxResult) {
            analytics.maxResult = result;
        }

        // Сохранение в localStorage
        localStorage.setItem('calculatorAnalytics', JSON.stringify(analytics));

        // Обновление отображения аналитики
        updateAnalytics();
    }

    // Обновление отображения аналитики
    function updateAnalytics() {
        totalOperationsElement.textContent = analytics.totalOperations;
        lastResultElement.textContent = roundResult(analytics.lastResult);
        averageResultElement.textContent = roundResult(analytics.averageResult);
        maxResultElement.textContent = roundResult(analytics.maxResult);
    }

    // Обработка нажатий клавиш клавиатуры
    document.addEventListener('keydown', event => {
        const key = event.key;

        // Цифры
        if (key >= '0' && key <= '9') {
            inputNumber(key);
            updateDisplay();
        }

        // Операции
        else if (key === '+') {
            chooseOperation('+');
            updateDisplay();
        }
        else if (key === '-') {
            chooseOperation('-');
            updateDisplay();
        }
        else if (key === '*') {
            chooseOperation('*');
            updateDisplay();
        }
        else if (key === '/') {
            event.preventDefault(); // Предотвращаем открытие контекстного меню
            chooseOperation('/');
            updateDisplay();
        }

        // Десятичная точка
        else if (key === '.' || key === ',') {
            inputDecimal();
            updateDisplay();
        }

        // Вычисление
        else if (key === 'Enter' || key === '=') {
            calculate();
            updateDisplay();
        }

        // Очистка
        else if (key === 'Escape') {
            clearCalculator();
            updateDisplay();
        }

        // Удаление
        else if (key === 'Backspace') {
            backspace();
            updateDisplay();
        }
    });
});