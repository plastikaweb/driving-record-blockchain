class SmartContract {
	apply(transaction, blocks) {
		blocks.forEach(block => {
			block.transactions.forEach(trans => {
				if (trans.driverLicenseNumber === transaction.driverLicenseNumber) {
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
