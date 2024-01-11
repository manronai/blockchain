
const Moralis = require("moralis").default;
const f = require("fs");

async function upLoadToIPFS(someName, pathname){

    await Moralis.start({
        apiKey: "veEGH37Q6qW2XybDJmOdbiX8VwTIL7JbuYbECrCNFYbc2ChxaIsFgTBdFSoYcuza"
        //veEGH37Q6qW2XybDJmOdbiX8VwTIL7JbuYbECrCNFYbc2ChxaIsFgTBdFSoYcuza
    })
    const uploadArray = [
        
        {
            path: someName,
            content: f.readFileSync(pathname, {encoding: "base64"})

        }
    ];

    const response = await Moralis.EvmApi.ipfs.uploadFolder({abi: uploadArray});
    console.log(response.result[0].path);
    return response.result;
}

//console.log(upLoadToIPFS("some.png", "views/uploads/190104128_output1683230558347.png"))
module.exports = {
    upLoadToIPFS
}

