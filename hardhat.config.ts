import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import '@typechain/hardhat';
import '@primitivefi/hardhat-dodoc';
import { config } from 'dotenv';
config();

const accounts = process.env.SIGNER ? [process.env.SIGNER] : [];

export default {
  solidity: "0.8.7",
  docdoc: {
    runOnCompile: true
  },
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 4000,
      },
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s2.binance.org:8545",
      accounts,
    },
    bsc_mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      accounts
    }
  },
};
