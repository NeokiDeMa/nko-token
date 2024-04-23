import { gql } from "@urql/core";
import { client } from "../clients/urql";
import { formatEther, parseEther } from "ethers";
import { writeFile } from "fs";
import { cwd } from "process";

interface URQLUserBalanceResponse {
  users: {
    wallet: string;
    balance: string;
  }[];
}
const QUERY = gql`
  query UsersBalanceBeforeHack {
    users(
      where: { balance_gt: 0 }
      orderBy: timestamp
      orderDirection: desc
      first: 1000
    ) {
      balance
      wallet
    }
  }
`;

async function main() {
  let response = await client
    .query<URQLUserBalanceResponse>(QUERY, {})
    .toPromise();
  const users = response.data && response.data.users;
  if (!users) return;
  const holders = JSON.stringify(users);
  writeFile(
    `${cwd()}/holders.json`,
    holders,
    {
      encoding: "utf-8",
    },
    (error) => {
      if (error) throw new Error("Failed to create holder file");
    }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
