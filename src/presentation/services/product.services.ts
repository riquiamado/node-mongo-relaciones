import {  ProductModel } from '../../data'

import { CreateProductDto,PaginationDto,ProductEntity,CustomError, UserEntity } from '../../domain'
// import { ProductEntity } from '../../domain/entities/product.entity'

export class ProductService {
  constructor() {}

  public async createProduct(
    createProductDto: CreateProductDto,user:UserEntity
  ) {
    const existProduc = await ProductModel.findOne({
      name: createProductDto.name
    })
    if (existProduc) throw CustomError.badRequest('Product already exist')
    try {
      const product = new ProductModel({
        ...createProductDto,
        user:user.id
      })
      console.log(product)
      await product.save()
    //   const { ...productEntity } = ProductEntity.fromObject(product)

      return product
    // console.log(product)
    //    return product
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }
  public async getProduct (paginationDto:PaginationDto){
    const {page,limit}= paginationDto
      try {
        const [total,products] = await Promise.all([
            ProductModel.countDocuments(),
            ProductModel.find()
          .skip((page -1) * limit)
          .limit(limit)
          .populate('user' )
          .populate('category' )
        ])
        return {
          page,
          limit,
          total,
          next:`/api/products?page=${(page +1)}&limit=${limit}`,
          prev:(page -1 >0)?`/api/products?page=${(page -1)}&limit=${limit}`:null,
         products :products
        }
    } catch (error) {
        throw CustomError.internalServer(`${error}`)
    }
  }
}
