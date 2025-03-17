class Calculator {
    constructor() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.clear();
        this.setupEventListeners();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.currentOperand === 'Error') {
            this.clear();
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) {
            this.showError();
            return;
        }

        try {
            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '×':
                    computation = prev * current;
                    break;
                case '÷':
                    if (current === 0) {
                        this.showError();
                        return;
                    }
                    computation = prev / current;
                    break;
                case '%':
                    computation = prev % current;
                    break;
                default:
                    return;
            }

            this.currentOperand = this.formatNumber(computation);
            this.operation = undefined;
            this.previousOperand = '';
            this.updateDisplay();
        } catch (error) {
            this.showError();
        }
    }

    showError() {
        this.currentOperand = 'Error';
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    formatNumber(number) {
        if (Math.abs(number) < 1e-10) {
            return '0';
        }

        if (Math.abs(number) > 1e10) {
            return number.toExponential(5);
        }

        return parseFloat(number.toFixed(5)).toString();
    }

    changeSign() {
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }
        this.currentOperand = this.formatNumber(parseFloat(this.currentOperand) * -1);
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.textContent = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.innerText);
            });
        });

        document.querySelectorAll('.operator').forEach(button => {
            button.addEventListener('click', () => {
                if (button.innerText === 'AC') {
                    this.clear();
                } else if (button.innerText === '±') {
                    this.changeSign();
                } else if (button.innerText === '=') {
                    this.compute();
                } else {
                    this.chooseOperation(button.innerText);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            e.preventDefault();

            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.appendNumber(e.key);
            } else if (e.key === '+') {
                this.chooseOperation('+');
            } else if (e.key === '-') {
                this.chooseOperation('-');
            } else if (e.key === '*') {
                this.chooseOperation('×');
            } else if (e.key === '/') {
                this.chooseOperation('÷');
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                this.compute();
            } else if (e.key === 'Escape') {
                this.clear();
            } else if (e.key === 'Backspace') {
                this.delete();
            } else if (e.key === '%') {
                this.chooseOperation('%');
            }
        });
    }
}

const calculator = new Calculator();
