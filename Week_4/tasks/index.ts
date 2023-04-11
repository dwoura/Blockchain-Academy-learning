import { task } from "hardhat/config";
import { readAddressList } from "../scripts/addressRecord";
//先npx hardhat compile
import { Dwa__factory} from "../typechain-types";


task("accounts").setAction(async (_, hre) => {
  const { network } = hre;
  const accounts = await hre.ethers.getSigners();

  console.log("Accounts:");
  for (const account of accounts) {
    console.log("- Address:", account.address);
    if(network.name!="localhost"){
      const balance = await hre.ethers.provider.getBalance(account.address);
      console.log("- Balance:", hre.ethers.utils.formatEther(balance), "ETH\n");
    }
  }   
});

//验证合约是否升级成功
task("getVersion").setAction(async (_, hre) => {
  const { network } = hre;
  const [dev] = await hre.ethers.getSigners();
  const addressList = readAddressList();
  const MyContractAdrr = addressList[network.name].MyContract as string;
  console.log(MyContractAdrr)

  const myContract = new Dwa__factory(dev).attach(
    MyContractAdrr
  );
  const version = await myContract.VERSION();

  console.log("version: ", version.toString());
});


