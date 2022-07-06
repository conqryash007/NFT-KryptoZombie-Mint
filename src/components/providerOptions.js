import WalletConnect from "@walletconnect/web3-provider";

export const providerOptions = {
  walletconnect: {
    package: WalletConnect, // required
    options: {
      infuraId: "d74a4e3b04cc4061a37770132b6fd0b6", // required
    },
  },
};
