import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  Query,
  UseGuards, HttpStatus, HttpCode
} from "@nestjs/common";
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import {Request} from "express";
import { ArticleToDtoInterceptor } from "./interceptors/article-to-dto-interceptor";
import { Public } from "../../global/authGuard/decoretors";
import { ArticleToDtoListInterceptor } from "./interceptors/article-to-dto-list-interceptor";
import { ArticlePatchGuard } from "./guards/article-patch-guard";

@ApiTags("Articles")
@Controller('articles')
@Public()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post("create")
  @UseInterceptors(ArticleToDtoInterceptor)
  @Public(false)
  async create(@Req() req : Request, @Body() createArticleDto: CreateArticleDto) {
    return await this.articlesService.create({...createArticleDto, author : req['user']});
  }

  @Get("/all")
  @ApiQuery({ name: 'limit', required: false, type: Number })
   findAll(@Query("page") page : number = 0, @Query("limit") limit : number = 10){
    return this.articlesService.findAll(page, limit);
  }

  @Get(':id')
  @UseInterceptors(ArticleToDtoInterceptor)
  findOne(@Param('id') id: string) {
    return this.articlesService.findById(+id);
  }

  @Get('author-id/:id')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAllByAuthor(@Param('id') id: number, @Query("page") page : number = 0, @Query("limit") limit : number = 10) {
    return await this.articlesService.findByAuthorId(id, page, limit);
  }

  @UseInterceptors(ArticleToDtoListInterceptor)
  @Get('tag/:tag')
  async findByTag(@Param('tag') tag :string, @Query("page") page : number = 0, @Query("limit") limit : number = 10){
    return await this.articlesService.findByTag(tag, page, limit);
  }

  @Patch(':id')
  @Public(false)
  @UseGuards(ArticlePatchGuard)
  @UseInterceptors(ArticleToDtoInterceptor)
  async update(@Param('id') id : number, @Req() req : Request, @Body() updateArticleDto: UpdateArticleDto) {
    return await this.articlesService.update(req['article'], updateArticleDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Public(false)
  @UseGuards(ArticlePatchGuard)
  @UseInterceptors(ArticleToDtoInterceptor)
  remove(@Param('id') id: number, @Req() req : Request,) {
    return this.articlesService.remove(req['article']);
  }
}
