import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from "rxjs";
import { UserDto } from "../dto/user.dto";

@Injectable()
export class UserListInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map(data=> {
          return data.map(x=>UserDto.GetInstance(x));
        })
      );
  }
}
