import { regularExps } from "../../../config/regular-expr";



export class RegisterUserDto {

    private constructor(
        public name:string,
        public email:string,
        public password:string
    ){}

    static create(object:{[key:string]:any}):[string?,RegisterUserDto?]{
        const {name,email,password}= object;
        if(!name) return ['Mising name'];
        if(!email) return ['Mising email'];
        if(!regularExps.email.test(email)) return ['Email is not valid'];
        if(!password) return ['Mising password']
        if(password.length < 6) return ['Password to short']
        return [undefined, new RegisterUserDto(name,email,password)]
    }
}