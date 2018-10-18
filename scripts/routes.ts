import { QueryController } from "../controllers/query";
import { UpdateController } from "../controllers/update";
import { SupplierController } from "../controllers/supplier";
import { AboutController } from "../controllers/about";
import { RegisterController, deployContract, registerNode, history, transfer, details, supplier, updateContract, consume } from "../controllers/register";
import { Request, Response, NextFunction } from "express";
var qr = require('qr-image');

/**
 * All application routes.
 */
export const AppRoutes = [
    {
        path: "/query/:address?",
        method: "get",
        action: ((req : Request, res: Response, next: NextFunction ) => { 
            QueryController(req, res, next);
        })
    },
    {
        path: "/update/:address?",
        method: "get",
        action: ((req : Request, res: Response, next: NextFunction ) => { 
            UpdateController(req, res, next);
        })
    },
    {
        path: "/qr/:address?",
        method: "get",
        action: ((req : Request, res: Response, next: NextFunction ) => { 
            var code = qr.image(req.params.address, { type: 'png', ec_level: 'H', size: 10, margin: 0 });
            res.setHeader('Content-type', 'image/png');
            code.pipe(res);
        })
    },
    {
        path: "/wineSecure/deployContract",
        method: "post",
        action: ((req : Request, res: Response, next: NextFunction ) => { 
                deployContract(req.body)
                .then((data) => { res.send(data); })
                .catch((err) => { res.statusCode = 400; res.send(); }); 
        })
    },
    {
        path: "/wineSecure/updateContract",
        method: "post",
        action: ((req : Request, res: Response, next: NextFunction ) => { 
                updateContract(req.body)
                .then((data) => { res.send(data); })
                .catch((err) => { console.log(err); }); 
        })
    },    
    {
        path: "/wineSecure/registerNode",
        method: "post",
        action: ((req : Request, res: Response ) => { 
                registerNode(req.body)
                .then((data) => { res.send(data); })
                .catch((err) => { console.log(err); }); 
        })
    },
    {
        path: "/wineSecure/history/:address?",
        method: "get",
        action: ((req : Request, res: Response ) => { 

            history(req.params.address)
                .then((data) => { res.send(data); })
                .catch((err) => { res.send(err); }); 
        })
    },
    {
        path: "/wineSecure/transfer",
        method: "post",
        action: ((req : Request, res: Response ) => { 
            transfer(req.body)
                .then((data) => { res.send(data); })
                .catch((err) => { res.send(err); }); 
        })
    },    
    {
        path: "/wineSecure/consume",
        method: "post",
        action: ((req : Request, res: Response ) => { 
            consume(req.body)
                .then((data) => { res.send(data); })
                .catch((err) => { res.send(err); }); 
        })
    },    
    {
        path: "/wineSecure/details",
        method: "get",
        action: ((req : Request, res: Response ) => { 
            details(req.body)
                .then((data) => { res.send(data); })
                .catch((err) => { res.send(err); }); 
        })
    },
    {
        path: "/wineSecure/supplier",
        method: "post",
        action: ((req : Request, res: Response ) => { 
            supplier( req.body.password)
                .then((data) => { res.send(data); })
                .catch((err) => { res.send(err); }); 
        })
    },       
    {
        path: "/supplier",
        method: "get",
        action: SupplierController
    },
    {
        path: "/register",
        method: "get",
        action: RegisterController
    },
    {
        path: "/about",
        method: "get",
        action: AboutController
    }
];