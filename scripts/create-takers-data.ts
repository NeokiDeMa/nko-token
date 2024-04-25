import holders from "../holders.json";
import { writeFile } from "fs";
async function main() {
  const takers = holders.map((user) => {
    return {
      wallet: user.wallet,
      balance: user.balance,
    };
  });
  writeFile(
    "takers.json",
    JSON.stringify(takers),
    {
      encoding: "utf-8",
    },
    (error) => {
      console.log(error);
    }
  );
}
main();
