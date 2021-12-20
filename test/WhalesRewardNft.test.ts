import chai from "chai";
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { WhalesRewardNft, WhalesRewardNft__factory } from "../typechain-types";
import { solidity } from "ethereum-waffle";
import { ContractTransaction } from "@ethersproject/contracts";
import { watch } from "fs";

chai.use(solidity);
const { expect } = chai;

const NFT_URI = "https://test.com";

describe("WhalesRewardNft", () => {
    let admin: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;

    let rewardNft: WhalesRewardNft;

    beforeEach(async () => {
        [admin, addr1, addr2] = await ethers.getSigners();
        
        const RewardNft: WhalesRewardNft__factory = await ethers.getContractFactory("WhalesRewardNft");
        rewardNft = await RewardNft.deploy("WHALES", "WHNFT");

        const tx = await rewardNft.setSwapContract(addr1.address);
        await tx.wait();
    });

    async function mintNft(): Promise<void> {
        const tx = await rewardNft.mintFor(addr2.address, NFT_URI);
        await tx.wait();
    }

    it('mint nft', async () => {
        let tokenId = await rewardNft.tokenId();
        await mintNft();
        tokenId = tokenId.add(1);
        expect(await rewardNft.tokenId()).to.equal(tokenId);
        expect(await rewardNft.ownerOf(tokenId)).to.equal(addr2.address);
        expect(await rewardNft.tokenURI(tokenId)).to.equal(NFT_URI);
    });

    it('mint nft should be MINTER only', async () => {
        const tx = await rewardNft.connect(addr1).mintFor(addr1.address, NFT_URI);
        try {
            await tx.wait();
            throw new Error("expected to fail")
        } catch (_) {}
    });

    it('burn nft', async () => {
        await mintNft();
        const tx = await rewardNft.connect(addr1).burnFor(addr2.address, 1);
        await tx.wait();
        let err = true;
        try {
            await rewardNft.ownerOf(1);
            err = false;
        } catch (_) {}
        if (!err) throw new Error("expected to fail");
    });

    it('burn nft should be BURNER only', async () => {
        await mintNft();
        const tx = await rewardNft.connect(addr2).burnFor(addr2.address, 1);
        let err = true;
        try {
            await tx.wait();
            err = false;
        } catch (_) {}
        if (!err) throw new Error("expected to fail");
    });

    it('burnFor should verify the owner', async () => {
        await mintNft();
        const tx = await rewardNft.connect(addr1).burnFor(admin.address, 1);
        let err = true;
        try {
            await tx.wait();
            err = false;
        } catch (_) {}
        if (!err) throw new Error("expected to fail");
    });

    it('burnFor should fail with nonexistent tokens', async () => {
        const tx = await rewardNft.connect(addr1).burnFor(addr1.address, 43423232);

        let err = true;
        try {
            await tx.wait();
            err = false;
        } catch (_) {}
        if (!err) throw new Error("expected to fail");
    });
})