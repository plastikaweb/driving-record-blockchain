const sha256 = require('js-sha256');
const Block = require('./block');

class BlockChain {

	constructor(genesisBlock) {
		this.blocks = [];
		this.addBlock(genesisBlock);
	}

	addBlock(block) {
		if (!this.blocks.length) {
			block.previousHash = '0000000000000000000000000';
			block.hash = this.generateHash(block);
		}

		this.blocks = [...this.blocks, block];
	}

	setNextBlock(transactions) {
		let block = new Block();

		transactions.forEach(transaction => {
			block.addTransaction(transaction);
		});

		block.index = this.blocks.length;
		block.previousHash = this.getPreviousBlockHash();
		block.hash = this.generateHash(block);

		return block;
	}

	getPreviousBlockHash() {
		return this.blocks[this.blocks.length - 1].hash;
	}

	generateHash(block) {
		let hash = sha256(block.key);
		while (!hash.startsWith('000')) {
			block.nonce += 1;
			hash = sha256(block.key);
			console.log(hash);
		}
		return hash;
	}

	transactionsByDriver(licenseNumber) {
		const transactions = [];
		this.blocks.forEach(block => {
			block.transactions.forEach(trans => {
				if (licenseNumber === trans.driverLicenseNumber) {
					transactions.push(trans);
				}
			});
		});
		return transactions;
	}
}

module.exports = BlockChain;
