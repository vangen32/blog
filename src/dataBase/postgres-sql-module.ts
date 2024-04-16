import { TypeOrmModule } from "@nestjs/typeorm";

export class PostgresSqlModule{
  static create(){
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
      entities: ["./dataBase/models/*.entity.ts"],
      synchronize: true,
      autoLoadEntities : true
    })
  }
}