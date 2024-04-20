import { UserEntity } from "../../../dataBase/models/user.entity";
import { IUserDto } from "./user-dato-interface";
import { ArticleDto } from "../../articles/dto/article.dto";

export class UserDto implements IUserDto{
  age: number;
  email: string;
  id: number;
  lastname: string;
  name: string;
  userArticles : ArticleDto[]

  static GetInstance(userEntity : UserEntity) : UserDto{
    delete userEntity.password
    return userEntity as UserDto;
  }

  static GetInstanceMini(userEntity : UserEntity){
    return userEntity ?  {
      id : userEntity.id,
      name : userEntity.name,
      lastname : userEntity.lastname
    } : null;
  }

}