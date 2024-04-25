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

// Removing wallet that are neoki domains
const QUERY = gql`
  query UsersBalanceBeforeHack {
    users(
      where: {
        balance_gt: 0
        wallet_not_in: [
          "0x0158b53A230C5bC6FE575E2c3Cd18bd198180b7b" # harrys wallet
          "0x4A99775ed7D59213C49508f3D9256C4DCdda323e" # first gnosis safe
          "0xB2f3F3Dcc49328fF2f2Fc27195037C3fABeD8062" # second gnosis safe
          "0x51E3D44172868Acc60D68ca99591Ce4230bc75E0" # Mexc 1
          "0x576b81F0c21EDBc920ad63FeEEB2b0736b018A58" # Mexc 2
          "0xe9ee9f2857b559C67dD03576A1c74589a6AF6197" # Bitmart
        ]
      }
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
