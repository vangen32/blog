import { Module } from '@nestjs/common';
import { CreateUserModule } from './controllers/create-user/create-user.module';
import { PostgresSqlModule } from "./dataBase/postgres-sql-module";
import { DataSource } from "typeorm";
import { ConfigModule } from "@nestjs/config";
import { UserAuthorizationModule } from './controllers/user-authorization/user-authorization.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PostgresSqlModule.create(),
    CreateUserModule,
    UserAuthorizationModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
  }
}
