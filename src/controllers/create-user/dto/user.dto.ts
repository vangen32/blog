import { UserEntity } from "../../../dataBase/models/user.entity";

export class UserDto{
  id : number
  email : string
  name : string
  lastname : string
  age : number

  static GetInstance(userEntity : UserEntity) : UserDto{
    return  {
      id : userEntity.id,
      email : userEntity.email,
      name : userEntity.name,
      lastname : userEntity.lastname,
      age : userEntity.age
    } as UserDto;
  }
}