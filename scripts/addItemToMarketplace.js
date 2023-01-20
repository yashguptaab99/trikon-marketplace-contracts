const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config();

async function main() {
    const TrikonERC721Mintable = await hre.ethers.getContractFactory("TrikonERC721Mintable");
    const token = TrikonERC721Mintable.attach(process.env.TrikonERC721Mintable);
    const TrikonMarketplace = await hre.ethers.getContractFactory("TrikonMarketplace");
    const marketplace = TrikonMarketplace.attach(process.env.TrikonMarketplace);

    let tx = await token.approve(marketplace.address, 1);
    await tx.wait();
    console.log("Successfully approved", tx.hash);

    let saleItem = {
        seller: (await ethers.getSigner()).address,
        price: 1,
        currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    };
    tx = await marketplace.addItemToMarket(token.address, 1, saleItem);
    await tx.wait();
    console.log("Successfully added item to marketplace", tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
