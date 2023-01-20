const hre = require("hardhat");

async function main() {
    console.log("Deploying Implementation TrikonERC721Mintable...");
    const TrikonERC721Mintable = await (
        await hre.ethers.getContractFactory("TrikonERC721Mintable")
    ).deploy("Trikon", "TR");
    console.log("Deployed Implementation");
    // await TrikonERC721Mintable.deployTransaction.wait(3);
    // await verify(TrikonERC721Mintable.address, ["Trikon", "TR"]);
    console.log("Implementation is deployed at:", TrikonERC721Mintable.address);

    console.log("Deploying Implementation TrikonMarketplace...");
    const TrikonMarketplace = await (await hre.ethers.getContractFactory("TrikonMarketplace")).deploy();
    console.log("Deployed Implementation");
    // await TrikonMarketplace.deployTransaction.wait(3);
    // await verify(TrikonMarketplace.address, []);
    console.log("Implementation is deployed at:", TrikonMarketplace.address);
}

async function verify(contractAddress, args) {
    console.log("----------------Verification Started------------------");
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        console.log("The error is ", e);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
