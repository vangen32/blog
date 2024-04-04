import { PartialType } from '@nestjs/mapped-types';
import { CreateCreateUserDto } from './create-create-user.dto';

export class UpdateCreateUserDto extends PartialType(CreateCreateUserDto) {}
