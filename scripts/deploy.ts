import { ethers } from "hardhat";

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    const GWEI = ethers.BigNumber.from(10).pow(9);
    const feeData = {
      maxFeePerGas: GWEI.mul(10),
      maxPriorityFeePerGas: GWEI
    };
    const batchTransfer = await BatchTransfer.connect(owner).deploy(feeData);

    await batchTransfer.deployed();

    console.log(batchTransfer.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
