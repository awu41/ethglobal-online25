import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY", // Replace with your Infura key
      accounts: [], // Add your private key here
      chainId: 11155111,
    },
    nitrolite: {
      url: "https://nitrolite.yellow.org", // Yellow's testnet
      accounts: [], // Add your private key here
      chainId: 1234, // Placeholder - need actual Yellow chain ID
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
