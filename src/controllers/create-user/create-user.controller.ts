import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { CreateCreateUserDto } from './dto/create-create-user.dto';
import { UpdateCreateUserDto } from './dto/update-create-user.dto';

@Controller('create-user')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  create(@Body() createCreateUserDto: CreateCreateUserDto) {
    return this.createUserService.create(createCreateUserDto);
  }

  @Get()
  findAll() {
    return this.createUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.createUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreateUserDto: UpdateCreateUserDto) {
    return this.createUserService.update(+id, updateCreateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.createUserService.remove(+id);
  }
}
