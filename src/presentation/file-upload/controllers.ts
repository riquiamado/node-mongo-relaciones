import { Request, Response } from 'express'
import {  CustomError } from '../../domain'
import { FileUploadService } from '../services'
import { UploadedFile } from 'express-fileupload'

export class FileUploadController {
  constructor(
    private readonly fileUploadService:FileUploadService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statuscode).json({ error: error.message })
    }
    console.log(`${error}`)
    return res.status(500).json({ error: 'Internal server error' })
  }

  uploadFiles = async (req: Request, res: Response) => {

    const type = req.params.type
    const validTypes = ['users','categories','products']
    if(!validTypes.includes(type)){
      return res.status(400).json({error:`Invalid type:${type},valid ones ${validTypes}`})
    }

  
    const file = req.body.files.at(0) as UploadedFile
    this.fileUploadService.uploadSingle(file,`uploads/${type}`)
    .then(upload => res.json(upload))
    .catch(error => this.handleError(error,res))
  }

  uploadMultipleFiles = async (req: Request, res: Response) => {
    const type = req.params.type
    const validTypes = ['users','categories','products']
    if(!validTypes.includes(type)){
      return res.status(400).json({error:`Invalid type:${type},valid ones ${validTypes}`})
    }

  
    const files = req.body.files as UploadedFile[]
    this.fileUploadService.uploadMultiple(files,`uploads/${type}`)
    .then(upload => res.json(upload))
    .catch(error => this.handleError(error,res))
  }

  // getCategoryById = async(req:Request,res:Response)=>{
  //     const {id}= req.params;
  //     const category = await CategoryModel.findById(id)
  //     if(category) throw `Category con id ${id} not found`
  //     return category
  // }

  // updateCategory = async(req:Request,res:Response)=>{
  //     const {id}= req.params;
  //     const body = req.body
  //     const category = await CategoryModel.findByIdAndUpdate(id)
  //     if(category) throw `Category con id ${id} not found`
  //     return category
  // }
  // deletCategory = async(req:Request,res:Response)=>{
  //     const {id}= req.params;
  //     const category = await CategoryModel.findByIdAndDelete(id)
  //     if(category) throw `Category con id ${id} not found`
  //     return category
  // }
}
