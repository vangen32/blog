import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { In, Repository } from "typeorm";
import { ArticleEntity } from "../../dataBase/models/article.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { TagEntity } from "../../dataBase/models/tag.entity";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articlesRepository : Repository<ArticleEntity>,
    @InjectRepository(TagEntity)
    private tagRepository : Repository<TagEntity>
  ) {
  }
  async create(createArticleDto: CreateArticleDto) {
    const article = { ...createArticleDto, tags : await this.getTags(createArticleDto.tags)}
    return await this.articlesRepository.save(this.articlesRepository.create(article));
  }

  async findAll(page : number, limit : number) {
    const articles = await this.articlesRepository.find({
      skip : page*limit,
      take : limit,
      relations : {
        tags : true,
        author : true
      }
    });
    if(articles.length <= 0)
      throw new BadRequestException("No such page exists")
    return articles;
  }

  async findById(id: number) : Promise<ArticleEntity> {
    const result = await this.articlesRepository.findOne({
      where: { id },
      relations: { author: true, tags: true },
    })
    if(result)
      return result;
    else
      throw new BadRequestException(`Article with ID ${id} does not exist`)
  }

  async findByAuthorId(authorId : number, page : number, limit : number)  : Promise<ArticleEntity[]>{
    const articles = this.articlesRepository.find({
      where : {
        author : {
          id : authorId
        }
      },
      take : limit,
      skip : page * limit,
      relations : ["tags", "author"]
    })
    if((await articles).length <= 0)
      throw new BadRequestException("No such page exists")
    return articles;
  }

  async findByTag(tag : string, page : number, limit : number)  : Promise<ArticleEntity[]>{
    const articles = this.articlesRepository.createQueryBuilder('article')
      .innerJoin('article.tags', 'tag', 'tag.tag = :tag', { tag })
      .leftJoinAndSelect('article.tags', 'allTags')
      .leftJoinAndSelect('article.author', 'author')
      .skip(page*limit)
      .take(limit).getMany();
    if((await articles).length <=0)
      throw new BadRequestException("No articles found with the specified tag or no such page exist")
    return articles;
  }

  async update(targetArticle : ArticleEntity, updateArticleDto: UpdateArticleDto) {
    targetArticle.content = updateArticleDto.content;
    targetArticle.tags = await this.getTags(updateArticleDto.tags);
    const updatedResult = await this.articlesRepository.save(targetArticle);

    if(targetArticle.content != updatedResult.content || !this.isSameTags(targetArticle.tags, updatedResult.tags)){
      throw new InternalServerErrorException("Update failed for unknown reasons")
    }
    return targetArticle;
  }

  async remove(article : ArticleEntity) {
    return await this.articlesRepository.remove(article);
  }

  private async getTags(tagList : string[]) :  Promise<TagEntity[]>{
    if(!tagList || tagList.length === 0)
      return [] as TagEntity[]
    const tags = await this.tagRepository.findBy({
      tag : In(tagList)
    })
    const notExistingTags = tagList.filter((x=>!tags.some(y=>y.tag === x))).map(x=>({tag : x}));
    const createdTags = await this.tagRepository.save(notExistingTags);
    return [...tags, ...createdTags] as TagEntity[]
  }
  private isSameTags(tags1 : TagEntity[], tags2 : TagEntity[]) : boolean{
    if (tags1.length !== tags2.length) {
      console.log("length");
      return false;
    }
    for (let i = 0; i < tags1.length; i++) {
      if (!tags2.some(x=>x.id === tags1[i].id)) {
        console.log(`id ${tags1[i].id}`);
        return false;
      }
    }
    return true;
  }
}
