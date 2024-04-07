import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { UserUnprocessableEntityException } from "./bad-unprocessable-entity-exception";
import { Response, Request } from 'express';

@Catch(UserUnprocessableEntityException)
export class HttpUserCreateBadRequestFilter implements ExceptionFilter {
  catch(exception: UserUnprocessableEntityException, host: ArgumentsHost) {
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