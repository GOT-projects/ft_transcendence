
export class CreateMessageDto {
    message!: string;
    userIdFrom!: number;
    userIdTo: number | null;
    channelIdTo: number | null;
}
