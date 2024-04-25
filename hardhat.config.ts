import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { vars } from "hardhat/config";
import * as dotenv from "dotenv";
dotenv.config();
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  sourcify: {
    enabled: true,
  },
  etherscan: {
    apiKey: {
      polygonAmoy: vars.get("POLYGON_AMOY_API_KEY"),
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_POLYGON_MAINNET_URL as string,
        blockNumber: 56245172,
        enabled: true,
      },
    },
    polygonAmoy: {
      accounts: [process.env.DEPLOYER_ACCOUNT as string],
      url: process.env.ALCHEMY_AMOY_URL,
      gasPrice: "auto",
    },
    polygon: {
      accounts: [process.env.DEPLOYER_ACCOUNT as string],
      url: process.env.ALCHEMY_AMOY_URL,
      gasPrice: "auto",
    },
  },
};

export default config;
