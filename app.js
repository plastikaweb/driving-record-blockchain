const express = require('express');
const app = express();

const Block = require('./block');
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');

app.get('/', (req, res) => res.send('hello world'));
app.get('/blockchain', (req, res) => {
  const genesisBlock = new Block();
  const blockChain = new Blockchain(genesisBlock);
  const transaction = new Transaction('Mary', 'Jerry', 100);
  const block = blockChain.setNextBlock([transaction]);
  blockChain.addBlock(block);
  const transaction2 = new Transaction('Charles', 'Mary', 55);
  const transaction3 = new Transaction('John', 'Eva', 15);
  const block2 = blockChain.setNextBlock([transaction2, transaction3]);
  blockChain.addBlock(block2);

  res.json(blockChain);
});
app.listen(3000, () => console.log('server running'));