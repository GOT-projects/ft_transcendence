import { PartialType } from '@nestjs/mapped-types';
import { CreateRelUserDto } from './create-rel_user.dto';

export class UpdateRelUserDto extends PartialType(CreateRelUserDto) {}
