let Web3 =require("web3");
let ethers =require("ethers");
require("dotenv").config();
const contractAddress = process.env.CONTRACT_ADDRESS;

let chain_http = process.env.chain_http;

let ABI = require("./abi.json");
//let contractAddress = "0xCeB08E18Bc55aB95Aaf67f441cA3F29042149cD6";// change it


let web3 = new Web3(new Web3.providers.HttpProvider(chain_http));
//let web3 = new Web3(new ethers.providers.JsonRpcProvider(chain_http));

let contract = new web3.eth.Contract(ABI,contractAddress);



async function push_in_apply_array_function(student_name, school_name, password, address, private_key){


   // await contract.methods.membership("e@g.com").call().then(console.log);
  //  const obj = await web3.eth.accounts.create();
   // console.log(obj.address, obj.privateKey);
   // web3.eth.getBalance(obj.address).then(console.log);
   // const accounts = await web3.eth.getAccounts();
    //const _from = accounts[1];
    //const _from = "0x64Dc11443C19034DeAEA807B7580611B323a8DD7";
    const _from = address;

    //const privateKey = "0x29ce4e4b946243fd48c29d32b0482757603d08cac75a9ee90c2c621684c772ff";
    const privateKey = private_key;
    const tx = {
        from: _from,
        to : contractAddress,
        gas: 400000,
        data: contract.methods.push_to_applied(school_name,student_name, password).encodeABI()

    }
    const signature = await web3.eth.accounts.signTransaction(tx, privateKey)
    web3.eth.sendSignedTransaction(signature.rawTransaction).on(
        "receipt",async()=>{
           // const events = await contract.getPastEvents("Incremented", {fromBlock: 1, toBlock:"latest"})
           // console.log(events);
        }
    )

}

module.exports = {
    push_in_apply_array_function,
    contract
};
   
