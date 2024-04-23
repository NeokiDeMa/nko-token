import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers, ignition } from "hardhat";
import NikoTokenModule from "./modules/NikoToken";
import { parseEther } from "ethers";

describe("Niko Token Unit Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  describe("Deployment", function () {
    it("NKO token should exist", async function () {
      const { nko } = await ignition.deploy(NikoTokenModule);
      expect(nko).to.exist;
    });

    it("Should have the right owner", async function () {
      const { nko } = await ignition.deploy(NikoTokenModule);
      const [owner] = await ethers.getSigners();
      expect(await nko.owner()).to.equal(owner.address);
    });

    it("Should have 3B tokens of cap", async function () {
      const { nko } = await ignition.deploy(NikoTokenModule);
      expect(await nko.cap()).to.equal(parseEther("3000000000"));
      const [owner] = await ethers.getSigners();
      await expect(nko.mint(owner, parseEther("4000000000"))).to.be.reverted;
    });
  });
  describe("Setting claimers", function () {
    it("Should be able to set calimers buy `createClaimers`", async function () {
      const { nko } = await ignition.deploy(NikoTokenModule);
    });
  });
});
