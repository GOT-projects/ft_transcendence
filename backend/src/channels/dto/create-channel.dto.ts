import { Length } from "class-validator";
import { channelStatus } from "../channels.types";

export class CreateChannelDto {
    @Length(1, 42)
    name!: string;

    status!: channelStatus;

    password?: string;
}
