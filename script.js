class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, historyListElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.historyListElement = historyListElement;
        this.history = []; // Массив для хранения истории
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        // Запрещаем ввод нескольких точек
        if (number === '.' && this.currentOperand.includes('.')) return;
        // Убираем начальный ноль, если вводится цифра (но оставляем "0.")
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
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
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Сохраняем в историю перед обновлением состояния
        this.addToHistory(prev, this.operation, current, computation);

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }

    // --- Логика Истории ---

    addToHistory(num1, op, num2, result) {
        const expression = `${num1} ${op} ${num2}`;
        // Добавляем в начало массива
        this.history.unshift({ expression, result });
        this.renderHistory();
    }

    renderHistory() {
        this.historyListElement.innerHTML = '';
        this.history.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('history-item');
            li.innerHTML = `
                <div>${item.expression} =</div>
                <span class="history-result">${item.result}</span>
            `;
            this.historyListElement.appendChild(li);
        });
    }

    clearHistory() {
        this.history = [];
        this.renderHistory();
    }
}

// Инициализация
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const historyListElement = document.getElementById('history-list');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, historyListElement);

// Добавляем поддержку клавиатуры (опционально, для удобства)
document.addEventListener('keydown', function (event) {
    let key = event.key;
    if (!isNaN(key) || key === '.') calculator.appendNumber(key);
    if (key === '+') calculator.chooseOperation('+');
    if (key === '-') calculator.chooseOperation('-');
    if (key === '*') calculator.chooseOperation('*');
    if (key === '/') calculator.chooseOperation('÷');
    if (key === 'Enter' || key === '=') {
        event.preventDefault(); // чтобы не нажималась активная кнопка
        calculator.compute();
    }
    if (key === 'Backspace') calculator.delete();
    if (key === 'Escape') calculator.clear();
});