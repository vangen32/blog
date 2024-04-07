import { Controller, Post, Body, HttpStatus, HttpCode, UseFilters } from "@nestjs/common";
import { UserAuthorizationService } from './user-authorization.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { ApiTags } from "@nestjs/swagger";
import { AuthExceptionFilter } from "./exceptions/auth-bad-request-exception-filter";

@ApiTags("User login")
@Controller('user')
export class UserAuthorizationController {
  constructor(private readonly userAuthorizationService: UserAuthorizationService) {}

  @HttpCode(HttpStatus.OK)
  @UseFilters(new AuthExceptionFilter())
  @Post("login")
  async login(@Body() credentials: UserCredentialsDto) {
    return await this.userAuthorizationService.login(credentials);
  }
}