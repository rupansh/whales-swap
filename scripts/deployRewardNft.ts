import { config } from "dotenv";
import hre from "hardhat";
import { deploy } from "./common";
config();

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const name = process.env.REWARD_NFT_NAME!
  const symbol = process.env.REWARD_NFT_SYMBOL!;

  if (!name) {
    throw Error("ERC721 contract name in .env!");
  }
  if (!symbol) {
    throw Error("ERC721 symbol required in .env!");
  }
  

  await deploy("WhalesRewardNft", name, symbol);
}
  
main()
  .then(() => process.exit(0))
  .catch(error => {
  console.error(error);
  process.exit(1);
});