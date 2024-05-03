import { CategoryModel } from '../../data'
import {
  CategoryEntity,
  CreateCategoryDto,
  CustomError,
  UserEntity,
} from '../../domain'
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto'

export class CategoryService {
  constructor() {}

  public async createCategory(
    createCategoryDto: CreateCategoryDto,
    user: UserEntity
  ) {
    const isCategory = await CategoryModel.findOne({
      name: createCategoryDto.name,
    })
    if (isCategory) throw CustomError.badRequest('Category already exist')
    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      })
      await category.save()
      const { ...categoryEntity } = CategoryEntity.fromObject(category)
      return {
         ...categoryEntity
      }
    //   return {
    //     id:category.id,
    //     name:category.name,
    //     available:category.available
    //   }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }
  public async getCategories (paginationDto:PaginationDto){
    const {page,limit}= paginationDto
      try {
        const [total,categories] = await Promise.all([
          CategoryModel.countDocuments(),
          CategoryModel.find()
          .skip((page -1) * limit)
          .limit(limit)
        ])
        return {
          page,
          limit,
          total,
          next:`/api/category?page=${(page +1)}&limit=${limit}`,
          prev:(page -1 >0)?`/api/category?page=${(page -1)}&limit=${limit}`:null,
         categories : categories.map( category => ({
            id: category.id,
            name:category.name,
            available:category.available
        }))}
    } catch (error) {
        throw CustomError.internalServer(`${error}`)
    }
  }
}
