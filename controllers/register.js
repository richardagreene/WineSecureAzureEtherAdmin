"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var inputContract = require('../controllers/wineSecure.json');
var DocumentDBClient = require('documentdb').DocumentClient;
var Web3 = require('web3');
function RegisterController(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        response.render("register");
    });
}
exports.RegisterController = RegisterController;
function deployContract(wineDetails) {
    return new Promise((resolve, reject) => {
        getNode().then((ip) => {
            var tokenAbi = JSON.parse(inputContract.abi);
            var bytecode = inputContract.bytecode;
            var gethIPCPath = process.argv[3];
            var web3IPC = new Web3(new Web3.providers.IpcProvider(gethIPCPath, require('net')));
            web3IPC.personal.unlockAccount(wineDetails.owner, wineDetails.password, function (err, res) {
                if (err) {
                    reject(err);
                    return;
                }
                ;
                var newContract = web3IPC.eth.contract(tokenAbi);
                newContract.new(wineDetails.name, wineDetails.vineyard, wineDetails.grapeVariety, wineDetails.colour, wineDetails.alcoholLevel, {
                    from: wineDetails.owner,
                    data: "0x" + bytecode,
                    gas: 4000000,
                }, (err, myContract) => {
                    if (!err) {
                        if (!myContract.address) {
                            console.log(myContract.transactionHash);
                        }
                        else {
                            console.log(myContract.address);
                            resolve(myContract.address);
                        }
                    }
                    else {
                        console.log("error");
                        console.log(err);
                        reject(err);
                    }
                });
            });
        });
    });
}
exports.deployContract = deployContract;
function updateContract(wineDetails) {
    return new Promise((resolve, reject) => {
        this.getNode().then((ip) => {
            var tokenAbi = JSON.parse(inputContract.abi);
            var gethIPCPath = process.argv[3];
            var web3IPC = new Web3(new Web3.providers.IpcProvider(gethIPCPath, require('net')));
            console.log(wineDetails);
            web3IPC.personal.unlockAccount(wineDetails.owner, wineDetails.password, function (err, res) {
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                var contract = web3IPC.eth.contract(tokenAbi);
                var contractInstance = contract.at(wineDetails.address);
                contractInstance.setDetails(wineDetails.name, wineDetails.vineyard, wineDetails.grapeVariety, wineDetails.colour, wineDetails.alcoholLevel, {
                    from: wineDetails.owner, gas: 450000
                }, (err, res) => {
                    if (!err) {
                        web3IPC.eth.getTransactionReceipt(res, function (err, result) {
                            if (!err) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        });
                    }
                    else
                        reject(false);
                });
            });
        });
    });
}
exports.updateContract = updateContract;
function history(address) {
    return new Promise((resolve, reject) => {
        this.getNode().then((ip) => {
            var tokenAbi = JSON.parse(inputContract.abi);
            var coinbase = process.argv[4];
            var coinbasePw = process.argv[5];
            var gethIPCPath = process.argv[3];
            var web3IPC = new Web3(new Web3.providers.IpcProvider(gethIPCPath, require('net')));
            web3IPC.personal.unlockAccount(coinbase, coinbasePw, function (err, res) {
                var contract = web3IPC.eth.contract(tokenAbi);
                var contractInstance = contract.at(address);
                var events = contractInstance.allEvents({ fromBlock: 0, toBlock: 'latest' });
                events.get(function (err, events) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    var dates = [];
                    events.forEach((evt) => {
                        dates.push(getTransactionDetails(web3IPC, evt));
                    });
                    Promise.all(dates).then((data) => { resolve(data); });
                });
            });
        });
    });
}
exports.history = history;
function details(address) {
    return new Promise((resolve, reject) => {
        getNode().then((ip) => {
            var tokenAbi = JSON.parse(inputContract.abi);
            var web3RPC = new Web3(new Web3.providers.HttpProvider("http://" + ip + ":8545"));
            var contract = web3RPC.eth.contract(tokenAbi);
            var contractInstance = contract.at(address);
            contractInstance.wineDetail((err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    });
}
exports.details = details;
function supplier(password) {
    return new Promise((resolve, reject) => {
        var coinbase = process.argv[4];
        var coinbasePw = process.argv[5];
        getNode().then((ip) => {
            var web3RPC = new Web3(new Web3.providers.HttpProvider("http://" + ip + ":8545"));
            web3RPC.personal.unlockAccount(coinbase, coinbasePw, 20);
            var account = web3RPC.personal.newAccount(password);
            web3RPC.eth.sendTransaction({ to: account,
                from: coinbase,
                value: web3RPC.toWei("10", "ether"),
                gas: 450000
            });
            resolve(account);
        });
    });
}
exports.supplier = supplier;
function transfer(data) {
    return new Promise((resolve, reject) => {
        var tokenAbi = JSON.parse(inputContract.abi);
        var coinbasePw = process.argv[5];
        var gethIPCPath = process.argv[3];
        var web3IPC = new Web3(new Web3.providers.IpcProvider(gethIPCPath, require('net')));
        web3IPC.personal.unlockAccount(data.owner, coinbasePw, function (err, res) {
            var contract = web3IPC.eth.contract(tokenAbi);
            var contractInstance = contract.at(data.address);
            contractInstance.transferOwnership(data.newOwner, {
                from: data.owner, gas: 450000
            }, (err, res) => {
                if (!err) {
                    resolve(true);
                }
                reject(false);
            });
        });
    });
}
exports.transfer = transfer;
function consume(wineDetails) {
    return new Promise((resolve, reject) => {
        var tokenAbi = JSON.parse(inputContract.abi);
        var gethIPCPath = process.argv[3];
        var web3IPC = new Web3(new Web3.providers.IpcProvider(gethIPCPath, require('net')));
        web3IPC.personal.unlockAccount(wineDetails.owner, wineDetails.password, function (err, res) {
            if (err) {
                resolve(false);
            }
            var contract = web3IPC.eth.contract(tokenAbi);
            var contractInstance = contract.at(wineDetails.address);
            contractInstance.consumed({
                from: wineDetails.owner, gas: 450000
            }, (err, res) => {
                if (!err) {
                    resolve(true);
                }
                reject(false);
            });
        });
    });
}
exports.consume = consume;
function registerNode(nodeDetails) {
    return new Promise((resolve, reject) => {
        var registrarHostEndpoint = process.argv[7];
        var registrarDatatbaseId = process.argv[9];
        var registrarCollectionId = process.argv[10];
        var registrarConnectionString = process.argv[8];
        var docDBClient = new DocumentDBClient(registrarHostEndpoint, { masterKey: registrarConnectionString });
        var collectionLink = "dbs/" + registrarDatatbaseId + "/colls/" + registrarCollectionId;
        docDBClient.createDocument(collectionLink, nodeDetails, function (err, createdDocument) {
            if (err) {
                resolve(false);
                return;
            }
        });
        resolve(true);
    });
}
exports.registerNode = registerNode;
function getTransactionDetails(web3IPC, trx) {
    return new Promise((resolve, reject) => {
        web3IPC.eth.getBlock(trx.blockNumber, ((err, data) => {
            var date1 = new Date(data.timestamp * 1000);
            resolve({
                event: trx.event,
                message: trx.args.message,
                date: date1.toUTCString()
            });
        }));
    });
}
exports.getTransactionDetails = getTransactionDetails;
function getNode() {
    return new Promise((resolve, reject) => {
        var registrarHostEndpoint = process.argv[7];
        var registrarDatatbaseId = process.argv[9];
        var registrarCollectionId = process.argv[10];
        var registrarConnectionString = process.argv[8];
        var docDBClient = new DocumentDBClient(registrarHostEndpoint, { masterKey: registrarConnectionString });
        var collectionLink = "dbs/" + registrarDatatbaseId + "/colls/" + registrarCollectionId;
        docDBClient.readDocuments(collectionLink).toArray(function (err, docs) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                var ip = "127.0.0.1";
                docs.forEach((e) => {
                    console.log("IP=>:" + docs[0].ipaddress);
                    ip = e.ipaddress;
                });
                resolve(ip);
            }
        });
    });
}
exports.getNode = getNode;
//# sourceMappingURL=register.js.map