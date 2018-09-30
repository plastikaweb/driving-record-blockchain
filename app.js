const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Block = require('./block');
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');
let transactions = [];
const blockChain = new Blockchain(new Block());

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('hello world'));

app.get('/blockchain', (req, res) => {
  res.json(blockChain);
});

app.get('/mine', (req, res) => {
  const block = blockChain.setNextBlock(transactions);
  blockChain.addBlock(block);
  res.json(block);
});

app.post('/transactions', (req, res) => {
  const { to, from, amount } = req.body;
  transactions = [...transactions, new Transaction(from, to, amount)];

  res.json(transactions);
});

app.listen(3000, () => console.log('server running'));