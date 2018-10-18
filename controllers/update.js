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
function UpdateController(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = {};
        var param = request.param('address', '');
        if (param != '') {
            details(param)
                .catch((err) => { console.log("next();" + err); })
                .then((data) => {
                console.log(data);
                response.render("update", data);
            });
        }
        else {
            response.render("update", data);
        }
    });
}
exports.UpdateController = UpdateController;
function details(address) {
    return new Promise((resolve, reject) => {
        getNode().then((ip) => {
            var tokenAbi = JSON.parse(inputContract.abi);
            var web3RPC = new Web3(new Web3.providers.HttpProvider("http://" + ip + ":8545"));
            if (!web3RPC.isAddress(address)) {
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
                var data = { address: address, name: result[0], vineyard: result[1], grapeVariety: result[2], colour: result[3], alcoholLevel: result[4], status: result[5] };
                resolve(data);
            });
        });
    });
}
exports.details = details;
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
                if (docs.length > 0)
                    ip = docs[0].ipaddress;
                resolve(ip);
            }
        });
    });
}
exports.getNode = getNode;
//# sourceMappingURL=update.js.map