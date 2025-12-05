
const MAX_LEN = 21;
let displayValue = "0";
let calculationHistory = [];

const displayElement = document.getElementById("display");
const errorMessageElement = document.getElementById("error-message");
const historyContainer = document.getElementById("history-container");
const historyContent = document.getElementById("history-content");
const toggleHistoryBtn = document.getElementById("toggle-history-btn");
const clearHistoryBtn = document.getElementById("clear-history");

document.addEventListener('DOMContentLoaded', function() {
    loadHistoryFromStorage();

    document.querySelectorAll('.btn[data-value]').forEach(button => {
        button.addEventListener('click', function() {
            btnClick(this.getAttribute('data-value'));
        });
    });

    document.getElementById('clear').addEventListener('click', clearDisplay);
    document.getElementById('equals').addEventListener('click', calculate);
    toggleHistoryBtn.addEventListener('click', toggleHistory);
    clearHistoryBtn.addEventListener('click', clearHistory);

    updateDisplay();
});

function logOperation(valueOnDisplay, result) {
    const timestamp = new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(',', '');

    const entry = {
        timestamp: `[${timestamp}]`,
        expression: valueOnDisplay,
        result: result
    };

    calculationHistory.unshift(entry);
    if (calculationHistory.length > 10) {
        calculationHistory = calculationHistory.slice(0, 10);
    }

    saveHistoryToStorage();
    updateHistoryDisplay();
}

function saveHistoryToStorage() {
    localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
}

function loadHistoryFromStorage() {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        calculationHistory = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

function updateHistoryDisplay() {
    if (calculationHistory.length === 0) {
        historyContent.innerHTML = '<div class="no-history">История вычислений пуста</div>';
        return;
    }

    let historyHTML = '';
    calculationHistory.forEach(entry => {
        historyHTML += `
            <div class="history-item">
                ${entry.timestamp} ${entry.expression} = ${entry.result}
            </div>
        `;
    });

    historyContent.innerHTML = historyHTML;
}

function updateDisplay() {
    if (displayValue === "") {
        displayElement.textContent = "0";
    } else {
        displayElement.textContent = displayValue;
    }
}

function btnClick(btn) {
    if (displayValue === "0" && btn !== "." && !isOperator(btn)) {
        displayValue = btn;
    } else if (displayValue.length < MAX_LEN) {
        if (isOperator(btn) && isOperator(displayValue.slice(-1))) {
            displayValue = displayValue.slice(0, -1) + btn;
        } else {
            displayValue += btn;
        }
    } else {
        showError("Превышение максимального количества символов");
        return;
    }

    updateDisplay();
    hideError();
}

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

function clearDisplay() {
    displayValue = "0";
    updateDisplay();
    hideError();
}

function calculate() {
    try {
        if (isOperator(displayValue.slice(-1))) {
            throw new Error("Выражение не может заканчиваться оператором");
        }

        const valueOnDisplay = displayValue;
        let expression = displayValue.replace(/×/g, '*').replace(/÷/g, '/');

        const result = eval(expression);

        if (!isFinite(result)) {
            throw new Error("Результат не является конечным числом");
        }

        let formattedResult = result.toString();
        if (formattedResult.length > MAX_LEN) {
            formattedResult = parseFloat(result).toFixed(10);
            formattedResult = parseFloat(formattedResult).toString();
        }

        displayValue = formattedResult;
        updateDisplay();
        logOperation(valueOnDisplay, formattedResult);
        hideError();
    } catch (error) {
        showError("Что-то пошло не так. Проверьте выражение.");
        clearDisplay();
    }
}

function showError(message) {
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = "block";

    setTimeout(hideError, 3000);
}

function hideError() {
    errorMessageElement.style.display = "none";
}

function toggleHistory() {
    if (historyContainer.style.display === "block") {
        historyContainer.style.display = "none";
        toggleHistoryBtn.textContent = "Показать историю";
    } else {
        historyContainer.style.display = "block";
        toggleHistoryBtn.textContent = "Скрыть историю";
    }
}

function clearHistory() {
    calculationHistory = [];
    saveHistoryToStorage();
    updateHistoryDisplay();

    if (historyContainer.style.display === "block") {
        toggleHistoryBtn.textContent = "Показать историю";
        historyContainer.style.display = "none";
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        btnClick(key);
    }
    else if (['+', '-', '*', '/'].includes(key)) {
        btnClick(key);
    }
    else if (key === '.') {
        btnClick('.');
    }
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    else if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
    }
    else if (key === 'Backspace') {
        if (displayValue.length > 1) {
            displayValue = displayValue.slice(0, -1);
        } else {
            displayValue = "0";
        }
        updateDisplay();
    }
});