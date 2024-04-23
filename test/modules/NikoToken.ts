import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

const NikoTokenModule = buildModule("NikoTokenModule", (m) => {
  const name = "Niko Token";
  const symbol = "NKO";
  const totalSupply = parseEther("3000000000");
  const nko = m.contract("NikoToken", [name, symbol, totalSupply]);
  return { nko };
});

export default NikoTokenModule;
