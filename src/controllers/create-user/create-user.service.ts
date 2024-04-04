import { Injectable } from '@nestjs/common';
import { CreateCreateUserDto } from './dto/create-create-user.dto';
import { UpdateCreateUserDto } from './dto/update-create-user.dto';

@Injectable()
export class CreateUserService {
  create(createCreateUserDto: CreateCreateUserDto) {
    return 'This action adds a new createUser';
  }

  findAll() {
    return `This action returns all createUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} createUser`;
  }

  update(id: number, updateCreateUserDto: UpdateCreateUserDto) {
    return `This action updates a #${id} createUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} createUser`;
  }
}
