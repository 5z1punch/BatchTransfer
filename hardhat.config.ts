import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

// Ensure that we have all the environment variables we need.
const mainnetRPC: string | undefined = process.env.ETHEREUM_RPC_URL;
if (!mainnetRPC) {
  throw new Error("Please set your ALCHEMY_API_KEY in a .env file");
}

const ACCT1_PTK: string | undefined = process.env.ACCT1_PTK;
const ACCT2_PTK: string | undefined = process.env.ACCT2_PTK;

const blockNumber: number| undefined = process.env.FORK_BLOCK ? Number(process.env.FORK_BLOCK) : undefined;
// console.log(mainnetRPC);

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1,
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      forking: {
        url: mainnetRPC,
        blockNumber: blockNumber
      },
      accounts: [{privateKey: ACCT1_PTK!, balance: 1e18.toString()}, {privateKey: ACCT2_PTK!, balance: 1e18.toString()}]
    },
    local:{
      chainId: 1,
      url: "http://127.0.0.1:8545/",
      accounts:[ACCT1_PTK!, ACCT2_PTK!],
    },
    mainnet: {
      chainId: 1,
      url: mainnetRPC,
      accounts:[ACCT1_PTK!, ACCT2_PTK!],
    },
  },
  solidity: {
    // version: "0.8.17",
    compilers: [
      {
        version: "0.8.17",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },
  
};

export default config;
