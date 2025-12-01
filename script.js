let display = document.getElementById("display");
let historyList = document.getElementById("history-list");
 
function appendNumber(num) {
    display.value += num;
}
 
function appendOperator(op) {
    if (display.value === "") return;
    const lastChar = display.value.slice(-1);
    if ("+-*/".includes(lastChar)) return;
    display.value += op;
}
 
function clearDisplay() {
    display.value = "";
}
 
function calculate() {
    try {
        let expression = display.value;
        let result = eval(expression);
 
        addToHistory(expression + " = " + result);
        display.value = result;
    } catch {
        display.value = "Ошибка";
        setTimeout(() => display.value = "", 1000);
    }
}
 
function percent() {
    if (display.value === "") return;
    display.value = parseFloat(display.value) / 100;
}
 
function sqrt() {
    if (display.value === "") return;
    display.value = Math.sqrt(parseFloat(display.value));
}
 
function addToHistory(text) {
    let div = document.createElement("div");
    div.className = "history-item";
    div.textContent = text;
    historyList.prepend(div);
}
 
function clearHistory() {
    historyList.innerHTML = "";
}
