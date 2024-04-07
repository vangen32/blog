import { Module } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { CreateUserController } from './create-user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../dataBase/models/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [CreateUserController],
  providers: [CreateUserService],
})
export class CreateUserModule {

}
