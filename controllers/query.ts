import {Request, Response, NextFunction } from "express";
var inputContract = require('../controllers/wineSecure.json');
var DocumentDBClient = require('documentdb').DocumentClient;
var Web3 = require('web3');


export async function QueryController(request: Request, response: Response, next: NextFunction) {
    var data = {};
    var param = request.param('address', '');
    if(param != ''){
        details(param)
        .catch((err) => { console.log(err);})
        .then((data : any)=>{
            response.render("query", data);
        })
    } else {
        response.render("query", data);
    }
}

export function details(address : string) : Promise<any> {
    return new Promise((resolve, reject) => {
        
        getNode().then((ip : string) =>{
            var tokenAbi = JSON.parse((<any>inputContract).abi);            
            var web3RPC = new Web3(new Web3.providers.HttpProvider("http://"+ip+":8545"));
            // break
            if(!web3RPC.isAddress(address)) {
                resolve({});
                return;
            }
            var contract = web3RPC.eth.contract(tokenAbi);
            var contractInstance = contract.at(address);
            contractInstance.wineDetail((err, result) => {
                if (err != null) {
                  reject(err);
                  return;
                }
                var data : any = { owner: contractInstance.owner, address: address, name: result[0], vineyard: result[1], grapeVariety : result[2], colour : result[3], alcoholLevel : result[4], status : result[5] };
                resolve( data );
            })
        });
    });
  }

  export function getNode() : Promise<string> {
    return new Promise((resolve, reject) => {
        var registrarHostEndpoint = process.argv[7];
        var registrarDatatbaseId = process.argv[9];
        var registrarCollectionId = process.argv[10];
        var registrarConnectionString = process.argv[8];
        var docDBClient = new DocumentDBClient(registrarHostEndpoint, {masterKey: registrarConnectionString});
        var collectionLink = "dbs/" + registrarDatatbaseId + "/colls/" + registrarCollectionId;
        docDBClient.readDocuments(collectionLink).toArray(function (err, docs) {      
          if (err) {
            console.log(err);    
            reject(err)
          } else {
              // set the ip to localhost by default
              var ip="127.0.0.1";
              if(docs.length > 0) 
                ip=docs[0].ipaddress;
             resolve(ip); 
          }
        });
    });
}
