let currentOperand = '';
let previousOperand = '';
let operation = undefined;

const currentOperandTextElement = document.getElementById('current-operand');
const previousOperandTextElement = document.getElementById('previous-operand');
const historyList = document.getElementById('history-list');

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    
    currentOperand = currentOperand.toString() + number.toString();
    updateDisplay();
}


function chooseOperation(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        compute();
    }
    
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert("Деление на ноль невозможно!");
                clearDisplay();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    
    addToHistory(prev, operation, current, computation);
    
    currentOperand = computation;
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

function clearDisplay() {
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function deleteNumber() {
    currentOperand = currentOperand.toString().slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    currentOperandTextElement.innerText = getDisplayNumber(currentOperand);
    
    if (operation != null) {
        previousOperandTextElement.innerText = 
            `${getDisplayNumber(previousOperand)} ${operation}`;
    } else {
        previousOperandTextElement.innerText = '';
    }
}

function getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

function addToHistory(prev, op, current, result) {
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) {
        emptyMsg.remove();
    }

    const li = document.createElement('li');
    li.innerText = `${prev} ${op} ${current} = ${parseFloat(result.toFixed(4))}`;
    
    historyList.prepend(li);
}

function clearHistory() {
    historyList.innerHTML = '<li class="empty-msg">История пуста</li>';
}

clearDisplay();