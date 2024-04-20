import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../dataBase/models/user.entity";

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository : Repository<UserEntity>
  ) {}
  async create(createUserDto: CreateUserDto) {
    await this.userRepository.save(this.userRepository.create(createUserDto))
    return;
  }
  async getAll(){
    return await this.userRepository.find({
        select: {
          password: false
        }
      });
  }
  async deleteUser(id : number){
    return this.userRepository.delete({
      id : id
    })
  }
}
