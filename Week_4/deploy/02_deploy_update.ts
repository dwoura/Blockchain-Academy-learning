import { readAddressList, storeAddressList } from "../scripts/addressRecord";
import {DeployFunction, ProxyOptions } from "hardhat-deploy/dist/types";
import {HardhatRuntimeEnvironment} from 'hardhat/types';

//先npx hardhat compile
import { TransparentUpgradeableProxy__factory, ProxyAdmin__factory } from "../typechain-types";

const { ethers } = require("hardhat");
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


  //----升级合约的部署----
  const myNewContract = await deploy(
    "DwaV2",
    {
      contract: "DwaV2",
      from: deployer,
      args: [],
      log: true,
      gasLimit: 1000000 //防止gas过低交易失败
  });
  // 输出部署成功后的地址
  console.log(`myNewContract deployed to: ${myNewContract.address}`);
  //存储 合约地址与合约实现地址信息
  addressList[network.name].Implementation_DwaV2 = myNewContract.address;
  storeAddressList(addressList);


  //----执行合约升级----
  const [dev] = await ethers.getSigners();
  const proxyAddress = addressList[network.name].MyContract;
  const proxyAdminAddress = addressList[network.name].ProxyAdmin;

  //从合约工厂获取按合约地址获取合约对象
  const proxy = new TransparentUpgradeableProxy__factory(dev).attach(proxyAddress);
  const proxyAdmin = new ProxyAdmin__factory(dev).attach(proxyAdminAddress);
  
  //proxyAdmin.upgrade(proxyAddress, newImplementationAddress);
  //admin把代理合约中的旧实现合约地址更改为新的实现合约地址
  const upgradeTx = await proxyAdmin.upgrade(proxy.address, myNewContract.address) ;
  console.log("MyContract upgraded to proxy");
  console.log("upgradeTx",upgradeTx);
}

//输入下面指令 运行该脚本
// npx hardhat deploy --network {network} --tags {Tag}
//如npx hardhat deploy --network localhost --tags MyContract

//若自定义脚本运行
// npx hardhat run --network {network} xxx/xxx.ts
func.tags = ["UpgradeContract"];
export default func;