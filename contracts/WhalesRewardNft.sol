// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./WhalesNftSwap.sol";


/// @title Reward NFT given to user for watching ads
contract WhalesRewardNft is ERC721URIStorage, AccessControl {
    /// @notice current tokenId
    uint256 public tokenId = 0;

    /// @notice Minter role
    /// @dev Backend's account should have this role
    bytes32 public constant MINTER = keccak256("MINTER");

    /// @notice Burner role
    /// @dev NFT Swap contract should have this role
    bytes32 public constant BURNER = keccak256("BURNER");

    /// @param name_ The name of the erc721 reward token
    /// @param symbol_ The symbol of the erc721 reward token
    /// @dev the caller is granted the admin role, along with the `MINTER` role
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(MINTER, msg.sender);
    }

    /// @notice Mints a new reward NFT
    /// @param to address of the nft receiver
    /// @param uri url of the NFT
    /// @dev increments `tokenId` BEFORE minting the nft. Requires caller to have the `MINTER` role.
    function mintFor(address to, string calldata uri) external onlyRole(MINTER) {
        tokenId += 1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /// @notice Burn a reward NFT, should be called by the `WhalesNftSwap` contract
    /// @param from the owner of the nft
    /// @param id the ID of the nft
    /// @dev This function makes sure that the nft is owned by `from` address.
    function burnFor(address from, uint256 id) external onlyRole(BURNER) {
        require(ownerOf(id) == from, "Nft not owned by this address!");
		_burn(id);
    }

    /// @notice Set the swap contract. Only admin can call this
    /// @param swap the address of `WhalesNftSwap` contract
    /// @dev grants `BURNER` role to `swap`
    function setSwapContract(WhalesNftSwap swap) external {
        grantRole(BURNER, address(swap));
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}