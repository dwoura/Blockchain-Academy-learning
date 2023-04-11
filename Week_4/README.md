# 

# 可升级合约学习记录

## 代理

- **透明代理**

**在透明代理模式中，升级功能是在代理合约中实现的。** 代理合约的管理员角色被赋予了操作代理合约的直接权限，以更新代理对应的逻辑实现地址。没有管理员权限的调用者则会把他们的调用委托给实现合约。

注意：代理合约管理员不能是逻辑实现合约的关键角色，甚至也不能是普通用户，因为代理管理员无法与实现合约进行交互。

- **UUPS代理**

在UUPS（Universal Upgradeable Proxy Standard）模式中， **合约升级功能是在逻辑合约中实现的**。由于升级机制存储在逻辑合约中，<u>升级过后的版本可以删除升级相关的逻辑</u>，以禁止未来的升级。在这种模式下，所有对代理合约的调用都会被转发给逻辑实现合约。

+ **信标代理**

这个就不说了

## Hardhat使用

> [ Hardhat | 中文手册](https://learnblockchain.cn/docs/hardhat/getting-started/)

+ #### 安装

```
npm install --save-dev hardhat
```

选择 Create an empty hardhat.config.js

> 后续模块安装推荐用 yarn add xxx

如果缺少什么模块，根据提示装上去即可

@nomicfoundation/hardhat-toolbox内置了waffle，所以不必再装waffle了

```
npm install --save-dev @nomicfoundation/hardhat-toolbox
或
yarn add @nomicfoundation/hardhat-toolbox --d
```

注意最新版的ethers模块不稳定！

**建议安装ethers5.7.2版本**

```
yarn add ethers@5.7.2
```

Hardhat中的任务是异步JavaScript函数，它可以访问[Hardhat运行时环境（HRE）](https://learnblockchain.cn/docs/hardhat/advanced/hardhat-runtime-environment.html)，通过HRE你可以访问配置、参数、其他的任务程序以及插件可能注入的任何对象。

#### 总结一下遇到的问题

+ 这几个文件夹是在compile合约之后才会生成的，除了deployments是脚本deploy执行后才会产生，并且会**缓存**曾经部署过的合约地址。

脚本引用到的typechain-types文件夹也是需要compile后才生成。

![](C:\Users\Dwoura\AppData\Roaming\marktext\images\2023-04-11-12-37-39-image.png)

+ secret.env文件中 bsctest_url=https://rpc.ankr.com/bsc_testnet_chapel 是币安测试网的rpc，用官方的不太稳定，ankr的rpc还不错！

+ 使用读取的addressList可能会出现undefined的情况，在typescript语法检测中通不过，可以试试这样。

```
  if(!addressList[network.name])
  {
    addressList[network.name] = {}//防止出现undefined
  };
```

#### 本地运行成功示例

![](C:\Users\Dwoura\AppData\Roaming\marktext\images\2023-04-09-15-04-27-image.png)

![](C:\Users\Dwoura\AppData\Roaming\marktext\images\2023-04-09-15-04-34-image.png)

#### 币安测试网运行成功示例

执行ProxyAdmin：

![](C:\Users\Dwoura\AppData\Roaming\marktext\images\2023-04-11-12-50-45-image.png)

执行MyContract：

![](C:\Users\Dwoura\AppData\Roaming\marktext\images\2023-04-11-12-49-35-image.png)

执行UpgradeContract：

![](C:\Users\Dwoura\AppData\Roaming\marktext\images\2023-04-11-12-48-59-image.png)

获取一下当前版本号：

![](C:\Users\Dwoura\AppData\Roaming\marktext\images\2023-04-11-12-48-29-image.png)
