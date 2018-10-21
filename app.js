const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const sha256 = require('js-sha256');
const SmartContract = require('./smart-contracts');

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
	const smartContract = new SmartContract();
	const {
		driverLicenseNumber,
		violationDate,
		violationType
	} = req.body;
	const transaction = new Transaction(sha256(driverLicenseNumber), violationDate, violationType);
	smartContract.apply(transaction, blockChain.blocks);
	transactions = [...transactions, transaction];

	res.json(transactions);
});

app.get('/driving-records/:driverLicenseNumber', (req, res) => {
	const {driverLicenseNumber} = req.params;
	const transactions = blockChain.transactionsByDriver(sha256(driverLicenseNumber));
	res.json(transactions);
});

app.listen(port, () => console.log('server running'));
