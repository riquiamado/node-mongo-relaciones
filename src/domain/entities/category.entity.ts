import { CustomError } from '../errors/custom.error'

export class CategoryEntity {
  constructor(
    // public id: string,
    public name: string,
    public available: boolean,
    public user: string,
    
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, available, user } = object

    // if (!id && !_id) {
    //   throw CustomError.badRequest('Mising id')
    // }
    if (!name) throw CustomError.badRequest('Mising name')
    if (!available) throw CustomError.badRequest('Mising available')
   
    if (!user) throw CustomError.badRequest('Mising user')
    

    return new CategoryEntity(
      // id || _id,
      name,
      available,
      user,
    )
  }
}
