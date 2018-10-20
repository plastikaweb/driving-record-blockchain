class Transaction {
  constructor(driverLicense, violationDate, violationType) {
    this.driverLicense = driverLicense;
    this.violationDate = violationDate;
    this.violationType = violationType;
    this.noOfViolations = 1;
    this.isDriverLicenseSuspended = false;
  }
}

module.exports = Transaction;
