import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";
export const mock = [
  {
    sender: "0xda7e07d3cdf7f30fdd8f068d947a05e292f04937",
    amount: "302000000000000000000",
  },
  {
    sender: "0x5965c7b80e455c2eacc9a3c99d68385ce8206d01",
    amount: "16363000000000000000000",
  },
];
const NikoTokenModule = buildModule("NikoTokenModule", (m) => {
  const name = "Niko Token";
  const symbol = "NKO";
  const totalSupply = parseEther("3000000000");
  const nko = m.contract("NikoToken", [name, symbol, totalSupply]);
  m.call(nko, "createClaimers", [mock]);

  return { nko };
});

export default NikoTokenModule;
