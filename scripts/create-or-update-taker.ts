import { ethers } from "hardhat";
import holders from "../holders.json";
import { formatEther, parseEther } from "ethers";

async function main() {
  // const takers = holders.map((taker) => {
  //   return {
  //     sender: taker.wallet,
  //     amount: taker.balance,
  //   };
  // });
  const swap = await ethers.getContractAt(
    "NikoSwap",
    "0x959E51f2625113C34DED8217622F546E6A88EBb4"
  );
  const tx = await swap.updateTakersClaims([
    {
      sender: "0xa6F7693ed4050736DAAd5072D8E93300eab2E8af",
      amount: parseEther("2"),
    },
  ]);
  await tx.wait();
  console.log("done");
}
main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
