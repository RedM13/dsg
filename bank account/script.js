let balance = 0.00;
let setAsideFunds = [];

function loadSavedData() {
    const savedBalance = localStorage.getItem('balance');
    const savedSetAsideFunds = localStorage.getItem('setAsideFunds');
    if (savedBalance !== null) {
        balance = parseFloat(savedBalance);
    }
    if (savedSetAsideFunds !== null) {
        setAsideFunds = JSON.parse(savedSetAsideFunds);
    }
    updateBalance();
    updateSetAsideList();
}

function saveData() {
    localStorage.setItem('balance', balance.toFixed(2));
    localStorage.setItem('setAsideFunds', JSON.stringify(setAsideFunds));
}

function updateBalance() {
    document.getElementById('balance').innerText = balance.toFixed(2);
}

function deposit() {
    let amount = parseFloat(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0) {
        showMessage('Please enter a valid amount.');
        return;
    }
    balance += amount;
    updateBalance();
    saveData();
    showMessage(`Deposited $${amount.toFixed(2)}.`);
    document.getElementById('amount').value = '';
}

function withdraw() {
    let amount = parseFloat(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0) {
        showMessage('Please enter a valid amount.');
        return;
    }
    if (amount > balance) {
        showMessage('Insufficient funds.');
        return;
    }
    balance -= amount;
    updateBalance();
    saveData();
    showMessage(`Withdrew $${amount.toFixed(2)}.`);
    document.getElementById('amount').value = '';
}

function setAside() {
    let amount = parseFloat(document.getElementById('setAsideAmount').value);
    let purpose = document.getElementById('purpose').value;
    if (isNaN(amount) || amount <= 0 || purpose.trim() === '') {
        showMessage('Please enter a valid amount and purpose.');
        return;
    }
    if (amount > balance) {
        showMessage('Insufficient funds to set aside.');
        return;
    }
    balance -= amount;
    setAsideFunds.push({ amount, purpose });
    updateBalance();
    updateSetAsideList();
    saveData();
    showMessage(`Set aside $${amount.toFixed(2)} for ${purpose}.`);
    document.getElementById('setAsideAmount').value = '';
    document.getElementById('purpose').value = '';
}

function setAsidePercentage() {
    let percentage = parseFloat(document.getElementById('setAsidePercentage').value) / 100;
    let purpose = document.getElementById('purposePercentage').value;
    if (isNaN(percentage) || percentage <= 0 || purpose.trim() === '') {
        showMessage('Please enter a valid percentage and purpose.');
        return;
    }
    let amount = percentage * balance;
    if (amount > balance) {
        showMessage('Insufficient funds to set aside.');
        return;
    }
    balance -= amount;
    setAsideFunds.push({ amount, purpose });
    updateBalance();
    updateSetAsideList();
    saveData();
    showMessage(`Set aside ${percentage * 100}% ($${amount.toFixed(2)}) for ${purpose}.`);
    document.getElementById('setAsidePercentage').value = '';
    document.getElementById('purposePercentage').value = '';
}

function updateSetAsideList() {
    let list = document.getElementById('setAsideList');
    list.innerHTML = '';
    setAsideFunds.forEach((fund, index) => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `
            ${fund.purpose}: $${fund.amount.toFixed(2)}
            <button class="delete-button" onclick="deleteSetAside(${index})">Delete</button>
        `;
        list.appendChild(listItem);
    });
}

function deleteSetAside(index) {
    let fund = setAsideFunds[index];
    balance += fund.amount;
    setAsideFunds.splice(index, 1);
    updateBalance();
    updateSetAsideList();
    saveData();
    showMessage(`Deleted set-aside fund for ${fund.purpose}.`);
}

function showMessage(message) {
    document.getElementById('message').innerText = message;
    setTimeout(() => {
        document.getElementById('message').innerText = '';
    }, 3000);
}

window.onload = loadSavedData;
