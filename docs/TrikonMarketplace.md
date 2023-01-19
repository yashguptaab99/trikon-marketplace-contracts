# TrikonMarketplace
**


## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`addItemToMarket(address _nftAddress, uint256 _tokenId, struct TrikonMarketplace.SaleItem _saleItem)` (external) ](#trikonmarketplace-additemtomarket-address-uint256-struct-trikonmarketplace-saleitem-)
  - [`removeItemFromMarket(address _nftAddress, uint256 _tokenId)` (external) ](#trikonmarketplace-removeitemfrommarket-address-uint256-)
  - [`updatePrice(address _nftAddress, uint256 _tokenId, uint256 _newPrice)` (external) ](#trikonmarketplace-updateprice-address-uint256-uint256-)
  - [`buyItem(address _nftAddress, uint256 _tokenId)` (external) ](#trikonmarketplace-buyitem-address-uint256-)
- [Events:](#events)

## Variables <a name="variables"></a>
- `mapping(address => mapping(uint256 => struct TrikonMarketplace.SaleItem)) itemsForSale`

## Functions <a name="functions"></a>

### `addItemToMarket(address _nftAddress, uint256 _tokenId, struct TrikonMarketplace.SaleItem _saleItem)` (external) <a name="trikonmarketplace-additemtomarket-address-uint256-struct-trikonmarketplace-saleitem-"></a>

*Description*: Function to add an item to the marketplace


#### Params
 - `_tokenId`: ERC721 token id for NFT

 - `_nftAddress`: ERC721 contract address for NFT

 - `_saleItem`: sale item object

### `removeItemFromMarket(address _nftAddress, uint256 _tokenId)` (external) <a name="trikonmarketplace-removeitemfrommarket-address-uint256-"></a>

*Description*: Function to remove an item from the marketplace


#### Params
 - `_tokenId`: NFT token id

 - `_nftAddress`: NFT contract address

### `updatePrice(address _nftAddress, uint256 _tokenId, uint256 _newPrice)` (external) <a name="trikonmarketplace-updateprice-address-uint256-uint256-"></a>

*Description*: Function to change price of an item from the marketplace


#### Params
 - `_nftAddress`: NFT contract address

 - `_tokenId`: NFT token id

 - `_newPrice`: new price of item

### `buyItem(address _nftAddress, uint256 _tokenId)` (external) <a name="trikonmarketplace-buyitem-address-uint256-"></a>

*Description*: Function to buy an item on the marketplace


#### Params
 - `_nftAddress`: NFT contract address

 - `_tokenId`: NFT token id
## Events <a name="events"></a>
### event `ItemAdded(address seller, address nftAddress, uint256 tokenId, uint256 price)` <a name="trikonmarketplace-itemadded-address-address-uint256-uint256-"></a>


### event `ItemRemoved(address seller, address nftAddress, uint256 tokenId)` <a name="trikonmarketplace-itemremoved-address-address-uint256-"></a>


### event `ItemUpdated(address seller, address nftAddress, uint256 tokenId, uint256 newPrice)` <a name="trikonmarketplace-itemupdated-address-address-uint256-uint256-"></a>


### event `ItemSold(address buyer, address nftAddress, uint256 tokenId, uint256 price)` <a name="trikonmarketplace-itemsold-address-address-uint256-uint256-"></a>


