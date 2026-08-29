import type { Request,Response ,NextFunction} from "express";

export function middleware(req:Request,res:Response,next:NextFunction){
    const startTime=Date.now();
    next();
    const endTime=Date.now();
    console.log(`Time taken ${endTime-startTime} ms for ${req.method} for route ${req.url}`);
}