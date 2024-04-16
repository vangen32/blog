import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../../../dataBase/models/user.entity";

export class CreateArticleDto {
  author : UserEntity

  @ApiProperty()
  content : string
  @ApiProperty()
  tags : string[]
}
