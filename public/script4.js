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

function calculateDecrease() {
    const initialValue = parseFloat(document.getElementById('initial-value2').value);
    const finalValue = parseFloat(document.getElementById('final-value2').value);

    if (isNaN(initialValue) || isNaN(finalValue)) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    const decrease = ((initialValue - finalValue) / initialValue) * 100;
    document.getElementById('result2').innerText = `Redução: ${decrease.toFixed(2)}%`;
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

// Função para conversão de moeda
function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const exchangeRate = getExchangeRate(fromCurrency, toCurrency); // Suponha uma função que obtém a taxa de câmbio

    if (isNaN(amount)) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    const convertedAmount = amount * exchangeRate;
    document.getElementById('conversion-result').innerText = `Resultado: ${convertedAmount.toFixed(2)} ${toCurrency}`;
}

function getExchangeRate(from, to) {
    // Aqui você pode adicionar lógica para obter a taxa de câmbio de uma API
    // Este é apenas um exemplo simples com uma taxa fixa
    const rates = {
        'USD': {'EUR': 0.84, 'BRL': 5.34},
        'EUR': {'USD': 1.19, 'BRL': 6.34},
        'BRL': {'USD': 0.19, 'EUR': 0.16}
    };
    return rates[from][to] || 1;
}
