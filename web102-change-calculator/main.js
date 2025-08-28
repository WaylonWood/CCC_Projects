document.addEventListener('DOMContentLoaded', function () {
    const amountDueInput = document.getElementById('amount-due');
    const amountReceivedInput = document.getElementById('amount-received');
    const calculateButton = document.getElementById('calculate-change');
    const clearButton = document.getElementById('clear-fields');
    const dollarsOutput = document.getElementById('dollars-output');
    const quartersOutput = document.getElementById('quarters-output');
    const dimesOutput = document.getElementById('dimes-output');
    const nickelsOutput = document.getElementById('nickels-output');
    const penniesOutput = document.getElementById('pennies-output');
    const mainGrid = document.querySelector('.main-grid');
    const breakdownCards = document.querySelectorAll('.breakdown-card');
    const denominations = document.querySelectorAll('.denomination');
    const resultsArea = document.querySelector('.results-area');
    const changeDisplay = document.getElementById('change-display');
    const changeAmount = document.getElementById('change-amount');

    function clearOutputs() {
    dollarsOutput.textContent = '0';
    quartersOutput.textContent = '0';
    dimesOutput.textContent = '0';
    nickelsOutput.textContent = '0';
    penniesOutput.textContent = '0';
    animateChangeAmount(0);
    changeDisplay.classList.remove('animate');
    breakdownCards.forEach(card => card.classList.remove('animate'));
    denominations.forEach(denom => denom.classList.remove('animate'));
    resultsArea.style.opacity = '0';
    mainGrid.classList.remove('calculated');
    }

    function calculateChange() {
        const due = parseFloat(amountDueInput.value);
        const received = parseFloat(amountReceivedInput.value);

        if (isNaN(due) || isNaN(received) || due < 0 || received < 0 || received < due) {
            clearOutputs();
            return;
        }

        let change = received - due;
        change = Math.round(change * 100) / 100;
        animateChangeAmount(change);
        changeDisplay.classList.add('animate');

        let cents = Math.round(change * 100);
        const dollars = Math.floor(cents / 100);
        cents %= 100;
        const quarters = Math.floor(cents / 25);
        cents %= 25;
        const dimes = Math.floor(cents / 10);
        cents %= 10;
        const nickels = Math.floor(cents / 5);
        cents %= 5;
        const pennies = cents;

        dollarsOutput.textContent = dollars;
        quartersOutput.textContent = quarters;
        dimesOutput.textContent = dimes;
        nickelsOutput.textContent = nickels;
        penniesOutput.textContent = pennies;

        // Trigger animations
        mainGrid.classList.add('calculated');
        resultsArea.style.opacity = '1';
        breakdownCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 150);
        });
        denominations.forEach((denom, index) => {
            setTimeout(() => {
                denom.classList.add('animate');
            }, 500 + index * 120);
        });
    }

    // Animate the change amount counting up
    function animateChangeAmount(targetAmount) {
        const duration = 800;
        const start = parseFloat(changeAmount.textContent.replace('$','')) || 0;
        const end = targetAmount;
        const startTime = performance.now();
        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = start + (end - start) * progress;
            changeAmount.textContent = `$${current.toFixed(2)}`;
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }

    calculateButton.addEventListener('click', calculateChange);
    clearButton.addEventListener('click', function () {
        amountDueInput.value = '';
        amountReceivedInput.value = '';
        clearOutputs();
    });

    clearOutputs();
    changeDisplay.classList.remove('animate');
});
