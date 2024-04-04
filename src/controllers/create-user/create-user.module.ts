import { Module } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { CreateUserController } from './create-user.controller';

@Module({
  controllers: [CreateUserController],
  providers: [CreateUserService],
})
export class CreateUserModule {}
