import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ArticlesService } from "../articles.service";

@Injectable()
export class ArticlePatchGuard implements CanActivate{
  constructor(private articleService : ArticlesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean>  {
    const request = context.switchToHttp().getRequest()
    const id = parseInt(request.params.id, 10)
    //Attached in authorization guard
    const user = request['user'];
    if(Number.isNaN(id))
      throw new BadRequestException("Article id must be a number")
    const article = await this.articleService.findById(id);
    if(user.id !== article.author.id)
      throw new ForbiddenException("You are not the author of this article, you cannot edit it")
    request['article'] = article;
    return true;
  }

}