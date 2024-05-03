import {  JWTAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { EmailService } from './email.services';




export class AuthService {

  // DI
  constructor(
    // DI - Email Service
    private readonly emailService: EmailService,
  ) {}


  public async registerUser( registerUserDto: RegisterUserDto ) {

    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if ( existUser ) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);
      
      // Encriptar la contraseña
      user.password = bcryptAdapter.hash( registerUserDto.password );
      
      await user.save();

      // Email de confirmación
      await this.sendEmailValidationLink( user.email );

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JWTAdapter.generateToken({ id: user.id });
      if ( !token ) throw CustomError.internalServer('Error while creating JWT');

      return { 
        user: userEntity, 
        token: token,
      };

    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }

  }


  public async loginUser( loginUserDto: LoginUserDto ) {

    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest('Email not exist');

    const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
    if ( !isMatching ) throw CustomError.badRequest('Password is not valid');


    const { password, ...userEntity} = UserEntity.fromObject( user );
    
    const token = await JWTAdapter.generateToken({ id: user.id });
    if ( !token ) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: userEntity,
      token: token,
    }

  }


  private sendEmailValidationLink = async( email: string ) => {

    const token = await JWTAdapter.generateToken({ email });
    if ( !token ) throw CustomError.internalServer('Error getting token');

    const link = `${ envs.WEBSERVICES_URL }/auth/validate-email/${ token }`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${ link }">Validate your email: ${ email }</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    }

    const isSent = await this.emailService.sendEmail(options);
    if ( !isSent ) throw CustomError.internalServer('Error sending email');

    return true;
  }


  public validateEmail = async(token:string) => {

    const payload = await JWTAdapter.validateToken(token);
    if ( !payload ) throw CustomError.unauthorized('Invalid token');

    const { email } = payload as { email: string };
    if ( !email ) throw CustomError.internalServer('Email not in token');

    const user = await UserModel.findOne({ email });
    if ( !user ) throw CustomError.internalServer('Email not exists');

    user.emailValidate= true;
    await user.save();

    return true;
  }


}