import { Module } from '@nestjs/common';
import { UserAuthorizationService } from './user-authorization.service';
import { UserAuthorizationController } from './user-authorization.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../dataBase/models/user.entity";
import { JwtModule } from "@nestjs/jwt";
import ENV from "../../helpers/ENV";

@Module({
  imports : [TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      signOptions: { expiresIn: '5m' },
      secretOrKeyProvider : ()=>ENV.JwtSecret
    }),
  ],
  controllers: [UserAuthorizationController],
  providers: [UserAuthorizationService],
})
export class UserAuthorizationModule {}
