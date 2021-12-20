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
    }
  },
};
