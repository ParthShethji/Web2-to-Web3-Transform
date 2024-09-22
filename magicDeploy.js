const solc = require("solc");
const fs = require("fs");
const path = require("path");



const compileContract = (contractName) => {
  // Read the Solidity source code from the file system
  const contractPath = './Hardhat/contracts/Lock.sol';
  const sourceCode = fs.readFileSync(contractPath, "utf8");
  // const Contract_name = JSON.stringify(contractName)
  // solc compiler config
  const input = {
    language: "Solidity",
    sources: {
      'Lock.sol': {
        content: sourceCode,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };
  console.log("Compiler input:", JSON.stringify(input, null, 2));

  // Compile the Solidity code using solc
  const compilationResult = solc.compile(JSON.stringify(input));
  // console.log("Compilation result:", compilationResult);
  compiledCode = JSON.parse(compilationResult);
  console.log(compiledCode);
  

  // Get the bytecode and ABI from the compiled contract
  const bytecode = compiledCode.contracts["Lock.sol"][contractName].evm.bytecode.object;
  console.log("got bytecode")
  const abi = compiledCode.contracts['Lock.sol'][contractName].abi;

  // // Write the bytecode to a new file
  // const bytecodePath = './Hardhat/artifacts/build-info/ByteCode.json';
  // fs.writeFileSync(bytecodePath, bytecode);

  // // Write the Contract ABI to a new file
  // const abiPath = '/Hardhat/artifacts/contracts/Lock.sol/ContractABI.json';
  // fs.writeFileSync(abiPath, JSON.stringify(abi, null, "\t"));

  const contractData = {
    abi: abi,
    bytecode: bytecode,
};

const data = './Hardhat/artifacts/contracts/Lock.sol/ContractData.json';
fs.writeFileSync(data, JSON.stringify(contractData, null, 2));

  // Log the compiled contract code to the console
  console.log("Contract Bytecode:\n", bytecode);
  console.log("Contract ABI:\n", abi);
  console.log("data written to path")
  return { bytecode, abi };
};


const { Web3 } = require("web3");

const provider = new Web3.providers.HttpProvider("https://rpc-sepolia.ethereum.com/");
const web3 = new Web3(provider);

const deployContract = async (bytecode, abi, privateKey) => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  const contract = new web3.eth.Contract(abi);

  try {
    const deployment = contract.deploy({ data: bytecode });
    const gas = await deployment.estimateGas();
    const deployedContract = await deployment.send({ from: account.address, gas });

    console.log("Contract deployed at address:", deployedContract.options.address);
    return deployedContract.options.address;
  } catch (error) {
    console.error("Deployment error:", error);
  }
};

// Usage
// deployContract(bytecode, abi, privateKey);
module.exports = {compileContract, deployContract}
