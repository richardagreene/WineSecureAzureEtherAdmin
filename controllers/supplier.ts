import {Request, Response} from "express";

export async function SupplierController(request: Request, response: Response) {
    response.render("supplier");
}
