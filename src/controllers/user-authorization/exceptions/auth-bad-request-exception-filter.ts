import { AuthBadRequestException } from "./auth-bad-request-exception";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class AuthExceptionFilter<T extends AuthBadRequestException> implements ExceptionFilter<T>{
  catch(exception: T, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message : exception.message
      });
  }

}