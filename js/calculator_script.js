
let currentInput = '';
let history = [];

function appendToDisplay(value) {
    currentInput += value;
    document.getElementById('result').value = currentInput;
}

function clearAll() {
    currentInput = '';
    document.getElementById('result').value = '';
}

function calculate() {
    try {
        const result = eval(currentInput);
        const operation = `${currentInput} = ${result}`;

        history.push(operation);
        updateHistory();

        document.getElementById('result').value = result;
        currentInput = result.toString();
    } catch (error) {
        document.getElementById('result').value = 'Error';
        currentInput = '';
    }
}

function updateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    history.forEach(operation => {
        const li = document.createElement('li');
        li.textContent = operation;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    history = [];
    currentInput = '';
    document.getElementById('result').value = '';
    updateHistory();
    }