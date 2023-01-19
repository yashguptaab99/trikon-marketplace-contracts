const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrikonMarketplace Test Suit", async () => {
    let owner, user1, user2, user3, token, marketplace, _saleItem;
    const _name = "Example Token";
    const _symbol = "ETT";

    beforeEach(async () => {
        [owner, user1, user2, user3] = await ethers.getSigners();
        const TrikonERC721Mintable = await ethers.getContractFactory("TrikonERC721Mintable");
        const TrikonMarketplace = await ethers.getContractFactory("TrikonMarketplace");

        token = await TrikonERC721Mintable.deploy(_name, _symbol);
        await token.connect(user1).mint("https://example.com/1");
        await token.connect(user1).mint("https://example.com/1");
        await token.connect(user2).mint("https://example.com/1");
        await token.connect(user2).mint("https://example.com/1");

        marketplace = await TrikonMarketplace.deploy();
        _saleItem = {
            seller: user1.address,
            price: 1,
            currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        };
    });

    describe("addItemToMarket()", async () => {
        it("Should revert if owner of NFT is not msg.sender.", async () => {
            await expect(marketplace.connect(user3).addItemToMarket(token.address, 1, _saleItem)).to.be.revertedWith(
                "Only the owner of NFT can perform this action"
            );
        });

        it("Should revert if Marketplace contract does not have approval for transfer.", async () => {
            await expect(marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem)).to.be.revertedWith(
                "Please Approve marketplace contract for this transaction"
            );
        });

        it("Should revert if price is < 0.", async () => {
            let _invalidSaleItem = {
                seller: user3.address,
                price: 0,
                currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            };
            await token.connect(user1).approve(marketplace.address, 1);
            await expect(
                marketplace.connect(user1).addItemToMarket(token.address, 1, _invalidSaleItem)
            ).to.be.revertedWith("Price must be at least 1 wei");
        });

        it("Should revert if item is already listed.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);
            await expect(marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem)).to.be.revertedWith(
                "Item is already listed"
            );
        });

        it("Should add item to marketplace successfully.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);
            const result = await marketplace.itemsForSale(token.address, 1);
            expect(result[0]).to.equal(user1.address);
            expect(result[1].toString()).to.equal("1");
        });
    });

    describe("removeItemFromMarket()", async () => {
        it("Should revert if item is not listed.", async () => {
            await expect(marketplace.connect(user1).removeItemFromMarket(token.address, 1)).to.be.revertedWith(
                "Item is not listed"
            );

            await expect(marketplace.connect(user1).removeItemFromMarket(token.address, 2)).to.be.revertedWith(
                "Item is not listed"
            );
        });

        it("Should revert is not called by owner.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);

            await expect(marketplace.connect(user2).removeItemFromMarket(token.address, 1)).to.be.revertedWith(
                "Only the owner of NFT can perform this action"
            );
        });

        it("Should remove item from marketplace successfully.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);
            await marketplace.connect(user1).removeItemFromMarket(token.address, 1);
            const result = await marketplace.itemsForSale(token.address, 1);
            expect(result[1].toString()).to.equal("0");
        });

        it("Should revert if called multiple times on same id.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);
            await marketplace.connect(user1).removeItemFromMarket(token.address, 1);
            await expect(marketplace.connect(user1).removeItemFromMarket(token.address, 1), "Item is not listed");
        });
    });

    describe("updatePrice()", async () => {
        it("Should revert if item id doest not exists.", async () => {
            await expect(marketplace.connect(user1).updatePrice(token.address, 1, 1000)).to.be.revertedWith(
                "Item is not listed"
            );

            await expect(marketplace.connect(user1).updatePrice(token.address, 2, 1000)).to.be.revertedWith(
                "Item is not listed"
            );
        });

        it("Should revert if not called by owner.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);

            await expect(marketplace.connect(user2).updatePrice(token.address, 1, 10)).to.be.revertedWith(
                "Only the owner of NFT can perform this action"
            );
        });

        it("Should revert if new price is < 0.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);

            await expect(marketplace.connect(user1).updatePrice(token.address, 1, 0)).to.be.revertedWith(
                "Price must be at least 1 wei"
            );
        });

        it("Should revert if current price is equal to new price.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);

            await expect(marketplace.connect(user1).updatePrice(token.address, 1, 1)).to.be.revertedWith(
                "Price must be different from current price"
            );
        });

        it("Should update price successfully.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);
            await marketplace.connect(user1).updatePrice(token.address, 1, 10);
            const result = await marketplace.itemsForSale(token.address, 1);
            expect(result[1].toString()).to.equal("10");
        });
    });

    describe("buyItem()", async () => {
        it("Should revert if invalid id is passed.", async () => {
            await expect(marketplace.connect(user1).buyItem(token.address, 1, { value: 1 })).to.be.revertedWith(
                "Item is not listed"
            );
        });

        it("Should revert if 0 funds are send.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);
            await expect(marketplace.connect(user3).buyItem(token.address, 1, { value: 0 })).to.be.revertedWith(
                "Not enough funds sent"
            );
        });

        it("Should revert if seller is trying to buy its own nft.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);
            await expect(marketplace.connect(user1).buyItem(token.address, 1, { value: 1 })).to.be.revertedWith(
                "Seller cannot buy its own nft"
            );
        });

        it("Should revert if Marketplace contract does not have approval for transfer.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);
            await token.connect(user1).approve("0x0000000000000000000000000000000000000000", 1);
            await expect(marketplace.connect(user3).buyItem(token.address, 1, { value: 1 })).to.be.revertedWith(
                "Please Approve marketplace contract for this transaction"
            );
        });

        it("Should revert if token ID is removed from marketplace.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);
            await marketplace.connect(user1).removeItemFromMarket(token.address, 1);
            await expect(marketplace.connect(user3).buyItem(token.address, 1, { value: 1 }), "Item is not listed");
        });

        it("Should buy item successfully.", async () => {
            await token.connect(user1).approve(marketplace.address, 1);
            await marketplace.connect(user1).addItemToMarket(token.address, 1, _saleItem);
            await marketplace.connect(user3).buyItem(token.address, 1, { value: 1 });
            const owner = await token.ownerOf(1);
            expect(owner).to.equal(user3.address);

            const result = await marketplace.itemsForSale(token.address, 1);
            expect(result[1].toString()).to.equal("0");
        });
    });
});
