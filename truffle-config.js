let HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider();
        // mnemonic,
        // "https://rinkeby.infura.io/v3/d74a4e3b04cc4061a37770132b6fd0b6"
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    },
  },

  contracts_directory: "./src/contracts",
  contracts_build_directory: "./src/abis",

  compilers: {
    solc: {
      version: "^0.8.4", // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: false,
          runs: 200,
        },
      },
    },
  },
};
