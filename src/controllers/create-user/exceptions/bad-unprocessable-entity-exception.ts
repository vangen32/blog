import { HttpException, HttpStatus } from "@nestjs/common";

export class UserUnprocessableEntityException extends HttpException{
  public constructor(message : string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
