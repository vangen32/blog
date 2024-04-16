import { Module } from '@nestjs/common';
import { CreateUserModule } from './controllers/create-user/create-user.module';
import { PostgresSqlModule } from "./dataBase/postgres-sql-module";
import { ConfigModule } from "@nestjs/config";
import { UserAuthorizationModule } from './controllers/user-authorization/user-authorization.module';
import { AuthGuardModule } from "./global/authGuard/auth-guard.module";
import { ArticlesModule } from './controllers/articles/articles.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    PostgresSqlModule.create(),
    CreateUserModule,
    UserAuthorizationModule,
    AuthGuardModule,
    ArticlesModule
  ],
})
export class AppModule {
  constructor() {
  }
}
