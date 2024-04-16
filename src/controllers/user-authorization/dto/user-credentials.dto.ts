import { ApiProperty } from "@nestjs/swagger";

export class UserCredentialsDto {
  @ApiProperty({default : "wanzikhn@gmail.com"})
  email : string

  @ApiProperty({default : "Asd112233"})
  password : string
}
