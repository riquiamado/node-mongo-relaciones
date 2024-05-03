import { Request, Response } from 'express'
import { CreateCategoryDto, CustomError } from '../../domain'
import { CategoryModel } from '../../data'
import { CategoryService } from '../services/category.services'
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto'

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statuscode).json({ error: error.message })
    }
    console.log(`${error}`)
    return res.status(500).json({ error: 'Internal server error' })
  }

  createCategory = async (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body)
    if (error) return res.status(400).json({ error })
    this.categoryService
      .createCategory(createCategoryDto!, req.body.user)
      .then((category) => res.json(category))
      .catch((error) => this.handleError(error, res))
  }

  getCategories = async (req: Request, res: Response) => {
    const {page = 1,limit=10}= req.query
    const [error, paginationDto] = PaginationDto.create(+page,+limit)
    if (error) return res.status(400).json({ error })
    this.categoryService.getCategories(paginationDto!)
    .then(categories => res.json(categories))
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
