const display = document.getElementById("display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");


let currentNumber = "0";
let previousNumber = null;
let operator = null;
let shouldResetDisplay = false;


// Update calculator display
function updateDisplay() {
    display.value = currentNumber;
}


// Add a number
function inputNumber(number) {

    if (currentNumber === "Error") {
        clearCalculator();
    }

    if (shouldResetDisplay) {
        currentNumber = number;
        shouldResetDisplay = false;
    } else if (currentNumber === "0") {
        currentNumber = number;
    } else {
        currentNumber += number;
    }

    updateDisplay();
}


// Add decimal point
function inputDecimal() {

    if (currentNumber === "Error") {
        clearCalculator();
    }

    if (shouldResetDisplay) {
        currentNumber = "0.";
        shouldResetDisplay = false;
    } else if (!currentNumber.includes(".")) {
        currentNumber += ".";
    }

    updateDisplay();
}


// Select an operator
function chooseOperator(selectedOperator) {

    if (currentNumber === "Error") {
        return;
    }

    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }

    previousNumber = Number(currentNumber);
    operator = selectedOperator;
    shouldResetDisplay = true;
}


// Perform calculation
function calculate() {

    if (operator === null || previousNumber === null) {
        return;
    }

    const current = Number(currentNumber);

    let result;


    switch (operator) {

        case "+":
            result = previousNumber + current;
            break;

        case "-":
            result = previousNumber - current;
            break;

        case "*":
            result = previousNumber * current;
            break;

        case "/":

            if (current === 0) {
                currentNumber = "Error";
                previousNumber = null;
                operator = null;
                shouldResetDisplay = true;

                updateDisplay();

                return;
            }

            result = previousNumber / current;
            break;

        default:
            return;
    }


    currentNumber = formatResult(result);

    previousNumber = null;
    operator = null;
    shouldResetDisplay = true;

    updateDisplay();
}


// Format calculation result
function formatResult(number) {

    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(
        Number.parseFloat(number.toFixed(10))
    );
}


// Clear calculator
function clearCalculator() {

    currentNumber = "0";
    previousNumber = null;
    operator = null;
    shouldResetDisplay = false;

    updateDisplay();
}


// Delete last number
function deleteNumber() {

    if (currentNumber === "Error") {
        clearCalculator();
        return;
    }

    if (shouldResetDisplay) {
        return;
    }

    if (currentNumber.length <= 1) {
        currentNumber = "0";
    } else {
        currentNumber = currentNumber.slice(0, -1);
    }

    updateDisplay();
}


// Calculate percentage
function percentage() {

    if (currentNumber === "Error") {
        return;
    }

    currentNumber = formatResult(
        Number(currentNumber) / 100
    );

    updateDisplay();
}


// Number buttons
numberButtons.forEach((button) => {

    button.addEventListener("click", () => {

        inputNumber(button.dataset.number);

    });

});


// Operator buttons
operatorButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const selectedOperator = button.dataset.operator;

        if (selectedOperator) {
            chooseOperator(selectedOperator);
        }

    });

});


// Action buttons
actionButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;


        switch (action) {

            case "clear":
                clearCalculator();
                break;

            case "delete":
                deleteNumber();
                break;

            case "decimal":
                inputDecimal();
                break;

            case "equals":
                calculate();
                break;

            case "percent":
                percentage();
                break;

        }

    });

});


// Keyboard support
document.addEventListener("keydown", (event) => {

    const key = event.key;


    // Numbers
    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
        return;
    }


    // Decimal
    if (key === ".") {
        inputDecimal();
        return;
    }


    // Operators
    if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
        return;
    }


    // Calculate
    if (key === "Enter" || key === "=") {
        calculate();
        return;
    }


    // Clear
    if (key === "Escape") {
        clearCalculator();
        return;
    }


    // Delete
    if (key === "Backspace") {
        deleteNumber();
        return;
    }


    // Percentage
    if (key === "%") {
        percentage();
    }

});
