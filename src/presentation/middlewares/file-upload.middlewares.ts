import { NextFunction, Request, Response } from "express";


export class FileUploadMiddlewares {

    static containesFiles (req:Request,res:Response,next:NextFunction){
      
    if(!req.files || Object.keys(req.files).length === 0){
      return res.status(400).json({error:'no req.files were upload'})
    }
    if(!Array.isArray(req.files.file)){
     req.body.files = [req.files.file]
    }else {
        req.body.files = req.files.file
    }
    next()
    }
}