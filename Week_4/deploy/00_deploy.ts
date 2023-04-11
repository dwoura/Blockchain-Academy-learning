import { readAddressList, storeAddressList } from "../scripts/addressRecord";
import {DeployFunction } from "hardhat-deploy/dist/types";
import {HardhatRuntimeEnvironment} from 'hardhat/types';

//文档https://learnblockchain.cn/docs/hardhat/plugins/hardhat-deploy.html#what-is-it-for-
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("Deploying ProxyAdmin with account:", deployer);
  
  //初始化地址json对象
  const addressList:any=readAddressList();
  if(!addressList[network.name])
  {
    addressList[network.name] = {}//防止出现undefined
  };

  

  //----ProxyAdmin合约部署----
  const proxyAdminContract = await deploy("ProxyAdmin", {
    contract: "ProxyAdmin",
    from: deployer,
    args: [],
    log: true
  });
  // 输出部署成功后的地址
  console.log(`ProxyAdmin Contract deployed to: ${proxyAdminContract.address}`);
  //存储合约地址信息
  addressList[network.name].ProxyAdmin = proxyAdminContract.address;
  storeAddressList(addressList);

  
}

//输入下面指令 运行该脚本
// npx hardhat deploy --network {network} --tags {Tag}
//如npx hardhat deploy --network localhost --tags ProxyAdmin

//若自定义脚本运行
// npx hardhat run --network {network} xxx/xxx.ts
func.tags = ["ProxyAdmin"];
export default func;