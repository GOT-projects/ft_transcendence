import { PartialType } from '@nestjs/mapped-types';
import { CreateRelUserChannelDto } from './create-rel_user_channel.dto';

export class UpdateRelUserChannelDto extends PartialType(CreateRelUserChannelDto) {}
