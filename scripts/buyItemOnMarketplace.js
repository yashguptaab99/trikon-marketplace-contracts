const { ethers, waffle } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config();

async function main() {
    const TrikonERC721Mintable = await hre.ethers.getContractFactory("TrikonERC721Mintable");
    const token = TrikonERC721Mintable.attach(process.env.TrikonERC721Mintable);
    const TrikonMarketplace = await hre.ethers.getContractFactory("TrikonMarketplace");
    const marketplace = TrikonMarketplace.attach(process.env.TrikonMarketplace);

    const signer = await new ethers.Wallet(process.env.USER_PRIVATE_KEY, waffle.provider);

    tx = await marketplace.connect(signer).buyItem(token.address, 1, { value: 1 });
    await tx.wait();
    console.log("Successfully bought item to marketplace", tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
