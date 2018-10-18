import {Request, Response} from "express";

export async function AboutController(request: Request, response: Response) {
    response.render("about");
}
