let expression = "";
let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];

function addToDisplay(char) {
    expression += char;
    updateDisplay();
}

function updateDisplay() {
    document.getElementById("display").value = expression || "0";
}

function clearDisplay() {
    expression = "";
    updateDisplay();
}

function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function calculate() {
    if (!expression.trim()) return;

    try {
        // Заменяем × на * для корректного вычисления
        let expr = expression.replace(/×/g, '*');

        // Безопасное вычисление выражения
        let result = eval(expr);

        // Проверка на специальные значения
        if (result === Infinity || result === -Infinity) {
            throw new Error("Деление на ноль!");
        }

        if (Number.isNaN(result)) {
            throw new Error("Некорректная операция!");
        }

        // Округление для длинных чисел
        if (result.toString().length > 10) {
            result = parseFloat(result.toFixed(10));
        }

        // Создание записи истории
        let historyItem = {
            id: Date.now(),
            text: expression + " = " + result,
            result: result,
            time: new Date().toLocaleString('ru-RU'),
            timestamp: new Date().getTime()
        };

        // Добавление в историю
        history.unshift(historyItem);

        // Ограничение истории (последние 50 записей)
        if (history.length > 50) {
            history = history.slice(0, 50);
        }

        // Сохранение в localStorage
        localStorage.setItem('calculatorHistory', JSON.stringify(history));

        // Обновление выражения
        expression = result.toString();
        updateDisplay();

        // Обновление интерфейса
        showHistory();
        updateStats();

    } catch (error) {
        alert("Ошибка: " + error.message);
        clearDisplay();
    }
}

function showHistory() {
    let historyDiv = document.getElementById("history-list");

    if (history.length === 0) {
        historyDiv.innerHTML = "<div class='history-item'>История пуста</div>";
        return;
    }

    let html = "";
    for (let i = 0; i < history.length; i++) {
        html += `<div class="history-item" onclick="useHistoryItem(${i})" style="cursor: pointer;">
            ${history[i].text}
            <br><small>${history[i].time}</small>
        </div>`;
    }

    historyDiv.innerHTML = html;
}

function useHistoryItem(index) {
    if (history[index]) {
        expression = history[index].result.toString();
        updateDisplay();
    }
}

function clearHistory() {
    if (confirm("Вы уверены, что хотите очистить всю историю вычислений?")) {
        history = [];
        localStorage.removeItem('calculatorHistory');
        showHistory();
        updateStats();
    }
}

function exportHistory() {
    if (history.length === 0) {
        alert("История пуста!");
        return;
    }

    let exportText = "История вычислений калькулятора\n";
    exportText += "===============================\n\n";

    history.forEach((item, index) => {
        exportText += `${index + 1}. ${item.text}\n`;
        exportText += `   Время: ${item.time}\n\n`;
    });

    // Создание файла для скачивания
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator_history_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function updateStats() {
    const total = history.length;
    const lastResult = history.length > 0 ? history[0].result : 0;

    document.getElementById("total-operations").textContent = total;
    document.getElementById("last-result").textContent = lastResult;
}

// Обработка клавиатуры
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        addToDisplay(key);
    } else if (key === '.') {
        addToDisplay('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        addToDisplay(key);
    } else if (key === '(' || key === ')') {
        addToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'c' || key === 'C') {
        clearHistory();
    }
});

// Инициализация при загрузке
window.onload = function() {
    updateDisplay();
    showHistory();
    updateStats();
};