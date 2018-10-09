class Transaction {
  constructor(driverLicense, voilationDate, voilationType) {
    this.driverLicense = driverLicense;
    this.voilationDate = voilationDate;
    this.voilationType = voilationType;
    this.noOfVoilations = 1;
    this.isDriverLicenseSuspended = false;
  }
}

module.exports = Transaction;
