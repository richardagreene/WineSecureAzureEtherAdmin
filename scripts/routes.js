"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("../controllers/query");
const update_1 = require("../controllers/update");
const supplier_1 = require("../controllers/supplier");
const about_1 = require("../controllers/about");
const register_1 = require("../controllers/register");
var qr = require('qr-image');
exports.AppRoutes = [
    {
        path: "/query/:address?",
        method: "get",
        action: ((req, res, next) => {
            query_1.QueryController(req, res, next);
        })
    },
    {
        path: "/update/:address?",
        method: "get",
        action: ((req, res, next) => {
            update_1.UpdateController(req, res, next);
        })
    },
    {
        path: "/qr/:address?",
        method: "get",
        action: ((req, res, next) => {
            var code = qr.image(req.params.address, { type: 'png', ec_level: 'H', size: 10, margin: 0 });
            res.setHeader('Content-type', 'image/png');
            code.pipe(res);
        })
    },
    {
        path: "/wineSecure/deployContract",
        method: "post",
        action: ((req, res, next) => {
            register_1.deployContract(req.body)
                .then((data) => { res.send(data); })
                .catch((err) => { res.statusCode = 400; res.send(); });
        })
    },
    {
        path: "/wineSecure/updateContract",
        method: "post",
        action: ((req, res, next) => {
            register_1.updateContract(req.body)
                .then((data) => { res.send(data); })
                .catch((err) => { console.log(err); });
        })
    },
    {
        path: "/wineSecure/registerNode",
        method: "post",
        action: ((req, res) => {
            register_1.registerNode(req.body)
                .then((data) => { res.send(data); })
                .catch((err) => { console.log(err); });
        })
    },
    {
        path: "/wineSecure/history/:address?",
        method: "get",
        action: ((req, res) => {
            register_1.history(req.params.address)
                .then((data) => { res.send(data); })
                .catch((err) => { res.send(err); });
        })
    },
    {
        path: "/wineSecure/transfer",
        method: "post",
        action: ((req, res) => {
            register_1.transfer(req.body)
                .then((data) => { res.send(data); })
                .catch((err) => { res.send(err); });
        })
    },
    {
        path: "/wineSecure/consume",
        method: "post",
        action: ((req, res) => {
            register_1.consume(req.body)
                .then((data) => { res.send(data); })
                .catch((err) => { res.send(err); });
        })
    },
    {
        path: "/wineSecure/details",
        method: "get",
        action: ((req, res) => {
            register_1.details(req.body)
                .then((data) => { res.send(data); })
                .catch((err) => { res.send(err); });
        })
    },
    {
        path: "/wineSecure/supplier",
        method: "post",
        action: ((req, res) => {
            register_1.supplier(req.body.password)
                .then((data) => { res.send(data); })
                .catch((err) => { res.send(err); });
        })
    },
    {
        path: "/supplier",
        method: "get",
        action: supplier_1.SupplierController
    },
    {
        path: "/register",
        method: "get",
        action: register_1.RegisterController
    },
    {
        path: "/about",
        method: "get",
        action: about_1.AboutController
    }
];
//# sourceMappingURL=routes.js.map