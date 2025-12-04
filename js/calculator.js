// Добавление значения на экран
function appendToDisplay(value) {
    document.getElementById('result').value += value;
}

// Очистка экрана
function clearDisplay() {
    document.getElementById('result').value = '';
}

// Вычисление результата
function calculate() {
    try {
        const result = eval(document.getElementById('result').value);
        const expression = document.getElementById('result').value;
        document.getElementById('result').value = result;

        // Добавление операции в историю
        const history = document.getElementById('history');
        history.innerHTML += `<p>${expression} = ${result}</p>`;
    } catch (error) {
        document.getElementById('result').value = 'Ошибка';
    }
}

// Очистка истории
function clearHistory() {
    document.getElementById('history').innerHTML = '';
}
