
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { CreateUserDto } from "../dto/create-user.dto";
import { UserUnprocessableEntityException } from "../exceptions/bad-unprocessable-entity-exception";
import Validator from "../../../helpers/validator";

@Injectable()
export class UserCreateValidationPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    const errorCauses = [];
    if(!Validator.isMail(value.email))
      errorCauses.push("Email is invalid.")
    if(!Validator.isPassword(value.password))
      errorCauses.push("Password is invalid. A valid password contains at least one uppercase letter, at least one lowercase letter, at least one number, and at least 8 characters in length")
    if(errorCauses.length)
      throw new UserUnprocessableEntityException(errorCauses.join(';'))
    return value;
  }
}
