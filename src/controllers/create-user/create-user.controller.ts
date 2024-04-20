import {
  Controller,
  Post,
  Body,
  Get,
  UseFilters,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus, Param, Delete
} from "@nestjs/common";
import { CreateUserService } from './create-user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from "@nestjs/swagger";
import { HttpUserCreateBadRequestFilter } from "./exceptions/http-exception-filter";
import { UserCreateValidationPipe } from "./pipes/user-create-validation-pipe";
import { UserEntity } from "../../dataBase/models/user.entity";
import { UserListInterceptor } from "./interceptors/user-list-interceptor";
import { AuthGuard } from "../../global/authGuard/authorization-guard";
import { Public } from "../../global/authGuard/decoretors";
import supertest from "supertest";

@ApiTags("User registration")
@Public()
@Controller('user')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post("create")
  @UseFilters(new HttpUserCreateBadRequestFilter())
  @HttpCode(HttpStatus.CREATED)
  create(@Body(new UserCreateValidationPipe()) createCreateUserDto: CreateUserDto) {
    return this.createUserService.create(createCreateUserDto);
  }


  @Get("/all")
  @UseInterceptors(UserListInterceptor)
  async findAll() : Promise<UserEntity[]>{
    return  await this.createUserService.getAll();
  }

  @Delete("delete/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id : number){
    await this.createUserService.deleteUser(id)
    return;
  }
}
