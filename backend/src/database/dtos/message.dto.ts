
export class CreateMessageDto {
    message!: string;
    userIdFrom!: number;
    userIdTo: number | null;
    userChannelTo: number | null;
}
