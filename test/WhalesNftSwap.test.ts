import chai from "chai";
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { WhalesRewardNft, WhalesRewardNft__factory, WhalesNftSwap, WhalesNftSwap__factory, DummyErc20, DummyErc20__factory } from "../typechain-types";
import { solidity } from "ethereum-waffle";

chai.use(solidity);
const { expect } = chai;

const REWARD_POOL = "100000000000000000000";
const NFT_REWARD  = "10000000000000000000"
const NFT_URI = "https://test.com";

describe("WhalesNftSwap", () => {
    let admin: SignerWithAddress;
    let addr1: SignerWithAddress;

    let rewardNft: WhalesRewardNft;
    let erc20: DummyErc20;
    let swapNft: WhalesNftSwap;

    beforeEach(async () => {
        [admin, addr1] = await ethers.getSigners();
        
        const RewardNft = await ethers.getContractFactory("WhalesRewardNft");
        rewardNft = await RewardNft.deploy("WHALES", "WHNFT");

        const DummyErc20: DummyErc20__factory = await ethers.getContractFactory("DummyErc20");
        erc20 = await DummyErc20.deploy();

        const SwapNft: WhalesNftSwap__factory = await ethers.getContractFactory("WhalesNftSwap");
        swapNft = await SwapNft.deploy(erc20.address, rewardNft.address, NFT_REWARD);

        const tx = await rewardNft.setSwapContract(swapNft.address);
        await tx.wait()
        const transferTx = await erc20.transfer(swapNft.address, REWARD_POOL);
        await transferTx.wait()
    });

    async function mintNft() {
        const tx = await rewardNft.mintFor(addr1.address, NFT_URI);
        await tx.wait();
    }

    it('swap nft', async () => {
        await mintNft();

        const tx = await swapNft.connect(addr1).swapReward(1);
        expect(tx)
            .to.emit(swapNft, 'RewardRedeemed')
            .withArgs(addr1.address, NFT_REWARD);
        
        await tx.wait();

        const bal = await erc20.balanceOf(addr1.address);
        expect(bal).to.equal(NFT_REWARD);
    });

    it('disallow swapping unowned nft', async () => {
        const tx = await swapNft.connect(addr1).swapReward(123131244);
        let err = true;
        try {
            await tx.wait();
            err = false;
        } catch (_) {}
        if (!err) throw new Error("expected to fail");
    });
})