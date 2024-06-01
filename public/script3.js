document.addEventListener('DOMContentLoaded', (event) => {
    const calcDisplay = document.getElementById('calc-display');
    if (calcDisplay) {
        document.addEventListener('keydown', (e) => {
            if ((e.key >= 0 && e.key <= 9) || e.key === '.' || e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                appendToDisplay(e.key);
            } else if (e.key === 'Enter') {
                calculateExpression();
            } else if (e.key === 'Backspace') {
                clearDisplay();
            }
        });
    }
});

function addPercentageSymbol(input) {
    // Remove any non-numeric characters except the percentage symbol
    input.value = input.value.replace(/[^\d.%]/g, '');
    if (input.value.length > 0 && !input.value.includes('%')) {
        input.value += '%';
    }
}

function calculateIncrease() {
    const initialValue = parseFloat(document.getElementById('initial-value1').value);
    const newValue = parseFloat(document.getElementById('new-value1').value);
    const increase = ((newValue - initialValue) / initialValue) * 100;
    document.getElementById('result1').innerText = `Aumento: ${increase.toFixed(2)}%`;
}

function calculateDecrease() {
    const initialValue = parseFloat(document.getElementById('initial-value2').value);
    const finalValue = parseFloat(document.getElementById('final-value2').value);
    const decrease = ((initialValue - finalValue) / initialValue) * 100;
    document.getElementById('result2').innerText = `Redução: ${decrease.toFixed(2)}%`;
}

function calculatePercentage() {
    const percentage = parseFloat(document.getElementById('percentage').value.replace('%', ''));
    const value = parseFloat(document.getElementById('value').value);
    const result = (percentage / 100) * value;
    document.getElementById('result3').innerText = `Resultado: ${result.toFixed(2)}`;
}

function appendToDisplay(value) {
    document.getElementById('calc-display').value += value;
}

function clearDisplay() {
    document.getElementById('calc-display').value = '';
}

function calculateExpression() {
    try {
        const expression = document.getElementById('calc-display').value;
        const result = eval(expression);
        document.getElementById('calc-display').value = result;
    } catch (error) {
        document.getElementById('calc-display').value = 'Erro';
    }
}
