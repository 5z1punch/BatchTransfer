import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

type ERC20Item = {
  token: string;
  amount: string;
};

type ERC721Item = {
  token: string;
  ids: string[];
};

type ERC1155Item = {
  token: string;
  ids: string[];
  amounts: string[];
};

describe("BatchTransfer", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    const batchTransfer = await BatchTransfer.connect(owner).deploy();

    return { batchTransfer, owner, otherAccount };
  }

  describe("bt", function () {
    it("forktest", async function () {
      const { batchTransfer, owner, otherAccount } = await loadFixture(deployFixture);
      console.log("batchTransfer", batchTransfer.address);

      // approve for test
      const erc20_1 = await ethers.getContractAt("IERC20", "0x6B175474E89094C44Da98b954EedeAC495271d0F");
      let tx = await erc20_1.connect(otherAccount).approve(batchTransfer.address, ethers.constants.MaxUint256);
      let resp = await tx.wait();
      // console.log(await erc20_1.callStatic.balanceOf(otherAccount.address));
      
      const nft_1 = await ethers.getContractAt("IERC721", "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");
      tx = await nft_1.connect(otherAccount).setApprovalForAll(batchTransfer.address, true);
      await tx.wait();
      const nft_2 = await ethers.getContractAt("IERC721", "0x9a604220d37b69c09eFfCcd2E8475740773E3DaF");
      tx = await nft_2.connect(otherAccount).setApprovalForAll(batchTransfer.address, true);
      await tx.wait();
      

      // erc1155
      const erc1155_1 = await ethers.getContractAt("IERC1155", "0xa42Bd534270dD4C934D970429392Ce335c79220D");
      tx = await erc1155_1.connect(otherAccount).setApprovalForAll(batchTransfer.address, true);
      await tx.wait();
      const erc1155_2 = await ethers.getContractAt("IERC1155", "0xE1eb72894533008A75A50806D77e527e91bdE142");
      tx = await erc1155_2.connect(otherAccount).setApprovalForAll(batchTransfer.address, true);

      // transfer from
      const erc20Items:ERC20Item[] = [];
      const erc721Items:ERC721Item[] = [];
      const erc1155Items:ERC1155Item[] = [];
      erc20Items.push({
        token: erc20_1.address,
        amount: "11111111111111111111",
      });
      erc721Items.push({
        token: nft_1.address,
        ids: ["123"]
      });
      erc721Items.push({
        token: nft_2.address,
        ids: ["1234", "5555"]
      });
      

      // 1155
      erc1155Items.push({
        token: erc1155_1.address,
        ids:["6"],
        amounts:["1"]
      });
      erc1155Items.push({
        token: erc1155_2.address,
        ids:["1", "2"],
        amounts:["34", "56"]
      });
      
      tx = await batchTransfer.connect(owner).batchSend(otherAccount.address, erc20Items, erc721Items, erc1155Items);
      resp = await tx.wait();
      console.log(resp.gasUsed);
    });
  });
});
