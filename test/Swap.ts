import { expect } from "chai";
import { ethers, ignition } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { parseEther } from "ethers";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

describe("Swap Contract Unit Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  const NikoTokenModule = buildModule("NikoTokenModule", (m) => {
    const nko = m.contract("NikoToken");
    return { nko };
  });
  const SwapTestModule = buildModule("SwapTestModule", (m) => {
    const { nko } = m.useModule(NikoTokenModule);
    const oldNko = m.contractAt(
      "NikoToken",
      "0xca3C652e994D88740b8Ab3b33B4935592aB1DfbA"
    );
    const swap = m.contract("NikoSwap", [nko, oldNko]);
    return { swap, nko, oldNko };
  });

  describe("Deployment", function () {
    it("NKO token should exist", async function () {
      const { swap } = await ignition.deploy(SwapTestModule);
      expect(swap).to.exist;
    });

    it("Should have the right owner", async function () {
      const { swap } = await ignition.deploy(SwapTestModule);
      const [owner] = await ethers.getSigners();
      expect(await swap.owner()).to.equal(owner.address);
    });
  });
  describe("Setting claimers", function () {
    it("Should be able to set calimers by `createClaimers`", async function () {
      const { swap } = await ignition.deploy(SwapTestModule);
      const [_, joao] = await ethers.getSigners();
      const taker = {
        sender: joao.address,
        amount: parseEther("10"),
      };
      await expect(swap.createClaimers([taker])).to.emit(swap, "Taker");
      const verifyTakerAmount = await swap.takers(taker.sender);
      expect(verifyTakerAmount).to.equal(parseEther("10"));
    });
    it("Should be able to update calimers by `updateTakersClaims`", async function () {
      const { swap } = await ignition.deploy(SwapTestModule);
      const [_, joao] = await ethers.getSigners();
      const taker = {
        sender: joao.address,
        amount: parseEther("10"),
      };

      expect(await swap.takers(taker.sender)).to.equal(parseEther("0"));
      await swap.updateTakersClaims([taker]);
      expect(await swap.takers(taker.sender)).to.equal(parseEther("10"));
    });
  });
  async function claimFixture() {
    const { swap, nko, oldNko } = await ignition.deploy(SwapTestModule);
    const [_, joao] = await ethers.getSigners();
    const nkoHolder = await ethers.getImpersonatedSigner(
      "0x7356bC1CeBCCcf7B201c415C2026D3b34825FBa7"
    );
    // @ts-ignore
    await oldNko.connect(nkoHolder).transfer(joao.address, parseEther("20"));
    return {
      swap,
      nko,
      oldNko,
    };
  }
  async function claimWithRequiredConditions() {
    const { swap, nko, oldNko } = await ignition.deploy(SwapTestModule);
    const [_, joao] = await ethers.getSigners();
    const taker = {
      sender: joao.address,
      amount: parseEther("20"),
    };
    const nkoHolder = await ethers.getImpersonatedSigner(
      "0x7356bC1CeBCCcf7B201c415C2026D3b34825FBa7"
    );
    await nko.transfer(swap.target, parseEther("20"));
    await swap.createClaimers([taker]);

    // Testing by using an account that has NKOs to send for the swapping wallet
    // @ts-ignore
    await nko.transfer(swap.target, parseEther("20"));
    // @ts-ignore
    await oldNko.connect(nkoHolder).transfer(joao.address, parseEther("20"));
    // @ts-ignore
    await oldNko.connect(joao).approve(swap.target, parseEther("20"));

    return {
      swap,
      nko,
      oldNko,
    };
  }
  describe("Swapping NKOs", function () {
    it("Should have balance approved in the Swap contract", async function () {
      const { swap } = await loadFixture(claimFixture);
      const [_, joao] = await ethers.getSigners();
      const taker = {
        sender: joao.address,
        amount: parseEther("20"),
      };
      await expect(swap.createClaimers([taker]), "didnt emit event").to.emit(
        swap,
        "Taker"
      );
      expect(
        await swap.takers(joao.address),
        "amount of taker doesnt match"
      ).to.equal(parseEther("20"));
    });
    it("Swap contract should have old NKO balance for swap", async function () {
      const { swap, oldNko } = await loadFixture(claimFixture);
      const nkoHolder = await ethers.getImpersonatedSigner(
        "0x7356bC1CeBCCcf7B201c415C2026D3b34825FBa7"
      );
      await expect(
        // @ts-ignore
        oldNko.connect(nkoHolder).transfer(swap.target, parseEther("20"))
      ).to.changeTokenBalance(oldNko, swap, parseEther("20"));
    });
    it("Should have old NKOs in the wallet", async function () {
      const { oldNko } = await loadFixture(claimFixture);
      const [_, joao] = await ethers.getSigners();

      expect(await oldNko.balanceOf(joao.address)).to.be.greaterThanOrEqual(
        parseEther("20")
      );
    });
    it("User should have sufficient allowance for the swap contract", async function () {
      const { nko, swap } = await loadFixture(claimFixture);
      await expect(nko.approve(swap.target, parseEther("20"))).to.emit(
        nko,
        "Approval"
      );
    });
    it("Swap contract should swap NKO to NKO v2", async function () {
      const { oldNko, swap, nko } = await loadFixture(
        claimWithRequiredConditions
      );
      const [_, joao] = await ethers.getSigners();
      // @ts-ignore
      await expect(swap.connect(joao).claim()).to.changeTokenBalances(
        oldNko,
        ["0x8658928deDEf0442b96891880a1E22bDbE0Dd45D", joao],
        [parseEther("20"), parseEther("-20")]
      );
      expect(await nko.balanceOf(joao.address)).to.equal(parseEther("20"));
    });
  });
});
