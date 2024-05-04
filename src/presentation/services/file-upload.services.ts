import path from 'node:path'
import fs from 'node:fs'
import { UploadedFile } from 'express-fileupload'
import { Uuid } from '../../config'
import { CustomError } from '../../domain'

export class FileUploadService {
  constructor(private readonly uuid = Uuid.v4) {}

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }
  }

  async uploadSingle(
    file: UploadedFile,
    folder: string = 'uploads',
    validExtensiones: string[] = ['png', 'jpg', 'jpeg', 'gif']
  ) {
    try {
      const fileExtencion = file.mimetype.split('/').at(1) ?? ''
      if (!validExtensiones.includes(fileExtencion)) {
        throw CustomError.badRequest(`Invalid extencion ${fileExtencion}, valid ones ${validExtensiones}`)
      }
      const destination = path.resolve(__dirname, '../../../', folder)
      this.checkFolder(destination)
      const fileName = `${ this.uuid()}.${fileExtencion}`
      file.mv(`${destination}/${fileName}`)
      return { fileName }
    } catch (error) {
      console.log({ error })
    }
  }

   async uploadMultiple(
    files: UploadedFile[],
    folder: string = 'uploads',
    validExtensiones: string[] = ['png', 'jpg', 'jpeg', 'gif']
  ) {
    const fileNames = await Promise.all(
        files.map(file => this.uploadSingle(file,folder,validExtensiones))
    )
    return {fileNames}
  }
}
