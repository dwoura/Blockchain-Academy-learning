import { readAddressList, storeAddressList } from "../scripts/addressRecord";
import {DeployFunction, ProxyOptions } from "hardhat-deploy/dist/types";
import {HardhatRuntimeEnvironment} from 'hardhat/types';

//文档https://learnblockchain.cn/docs/hardhat/plugins/hardhat-deploy.html#what-is-it-for-
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("Deploying My Contract with account:", deployer);
  
  //初始化地址json对象
  const addressList:any=readAddressList();
  if(!addressList[network.name])
  {
    addressList[network.name] = {}
  };//防止出现undefined


  //----自定义代币合约部署----
  //代理配置项
  const proxyOptions: ProxyOptions = {
    proxyContract: "TransparentUpgradeableProxy",//库标准合约
    viaAdminContract: "ProxyAdmin",
    execute: {
      // 只在初始化时执行
      init: {
        // 执行initialize方法
        methodName: "init",
        // 参数
        args: [66]
      },
    },
  };
  //部署
  const myContract = await deploy("Dwa", {
    contract: "Dwa",
    from: deployer,
    proxy: proxyOptions,
    args: [],
    log: true,
    gasLimit: 1000000 //防止gas过低交易失败
  });
  //输出部署成功后的地址
  console.log(`Proxy deployed to: ${myContract.address}`);
  console.log(`Implementation deployed to: ${myContract.implementation}`);
  //存储 合约地址与合约实现地址信息
  addressList[network.name].MyContract = myContract.address;
  addressList[network.name].Implementation_Dwa = myContract.implementation;
  storeAddressList(addressList);
}

//输入下面指令 运行该脚本
// npx hardhat deploy --network {network} --tags {Tag}
//如npx hardhat deploy --network localhost --tags MyContract

//若自定义脚本运行
// npx hardhat run --network {network} xxx/xxx.ts
func.tags = ["MyContract"];
export default func;