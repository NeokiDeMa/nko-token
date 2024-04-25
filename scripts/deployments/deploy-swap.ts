import { ethers, run } from "hardhat";

async function main() {
  const swap = await ethers.deployContract("NikoSwap", [
    "0x32A3791036035D4878bf7E3334e39b747390CC7b",
    "0xca3C652e994D88740b8Ab3b33B4935592aB1DfbA",
  ]);
  await swap.waitForDeployment();
  await wait();
  await run("verify:verify", {
    address: swap.target,
    constructorArguments: [
      "0x32A3791036035D4878bf7E3334e39b747390CC7b",
      "0xca3C652e994D88740b8Ab3b33B4935592aB1DfbA",
    ],
  });
}
async function wait() {
  return new Promise((resolve) => setTimeout(resolve, 40 * 1000));
}
main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
