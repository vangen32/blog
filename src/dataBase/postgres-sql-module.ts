import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./models/user.entity";
import { ArticleEntity } from "./models/article.entity";
import { TagEntity } from "./models/tag.entity";

export class PostgresSqlModule{
  static create(options: { testEnvironment?: boolean } = {}) {
    if (options.testEnvironment) {
      return this.createTestModule();
    } else {
      return this.createProductionModule();
    }
  }
  static createProductionModule(){
    return TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Asd112233',
      database: 'blog',
      entities: ["./dataBase/models/*.entity.ts"],
      synchronize: true,
      autoLoadEntities : true
    })
  }
  static createTestModule(){
    return TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Asd112233',
      database: 'blog_test',
      entities: [UserEntity, ArticleEntity, TagEntity],
      synchronize: true,
      autoLoadEntities : true
    })
  }
}