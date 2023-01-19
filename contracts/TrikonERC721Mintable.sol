// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrikonERC721Mintable is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;

    /**
     * @param _name Name of the contract
     * @param _symbol Symbol of the contract
     */
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        require(bytes(_name).length > 0, "TrikonERC721Mintable: name must not be empty");
        require(bytes(_symbol).length > 0, "TrikonERC721Mintable: symbol must not be empty");
    }

    /**
     * @notice public Function to mint NFTs
     * @param _tokenURI Token uri for the token to be minted
     */
    function mint(string memory _tokenURI) public returns (uint256) {
        require(bytes(_tokenURI).length > 0, "TrikonERC721Mintable: tokenURI must not be empty");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        return newItemId;
    }

    /**
     * @notice Get total supply of tokens
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}
