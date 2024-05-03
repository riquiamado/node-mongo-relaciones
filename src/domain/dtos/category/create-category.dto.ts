


export class CreateCategoryDto {
    constructor(
        public name:string,
        public available?:boolean,
       
    ) {}

    static create(object:{[key:string]:any}):[string?,CreateCategoryDto?]{
      const {name,available=false}= object
      let availableBolean = available;
      if(!name) return ['Mising name']
      if(typeof available !== 'boolean') {
        availableBolean= (available === 'true')
      }
      

      return [undefined, new CreateCategoryDto(name,availableBolean)]
    }
}