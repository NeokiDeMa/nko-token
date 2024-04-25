import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import NikoTokenModule from "./NikoToken";

const SwapModule = buildModule("SwapModule", (m) => {
  const { nko } = m.useModule(NikoTokenModule);
  const swap = m.contract("NikoSwap", [
    nko,
    "0xca3C652e994D88740b8Ab3b33B4935592aB1DfbA",
  ]);

  return { swap };
});

export default SwapModule;
