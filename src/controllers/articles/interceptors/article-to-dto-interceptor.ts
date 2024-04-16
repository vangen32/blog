import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { ArticleDto } from "../dto/article.dto";

@Injectable()
export class ArticleToDtoInterceptor implements NestInterceptor{
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle()
      .pipe(
        map(data=>{
          if(data)
            return ArticleDto.GetInstance(data)
          return data
        })
      )
  }
}