import { Global, Module } from "@nestjs/common";
import { UserGlobalService } from "./user-global.service";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./authorization-guard";
import { JwtModule, JwtService } from "@nestjs/jwt";
import ENV from "../../helpers/ENV";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../dataBase/models/user.entity";

@Global()
@Module({
  imports : [
    JwtModule.register({
      signOptions: { expiresIn: '5m' },
      secretOrKeyProvider : ()=>ENV.JwtSecret
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers : [
    UserGlobalService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    JwtService
  ],
  exports : [UserGlobalService]
})
export class AuthGuardModule{}