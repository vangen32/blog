import { ArticleEntity } from "../../../dataBase/models/article.entity";
import { TagEntity } from "../../../dataBase/models/tag.entity";
import { UserDto } from "../../create-user/dto/user.dto";

export class ArticleDto{

  id: number
  content : string
  author : UserDto
  tags : TagEntity[]

  static GetInstance(obj : ArticleEntity){
    return {
      ...obj,
      author : UserDto.GetInstance(obj.author)
    }
  }
}