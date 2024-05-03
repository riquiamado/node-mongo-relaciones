import { Request, Response } from 'express'
import {  CreateProductDto, CustomError } from '../../domain'
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto'
import { ProductService } from '../services/product.services'

export class ProductController {
  constructor(
     private readonly productService: ProductService
) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statuscode).json({ error: error.message })
    }
    console.log(`${error}`)
    return res.status(500).json({ error: 'Internal server error' })
  }

  createProduct = async (req: Request, res: Response) => {
    const [error, createproductDto] = CreateProductDto.create(req.body)
    if (error) return res.status(400).json({ error })
    this.productService
      .createProduct(createproductDto!,req.body.user)
      .then((product) => res.json(product))
      .catch((error) => this.handleError(error, res))
  }

  getProducts = async (req: Request, res: Response) => {
    const {page = 1,limit=10}= req.query
    const [error, paginationDto] = PaginationDto.create(+page,+limit)
    if (error) return res.status(400).json({ error })
    this.productService.getProduct(paginationDto!)
    .then(products => res.json(products))
    .catch((error) => this.handleError(error, res))
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
