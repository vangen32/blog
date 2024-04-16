import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({default : "wanzikhn@gmail.com"})
  email : string
  @ApiProperty({default : "Ivan"})
  name : string
  @ApiProperty({default : "Sh"})
  lastname : string
  @ApiProperty({default : 27})
  age : number
  @ApiProperty({default : "Asd112233"})
  password : string
}
