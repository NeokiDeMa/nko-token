import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NikoTokenModule = buildModule("NikoTokenModule", (m) => {
  const nko = m.contract("NikoToken", []);
  return { nko };
});

export default NikoTokenModule;
