import { UserCredentialsDto } from "./dto/user-credentials.dto";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserEntity } from "../../dataBase/models/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { AuthBadRequestException } from "./exceptions/auth-bad-request-exception";

@Injectable()
export class UserAuthorizationService {
  constructor(@InjectRepository(UserEntity)
              private userRepository : Repository<UserEntity>,
              private jwtService : JwtService
  )
  {}

  async login(credentials: UserCredentialsDto) : Promise<{ accessToken : string}> {
    const user = await this.userRepository.findOne({
      where : {email : credentials.email}
    });
    if(!user || !await user.comparePassword(credentials.password))
      throw new AuthBadRequestException();
    const payload = { id: user.id, email: user.email };
    return {
      accessToken: `Bearer ${await this.jwtService.signAsync(payload)}`,
    };
  }
}
