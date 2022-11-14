import { PartialType } from '@nestjs/mapped-types';
import { Length } from 'class-validator';
import { channelStatus } from '../channels.types';
import { CreateChannelDto } from './create-channel.dto';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {

    id!: number;

    @Length(1, 42)
    name!: string;

    status!: channelStatus;

    password?: string;

}
