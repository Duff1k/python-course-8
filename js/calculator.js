function appendToDisplay(value) {
    document.getElementById('result').value += value;
}


function clearDisplay() {
    document.getElementById('result').value = '';
}

function calculate() {
    try {
        const result = eval(document.getElementById('result').value);
        const expression = document.getElementById('result').value;
        document.getElementById('result').value = result;

        const history = document.getElementById('history');
        history.innerHTML += `<p>${expression} = ${result}</p>`;
    } catch (error) {
        document.getElementById('result').value = 'Ошибка';
    }
}

function clearHistory() {
    document.getElementById('history').innerHTML = '';
}
