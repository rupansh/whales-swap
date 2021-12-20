import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import '@typechain/hardhat';

export default {
  solidity: "0.8.7",
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 4000,
      },
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s2.binance.org:8545",
      accounts: [process.env.SIGNER],
    }
  },
};
