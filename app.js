const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const sha256 = require('js-sha256');

const app = express();
let port = 3000;
let nodes = [];

const BlockChainNode = require('./blockchain-node');
const Block = require('./block');
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');
let transactions = [];
let blockChain = new Blockchain(new Block());

app.use(bodyParser.json());

process.argv.forEach((val, index, arr) => {
  port = arr[2] || port;
});

app.get('/resolve', (req, res) => {
  nodes.forEach((node) => {
    fetch(`${node.url}/blockchain`)
      .then(response => response.json())
      .then(otherBlockChain => {
        if (blockChain.blocks.length < otherBlockChain.blocks.length) {
          blockChain = otherBlockChain;
        }
        res.send(blockChain);
      })
      .catch(err => console.log(err));
  });
});

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
    driverLicenseNumber,
    voilationDate,
    voilationType
  } = req.body;
  transactions = [...transactions, new Transaction(sha256(driverLicenseNumber), voilationDate, voilationType)];

  res.json(transactions);
});

app.listen(port, () => console.log('server running'));
