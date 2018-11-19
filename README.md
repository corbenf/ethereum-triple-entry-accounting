# ProtoCounting 0.3a

:warning: This application is a proof of concept only and should by no means be considered production ready, use at your own risk :warning:

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this project you will need the following installed on your machine:

- [Node.js](https://nodejs.org)
- [Angular CLI](https://cli.angular.io/) (v6 or higher)
- [Truffle](https://truffleframework.com/truffle)
- [Geth](https://geth.ethereum.org/downloads/)
- [MongoDB](https://www.mongodb.com/mongodb-4.0) (v4 or higher)
- [MetaMask](https://metamask.io/), [Mist](https://github.com/ethereum/mist/releases) or similar

With all components running, the DApp will occupy the ports 2720, 4200, 8501, 8502, 8887, 8888, 8889 and 27017. Make sure nothing else is already running on these ports.

Clone the repository:
```
git clone https://github.com/corbenf/ethereum-triple-entry-accounting.git
```
The following guide assumes that you are running Windows 10.

### Installing

This DApp has been configured to use a specific Ethereum Devnet with it's corresponding accounts

#### Starting the Ethereum Nodes

Starting the Ethereum nodes can be acheived by manually navigating to the `eth-devnet` folder and running the `runStart.bat` batch file or you can run the following commands

```
cd eth-devnet
runStart.bat
```

OR
Open three terminals (cmd or powershell) and run the following commands

Terminal one
```
bootnode -nodekey boot.key -verbosity 9 -addr :8888
```

Terminal two
```
geth --datadir node1/ --syncmode 'full' --port 8887 --rpc --rpcaddr 'localhost' --rpcport 8501 --rpcapi 'personal,db,eth,net,web3,txpool,miner' --bootnodes 'enode://0e2be185e4bc85e93b6111334456d96135e57400d5636d598fd91be1a815df898977e55a068415313aa4505deb5c85eaf8e6d61ac6d239efd8986eff7663e75e@127.0.0.1:8888' --networkid 7966 --gasprice '1' -unlock 'bb1a3d0f52fa761fc48eb16c9fd8eb02385c8e70' --password node1/password.txt --mine --rpccorsdomain '*' --ipcpath node1/geth/chaindata/geth.ipc --targetgaslimit 94000000
```

Terminal three
```
geth --datadir node2/ --syncmode 'full' --port 8889 --rpc --rpcaddr 'localhost' --rpcport 8502 --rpcapi 'personal,db,eth,net,web3,txpool,miner' --bootnodes 'enode://0e2be185e4bc85e93b6111334456d96135e57400d5636d598fd91be1a815df898977e55a068415313aa4505deb5c85eaf8e6d61ac6d239efd8986eff7663e75e@127.0.0.1:8888' --networkid 7966 --gasprice '0' --unlock '6044ca16e88a572900871b4f3ce791f710f6072f' --password node2/password.txt --mine --rpccorsdomain '*' --ipcpath node2/geth/chaindata/geth.ipc --targetgaslimit 94000000
```

### Deploying the Smart Contract

The nodes included in this repo do not have the template version of the smart contract pre-deployed. To deploy the smart contract run the following command in the root directory of the repo

```
truffle migrate --reset
```

#### MetaMask Connecting to Geth and Importing Accounts

To connect MetaMask to the Ethereum nodes, in the `Networks` selection choose `Custom RPC`, enter the address `http://127.0.0.1:8501/` then click `Show Advanced Options` and enther the ChainID `7966`.

To use this DApp sucessfully, you will need to import the accounts from the Ethereum Devnet into MetaMask.

1. Open the `Accounts` menu in MetaMask and select `Import Account`.
2. Choose the `JSON` option from the `Select Type` dropdown then click `Choose File`
3. Navigate to the `eth-devnet\node1\keystore` directory and select:
    - `UTC--2018-08-04T22-21-25.375477900Z--bb1a3d0f52fa761fc48eb16c9fd8eb02385c8e70`
    - and use `pwndnode1` as the password.
4. Repeat the same for the remaining two files and for the two files in the `eth-devnet\node2\keystore` directory using the credentials below

**Node 1**
```
File: UTC--2018-08-04T22-21-25.375477900Z--bb1a3d0f52fa761fc48eb16c9fd8eb02385c8e70
Password: pwdnode1

File: UTC--2018-08-07T03-57-52.587711800Z--df965d95e74d3d46b8bf76d000f49a1ee167fc50
Password: Passw0rd1

File: UTC--2018-10-02T21-15-08.011868400Z--4d6599f828033bfe4dad97d94cb403137f828a95
Password: Passw0rd1
```
**Node 2**
```
File: UTC--2018-08-04T22-22-18.596666500Z--6044ca16e88a572900871b4f3ce791f710f6072f
Password: pwdnode2

File: UTC--2018-08-07T03-58-57.366960500Z--792f311201b3be0d710f0b46bfe88c228a7da67e
Password: Passw0rd2
```

#### Configuring MongoDB

This DApp has been configured to use a specific MongoDB setup. To replicate this setup:

1. Ensure that MongoDB is running on port 27017
2. Create a new Database and name it `protoCounting`
3. Create the following four collections in the `protoCounting` database
    - `inventory`
    - `invoices`
    - `ledgerAccounts`
    - `users`
4. Import the backup files from the `mongo-exports` folder into their corresponding collections
    - e.g. import `inventory.json` into the `inventory` collection.

#### Node.js Express Server

First run

```
cd express-server
npm install
```
to install the dependencies.

Then run

```
npm run dev
```

#### Angular Front-End
From the express-server directory run
```
cd ../invoicing-master
npm install
```
Then run
```
ng serve -o
```
to start the project. Make sure to confirm the security prompt from MetaMask and the development environment will be ready.

## Built With

* [Angular 6](https://angular.io/)
* [Web3js](https://web3js.readthedocs.io/en/1.0/web3-eth.html)
* [Truffle](https://truffleframework.com/)

## License

This project is licensed under the GNU General Public License 3.0 - see the [LICENSE.md](LICENSE) file for details
