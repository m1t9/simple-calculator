class Calculator {
	constructor(previousOperandTextElement, currentOperandTextElement) {
		this.previousOperandTextElement = previousOperandTextElement;
		this.currentOperandTextElement = currentOperandTextElement;
		this.flag = false;
		this.clear();
		this.windowSize = 15;
	}

	clear() {
		this.previousOperand = '';
		this.currentOperand = '';
		this.operation = undefined;
		this.flag = false;
	}

	delete() {
		if (this.previousOperand !== '' && this.currentOperand === '') {
			this.operation = undefined;
			this.currentOperand = this.previousOperand;
			this.previousOperand = '';
			return;
		}
		this.currentOperand = this.currentOperand.toString().slice(0, -1);
	}

	appendNumber(number) {
		if (number === '.' && this.currentOperand.toString().includes('.')) return;
		this.currentOperand = this.currentOperand.toString() + number.toString();
	}

	chooseOperation(operation) {
		if (this.currentOperand === '' && this.previousOperand !== '') this.operation = operation;
		if (this.currentOperand === '') return;

		if (this.currentOperand !== '' && this.previousOperand !== '') {
	      this.compute();
	    }
		this.operation = operation;
		this.previousOperand = this.currentOperand;
		this.currentOperand = '';
	}

	getSqrt() {
		if (this.currentOperand === '') return;
		this.flag = true;
		this.currentOperand = (this.currentOperand >= 0) ? Math.sqrt(parseFloat(this.currentOperand)) : this.currentOperand = 'error';
	}

	compute() {
		let computation;
		const prev = parseFloat(this.previousOperand);
		const current = parseFloat(this.currentOperand);
		if (isNaN(prev) || isNaN(current)) return;
		switch (this.operation) {
			case '+':
				computation = prev + current
				break
			case '-':
				computation = prev - current
				break
			case '*':
				computation = prev * current
				break
			case '/':
				computation = current === 0 ? 'error' : prev / current
				break
			case '^':
				computation = current < 0 ? 'error' : Math.pow(prev, current)
				break
			default:
				return
		}
		if (computation !== 'error') {
			this.currentOperand = parseFloat(computation);
		} else {
			this.currentOperand = 'error';
		}
		this.flag = true;
		this.operation = undefined;
		this.previousOperand = '';

	}

	getDisplayNumber(number) {
		var zeroFlag = false;
		if (number > -1 && number < 0) {
			zeroFlag = true;
		}
		if (this.currentOperand === 'error') {
			this.currentOperand = '';
			this.previousOperand = '';
			return 'ERROR';
		}
		if (this.currentOperand > 1e20 || this.currentOperand < -1e20) {
			this.currentOperand = '';
			this.previousOperand = '';
			return 'MAX VALUE ERROR';
		}

		const stringNumber = number.toString();
		const integerDigits = parseFloat(stringNumber.split('.')[0]);
		const decimalDigits = stringNumber.split('.')[1];
		let integerDisplay;

		if (isNaN(integerDigits)) {
			integerDisplay = '';
		} else {
			if (integerDigits.toString().length > this.windowSize) {
				integerDisplay = integerDigits.toExponential(this.windowSize - 6);
				return	integerDisplay;
			}
			integerDisplay = integerDigits;
		}

		if (decimalDigits != null) {
			if ((integerDigits.toString().length + decimalDigits.toString().length) > this.windowSize - 2) {
				integerDisplay = parseFloat(parseFloat(number).toFixed(
						(this.windowSize  - integerDigits.toString().length - 
								((zeroFlag === true) ? 1 : 0)
							) 
					));
				return integerDisplay;
			}
			if (zeroFlag === true) {
				zeroFlag = false;
				return `-${integerDisplay}.${decimalDigits}`;
			}
			return `${integerDisplay}.${decimalDigits}`;
		} else {
			return integerDisplay;
		}
	}

	updateDisplay() {
	    this.currentOperandTextElement.innerText =
	      this.getDisplayNumber(this.currentOperand);
	    if (this.operation != null) {
	      this.previousOperandTextElement.innerText =
	        `${this.getDisplayNumber(parseFloat(this.previousOperand))} ${this.operation}`;
	    } else {
	      this.previousOperandTextElement.innerText = '';
	    }
	}

	changeSign() {
		if (this.previousOperand !== '' && this.currentOperand === '') {
			this.previousOperand = -1 * this.previousOperand;
		}
		if (this.currentOperand !== '') this.currentOperand = -1 * this.currentOperand;
	}
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const sqrtButton = document.querySelector('[data-sqrt]');
const powButton = document.querySelector('[data-pow]');
const signButton = document.querySelector('[data-sign]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
calculator.updateDisplay();

numberButtons.forEach(button => {
 	button.addEventListener('click', () => {
		if(calculator.previousOperand === "" &&
			calculator.currentOperand !== "" &&
			calculator.flag) {
				calculator.currentOperand = "";
				calculator.flag = false;
      	}
	      calculator.appendNumber(button.innerText);
	      calculator.updateDisplay();
	})
});

operationButtons.forEach(button => {
  	button.addEventListener('click', () => {
	    calculator.chooseOperation(button.innerText);
	    calculator.updateDisplay();
  })
});

equalsButton.addEventListener('click', button => {
	calculator.compute();
	calculator.updateDisplay();
});

allClearButton.addEventListener('click', button => {
	calculator.clear();
	calculator.updateDisplay();
});

deleteButton.addEventListener('click', button => {
	calculator.delete();
	calculator.updateDisplay();
});

sqrtButton.addEventListener('click', button => {
	calculator.getSqrt();
	calculator.updateDisplay();
});

signButton.addEventListener('click', button => {
	calculator.changeSign();
	calculator.updateDisplay();
});

powButton.addEventListener('click', button => {
	calculator.chooseOperation('^');
	calculator.compute();
	calculator.updateDisplay();
});
