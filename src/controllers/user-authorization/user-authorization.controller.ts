import { Controller, Post, Body, HttpStatus, HttpCode, UseFilters, Get, Req, UseInterceptors } from "@nestjs/common";
import { UserAuthorizationService } from './user-authorization.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthExceptionFilter } from "./exceptions/auth-bad-request-exception-filter";
import { Public } from "../../global/authGuard/decoretors";
import { UserDto } from "../create-user/dto/user.dto";

@ApiTags("User login")
@UseFilters(new AuthExceptionFilter())
@Controller('user')
export class UserAuthorizationController {
  constructor(private readonly userAuthorizationService: UserAuthorizationService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiOperation({ summary: 'Get user access token' })
  @Public()
  async login(@Body() credentials: UserCredentialsDto) {
    return await this.userAuthorizationService.login(credentials);
  }

  @Get("me")
  getMe(@Req() req : Request){
    return UserDto.GetInstance(req["user"])
  }
}
