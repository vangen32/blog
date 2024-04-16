import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "../../dataBase/models/article.entity";
import { TagEntity } from "../../dataBase/models/tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, TagEntity])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
