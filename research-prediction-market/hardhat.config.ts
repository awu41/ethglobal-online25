export default {
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
      type: "http",
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      type: "http",
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: [],
      chainId: 11155111,
    },
    nitrolite: {
      type: "http",
      url: "https://nitrolite.yellow.org",
      accounts: [],
      chainId: 1234,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
