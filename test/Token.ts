import { ignition } from "hardhat";
import NikoTokenModule from "../ignition/modules/NikoToken";
import { expect } from "chai";
import { parseEther } from "ethers";

describe("Token test", function () {
  it("token name should be `Niko Token`", async function () {
    const { nko } = await ignition.deploy(NikoTokenModule);
    expect(await nko.name()).to.equal("Niko Token");
  });
  it("token symbol should be `NKO`", async function () {
    const { nko } = await ignition.deploy(NikoTokenModule);
    expect(await nko.symbol()).to.equal("NKO");
  });
  it("token total supply should be `3 billion`", async function () {
    const { nko } = await ignition.deploy(NikoTokenModule);
    expect(await nko.totalSupply()).to.equal(parseEther("3000000000"));
  });
});
