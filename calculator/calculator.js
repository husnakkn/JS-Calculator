const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');
const display_history = document.querySelector('.display .history');

let input = "";
let history = [];
let lastKeyWasEquals = false;

for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        console.log(`Key pressed: ${value}`);

        if (value == "clear") {
            clearCalculator();
        } else if (value == "backspace") {
            handleBackspace();
        } else if (value == "=") {
            evaluateExpression();
        } else if (value == "brackets") {
            handleBrackets();
        } else if (value == "H") {
            toggleHistory();
        } else {
            handleInput(value);
        }
    });
}

function clearCalculator() {
    input = "";
    display_input.innerHTML = "";
    display_output.innerHTML = "";
    lastKeyWasEquals = false;
}

function handleBackspace() {
    input = input.slice(0, -1);
    display_input.innerHTML = CleanInput(input);
}

function evaluateExpression() {
    try {
        let result = evaluateExpressionWithPrecedence(input);
        display_output.innerHTML = CleanOutput(result);
        updateHistory(`${input} = ${result}`);
        input = "";
        lastKeyWasEquals = true;
    } catch (e) {
        display_output.innerHTML = "Error";
    }
}

function handleBrackets() {
    let countOpen = (input.match(/\(/g) || []).length;
    let countClose = (input.match(/\)/g) || []).length;

    if (countOpen === countClose) {
        input += "(";
    } else if (countOpen > countClose) {
        input += ")";
    }

    display_input.innerHTML = CleanInput(input);
    lastKeyWasEquals = false;
}

function toggleHistory() {
    display_history.classList.toggle('hidden');
}

function handleInput(value) {
    if (lastKeyWasEquals) {
        if (!isNaN(value)) {
            input = value;
            display_input.innerHTML = CleanInput(input);
            display_output.innerHTML = "";
        } else {
            input = "";
            display_input.innerHTML = "";
        }
        lastKeyWasEquals = false;
    } else {
        if (ValidateInput(value)) {
            input += value;
            display_input.innerHTML = CleanInput(input);
        }
    }
    display_history.classList.add('hidden');
}

function updateHistory(entry) {
    if (history.length >= 5) {
        history.shift();
    }
    history.push(entry);
    display_history.innerHTML = history.map(item => `<div>${item}</div>`).join('');
}

function CleanInput(input) {
    let cleanedInput = input.replace(/\//g, `<span class="operator">÷</span>`)
    
                           .replace(/\*/g, `<span class="operator">x</span>`)
                           .replace(/\+/g, `<span class="operator">+</span>`)
                           .replace(/-/g, `<span class="operator">-</span>`)
                           .replace(/\(/g, `<span class="brackets">(</span>`)
                           .replace(/\)/g, `<span class="brackets">)</span>`);

    return cleanedInput;
}


function CleanOutput(output) {
    let roundedOutput = parseFloat(output.toFixed(5)); 
    let output_string = roundedOutput.toString();
    let decimal = output_string.split(".")[1];
    output_string = output_string.split(".")[0];

    let output_array = output_string.split("");

    if (output_array.length > 3) {
        for (let i = output_array.length - 3; i > 0; i -= 3) {
            output_array.splice(i, 0, ",");
        }
    }

    if (decimal) {
        output_array.push(".");
        output_array.push(decimal);
    }

    return output_array.join("");
}

function ValidateInput(value) {
    let last_input = input.slice(-1);
    let operators = ["+", "-", "*", "/"];

    if (value == "." && last_input == ".") {
        return false;
    }

    if (operators.includes(value)) {
        if (operators.includes(last_input)) {
            return false;
        } else {
            return true;
        }
    }

    return true;
}

function evaluateExpressionWithPrecedence(expression) {
    while (expression.includes('(')) {
        let startIndex = expression.lastIndexOf('(');
        let endIndex = expression.indexOf(')', startIndex);

        if (endIndex === -1) {
            throw new Error('Missing closing parenthesis');
        }

        let subExpression = expression.substring(startIndex + 1, endIndex);
        let subResult = eval(PerpareInput(subExpression));

        expression = expression.substring(0, startIndex) + subResult + expression.substring(endIndex + 1);
    }

    return eval(PerpareInput(expression));
}

function PerpareInput(input) {

    return input;
}
