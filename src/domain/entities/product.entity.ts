import { CustomError } from '../errors/custom.error'

export class ProductEntity {
  constructor(
    // public id: string,
    public name: string,
    public available: boolean,
    public price:number,
    public user: string,
    public category:string,
    public description?:string,
    
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { name, available,price,description, user,category } = object

    // if (!id && !_id) {
    //   throw CustomError.badRequest('Mising id')
    // }
    if (!name) throw CustomError.badRequest('Mising name')
    // if (!available) throw CustomError.badRequest('Mising available')
    // if (!price) throw CustomError.badRequest('Mising price')
   
    if (!user) throw CustomError.badRequest('Mising user')
    if (!category) throw CustomError.badRequest('Mising category')
    

    return new ProductEntity(
      // id || _id,
      name,
      available,
      price,
      description,
      user,
      category
    )
  }
}
