const KryptoBird = artifacts.require("KryptoBird");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(KryptoBird, { from: accounts[0] });
};
