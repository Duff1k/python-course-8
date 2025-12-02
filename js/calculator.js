let expression = "";
let history = [];

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

function calculate() {
    if (!expression) return;

    try {
        let result = eval(expression);

        if (result === Infinity || result === -Infinity) {
            alert("Ошибка: Деление на ноль!");
            clearDisplay();
            return;
        }

        if (Number.isNaN(result)) {
            alert("Ошибка: Некорректная математическая операция!");
            clearDisplay();
            return;
        }

        let historyItem = {
            text: expression + " = " + result,
            time: new Date().toLocaleString()
        };
        history.unshift(historyItem);

        expression = result.toString();
        updateDisplay();
        showHistory();

    } catch {
        alert("Ошибка в выражении!");
        clearDisplay();
    }
}


function showHistory() {
    let historyDiv = document.getElementById("history-list");

    if (history.length === 0) {
        historyDiv.innerHTML = "<div>Нет истории</div>";
        return;
    }

    let html = "";
    for (let i = 0; i < Math.min(history.length, 20); i++) {
        html += `<div class="history-item">
            ${history[i].text}
            <br><small>${history[i].time}</small>
        </div>`;
    }

    historyDiv.innerHTML = html;
}


function clearHistory() {
    if (confirm("Очистить историю?")) {
        history = [];
        showHistory();
    }
}


window.onload = function() {
    updateDisplay();
    showHistory();
};