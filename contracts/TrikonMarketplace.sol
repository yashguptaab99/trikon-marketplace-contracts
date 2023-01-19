// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./lib/CurrencyTransferLib.sol";

contract TrikonMarketplace is ReentrancyGuard {
    /// @notice Structure for listed items
    struct SaleItem {
        address payable seller;
        uint256 price;
        address currency;
    }

    /// @notice NftAddress -> Token ID -> Listing item
    mapping(address => mapping(uint256 => SaleItem)) public itemsForSale;

    event ItemAdded(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
    event ItemRemoved(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);
    event ItemUpdated(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 newPrice);
    event ItemSold(address indexed buyer, address indexed nftAddress, uint256 indexed tokenId, uint256 price);

    modifier onlyItemOwner(address nftAddress, uint256 tokenId) {
        IERC721Metadata tokenContract = IERC721Metadata(nftAddress);
        require(tokenContract.ownerOf(tokenId) == msg.sender, "Only the owner of NFT can perform this action");
        _;
    }

    modifier hasTransferApproval(address nftAddress, uint256 tokenId) {
        IERC721Metadata tokenContract = IERC721Metadata(nftAddress);
        require(
            tokenContract.getApproved(tokenId) == address(this),
            "Please Approve marketplace contract for this transaction"
        );
        _;
    }

    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        SaleItem memory item = itemsForSale[nftAddress][tokenId];
        require(item.price <= 0, "Item is already listed");
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        SaleItem memory item = itemsForSale[nftAddress][tokenId];
        require(item.price > 0, "Item is not listed");
        _;
    }

    /**
     * @notice Function to add an item to the marketplace
     * @param _tokenId ERC721 token id for NFT
     * @param _nftAddress ERC721 contract address for NFT
     * @param _saleItem sale item object
     */
    function addItemToMarket(
        address _nftAddress,
        uint256 _tokenId,
        SaleItem memory _saleItem
    )
        external
        onlyItemOwner(_nftAddress, _tokenId)
        hasTransferApproval(_nftAddress, _tokenId)
        notListed(_nftAddress, _tokenId, msg.sender)
    {
        require(_saleItem.price > 0, "Price must be at least 1 wei");
        require(msg.sender == _saleItem.seller, "Invalid seller");

        itemsForSale[_nftAddress][_tokenId] = _saleItem;
        emit ItemAdded(msg.sender, _nftAddress, _tokenId, _saleItem.price);
    }

    /**
     * @notice Function to remove an item from the marketplace
     * @param _tokenId NFT token id
     * @param _nftAddress NFT contract address
     */
    function removeItemFromMarket(
        address _nftAddress,
        uint256 _tokenId
    ) external nonReentrant onlyItemOwner(_nftAddress, _tokenId) isListed(_nftAddress, _tokenId) {
        delete (itemsForSale[_nftAddress][_tokenId]);
        emit ItemRemoved(msg.sender, _nftAddress, _tokenId);
    }

    /**
     * @notice Function to change price of an item from the marketplace
     * @param _nftAddress NFT contract address
     * @param _tokenId NFT token id
     * @param _newPrice new price of item
     */
    function updatePrice(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _newPrice
    ) external nonReentrant onlyItemOwner(_nftAddress, _tokenId) isListed(_nftAddress, _tokenId) {
        require(_newPrice > 0, "Price must be at least 1 wei");

        SaleItem storage item = itemsForSale[_nftAddress][_tokenId];

        require(_newPrice != item.price, "Price must be different from current price");

        item.price = _newPrice;
        emit ItemUpdated(msg.sender, _nftAddress, _tokenId, _newPrice);
    }

    /**
     * @notice Function to buy an item on the marketplace
     * @param _nftAddress NFT contract address
     * @param _tokenId NFT token id
     */
    function buyItem(
        address _nftAddress,
        uint256 _tokenId
    ) external payable nonReentrant isListed(_nftAddress, _tokenId) hasTransferApproval(_nftAddress, _tokenId) {
        SaleItem memory item = itemsForSale[_nftAddress][_tokenId];

        // Verify sale conditions
        require(msg.value >= item.price, "Not enough funds sent");
        require(msg.sender != item.seller, "Seller cannot buy its own nft");

        // Collect buy values from buyer
        CurrencyTransferLib.transferCurrency(item.currency, msg.sender, item.seller, item.price);

        // Transfer bought tokens to buyer
        IERC721Metadata(_nftAddress).safeTransferFrom(item.seller, msg.sender, _tokenId);

        delete (itemsForSale[_nftAddress][_tokenId]);
        emit ItemSold(msg.sender, _nftAddress, _tokenId, msg.value);
    }
}
