// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./WhalesRewardNft.sol";

/// @title Swapper for Reward NFT
contract WhalesNftSwap {
    using SafeERC20 for IERC20;

    /// @notice emitted whenever `to` is granted a reward of `amount`
    /// @param to receiver of the reward
    /// @param amount number of WHALES token sent to the user
    event RewardRedeemed(address to, uint256 amount);

    /// @notice address of Whales Token
    IERC20 public whalesToken;

    /// @notice `WhalesRewardNft` contract address
    /// @dev make sure that this has the `BURNER` role
    WhalesRewardNft public nftContract;

    /// @notice reward for swapping an nft
    uint256 public nftReward;

    /// @param whalesToken_ address of Whales Token contract
    /// @param nftContract_ address of Reward NFT contract
    /// @param nftReward_ reward per nft
    /// @dev Make sure to grant the role of `BURNER` to this address after deployed
    /// @dev Make sure to transfer the appropriate amount of whales token to this account after deploying
    constructor(IERC20 whalesToken_, WhalesRewardNft nftContract_, uint256 nftReward_) {
        whalesToken = whalesToken_;
        nftContract = nftContract_;
        nftReward = nftReward_;
    }

    /// @notice Swap a Whales NFT reward for Whales Token
    /// @param tokenId id of the nft. Must be owned by the sender.
    /// @dev burns `tokenId`, transers `nftReward` from this contract to sender, emits `RewardRedemmed` event
    function swapReward(uint256 tokenId) external {
        emit RewardRedeemed(msg.sender, nftReward);
        whalesToken.safeTransfer(msg.sender, nftReward);
        nftContract.burnFor(msg.sender, tokenId);
    }
}