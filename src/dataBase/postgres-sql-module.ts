import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./models/user.entity";
import { ArticleEntity } from "./models/article.entity";
import { TagEntity } from "./models/tag.entity";

export class PostgresSqlModule{
  static create(options: { testEnvironment?: boolean } = {}) {
    console.log(process.env.NODE_ENV);
    if (options.testEnvironment) {
      return this.createTestModule();
    } else {
      return this.createProductionModule();
    }
  }
  static createProductionModule(){
    console.log("Prod init");
    return TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ["./dataBase/models/*.entity.ts"],
      synchronize: true,
      autoLoadEntities : true
    })
  }
  static createTestModule(){
    return TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_TEST_NAME,
      entities: [UserEntity, ArticleEntity, TagEntity],
      synchronize: true,
      autoLoadEntities : true
    })
  }
}