var Invoice = artifacts.require("./Invoice.sol");

module.exports = function(deployer) {
  deployer.deploy(Invoice, 0, 0, "0x0", "0x0", 0 ,"0x0",["0x0"], 0, 0, 0);
};
