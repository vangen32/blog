import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserEntity } from "../../dataBase/models/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserGlobalService{
  constructor(
    @InjectRepository(UserEntity)
    private userRepository : Repository<UserEntity>)
  {}
  async findUser(id : number, email : string) : Promise<UserEntity>{
    return await this.userRepository.findOne({
      where : {
        id , email
      }
    })
  }
}