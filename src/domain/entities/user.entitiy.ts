import { CustomError } from '../errors/custom.error'

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidate: boolean,
    public password: string,
    public role: string[],
    public img?: string
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, email, emailValidate, password, role, img } = object

    if (!id && !_id) {
      throw CustomError.badRequest('Mising id')
    }
    if (!name) throw CustomError.badRequest('Mising name')
    if (!email) throw CustomError.badRequest('Mising email')
    if (emailValidate === undefined)
      throw CustomError.badRequest('Mising emailValidate')
    if (!password) throw CustomError.badRequest('Mising password')
    if (!role) throw CustomError.badRequest('Mising role')

    return new UserEntity(
      id || _id,
      name,
      email,
      emailValidate,
      password,
      role,
      img
    )
  }
}
