document.addEventListener('DOMContentLoaded', function() {
    async function loadPurchases() {
        try {
            const response = await fetch('http://localhost:3500/compras-parceladas');
            const purchases = await response.json();

            const purchaseList = document.getElementById('purchase-list');
            purchaseList.innerHTML = '';

            purchases.forEach(purchase => {
                const row = document.createElement('tr');

                const installmentsSelect = document.createElement('select');
                installmentsSelect.classList.add('installments-select');

                const emptyOption = document.createElement('option');
                emptyOption.value = '';
                emptyOption.innerText = 'Parcelas';
                emptyOption.disabled = true;
                emptyOption.selected = true;
                installmentsSelect.appendChild(emptyOption);

                for (let i = 1; i <= purchase.parcelas; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.innerText = `Parcela ${i}`;
                    installmentsSelect.appendChild(option);
                }

                const statusContainer = document.createElement('div');
                statusContainer.classList.add('status');
                statusContainer.textContent = 'Selecione uma parcela';

                row.innerHTML = `
                    <td>${purchase.nome}</td>
                    <td>${purchase.produto}</td>
                    <td>R$ ${parseFloat(purchase.valor).toFixed(2)}</td>
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

                installmentsSelect.addEventListener('change', function(event) {
                    event.preventDefault(); // Evita a atualização da página

                    const selectedInstallment = installmentsSelect.value;
                    if (selectedInstallment) {
                        const status = purchase.status_pagamento[`parcela_${selectedInstallment}`];
                        let statusText;
                        if (status && status.pago) {
                            const formattedDate = formatDate(status.data_pagamento);
                            statusText = `Pago em: ${formattedDate}`;
                        } else {
                            statusText = 'Falta Pagar';
                        }

                        statusContainer.innerHTML = `
                            <div class="checkbox-wrapper">
                                <input type="checkbox" data-installment="${selectedInstallment}" ${status && status.pago ? 'checked' : ''}>
                                <span class="${status && status.pago ? 'paid' : 'not-paid'}">${statusText}</span>
                            </div>
                        `;

                        const checkbox = statusContainer.querySelector('input[type="checkbox"]');

                        checkbox.addEventListener('change', async function(event) {
                            event.preventDefault(); // Evita a atualização da página

                            const paid = checkbox.checked;
                            const installment = checkbox.dataset.installment;

                            try {
                                await fetch(`http://localhost:3500/compras-parceladas/${purchase.nome}/${purchase.produto}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        installment,
                                        paid
                                    })
                                });

                                // Atualizar o status do pagamento no frontend sem recarregar a página
                                const updatedStatus = paid ? `Pago em: ${formatDate(new Date())}` : 'Falta Pagar';
                                statusContainer.querySelector('span').textContent = updatedStatus;
                                statusContainer.querySelector('span').className = paid ? 'paid' : 'not-paid';

                            } catch (err) {
                                console.error('Erro ao atualizar status de pagamento', err);
                            }
                        });
                    } else {
                        statusContainer.textContent = 'Selecione uma parcela';
                    }
                });
            });
        } catch (err) {
            console.error('Erro ao carregar compras parceladas', err);
        }
    }

    loadPurchases();

    document.getElementById('purchase-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Evita a atualização da página ao enviar o formulário

        const name = document.getElementById('name').value;
        const product = document.getElementById('product').value;
        const value = document.getElementById('value').value;
        const installments = document.getElementById('installments').value;

        fetch('http://localhost:3500/compras-parceladas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                name,
                product,
                value,
                installments
            })
        }).then(response => {
            if (response.ok) {
                loadPurchases();
            }
        }).catch(err => console.error('Erro ao adicionar compra parcelada', err));
    });

    document.getElementById('purchase-list').addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-button')) {
            const row = e.target.closest('tr');
            const confirmDelete = confirm('Você tem certeza que deseja excluir esta compra?');
            if (confirmDelete) {
                const name = row.cells[0].innerText;
                const product = row.cells[1].innerText;

                fetch(`http://localhost:3500/compras-parceladas/${name}/${product}`, {
                    method: 'DELETE'
                }).then(response => {
                    if (response.ok) {
                        loadPurchases();
                    }
                }).catch(err => console.error('Erro ao excluir compra parcelada', err));
            }
        }
    });
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
const valueInput = document.getElementById("value");

valueInput.addEventListener("input", function() {
  let valor = this.value.replace(/\D/g, '');
  valor = (valor / 100).toFixed(2);
  this.value = valor ? 'R$ ' + valor : '';
});


  
