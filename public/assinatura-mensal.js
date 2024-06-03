
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3500/assinaturas')
        .then(response => response.json())
        .then(data => {
            const purchaseList = document.getElementById('purchase-list').querySelector('tbody');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.dataset.id = item.id; // Adicione o ID da assinatura à linha
                
                const installmentsSelect = document.createElement('select');
                installmentsSelect.classList.add('installments-select');
                generateMonthYearOptions(installmentsSelect);
                
                const statusContainer = document.createElement('div');
                statusContainer.classList.add('status');
                statusContainer.textContent = 'Falta Pagar';
                
                row.innerHTML = `
                    <td>${item.nome}</td>
                    <td>${item.produto}</td>
                    <td>${item.valor}</td>
                `;
                
                const installmentsCell = document.createElement('td');
                installmentsCell.appendChild(installmentsSelect);
                
                const statusCell = document.createElement('td');
                statusCell.appendChild(statusContainer);
                
                row.appendChild(installmentsCell);
                row.appendChild(statusCell);
                
                const actionsCell = document.createElement('td');
                actionsCell.classList.add('actions');
                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.classList.add('edit-button');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.classList.add('delete-button');
                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);
                
                row.appendChild(actionsCell);
                
                purchaseList.appendChild(row);
            });
        })
        .catch(error => console.error('Erro:', error));
});


















document.getElementById('purchase-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('name').value;
    const produto = document.getElementById('product').value;
    const valor = document.getElementById('value').value;

    const purchaseList = document.getElementById('purchase-list').querySelector('tbody');
    
    const row = document.createElement('tr');
    
    const installmentsSelect = document.createElement('select');
    installmentsSelect.classList.add('installments-select');
    
    generateMonthYearOptions(installmentsSelect);
    
    const statusContainer = document.createElement('div');
    statusContainer.classList.add('status');
    statusContainer.textContent = 'Falta Pagar';
    
    row.innerHTML = `
        <td>${nome}</td>
        <td>${produto}</td>
        <td>${valor}</td>
    `;
    
    const installmentsCell = document.createElement('td');
    installmentsCell.appendChild(installmentsSelect);
    
    const statusCell = document.createElement('td');
    statusCell.appendChild(statusContainer);
    
    row.appendChild(installmentsCell);
    row.appendChild(statusCell);
    
    const actionsCell = document.createElement('td');
    actionsCell.classList.add('actions');
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('edit-button');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.classList.add('delete-button');
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    
    row.appendChild(actionsCell);
    
    purchaseList.appendChild(row);
    
    document.getElementById('purchase-form').reset();

    // Enviar dados para o servidor
    fetch('http://localhost:3500/assinaturas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `nome=${encodeURIComponent(nome)}&produto=${encodeURIComponent(produto)}&valor=${encodeURIComponent(valor)}`
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch(error => console.error('Erro:', error));
});

function generateMonthYearOptions(selectElement) {
    const currentYear = new Date().getFullYear();
    const months = [
        '01', '02', '03', '04', '05', '06',
        '07', '08', '09', '10', '11', '12'
    ];

    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.innerText = 'Mensalidade';
    emptyOption.disabled = true;
    emptyOption.selected = true;
    selectElement.appendChild(emptyOption);

    for (let year = currentYear; year <= currentYear + 1; year++) {
        for (let month of months) {
            const option = document.createElement('option');
            option.value = `${month}/${year}`;
            option.innerText = `${month}/${year}`;
            selectElement.appendChild(option);
        }
    }
}

document.getElementById('purchase-list').addEventListener('change', function(e) {
    if (e.target.classList.contains('installments-select') && e.target.selectedIndex !== 0) {
        const select = e.target;
        const selectedInstallment = select.value;
        
        const currentRow = select.closest('tr');
        const statusContainer = currentRow.querySelector('.status');
        statusContainer.innerHTML = '';
        
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.classList.add('checkbox-wrapper');
        
        const statusText = document.createElement('span');
        statusText.innerText = 'Falta Pagar';
        statusText.classList.add('not-paid');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.installment = selectedInstallment;
        checkbox.checked = false;

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(statusText);
        statusContainer.appendChild(checkboxWrapper);

        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                const date = new Date().toLocaleDateString('pt-BR');
                statusText.textContent = `Pago em: ${date}`;
                statusText.classList.remove('not-paid');
                statusText.classList.add('paid');
                
                const otherCheckboxes = currentRow.querySelectorAll(`input[type="checkbox"]:not([data-installment="${selectedInstallment}"])`);
                otherCheckboxes.forEach(cb => {
                    cb.checked = false;
                    const otherStatusText = cb.nextElementSibling;
                    otherStatusText.textContent = 'Falta Pagar';
                    otherStatusText.classList.remove('paid');
                    otherStatusText.classList.add('not-paid');
                });
            } else {
                statusText.textContent = 'Falta Pagar';
                statusText.classList.remove('paid');
                statusText.classList.add('not-paid');
            }
        });
    }
});

document.getElementById('purchase-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-button')) {
        const row = e.target.closest('tr');
        alert('Atenção: ao editar, o status de pagamento será redefinido.');
        
        const name = prompt('Editar Nome da Pessoa:', row.cells[0].innerText);
        const product = prompt('Editar Produto:', row.cells[1].innerText);
        const value = prompt('Editar Valor do Produto:', row.cells[2].innerText);

        if (name && product && value) {
            row.cells[0].innerText = name;
            row.cells[1].innerText = product;
            row.cells[2].innerText = value;
            
            const statusContainer = row.querySelector('.status');
            statusContainer.innerHTML = '';
        }
    }

    if (e.target.classList.contains('delete-button')) {
        const row = e.target.closest('tr');
        const confirmDelete = confirm('Você tem certeza que deseja excluir esta compra?');
        if (confirmDelete) {
            const id = row.dataset.id;
            fetch(`http://localhost:3500/assinaturas/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.text())
            .then(data => {
                alert(data);
                row.remove();
            
            })
            .catch(error => console.error('Erro:', error));
        }
    }
});

const valueInput = document.getElementById("value");

valueInput.addEventListener("input", function() {
  let valor = this.value.replace(/\D/g, '');
  valor = (valor / 100).toFixed(2);
  this.value = valor ? 'R$ ' + valor : '';
});

