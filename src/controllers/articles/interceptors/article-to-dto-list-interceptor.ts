import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { ArticleDto } from "../dto/article.dto";

@Injectable()
export class ArticleToDtoListInterceptor implements NestInterceptor{
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(map(data=>{
      return data.map(x=>ArticleDto.GetInstance(x))
    }))
  }
}