import { HardhatUserConfig  } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";


//npx hardhat compile后导入任务
import "./tasks"
import "./tasks/index"
//npx hardhat可查看可用指令列表

//导入配置文件读取信息
//import * as dotenv from "dotenv";
//dotenv.config();
require("dotenv").config({ path: 'secret.env' });//dotenv 是一个用于加载环境变量的库，在 Node.js 应用程序中可以使用它来简化对环境变量的访问。在日常开发中起到了很重要的作用。
const mnemonic = process.env.mnemonic;
const goerli_url = process.env.goerli_url;
const bsc_url = process.env.bsc_url;
const bsctest_url = process.env.bsctest_url;
const private_key = process.env.private_key as string;//私钥，as string强制转换为string

const config: HardhatUserConfig = {
  solidity: {
    version:"0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      localhost: 0,
      tokenOwner: 0,
    },
  },
  defaultNetwork: "localhost",//切换部署网络networks的时候更改命令参数,如--bsctest
  networks: {
    localhost: {
      url: "http://localhost:8545",
      accounts:{
        mnemonic: mnemonic //助记词 本地自带的是test test test test test test test test test test test junk
      },
    },
    bsctest: {
      url: bsctest_url,
      accounts: [private_key],
      timeout: 100000
    },
    goerli: {
      url: goerli_url,
      chainId: 5,
      accounts: [private_key]
    },
    bsc: {
      url: bsc_url,
      chainId: 56,
      accounts: [private_key]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },  
  mocha: {
    timeout: 600000,
  }
};

export default config;

