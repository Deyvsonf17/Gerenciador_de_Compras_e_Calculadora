const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3500;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Gerenciador_de_Compras',
    password: 'deyvson',
    port: 5460,
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/assinaturas', async (req, res) => {
    const { nome, produto, valor } = req.body;
    try {
        const client = await pool.connect();
        await client.query('INSERT INTO assinaturas (nome, produto, valor) VALUES ($1, $2, $3)', [nome, produto, valor]);
        res.send('Assinatura adicionada com sucesso!');
        client.release();
    } catch (err) {
        console.error('Erro ao inserir assinatura', err);
        res.status(500).send('Erro ao inserir assinatura');
    }
});

app.get('/assinaturas', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM assinaturas');
        res.json(result.rows);
        client.release();
    } catch (err) {
        console.error('Erro ao buscar assinaturas', err);
        res.status(500).send('Erro ao buscar assinaturas');
    }
});

app.delete('/assinaturas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        await client.query('DELETE FROM assinaturas WHERE id = $1', [id]);
        res.send('Assinatura excluída com sucesso!');
        client.release();
    } catch (err) {
        console.error('Erro ao excluir assinatura', err);
        res.status(500).send('Erro ao excluir assinatura');
    }
});

app.post('/compras-parceladas', async (req, res) => {
    const { name, product, value, installments } = req.body;
    try {
        const client = await pool.connect();
        const status_pagamento = {};
        for (let i = 1; i <= installments; i++) {
            status_pagamento[`parcela_${i}`] = false;
        }
        await client.query('INSERT INTO compras_parceladas (nome, produto, valor, parcelas, status_pagamento) VALUES ($1, $2, $3, $4, $5)', [name, product, value, installments, status_pagamento]);
        res.send('Compra parcelada adicionada com sucesso!');
        client.release();
    } catch (err) {
        console.error('Erro ao inserir compra parcelada', err);
        res.status(500).send('Erro ao inserir compra parcelada');
    }
});

app.get('/compras-parceladas', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM compras_parceladas');
        res.json(result.rows);
        client.release();
    } catch (err) {
        console.error('Erro ao buscar compras parceladas', err);
        res.status(500).send('Erro ao buscar compras parceladas');
    }
});

app.patch('/compras-parceladas/:name/:product', async (req, res) => {
    const { name, product } = req.params;
    const { installment, paid } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT status_pagamento FROM compras_parceladas WHERE nome = $1 AND produto = $2', [name, product]);
        const statusPagamento = result.rows[0].status_pagamento;
        statusPagamento[`parcela_${installment}`] = paid;
        await client.query('UPDATE compras_parceladas SET status_pagamento = $1 WHERE nome = $2 AND produto = $3', [statusPagamento, name, product]);
        res.send('Status de pagamento atualizado com sucesso!');
        client.release();
    } catch (err) {
        console.error('Erro ao atualizar status de pagamento', err);
        res.status(500).send('Erro ao atualizar status de pagamento');
    }
});

app.delete('/compras-parceladas/:name/:product', async (req, res) => {
    const { name, product } = req.params;
    try {
        const client = await pool.connect();
        await client.query('DELETE FROM compras_parceladas WHERE nome = $1 AND produto = $2', [name, product]);
        res.send('Compra parcelada excluída com sucesso!');
        client.release();
    } catch (err) {
        console.error('Erro ao excluir compra parcelada', err);
        res.status(500).send('Erro ao excluir compra parcelada');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
