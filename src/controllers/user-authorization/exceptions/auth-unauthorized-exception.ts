import { HttpException, HttpStatus } from "@nestjs/common";

export class UserUnauthorizedException extends HttpException{
  public constructor(message : string = "Unauthorized") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
