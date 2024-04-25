import { formatEther } from "ethers";
import holders from "../holders.json";

async function main() {
  const allBalance = holders.map((user) =>
    parseFloat(formatEther(user.balance))
  );
  const tokenSupply = allBalance.reduce((prev, current) => prev + current, 0);

  const circulatingSupply = tokenSupply - 2500000010;

  console.log({
    circulatingSupply: circulatingSupply.toLocaleString("en-US", {
      currency: "USD",
    }),
  });
}
main();
