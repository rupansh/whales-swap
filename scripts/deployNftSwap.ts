import { config } from "dotenv";
import hre from "hardhat";
import { WhalesNftSwap } from "../typechain-types";
import { deploy } from "./common";
config();

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const erc20Contract = process.env.ERC20_ADDR;
  const rewardContract = process.env.REWARD_NFT_ADDR!;
  const reward = hre.ethers.BigNumber.from(process.env.SWAP_REWARD!);
  const rewardPool = hre.ethers.BigNumber.from(process.env.SWAP_REWARD_POOL!);

  if (!erc20Contract) {
    throw Error("ERC20 contract required in .env!");
  }
  if (!rewardContract) {
    throw Error("ERC721 Reward contract required in .env!");
  }

  const erc20 = (await hre.ethers.getContractFactory("DummyErc20")).attach(erc20Contract).connect(owner);
  const rewardNft = (await hre.ethers.getContractFactory("WhalesRewardNft")).attach(rewardContract).connect(owner);
  

  const swapper = await deploy("WhalesNftSwap", ...[erc20Contract, rewardContract, reward]) as WhalesNftSwap;
  console.log("sending reward pool");
  const tx = await erc20.callStatic.transfer(swapper.address, rewardPool);
  if (!tx) {
    throw Error("failed to send reward pool to swapper, transfer call rejected by erc20");
  }
  const signed = await erc20.transfer(swapper.address, rewardPool);
  await signed.wait();
  console.log("done!", signed.hash);

  console.log("setting burner role");
  const swapTx = await rewardNft.setSwapContract(swapper.address);
  await swapTx.wait();
  console.log("done!", swapTx.hash);
}
  
main()
  .then(() => process.exit(0))
  .catch(error => {
  console.error(error);
  process.exit(1);
});