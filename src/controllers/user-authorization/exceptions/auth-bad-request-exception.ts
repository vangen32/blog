import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthBadRequestException extends HttpException{
  constructor(message : string = "Invalid email or password") {
    super(message, HttpStatus.BAD_REQUEST);
  }
}