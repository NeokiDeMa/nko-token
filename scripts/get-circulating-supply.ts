import { formatEther } from "ethers";
import holders from "../holders.json";
// TODO
async function main() {
  const allBalance = holders.map((user) =>
    parseFloat(formatEther(user.balance))
  );
  const tokenSupply = allBalance.reduce((prev, current) => prev + current, 0);
  const theBoss = holders.find(
    (wallet) =>
      wallet.wallet.toLowerCase() ===
      "0x0158b53A230C5bC6FE575E2c3Cd18bd198180b7b".toLowerCase()
  );
  if (!theBoss) throw new Error("Didnt find the wallet");
  const circulatingSupply =
    tokenSupply - parseFloat(formatEther(theBoss.balance));
  console.log({
    circulatingSupply: circulatingSupply.toLocaleString("en-US", {
      currency: "USD",
    }),
  });
}
main();
