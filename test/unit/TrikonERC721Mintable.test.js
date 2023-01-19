const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrikonERC721Mintable Test Suit", async () => {
    let owner, token;
    const _name = "Example Token";
    const _symbol = "ETT";
    before(async () => {
        [owner] = await ethers.getSigners();
        const TrikonERC721Mintable = await ethers.getContractFactory("TrikonERC721Mintable");
        token = await TrikonERC721Mintable.deploy(_name, _symbol);
    });

    describe("Initialize()", async () => {
        it("Should revert if name or symbol is empty", async () => {
            await expect((await ethers.getContractFactory("TrikonERC721Mintable")).deploy("", "")).to.be.revertedWith(
                "TrikonERC721Mintable: name must not be empty"
            );

            await expect(
                (await ethers.getContractFactory("TrikonERC721Mintable")).deploy(_name, "")
            ).to.be.revertedWith("TrikonERC721Mintable: symbol must not be empty");
        });

        it("Should have correct name, symbol, owner and totalSupply.", async () => {
            const name = await token.name();
            const symbol = await token.symbol();
            const contractOwner = await token.owner();
            const totalSupply = await token.totalSupply();

            expect(name).to.be.equal(_name);
            expect(symbol).to.be.equal(_symbol);
            expect(contractOwner).to.be.equal(owner.address);
            expect(totalSupply.toString()).to.be.equal("0");
        });
    });
    describe("mint()", async () => {
        it("Should revert if _tokenUri is empty", async () => {
            await expect(token.mint("")).to.be.revertedWith("TrikonERC721Mintable: tokenURI must not be empty");
        });

        it("Should mint nft successfully", async () => {
            await token.mint("https://example.com/1");

            const balance = await token.balanceOf(owner.address);
            expect(balance.toString()).to.equal("1");

            const tokenOwner = await token.ownerOf(1);
            expect(tokenOwner).to.equal(owner.address);

            const totalSupply = await token.totalSupply();
            expect(totalSupply.toString()).to.equal("1");

            const tokenURI = await token.tokenURI(1);
            expect(tokenURI).to.equal("https://example.com/1");
        });
    });
});
