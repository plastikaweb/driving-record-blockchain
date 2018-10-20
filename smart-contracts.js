class SmartContract {
	apply(transaction, blocks) {
		blocks.forEach(block => {
			block.transactions.forEach(trans => {
				if (trans.driverLicense === transaction.driverLicense) {
					transaction.noOfViolations++;
					if (transaction.noOfViolations > 5) {
						transaction.isDriverLicenseSuspended = true;
					}
				}
			})
		});
	}
}

module.exports = SmartContract;
