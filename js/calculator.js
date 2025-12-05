let expression = "";
let historyList = [];

function press(value) {
    expression += value;
    document.getElementById("display").value = expression;
}

function clearDisplay() {
    expression = "";
    document.getElementById("display").value = "";
}

function calculate() {
    try {
        let result = eval(expression);

       
        historyList.push(`${expression} = ${result}`);

        updateHistory();

        expression = result.toString();
        document.getElementById("display").value = expression;
    } catch (error) {
        document.getElementById("display").value = "Ошибка!";
        expression = "";
    }
}

function updateHistory() {
    let historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";

    historyList.forEach(item => {
        let p = document.createElement("p");
        p.textContent = item;
        historyDiv.appendChild(p);
    });
}

function clearHistory() {
    historyList = [];
    updateHistory();
}

