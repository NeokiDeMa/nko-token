import { ethers, run, tasks } from "hardhat";

async function main() {
  const nko = await ethers.deployContract("NikoToken");
  await nko.waitForDeployment();

  await wait();
  await run("verify:verify", {
    address: nko.target,
    constructorArguments: [],
  });
}
async function wait() {
  return new Promise((resolve) => setTimeout(resolve, 40 * 1000));
}
main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
