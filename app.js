const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let port = 3000;
let nodes = [];

const BlockChainNode = require('./blockchain-node');
const Block = require('./block');
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');
let transactions = [];
const blockChain = new Blockchain(new Block());

process.argv.forEach((val, index, arr) => {
  port = arr[2] || port;
});

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('hello world'));

app.post('/nodes/register', (req, res) => {
  let nodesList = req.body.urls;
  nodesList.forEach((node) => nodes = [...nodes, new BlockChainNode(node.url)]);

  res.json(nodes);
});

app.get('/nodes', (req, res) => res.json(nodes));

app.get('/blockchain', (req, res) => res.json(blockChain));

app.get('/mine', (req, res) => {
  const block = blockChain.setNextBlock(transactions);
  blockChain.addBlock(block);
  transactions = [];
  res.json(block);
});

app.post('/transactions', (req, res) => {
  const {
    to,
    from,
    amount
  } = req.body;
  transactions = [...transactions, new Transaction(from, to, amount)];

  res.json(transactions);
});

app.listen(port, () => console.log('server running'));