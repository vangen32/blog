import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  email : string
  @ApiProperty()
  name : string
  @ApiProperty()
  lastname : string
  @ApiProperty()
  age : number
  @ApiProperty()
  password : string
}
