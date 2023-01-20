const hre = require("hardhat");
require("dotenv").config();

async function main() {
    const TrikonERC721Mintable = await hre.ethers.getContractFactory("TrikonERC721Mintable");
    const token = TrikonERC721Mintable.attach(process.env.TrikonERC721Mintable);
    const tx = await token.mint("https://example.com/1");
    await tx.wait();
    console.log("Successfully minted", tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
